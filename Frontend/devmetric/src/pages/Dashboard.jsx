import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/dashboard.css";
import axios from "axios";
import { API_URL_BASE } from "../config";
import NavBar from "../components/NavBar";
import Loading from "../components/Loading";
import ProfileCard from "../components/ProfileCard";
import ScoreCard from "../components/ScoreCard";
import ReposCard from "../components/ReposCard";
import PieChart from "../components/PieChart";
import StatsSummary from "../components/StatsSummary";
import PercentileCard from "../components/PercentileCard";
import ContributionsHeatmap from "../components/ContributionsHeatmap";

// TO DO: 
//  Add error handling for API calls
//  Replace mock data with real API responses
//  Add usernames readme link in ProfileCard, if none then ignore

//Possible age ranges: "13-17", "18-21", "22-25", "25-34", "35-44", "45-54", "55-64", "65+"


function Dashboard() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState([0, "Analyzing your GitHub data…"]);
  const [showLoading, setShowLoading] = useState(true);
  const [loadingCount, setLoadingCount] = useState(0);

  const [avatarURL, setAvatar] = useState(null);
  const [bio, setBio] = useState("");
  const [followers, setFollowers] = useState(0);
  const [following, setFollowing] = useState(0);
  const [repos, setRepos] = useState([]);
  const [languages, setLanguages] = useState({});
  const [stats, setStats] = useState(null);
  const [percentiles, setPercentiles] = useState(null);
  const [contributions, setContributions] = useState([]);
  const [personalREADME, setPersonalREADME] = useState(null);

  /*** Loading helper ***/
  const updateLoadingBar = (message) => {
    setLoadingCount((prev) => {
  const newCount = prev + 1;
  const percent = Math.round((newCount / fetchFunctions.length) * 100);
  setLoading([percent, message]);
  return newCount;
});
  };

  const loggedOut = () => {
    setLoading(0, "Please log in again.");
    navigate("/login");
  }

  /*** Fetch functions ***/
  const fetchAvatar = async () => {
    try {
      setLoading([loading[0], "Looking for your avatar..."]);
      const res = await axios.get(`${API_URL_BASE}/data/avatar`, { withCredentials: true });
      if (res.data.avatar_url) setAvatar(res.data.avatar_url);
      updateLoadingBar("Found your avatar!");
    } catch (err) {
      console.error("Error fetching avatar:", err);
     loggedOut();
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
       loggedOut();
    }
  };

  const fetchTopRepos = async () => {
    try {
      setLoading([loading[0], "Fetching Top Repos..."]);
      const res = await axios.get(`${API_URL_BASE}/data/top-repos`, { withCredentials: true });
      console.log("Top 5 Repos:", res.data.slice(0, 5));
      updateLoadingBar("Found your repositories!");
      setRepos(res.data.slice(0, 5));
    } catch (err) {
      console.error("Error fetching top repos:", err);
       loggedOut();
    }
  };

  const fetchLanguages = async () => {
    try {
      setLoading([loading[0], "Fetching Top Languages"]);
      const res = await axios.get(`${API_URL_BASE}/data/languages`, {
      withCredentials: true
      });
      console.log("Top Languages", res.data);
      updateLoadingBar("Found your Top Languages!");
      setLanguages(res.data);
    } catch (err) {
      console.error("Error fetching Languages:", err);
       loggedOut();
    }
  };

  const fetchStats = async () => {
    try {
      // Calculate total stars from repos
      setLoading([loading[0], "Calculating Stats..."]);
      const totalStars = repos.reduce((sum, repo) => sum + (repo.stars || 0), 0);
      
      // Mock stats for now - replace with actual API call later
      setStats({
        totalCommits: 1247,
        totalPRs: 89,
        totalStars: totalStars || 342,
        totalForks: 156,
        repoCount: repos.length || 24
      });
    } catch (err) {
      console.error("Error fetching stats:", err);
       loggedOut();
    }
  };

  const fetchPercentiles = async () => {
    try {
      setLoading([loading[0], "Calculating Percentiles..."]);
      // Mock percentiles for now - replace with actual API call later
      setPercentiles({
        overall: 72,
        repos: 65,
        commits: 78,
        languages: 70
      });
    } catch (err) {
      console.error("Error fetching percentiles:", err);
       loggedOut();
    }
  };

  const fetchHeatMap = async () => {
    try {
      setLoading([loading[0], "Fetching Contribution Heatmap..."]);

      const res = await axios.get(`${API_URL_BASE}/data/heatmap`, {
      withCredentials: true
      });
      setContributions(res.data);
      console.log("Heatmap Data:", res.data);
      updateLoadingBar("Contribution Heatmap Loaded!");
    } catch (err) {
      console.error("Error fetching Heatmap:", err);
       loggedOut();
    }
  };

  const checkPersonalREADME = async () => {
    try {
      setLoading([loading[0], "Finding Personal README..."]);

      const res = await axios.get(`${API_URL_BASE}/data/personal-readme`, {
      withCredentials: true
      });
      if(res.data.exists)
      {
        setPersonalREADME(res.data.content);
      }
      else
      {
        setPersonalREADME(null);
      }
      
      console.log("Personal README:", res.data);
      updateLoadingBar("Found Personal README!");
    } catch (err) {
      console.error("Error fetching Personal README:", err);
       loggedOut();
    }
  };

  /*** List of functions for dynamic loading ***/
  const fetchFunctions = [fetchAvatar, fetchDetails, fetchTopRepos, fetchLanguages, 
    fetchStats, fetchPercentiles, fetchHeatMap,
    checkPersonalREADME];

  /*** Run all fetches on mount ***/
  useEffect(() => {
    const fetchAll = async () => {
      await Promise.all(fetchFunctions.map((func) => func()));
    };
    fetchAll();
  }, []);

  /*** Fetch stats and percentiles after repos load ***/
  useEffect(() => {
    if (repos.length > 0) {
      fetchStats();
      fetchPercentiles();
    }
  }, [repos]);

  /*** Hide loading when complete ***/
  useEffect(() => {
    if (loading[0] >= 100) {
      const timer = setTimeout(() => setShowLoading(false), 500);
      return () => clearTimeout(timer);
    } else setShowLoading(true);
  }, [loading[0]]);

  return (
    <div className="dashboard-wrapper">
      {showLoading && <Loading progress={loading[0]} label={loading[1]} />}
      <NavBar />

      <div className="dashboard-header">
        <h1 className="dashboard-title">Your Dashboard</h1>
        <p className="dashboard-subtitle">Comprehensive insights into your GitHub activity and performance</p>
      </div>

      <div className="dashboard-grid">
        <ScoreCard score={72} percentiles={percentiles} />
        
        <div className="top-row">
          <ProfileCard
            avatar_url={avatarURL}
            bio={bio}
            following={following}
            followers={followers}
            personalREADME={personalREADME}
          />
          <ReposCard topRepos={repos}/>
        </div>

        <div className="middle-row">
          <PieChart data={languages}/>
          <ContributionsHeatmap contributions={contributions}/>
        </div>
        <div className="bottom-row">
          <StatsSummary stats={stats}/>
          <PercentileCard percentiles={percentiles}/>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
