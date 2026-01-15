// Repos.jsx
import "../styles/repos.css";

function Repos({ topRepos }) {
  if (!topRepos || topRepos.length === 0) {
    return (
      <div className="repos-card">
        <h3>Top Repositories</h3>
        <p>No repositories found.</p>
      </div>
    );
  }

  return (
    <div className="repos-card">
      <h3>Top Repositories</h3>
      <ul>
        {topRepos.map((repo) => (
          <li key={repo.name} className="repo-item">
            <div className="repo-name">{repo.name}</div>
            <div className="repo-stats">
              ⭐ {repo.stars} | 🕒 {new Date(repo.last_push).toLocaleDateString()}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Repos;
