import Avatar from "./Avatar";
import "../styles/profilecard.css";
import { useState, useEffect } from "react";

function ProfileCard({ avatar_url , bio, following, followers, personalREADME}) {
  const [username, setUsername] = useState("");
  const [age, setAge] = useState("");

  useEffect(() => {
    const u = localStorage.getItem("username");
    const a = localStorage.getItem("age");
    if (u) setUsername(u);
    if (a) setAge(a);
  }, []);

  const parseMarkdown = (text) => {
    const lines = text.split('\n');
    const elements = [];

    lines.forEach((line, idx) => {
      let content = line;
      const key = `readme-${idx}`;

      // Handle headers (# ## ### etc)
      const headerMatch = line.match(/^(#{1,6})\s+(.+)$/);
      if (headerMatch) {
        const level = headerMatch[1].length;
        const headerText = headerMatch[2];
        const HeaderTag = `h${level + 2}`;
        elements.push(
          <div key={key} className={`readme-header readme-h${level}`}>{parseInlineMarkdown(headerText)}</div>
        );
        return;
      }

      // Handle lists
      if (/^[\*\-]\s+/.test(line)) {
        const listText = line.replace(/^[\*\-]\s+/, '');
        elements.push(
          <li key={key} className="readme-list-item">{parseInlineMarkdown(listText)}</li>
        );
        return;
      }

      // Handle empty lines
      if (line.trim() === '') {
        elements.push(<div key={key} className="readme-spacer" />);
        return;
      }

      // Regular paragraph
      elements.push(
        <p key={key} className="readme-paragraph">{parseInlineMarkdown(content)}</p>
      );
    });

    return elements;
  };

  const parseInlineMarkdown = (text) => {
    const parts = [];
    let lastIndex = 0;

    // Regex to match bold, italic, code
    const regex = /(\*\*(.+?)\*\*)|(\*(.+?)\*)|(`(.+?)`)/g;
    let match;

    while ((match = regex.exec(text)) !== null) {
      // Add text before match
      if (match.index > lastIndex) {
        parts.push(text.substring(lastIndex, match.index));
      }

      // Add formatted element
      if (match[2]) {
        // Bold **text**
        parts.push(<strong key={`bold-${match.index}`}>{match[2]}</strong>);
      } else if (match[4]) {
        // Italic *text*
        parts.push(<em key={`italic-${match.index}`}>{match[4]}</em>);
      } else if (match[6]) {
        // Code `text`
        parts.push(<code key={`code-${match.index}`}>{match[6]}</code>);
      }

      lastIndex = regex.lastIndex;
    }

    // Add remaining text
    if (lastIndex < text.length) {
      parts.push(text.substring(lastIndex));
    }

    return parts.length > 0 ? parts : text;
  };

  return (
    <div className="profile-card">
      <Avatar avatar_url={avatar_url} size={80} />
      <div className="profile-info">
        <h2 className="profile-username">{username || "Unknown User"}</h2>
        <div className="profile-details">
          {age && <span className="profile-age">{age} yrs</span>}
          {followers != null && <span className="profile-age">{followers} Followers</span>}
          {following != null && <span className="profile-age">{following} Following</span>}
        </div>

        {bio && <p className="profile-bio">{bio}</p>}
        
        {username && (
          <a 
            href={`https://github.com/${username}`} 
            target="_blank" 
            rel="noopener noreferrer"
            className="profile-github-link"
          >
            github.com/{username}
          </a>
        )}

        {personalREADME && (
          <div className="profile-readme">
            <h3 className="readme-title">README</h3>
            <div className="readme-content">{parseMarkdown(personalREADME)}</div>
          </div>
        )}
      </div>
    </div>
  );
}

export default ProfileCard;
