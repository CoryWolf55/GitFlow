import "../styles/logincard.css";
import { API_URL_BASE } from "../config";
import {useEffect } from "react";

function LoginCard() {
  const handleGithubLogin = () => {
    window.location.href = `${API_URL_BASE}/auth/github/login`;
  };


  return (
    <div className="login-page-wrapper">
      <div className="login-card">
        <h1 className="login-title">Sign in to DevMetric</h1>
        <p className="login-subtitle">
          Analyze your GitHub and see how you rank against developers your age.
        </p>

        <button className="github-login-btn" onClick={handleGithubLogin}>
          <img
            src="https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png"
            alt="GitHub logo"
          />
          Continue with GitHub
        </button>


        <p className="login-footnote">
          We only access data you explicitly authorize via GitHub.
          You can revoke access at any time.
        </p>
      </div>
    </div>
  );
}

export default LoginCard;
