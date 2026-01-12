import { useEffect, useState } from "react";
import axios from "axios";
import { API_URL_BASE } from "../config";
import NavBar from "../components/NavBar";
import Loading from "../components/Loading";
import Avatar from "../components/Avatar";



function Dashboard() {
  const [loading, setLoading] = useState([0,"Analyzing your GitHub data…"]); //Tuple of progress, display text
  const [avatarURL, setAvatar] = useState(null);

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
  setAvatar(null);
}
    };

    GetAvatar();
  },[]);
  

  return (
    <div>
      <NavBar/>
      <Avatar avatar_url={avatarURL}/>
    </div>
  );
}

//<Loading progress={loading[0]} label={loading[1]}/>

export default Dashboard;
