import { useEffect, useState } from "react";

function LoginPage() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const API_URL_BASE = "http://127.0.0.1:8000";
    fetch(`${API_URL_BASE}/users`)
      .then((res) => res.json())
      .then((data) => {
        console.log("Fetched users:", data);
        setUsers(Array.isArray(data) ? data : []);
      })
      .catch((err) => console.error("Fetch error:", err));
  }, []);

  return (
    <div>
      <h1>Hello!</h1>
      <ul>
        {users.length > 0
          ? users.map((user) => <li key={user.id}>{user.username}</li>)
          : <li>No users found</li>}
      </ul>
    </div>
  );
}

export default LoginPage;
