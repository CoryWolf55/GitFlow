import { useEffect, useState } from "react";
import axios from "axios";

function LoginPage() {
  const [users, setUsers] = useState([]);

  const API_URL_BASE = "http://127.0.0.1:8000";

  // Fetch users from backend (optional, just for display)
  useEffect(() => {
    fetch(`${API_URL_BASE}/user`) // adjust endpoint if needed
      .then((res) => res.json())
      .then((data) => {
        console.log("Fetched users:", data);
        setUsers(Array.isArray(data) ? data : []);
      })
      .catch((err) => console.error("Fetch error:", err));
  }, []);

  // Redirect user to GitHub OAuth login
  const handleGithubLogin = () => {
    window.location.href = `${API_URL_BASE}/auth/github/login`;
  };

  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h1>Welcome to GitFlow</h1>

      <button
        onClick={handleGithubLogin}
        style={{
          padding: "10px 20px",
          fontSize: "16px",
          cursor: "pointer",
          borderRadius: "8px",
          backgroundColor: "#24292e",
          color: "white",
          border: "none",
          marginTop: "20px"
        }}
      >
        Login with GitHub
      </button>

      <h2 style={{ marginTop: "40px" }}>Existing Users</h2>
      <ul style={{ listStyle: "none", padding: 0 }}>
        {users.length > 0
          ? users.map((user) => (
              <li key={user.github_id} style={{ margin: "5px 0" }}>
                {user.username}
              </li>
            ))
          : <li>No users found</li>}
      </ul>
    </div>
  );
}

export default LoginPage;
