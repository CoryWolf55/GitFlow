import { useEffect, useState } from "react";
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

function Dashboard() {
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
      setRepos(res.data.slice(0, 5));
    } catch (err) {
      console.error("Error fetching top repos:", err);
      setLoading([100, "Error Loading Repos"]);
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
      setLoading([100, "Error Loading Languages"]);
    }
  };

  const fetchStats = async () => {
    try {
      // Calculate total stars from repos
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
    }
  };

  const fetchPercentiles = async () => {
    try {
      // Mock percentiles for now - replace with actual API call later
      setPercentiles({
        overall: 72,
        repos: 65,
        commits: 78,
        languages: 70
      });
    } catch (err) {
      console.error("Error fetching percentiles:", err);
    }
  };

  /*** List of functions for dynamic loading ***/
  const fetchFunctions = [fetchAvatar, fetchDetails, fetchTopRepos, fetchLanguages];

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
      <NavBar />
      {showLoading && <Loading progress={loading[0]} label={loading[1]} />}

      <div className="dashboard-header">
        <h1 className="dashboard-title">Your Dashboard</h1>
        <p className="dashboard-subtitle">Comprehensive insights into your GitHub activity and performance</p>
      </div>

      <div className="dashboard-grid">
        <div className="top-row">
          <ProfileCard
            avatar_url={avatarURL}
            bio={bio}
            following={following}
            followers={followers}
          />
          <div className="top-row-right">
            <ScoreCard score={72} />
            <ReposCard topRepos={repos}/>
          </div>
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
