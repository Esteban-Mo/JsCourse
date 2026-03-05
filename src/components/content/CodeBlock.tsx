import { useState } from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';

interface CodeBlockProps {
  language?: string;
  children: string;
}

export default function CodeBlock({ language = 'javascript', children }: CodeBlockProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(children.trim()).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    }).catch(() => undefined);
  };

  return (
    <div className="code-block">
      <div className="code-header">
        <div className="code-dots">
          <span /><span /><span />
        </div>
        <div className="code-lang">{language}</div>
        <button className="copy-btn" onClick={handleCopy}>
          {copied ? '✓ copié' : 'copier'}
        </button>
      </div>
      <SyntaxHighlighter
        language={language}
        style={vscDarkPlus}
        customStyle={{
          margin: 0,
          background: 'transparent',
          padding: '24px',
          fontFamily: "'Space Mono', monospace",
          fontSize: '13px',
          lineHeight: '1.8',
        }}
      >
        {children.trim()}
      </SyntaxHighlighter>
    </div>
  );
}
