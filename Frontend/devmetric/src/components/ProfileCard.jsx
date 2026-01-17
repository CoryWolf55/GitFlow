import Avatar from "./Avatar";
import "../styles/profilecard.css";
import { useState, useEffect } from "react";

function ProfileCard({ avatar_url , bio, following, followers}) {
  const [username, setUsername] = useState("");
  const [age, setAge] = useState("");

  useEffect(() => {
    const u = localStorage.getItem("username");
    const a = localStorage.getItem("age");
    if (u) setUsername(u);
    if (a) setAge(a);
  }, []);

  return (
    <div className="profile-card">
      <Avatar avatar_url={avatar_url} size={80} />
      <div className="profile-info">
        <h2 className="profile-username">{username || "Unknown User"}</h2>
        <div className="profile-details">
          {age && <span className="profile-age">{age} yrs</span>}
          {followers != null && <span className="profile-age">{followers} Followers</span>}
          {following != null && <span className="profile-age">{following} Following</span>}
        </div>

        {bio && <p className="profile-bio">{bio}</p>}
        
        {username && (
          <a 
            href={`https://github.com/${username}`} 
            target="_blank" 
            rel="noopener noreferrer"
            className="profile-github-link"
          >
            github.com/{username}
          </a>
        )}
      </div>
    </div>
  );
}

export default ProfileCard;
