export default function Loading() {
  return (
    <main className="dashboard-main app-loading" role="status" aria-label="Loading page content">
      <span className="app-loading-label">Loading page…</span>
      <div className="loading-skeleton" aria-hidden="true">
        <div className="loading-heading">
          <div className="loading-block loading-eyebrow" />
          <div className="loading-block loading-title" />
          <div className="loading-block loading-description" />
        </div>
        <div className="loading-feature-grid">
          <div className="loading-panel loading-feature-panel">
            <div className="loading-block loading-panel-title" />
            <div className="loading-block loading-reading" />
            <div className="loading-block loading-caption" />
          </div>
          <div className="loading-panel loading-feature-panel">
            <div className="loading-block loading-panel-title" />
            <div className="loading-chart">
              <div />
              <div />
              <div />
              <div />
              <div />
              <div />
              <div />
            </div>
          </div>
        </div>
        <div className="loading-panel loading-summary-panel">
          <div className="loading-block" />
          <div className="loading-block" />
          <div className="loading-block" />
          <div className="loading-block" />
        </div>
        <div className="loading-panel loading-list-panel">
          <div className="loading-block loading-panel-title" />
          <div className="loading-list-row" />
          <div className="loading-list-row" />
          <div className="loading-list-row" />
        </div>
      </div>
    </main>
  );
}
