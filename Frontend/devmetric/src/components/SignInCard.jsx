import { useState, useEffect } from "react";
import "../styles/signincard.css";

function SignInCard({ githubUsername, onSubmit , setGithubUsername, canEdit}) {
  const [age, setAge] = useState("");
  const [password, setPassword] = useState("");
  const [titleText, setTitleText] = useState("");
  const [buttonText, setButtonText] = useState("");
  const [displayAge, setDisplayAge] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ age, password, username: githubUsername });
  };

  useEffect(() => {
    setTitleText("Log in");
    setButtonText("Complete Login");

    //Check age

    const age = localStorage.getItem("age");

    if(age)
    {
      setAge(age);
      setDisplayAge(age);
    }
    else{
      setDisplayAge("Enter your age");
    }
}, []);

  return (
    <div className="signin-page-wrapper">
      <div className="signin-card">
        <h1 className="signin-title">{titleText}</h1>
        <p className="signin-subtitle">
          Enter your age and create a password to finish setting up your DevMetric account.
        </p>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Username</label>
            <input type="text" 
            value={githubUsername || ""} 
            onChange={(e) => setGithubUsername(e.target.value)}
            disabled={
            !canEdit
            } 
            placeholder="Enter your GitHub Username"
            />
          </div>

          <div className="form-group">
            <label>Age</label>
            <input
              type="number"
              value={age}
              onChange={(e) => setAge(e.target.value)}
              required={canEdit}
              disabled={!canEdit}
              placeholder={displayAge}
            />
          </div>

          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="Enter a password"
            />
          </div>

          <button type="submit" className="signin-btn">
            {buttonText}
          </button>
        </form>

        <p className="signin-footnote">
          Get ready to see magic!
        </p>
      </div>
    </div>
  );
}

export default SignInCard;
