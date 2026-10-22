import { useState } from "react";
import { t } from "../i18n/en";
import { catalog } from "../data/loader";

/** Copyable two-line install command for a plugin. */
export default function InstallCommand({ name }: { name: string }) {
  const [copied, setCopied] = useState<string | null>(null);

  const copy = async (text: string, key: string) => {
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      /* clipboard unavailable — selection fallback is fine for a static site */
    }
    setCopied(key);
    setTimeout(() => setCopied(null), 1600);
  };

  const lines = [
    `claude plugin marketplace add ${catalog.marketplace.repo}`,
    `claude plugin install ${name}@${catalog.marketplace.name}`,
  ];

  return (
    <div className="install">
      <div className="title">{t.installTitle}</div>
      {lines.map((line) => (
        <div className="row" key={line}>
          <code>{line}</code>
          <button
            className={`copy-btn${copied === line ? " ok" : ""}`}
            onClick={() => copy(line, line)}
          >
            {copied === line ? t.installCopied : t.installCopy}
          </button>
        </div>
      ))}
    </div>
  );
}
