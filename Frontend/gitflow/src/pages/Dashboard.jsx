import { useEffect, useState } from "react";
import axios from "axios";

function Dashboard() {
  const [user, setUser] = useState(null);
  const [githubData, setGithubData] = useState(null);

  // Fetch user after GitHub callback
  useEffect(() => {
    const fetchUserData = async () => {
      // 1. Assume you have github_id from login response
      const githubId = localStorage.getItem("github_id");
      if (!githubId) return;

      const res = await axios.get(`http://localhost:8000/user/${githubId}/github-data`);
      setGithubData(res.data);
    };

    fetchUserData();
  }, []);

  if (!githubData) return <div>Loading...</div>;

  return (
    <div>
      <h1>Welcome {githubData.profile.login}</h1>
      <h3>Repos:</h3>
      <ul>
        {githubData.repos.map((repo) => (
          <li key={repo.id}>
            <a href={repo.html_url} target="_blank" rel="noopener noreferrer">{repo.name}</a>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Dashboard;
