from fastapi import Request, Depends, HTTPException, APIRouter, Cookie
from sqlalchemy.orm import Session
from starlette import status
import base64

"""MODELS"""
from models.user import User
from models.github_stats import GitHubStats
from models.user_score import UserScore

from dependencies import get_db
from slowapi import Limiter
from slowapi.util import get_remote_address
import httpx

limiter = Limiter(key_func=get_remote_address)
router = APIRouter()

@router.get("/data/avatar")
@limiter.limit("15/minute")
def get_avatar(request: Request, userId: str = Cookie(None), db: Session = Depends(get_db)):
    print("Hit /data/avatar")
    print("userId cookie:", userId)
    if not userId:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Not logged in")

    try:
        user_id_int = int(userId)
    except ValueError:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid user ID cookie")

    user = db.query(User).filter(User.id == user_id_int).first()
    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")

    avatar_url = f"https://avatars.githubusercontent.com/u/{user.github_id}?v=4"
    return {"avatar_url": avatar_url}


@router.get("/data/github-stats")
@limiter.limit("15/minute")
def get_github_stats(request: Request, userId: str = Cookie(None), db: Session = Depends(get_db)):
    if not userId:
        raise HTTPException(status_code=401, detail="Not logged in")

    user = db.query(User).filter(User.id == int(userId)).first()
    if not user or not user.access_token:
        raise HTTPException(status_code=401, detail="GitHub token missing")

    headers = {"Authorization": f"Bearer {user.access_token}"}
    response = httpx.get("https://api.github.com/user", headers=headers)

    if response.status_code != 200:
        raise HTTPException(status_code=response.status_code, detail="Failed to fetch GitHub profile")

    data = response.json()
    return {
        "followers": data.get("followers", 0),
        "following": data.get("following", 0),
        "bio": data.get("bio", "")
    }

@router.get("/data/top-repos")
@limiter.limit("15/minute")
def get_top_repos(request: Request, userId: str = Cookie(None), db: Session = Depends(get_db)):
    """
    Fetch top 5 GitHub repositories by star count for the logged-in user.
    """
    if not userId:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Not logged in")

    user = db.query(User).filter(User.id == int(userId)).first()
    if not user or not user.access_token:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="GitHub token missing")

    headers = {"Authorization": f"Bearer {user.access_token}"}

    # Fetch all repos (may be paginated, so only take first 100 for simplicity)
    response = httpx.get(
        "https://api.github.com/user/repos?per_page=100&sort=updated",
        headers=headers,
        timeout=10
    )

    if response.status_code != 200:
        raise HTTPException(status_code=response.status_code, detail="Failed to fetch GitHub repos")

    repos = response.json()

    # Map to minimal structure and sort by stars
    mapped_repos = [
        {
            "name": repo["name"],
            "stars": repo.get("stargazers_count", 0),
            "last_push": repo.get("pushed_at"),
            "language": repo.get("language")
        }
        for repo in repos
    ]

    # Sort descending by stars and take top 5
    top_repos = sorted(mapped_repos, key=lambda x: x["stars"], reverse=True)[:5]

    return top_repos



@router.get("/data/languages")
@limiter.limit("10/minute")
def get_language_usage(
    request: Request,
    userId: str = Cookie(None),
    db: Session = Depends(get_db)
):
    if not userId:
        raise HTTPException(status_code=401, detail="Not logged in")

    user = db.query(User).filter(User.id == int(userId)).first()
    if not user or not user.access_token:
        raise HTTPException(status_code=401, detail="GitHub token missing")

    headers = {
        "Authorization": f"Bearer {user.access_token}",
        "Accept": "application/vnd.github+json"
    }

    query = """
    query {
      viewer {
        repositories(first: 100, ownerAffiliations: OWNER) {
          nodes {
            languages(first: 20) {
              edges {
                size
                node {
                  name
                }
              }
            }
          }
        }
      }
    }
    """

    response = httpx.post(
        "https://api.github.com/graphql",
        headers=headers,
        json={"query": query},
        timeout=15
    )

    if response.status_code != 200:
        raise HTTPException(
            status_code=response.status_code,
            detail="Failed to fetch language data"
        )

    data = response.json()

    repos = data["data"]["viewer"]["repositories"]["nodes"]
    language_totals = {}

    for repo in repos:
        for lang in repo["languages"]["edges"]:
            name = lang["node"]["name"]
            size = lang["size"]
            language_totals[name] = language_totals.get(name, 0) + size

    return language_totals



@router.get("/data/heatmap")
@limiter.limit("10/minute")
def get_contributions_heatmap(
    request: Request,
    userId: str = Cookie(None),
    db: Session = Depends(get_db)
):
    if not userId:
        raise HTTPException(status_code=401, detail="Not logged in")

    user = db.query(User).filter(User.id == int(userId)).first()
    if not user or not user.access_token:
        raise HTTPException(status_code=401, detail="GitHub token missing")

    headers = {
        "Authorization": f"Bearer {user.access_token}",
        "Accept": "application/vnd.github+json"
    }

    query = """
    query {
      viewer {
        contributionsCollection {
          contributionCalendar {
            weeks {
              contributionDays {
                date
                contributionCount
              }
            }
          }
        }
      }
    }
    """

    response = httpx.post(
        "https://api.github.com/graphql",
        headers=headers,
        json={"query": query},
        timeout=15
    )

    if response.status_code != 200:
        raise HTTPException(status_code=response.status_code, detail="Failed to fetch contributions data")

    data = response.json()

    try:
        weeks = data["data"]["viewer"]["contributionsCollection"]["contributionCalendar"]["weeks"]
        heatmap = []
        for week in weeks:
            for day in week["contributionDays"]:
                heatmap.append({
                    "date": day["date"],
                    "count": day["contributionCount"]
                })
        return heatmap
    except KeyError:
        raise HTTPException(status_code=404, detail="Failed to parse contributions data")


@router.get("/data/personal-readme")
@limiter.limit("10/minute")
def get_personal_readme_repo(
    request: Request,
    userId: str = Cookie(None),
    db: Session = Depends(get_db)
):
    if not userId:
        raise HTTPException(status_code=401, detail="Not logged in")

    user = db.query(User).filter(User.id == int(userId)).first()
    if not user or not user.access_token or not user.username:
        raise HTTPException(status_code=401, detail="GitHub token or username missing")

    headers = {
        "Authorization": f"Bearer {user.access_token}",
        "Accept": "application/vnd.github+json"
    }

    url = f"https://api.github.com/repos/{user.username}/{user.username}/readme"

    try:
        response = httpx.get(url, headers=headers, timeout=10)
    except httpx.RequestError as e:
        print("HTTPX network error:", e)
        raise HTTPException(status_code=500, detail="Failed to reach GitHub API")

    if response.status_code == 404:
        return {"description": "", "exists": False}  # safe fallback
    if response.status_code != 200:
        print("GitHub API error:", response.text)
        raise HTTPException(status_code=response.status_code, detail="Failed to fetch repo")

    data = response.json()
    content = base64.b64decode(data["content"]).decode("utf-8")

    return {"exists": True, "content": content}
