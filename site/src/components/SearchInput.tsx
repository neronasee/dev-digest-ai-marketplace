import { useNavigate } from "react-router-dom";
import { t } from "../i18n/en";

export default function SearchInput({ initial = "" }: { initial?: string }) {
  const navigate = useNavigate();
  return (
    <form
      className="searchbar"
      onSubmit={(e) => {
        e.preventDefault();
        const q = new FormData(e.currentTarget).get("q");
        navigate(`/search?q=${encodeURIComponent(String(q ?? ""))}`);
      }}
    >
      <input name="q" defaultValue={initial} placeholder={t.searchPlaceholder} autoFocus aria-label={t.searchHint} />
      <button className="icon-btn" type="submit">→</button>
    </form>
  );
}
