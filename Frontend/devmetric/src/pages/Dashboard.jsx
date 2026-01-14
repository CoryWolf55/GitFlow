import { useEffect, useState } from "react";
import axios from "axios";
import { API_URL_BASE } from "../config";
import NavBar from "../components/NavBar";
import Loading from "../components/Loading";
import Avatar from "../components/Avatar";
import ProfileCard from "../components/ProfileCard";



function Dashboard() {
  const [loading, setLoading] = useState([0,"Analyzing your GitHub data…"]); //Tuple of progress, display text
  const [showLoading, setShowLoading] = useState(true);
  const [avatarURL, setAvatar] = useState(null);
  const [bio, setBio] = useState("");
  const [followers, setFollowers] = useState(0);
  const [following, setFollowing] = useState(0);

  useEffect(() => {
    const GetAvatar = async () => {
      try{
      setLoading([loading[0], "Grabbing Avatar..."]);
      const res = await axios.get(`${API_URL_BASE}/data/avatar`, { withCredentials: true })
      const avatar_url = res.data.avatar_url;
      if(avatar_url)
      {
        setAvatar(avatar_url);
      } 
      setLoading([30, "Found Avatar"]);
      }
      catch (err) {
  console.error("Error grabbing Avatar:", err);
  setLoading([loading[100], "Error Loading!"]);
  setAvatar(null);
    }
  };
  
  const fetchDetails = async () => {
    try {
      setLoading([loading[0], "Fetching Details..."]);
      const res = await axios.get(`${API_URL_BASE}/data/github-stats`, { withCredentials: true });
      console.log("GitHub stats response:", res.data);
      const bio = res.data.bio;
      const followers = res.data.followers;
      const following = res.data.following;
      if(res)
      {
        setBio(bio);
        setFollowers(followers);
        setFollowing(following);
      }

      setLoading([100, "Details Found!"]);
    } catch (err) {
      console.error("Failed to get details", err);
      setLoading([loading[100], "Error Loading!"]);
    }

  };

    
    fetchDetails();
    GetAvatar();
  },[]);



  useEffect(() => {
    if (loading[0] >= 100) {
      const timer = setTimeout(() => setShowLoading(false), 500); // delay 0.5s
      return () => clearTimeout(timer);
    } else {
      setShowLoading(true);
    }
  }, [loading[0]]);




  

  return (
    <div>
      <NavBar/>
      <ProfileCard avatar_url={avatarURL} bio={bio} following={following} followers={followers}/>


      {showLoading && <Loading progress={loading[0]} label={loading[1]} />}
    </div>
  );
}


export default Dashboard;
