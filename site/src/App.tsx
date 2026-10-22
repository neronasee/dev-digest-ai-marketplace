import { Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import HomePage from "./pages/HomePage";
import SearchPage from "./pages/SearchPage";
import PluginDetailPage from "./pages/PluginDetailPage";
import WhatsNewPage from "./pages/WhatsNewPage";
import { t } from "./i18n/en";

export default function App() {
  return (
    <div className="app">
      <Header />
      <main className="main">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/search" element={<SearchPage />} />
          <Route path="/plugin/:name" element={<PluginDetailPage />} />
          <Route path="/whats-new" element={<WhatsNewPage />} />
          <Route path="*" element={<div className="empty">{t.notFound}</div>} />
        </Routes>
      </main>
      <footer className="footer">{t.footerNote}</footer>
    </div>
  );
}
