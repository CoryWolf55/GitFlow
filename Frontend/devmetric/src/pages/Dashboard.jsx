import { useEffect, useState } from "react";
import "../styles/dashboard.css";
import axios from "axios";
import { API_URL_BASE } from "../config";
import NavBar from "../components/NavBar";
import Loading from "../components/Loading";
import ProfileCard from "../components/ProfileCard";
import ScoreCard from "../components/ScoreCard";

function Dashboard() {
  const [loading, setLoading] = useState([0, "Analyzing your GitHub data…"]);
  const [showLoading, setShowLoading] = useState(true);
  const [loadingCount, setLoadingCount] = useState(0);

  const [avatarURL, setAvatar] = useState(null);
  const [bio, setBio] = useState("");
  const [followers, setFollowers] = useState(0);
  const [following, setFollowing] = useState(0);

  /*** Loading helper ***/
  const updateLoadingBar = (message) => {
    setLoadingCount((prev) => {
  const newCount = prev + 1;
  const percent = Math.round((newCount / fetchFunctions.length) * 100);
  setLoading([percent, message]);
  return newCount;
});
  };

  /*** Fetch functions ***/
  const fetchAvatar = async () => {
    try {
      setLoading([loading[0], "Looking for your avatar..."]);
      const res = await axios.get(`${API_URL_BASE}/data/avatar`, { withCredentials: true });
      if (res.data.avatar_url) setAvatar(res.data.avatar_url);
      updateLoadingBar("Found your avatar!");
    } catch (err) {
      console.error("Error fetching avatar:", err);
      setLoading([100, "Error Loading Avatar"]);
    }
  };

  const fetchDetails = async () => {
    try {
      setLoading([loading[0], "Fetching GitHub details..."]);
      const res = await axios.get(`${API_URL_BASE}/data/github-stats`, { withCredentials: true });
      setBio(res.data.bio || "");
      setFollowers(res.data.followers || 0);
      setFollowing(res.data.following || 0);
      updateLoadingBar("Details Found!");
    } catch (err) {
      console.error("Error fetching details:", err);
      setLoading([100, "Error Loading Details"]);
    }
  };

  const fetchTopRepos = async () => {
    try {
      setLoading([loading[0], "Fetching Top Repos..."]);
      const res = await axios.get(`${API_URL_BASE}/data/top-repos`, { withCredentials: true });
      console.log("Top 5 Repos:", res.data.slice(0, 5));
      updateLoadingBar("Found your repositories!");
    } catch (err) {
      console.error("Error fetching top repos:", err);
      setLoading([100, "Error Loading Repos"]);
    }
  };

  /*** List of functions for dynamic loading ***/
  const fetchFunctions = [fetchAvatar, fetchDetails, fetchTopRepos];

  /*** Run all fetches on mount ***/
  useEffect(() => {
    const fetchAll = async () => {
      await Promise.all(fetchFunctions.map((func) => func()));
    };
    fetchAll();
  }, []);

  /*** Hide loading when complete ***/
  useEffect(() => {
    if (loading[0] >= 100) {
      const timer = setTimeout(() => setShowLoading(false), 500);
      return () => clearTimeout(timer);
    } else setShowLoading(true);
  }, [loading[0]]);

  return (
    <div>
      <NavBar />
      {showLoading && <Loading progress={loading[0]} label={loading[1]} />}

      <div className="dashboard-grid">
        <div className="top-row">
          <ProfileCard
            avatar_url={avatarURL}
            bio={bio}
            following={following}
            followers={followers}
          />
          <ScoreCard score={72} />
        </div>

        <div className="middle-row">{/* GitHub Activity cards here */}</div>
        <div className="bottom-row">{/* Percentile / metrics cards here */}</div>
      </div>
    </div>
  );
}

export default Dashboard;
