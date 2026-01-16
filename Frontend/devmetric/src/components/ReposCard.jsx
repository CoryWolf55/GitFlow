// Repos.jsx
import "../styles/repos.css";
import '@fortawesome/fontawesome-free/css/all.min.css';

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
              <span className="repo-stat-item">
                <i className="fa-solid fa-star" style={{color: '#fbbf24'}}></i>
                {repo.stars || 0}
              </span>
              <span className="repo-stat-item">
                <i className="fa-solid fa-clock" style={{color: '#94a3b8'}}></i>
                {new Date(repo.last_push).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
              </span>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Repos;
