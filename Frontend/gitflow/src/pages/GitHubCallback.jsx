import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const API_URL_BASE = "http://127.0.0.1:8000";

function GitHubCallback() {
  const navigate = useNavigate();

  useEffect(() => {
    const handleCallback = async () => {
      // Parse the `code` from URL
      const params = new URLSearchParams(window.location.search);
      const code = params.get("code");
      if (!code) return;

      try {
        // Send code to backend to exchange for token and user data
        const res = await axios.get(`${API_URL_BASE}/auth/github/callback?code=${code}`);
        const userData = res.data;

        // Save user data locally (or in context/state)
        localStorage.setItem("github_id", userData.github_id);
        localStorage.setItem("username", userData.username);
        localStorage.setItem("access_token", userData.access_token);

        // Redirect to dashboard
        navigate("/dashboard");
      } catch (err) {
        console.error("Error handling GitHub callback:", err);
      }
    };

    handleCallback();
  }, [navigate]);

  return <div>Logging you in... please wait.</div>;
}

export default GitHubCallback;
