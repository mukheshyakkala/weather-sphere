"use client";

import { useEffect } from "react";
import { AlertTriangle, CloudSun, RotateCcw } from "lucide-react";
import "./Error.css";

export default function Error({ error, reset }) {
  useEffect(() => {
    console.error("Dashboard Error:", error);
  }, [error]);

  return (
    <main className="app-error" role="alert">
      <div className="app-error-card">
        <div className="app-error-art" aria-hidden="true">
          <div className="app-error-sun" />
          <CloudSun className="app-error-cloud" strokeWidth={1.5} />
          <span className="app-error-alert">
            <AlertTriangle size={18} />
          </span>
        </div>

        <span className="app-error-eyebrow">WEATHERSPHERE STATUS</span>
        <h1>We hit a weather delay</h1>
        <p className="app-error-message">
          Something went wrong while loading this page. Your saved locations and preferences are safe.
        </p>
        <p className="app-error-help">
          Try again in a moment. If the problem continues, check your connection and reload the page.
        </p>

        <button
          type="button"
          onClick={reset}
          className="app-error-retry"
        >
          <RotateCcw size={17} />
          <span>Try again</span>
        </button>

        {error?.digest && (
          <p className="app-error-reference">Reference: {error.digest}</p>
        )}
      </div>
    </main>
  );
}