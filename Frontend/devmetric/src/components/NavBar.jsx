import "../styles/navbar.css";
import NavRightSide from "./NavRightSide";

function NavBar(props) {
  
  return (
    <nav className="navbar">
      <div className="navbar-left">
        <a href="/" className="logo">
          DevMetric
        </a>
      </div>

      <div className="navbar-center">
        <ul className="nav-links">
          <li>
            <a href="/leaderboard">Leaderboard</a>
          </li>
          <li>
            <a href="/dashboard">Metrics</a>
          </li>
          <li>
            <a href="/faq">FAQ</a>
          </li>
        </ul>
      </div>
      <div className="navbar-right">
        <NavRightSide isMainPage = {props.isMainPage}/>
      </div>
    </nav>
  );
}


NavBar.defaultProps = {
  isMainPage: false
}

export default NavBar;
