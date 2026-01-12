// Avatar.jsx
import "../styles/avatar.css";

function Avatar({ avatar_url}) {


  return (
    <div className="avatar-wrapper" style={{ width: 100, height: 100 }}>
      <img
        src={avatar_url}
        alt={"Avatar"}
        className="avatar-img"
      />
    </div>
  );
}

export default Avatar;