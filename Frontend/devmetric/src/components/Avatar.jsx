// Avatar.jsx
import "../styles/avatar.css";

function Avatar({ avatar_url}) {


  return (
    <div className="avatar-wrapper" style={{ width: 80, height: 80 }}>
      <img
        src={avatar_url}
        alt={`avatar`}
        className="avatar-img"
      />
    </div>
  );
}

export default Avatar;