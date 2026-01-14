import { useState , useEffect} from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {API_URL_BASE} from "../config";
import SignInCard from "../components/SignInCard";
import NavBar from "../components/NavBar";

function SignUpPage() {
  const [githubUsername, setGithubUsername] = useState(""); // replace later with GitHub username
  const [canEdit, setCanEdit] = useState(false);

  const navigate = useNavigate();

  //Check cookie for github auth
  useEffect(() => {
  const checkCookie = async () => {
    try {
      const res = await axios.get(`${API_URL_BASE}/userID`, { withCredentials: true });
      console.log("Response from /userID:", res); 
      const userID = res.data?.userId;
      if (userID) {
        localStorage.setItem("userID", userID);
        console.log("Got userID from cookie:", userID);
        setCanEdit(userID);
      } else {
        console.log("No userID found in response");
      }
    } catch (err) {
      console.log("Grab Error cookie:", err);
    }
   
  };


   const getUsername = async () => {
  try {
    const response = await axios.get(`${API_URL_BASE}/user/username`, {
      withCredentials: true,
    });

    console.log(response);

    const username = response.data?.username;

    if (!username) return;

    setGithubUsername(username);
    localStorage.setItem("username", username);
    setCanEdit(username);

  } catch (err) {
    console.log("Error getting or setting username", err);
  }
};

  if(!localStorage.getItem("userID"))
  {
    checkCookie();
  }
  if(!localStorage.getItem("username"))
  {
     getUsername();
  }
  else {
    const username = localStorage.getItem("username");
    setCanEdit(false);
    setGithubUsername(username);
    console.log(username);
  }
  
}, []);

  const handleSignup = async (data) => {
    try {
      // Send to backend
      const payload = {
      ...data,
      username: githubUsername,
      age: data.age ? Number(data.age) : null
    };
      const res = await axios.post(`${API_URL_BASE}/user/register`, payload, {withCredentials: true});
      console.log("Signup success:", res.data);
      const responseData = res.data;
      if(responseData){
        localStorage.setItem("age", responseData.age);
        localStorage.setItem("username", responseData.username);
        localStorage.setItem("github_id", responseData.github_id);
        // redirect
        navigate("/dashboard");

      }
      
    } catch (err) {
      console.error("Signup error:", err);
      alert("Signup failed. Please try again.");
    }
  };

  return (
    <div>
      <NavBar/>
      <SignInCard 
      githubUsername={githubUsername} 
      onSubmit={handleSignup} 
      setGithubUsername={setGithubUsername}
      canEdit={canEdit}
      />
    </div>
  );
}

export default SignUpPage;
