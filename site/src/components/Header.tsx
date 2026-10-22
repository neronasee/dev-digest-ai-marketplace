import { Link, useLocation, useNavigate } from "react-router-dom";
import { t } from "../i18n/en";
import { initialTheme, setTheme } from "../lib/theme";

export default function Header() {
  const location = useLocation();
  const navigate = useNavigate();

  const toggleTheme = () => setTheme(initialTheme() === "dark" ? "light" : "dark");

  return (
    <header className="header">
      <div className="brand" onClick={() => navigate("/")} role="link" tabIndex={0}>
        <div className="dot">DD</div>
        <span>{t.siteTitle}</span>
      </div>
      <nav>
        <Link to="/" className={location.pathname === "/" ? "active" : ""}>{t.navHome}</Link>
        <Link to="/whats-new" className={location.pathname === "/whats-new" ? "active" : ""}>{t.navWhatsNew}</Link>
      </nav>
      <div className="spacer" />
      <button className="icon-btn" onClick={toggleTheme} title={t.themeToggle} aria-label={t.themeToggle}>
        ◐
      </button>
    </header>
  );
}
