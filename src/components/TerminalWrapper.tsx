"use client";

import dynamic from 'next/dynamic';

const XTerminal = dynamic(() => import('./XTerminal'), {
  ssr: false,
  loading: () => (
    <div className="terminal-container">
      <p>Loading terminal...</p>
    </div>
  )
});

export default function TerminalWrapper() {
  return (
    <div className="terminal-wrapper">
      <div className="terminal-window">
        <XTerminal />
      </div>

      <style jsx>{`
        .terminal-wrapper {
          height: 100vh;
          width: 100vw;
          display: flex;
          justify-content: center;
          align-items: center;
          background: #121212;
        }

        .terminal-window {
          width: 800px;
          height: 500px;
          background-color: #1e1e1e;
          border-radius: 8px;
          box-shadow: 0 0 20px rgba(0, 0, 0, 0.5);
          overflow: hidden;
          padding: 12px;
          box-sizing: border-box;
        }

        .terminal-container {
          color: #ccc;
          font-family: 'Courier New', Courier, monospace;
          display: flex;
          align-items: center;
          justify-content: center;
          height: 100%;
        }
      `}</style>
    </div>
  );
}
