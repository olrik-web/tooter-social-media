import SyntaxHighlighter from "react-syntax-highlighter";
import { LightBulbIcon, ArrowDownTrayIcon, DocumentDuplicateIcon } from "@heroicons/react/24/outline";
import { LightBulbIcon as LightBulbIconFill } from "@heroicons/react/24/solid";

export default function SyntaxHighlighterField({ language, code, theme, darkMode, setDarkMode, copied, setCopied }) {
  function copyToClipboard() {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => {
        setCopied(false);
      }, 2000);
    }
  }

  return (
    <>
      <div className="flex flex-row justify-between my-2">
        <button type="button" onClick={() => setDarkMode(!darkMode)}>
          {darkMode ? <LightBulbIconFill className="w-6 h-6" /> : <LightBulbIcon className="w-6 h-6" />}
        </button>
        <button type="button" onClick={() => copyToClipboard()}>
          <div className="flex flex-row gap-x-2 items-center">
            {copied ? "Copied!" : "Copy"}
            <DocumentDuplicateIcon className="w-6 h-6" />
          </div>
        </button>
        <button type="button">
          <a href={`data:text/plain;charset=utf-8,${encodeURIComponent(code)}`} download="code.txt">
            <ArrowDownTrayIcon className="w-6 h-6" />
          </a>
        </button>
      </div>
      <SyntaxHighlighter language={language} style={theme} showLineNumbers className="rounded-xl">
        {code}
      </SyntaxHighlighter>
    </>
  );
}
