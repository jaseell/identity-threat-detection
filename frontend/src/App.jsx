import { useEffect, useState } from "react";
import {
  ShieldCheck,
  LayoutDashboard,
  Bell,
  Users,
  Activity,
  AlertTriangle,
  ShieldAlert,
  MapPin,
  LockKeyhole,
  Search,
  Settings,
} from "lucide-react";

import "./index.css";

const eventData = [
  {
    user: "alice",
    event_type: "login_failed",
    ip_address: "10.0.0.10",
    timestamp: "2026-10-08T09:00:00Z",
    location: "Kochi",
    success: false,
    role: "user",
  },
  {
    user: "alice",
    event_type: "login_failed",
    ip_address: "10.0.0.10",
    timestamp: "2026-10-08T09:01:00Z",
    location: "Kochi",
    success: false,
    role: "user",
  },
  {
    user: "alice",
    event_type: "login_failed",
    ip_address: "10.0.0.10",
    timestamp: "2026-10-08T09:02:00Z",
    location: "Kochi",
    success: false,
    role: "user",
  },
  {
    user: "bob",
    event_type: "mfa_request",
    ip_address: "10.0.0.20",
    timestamp: "2026-10-08T09:10:00Z",
    location: "Bangalore",
    success: true,
    role: "user",
  },
  {
    user: "bob",
    event_type: "mfa_request",
    ip_address: "10.0.0.20",
    timestamp: "2026-10-08T09:11:00Z",
    location: "Bangalore",
    success: true,
    role: "user",
  },
  {
    user: "bob",
    event_type: "mfa_request",
    ip_address: "10.0.0.20",
    timestamp: "2026-10-08T09:12:00Z",
    location: "Bangalore",
    success: true,
    role: "user",
  },
  {
    user: "charlie",
    event_type: "login",
    ip_address: "10.0.0.30",
    timestamp: "2026-10-08T10:00:00Z",
    location: "Kochi",
    success: true,
    role: "user",
  },
  {
    user: "charlie",
    event_type: "login",
    ip_address: "10.0.0.31",
    timestamp: "2026-10-08T10:05:00Z",
    location: "London",
    success: true,
    role: "user",
  },
  {
    user: "david",
    event_type: "role_changed",
    ip_address: "10.0.0.40",
    timestamp: "2026-10-08T10:20:00Z",
    location: "Kochi",
    success: true,
    role: "admin",
  },
];

const threatIcons = {
  brute_force: LockKeyhole,
  mfa_fatigue: Bell,
  impossible_travel: MapPin,
  privilege_escalation: ShieldAlert,
};

const formatThreat = (value) =>
  value
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");

function App() {
  const [threats, setThreats] = useState([]);
  const [eventsProcessed, setEventsProcessed] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedThreat, setSelectedThreat] = useState(null);
  const [activePage, setActivePage] = useState("dashboard");

  useEffect(() => {
    fetch("http://127.0.0.1:8000/v1/events", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(eventData),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Backend API request failed");
        }
        return response.json();
      })
      .then((data) => {
        setThreats(data.alerts);
        setEventsProcessed(data.events_received);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  const criticalCount = threats.filter(
    (item) => item.severity === "CRITICAL"
  ).length;

  const highCount = threats.filter(
    (item) => item.severity === "HIGH"
  ).length;

  return (
    <div className="app">
      <aside className="sidebar">
        <div className="brand">
          <div className="brand-icon">
            <ShieldCheck size={23} />
          </div>

          <div>
            <h2>ITDR Guard</h2>
            <span>Identity Security</span>
          </div>
        </div>

        <nav>
          <button
            className={activePage === "dashboard" ? "active" : ""}
            onClick={() => setActivePage("dashboard")}
          >
            <LayoutDashboard size={18} />
            Dashboard
          </button>

          <button
            className={activePage === "threats" ? "active" : ""}
            onClick={() => setActivePage("threats")}
          >
            <AlertTriangle size={18} />
            Threats
          </button>

          <button
            className={activePage === "identities" ? "active" : ""}
            onClick={() => setActivePage("identities")}
          >
            <Users size={18} />
            Identities
          </button>

          <button
            className={activePage === "events" ? "active" : ""}
            onClick={() => setActivePage("events")}
          >
            <Activity size={18} />
            Events
          </button>
        </nav>

        <div className="sidebar-bottom">
          <button
            className={activePage === "settings" ? "active" : ""}
            onClick={() => setActivePage("settings")}
          >
            <Settings size={18} />
            Settings
          </button>

          <div className="system-status">
            <span className="status-dot"></span>

            <div>
              <strong>System Healthy</strong>
              <small>Detection engine online</small>
            </div>
          </div>
        </div>
      </aside>

      <main className="main">
        <header className="topbar">
          <div>
            <p className="eyebrow">SECURITY OPERATIONS</p>
            <h1>Identity Threat Dashboard</h1>
            <p className="subtitle">
              Monitor identity activity and respond to security threats.
            </p>
          </div>

          <div className="top-actions">
            <div className="avatar">JK</div>
          </div>
        </header>

        {activePage === "dashboard" && loading && (
          <div className="loading-box">
            <Activity size={18} />
            Loading threat intelligence...
          </div>
        )}

        {activePage === "dashboard" && error && (
          <div className="error-box">
            <AlertTriangle size={18} />
            {error}
          </div>
        )}

        {activePage === "dashboard" && !loading && !error && (
          <>
            <section className="stats-grid">
              <div className="stat-card">
                <div className="stat-icon blue">
                  <Activity size={21} />
                </div>

                <div>
                  <span>Events Processed</span>
                  <strong>{eventsProcessed}</strong>
                  <small>Identity events analyzed</small>
                </div>
              </div>

              <div className="stat-card">
                <div className="stat-icon red">
                  <ShieldAlert size={21} />
                </div>

                <div>
                  <span>Active Threats</span>
                  <strong>{threats.length}</strong>
                  <small>Require attention</small>
                </div>
              </div>

              <div className="stat-card">
                <div className="stat-icon orange">
                  <AlertTriangle size={21} />
                </div>

                <div>
                  <span>Critical Threats</span>
                  <strong>{criticalCount}</strong>
                  <small>Immediate response</small>
                </div>
              </div>

              <div className="stat-card">
                <div className="stat-icon green">
                  <ShieldCheck size={21} />
                </div>

                <div>
                  <span>Detection Status</span>
                  <strong>Online</strong>
                  <small>Rules engine operational</small>
                </div>
              </div>
            </section>

            <section className="content-grid">
              <div className="panel threat-panel">
                <div className="panel-header">
                  <div>
                    <h2>Detected Threats</h2>
                    <p>Live results from detection engine</p>
                  </div>

                  <button className="view-button">
                    View all
                  </button>
                </div>

                <div className="table-wrapper">
                  <table>
                    <thead>
                      <tr>
                        <th>User</th>
                        <th>Threat</th>
                        <th>Risk</th>
                        <th>Severity</th>
                        <th>Response</th>
                      </tr>
                    </thead>

                    <tbody>
                      {threats.map((item) => {
                        const Icon =
                          threatIcons[item.threat_type] || ShieldAlert;

                        return (
                          <tr key={`${item.user}-${item.threat_type}`} onClick={() => setSelectedThreat(item)} className="clickable-row">
                            <td>
                              <div className="user-cell">
                                <div className="threat-icon">
                                  <Icon size={17} />
                                </div>

                                <strong>{item.user}</strong>
                              </div>
                            </td>

                            <td>{formatThreat(item.threat_type)}</td>

                            <td>
                              <span className="risk-score">
                                {item.risk_score.toFixed(2)}
                              </span>
                            </td>

                            <td>
                              <span
                                className={`severity ${item.severity.toLowerCase()}`}
                              >
                                {item.severity}
                              </span>
                            </td>

                            <td>
                              <span className="response">
                                {item.action}
                              </span>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="panel overview-panel">
                <div className="panel-header">
                  <div>
                    <h2>Threat Overview</h2>
                    <p>Current severity distribution</p>
                  </div>
                </div>

                <div className="overview-content">
                  <div className="donut">
                    <div>
                      <strong>{threats.length}</strong>
                      <span>Threats</span>
                    </div>
                  </div>

                  <div className="legend">
                    <div>
                      <span className="legend-dot critical"></span>
                      <span>Critical</span>
                      <strong>{criticalCount}</strong>
                    </div>

                    <div>
                      <span className="legend-dot high"></span>
                      <span>High</span>
                      <strong>{highCount}</strong>
                    </div>

                    <div>
                      <span className="legend-dot medium"></span>
                      <span>Medium</span>
                      <strong>
                        {threats.filter(
                          (item) => item.severity === "MEDIUM"
                        ).length}
                      </strong>
                    </div>
                  </div>
                </div>

                <div className="response-box">
                  <ShieldCheck size={18} />

                  <div>
                    <strong>Automated Response Ready</strong>
                    <p>
                      Critical threats are recommended for SOC notification
                      and blocking.
                    </p>
                  </div>
                </div>
              </div>
            </section>

            <section className="panel events-panel">
              <div className="panel-header">
                <div>
                  <h2>Detection Rules</h2>
                  <p>Active identity threat detection coverage</p>
                </div>
              </div>

              <div className="rules-grid">
                <div className="rule">
                  <div className="rule-icon">
                    <LockKeyhole size={18} />
                  </div>

                  <div>
                    <strong>Brute Force</strong>
                    <span>Multiple failed logins</span>
                  </div>

                  <b>ACTIVE</b>
                </div>

                <div className="rule">
                  <div className="rule-icon">
                    <Bell size={18} />
                  </div>

                  <div>
                    <strong>MFA Fatigue</strong>
                    <span>Repeated MFA requests</span>
                  </div>

                  <b>ACTIVE</b>
                </div>

                <div className="rule">
                  <div className="rule-icon">
                    <MapPin size={18} />
                  </div>

                  <div>
                    <strong>Impossible Travel</strong>
                    <span>Rapid location changes</span>
                  </div>

                  <b>ACTIVE</b>
                </div>

                <div className="rule">
                  <div className="rule-icon">
                    <ShieldAlert size={18} />
                  </div>

                  <div>
                    <strong>Privilege Escalation</strong>
                    <span>Unexpected admin role</span>
                  </div>

                  <b>ACTIVE</b>
                </div>
              </div>
            </section>
          </>
        )}
      

        {activePage === "threats" && (
          <section className="panel page-panel">
            <div className="panel-header">
              <div>
                <p className="eyebrow">SECURITY OPERATIONS</p>
                <h2>Detected Threats</h2>
                <p>All threats identified by the detection engine.</p>
              </div>
            </div>

            <div className="table-wrapper">
              <table>
                <thead>
                  <tr>
                    <th>User</th>
                    <th>Threat</th>
                    <th>Risk</th>
                    <th>Severity</th>
                    <th>Response</th>
                  </tr>
                </thead>

                <tbody>
                  {threats.map((item) => (
                    <tr
                      key={`${item.user}-${item.threat_type}`}
                      className="clickable-row"
                      onClick={() => setSelectedThreat(item)}
                    >
                      <td>{item.user}</td>
                      <td>{formatThreat(item.threat_type)}</td>
                      <td>{item.risk_score.toFixed(2)}</td>
                      <td>
                        <span className={`severity ${item.severity.toLowerCase()}`}>
                          {item.severity}
                        </span>
                      </td>
                      <td>{item.action}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        )}

        {activePage === "identities" && (
          <section className="panel page-panel">
            <div className="panel-header">
              <div>
                <p className="eyebrow">IDENTITY SECURITY</p>
                <h2>Identities</h2>
                <p>Users associated with detected security activity.</p>
              </div>
            </div>

            <div className="identity-grid">
              {[...new Set(threats.map((item) => item.user))].map((user) => {
                const userThreats = threats.filter(
                  (item) => item.user === user
                );

                const highest = userThreats.some(
                  (item) => item.severity === "CRITICAL"
                )
                  ? "CRITICAL"
                  : "HIGH";

                return (
                  <div className="identity-card" key={user}>
                    <div className="avatar identity-avatar">
                      {user.slice(0, 2).toUpperCase()}
                    </div>

                    <div>
                      <strong>{user}</strong>
                      <span>{userThreats.length} detected threat(s)</span>
                    </div>

                    <b className={`identity-risk ${highest.toLowerCase()}`}>
                      {highest}
                    </b>
                  </div>
                );
              })}
            </div>
          </section>
        )}

        {activePage === "events" && (
          <section className="panel page-panel">
            <div className="panel-header">
              <div>
                <p className="eyebrow">IDENTITY TELEMETRY</p>
                <h2>Identity Events</h2>
                <p>Raw events submitted to the detection engine.</p>
              </div>
            </div>

            <div className="table-wrapper">
              <table>
                <thead>
                  <tr>
                    <th>User</th>
                    <th>Event</th>
                    <th>IP Address</th>
                    <th>Location</th>
                    <th>Success</th>
                  </tr>
                </thead>

                <tbody>
                  {eventData.map((event, index) => (
                    <tr key={`${event.user}-${event.timestamp}-${index}`}>
                      <td>{event.user}</td>
                      <td>{formatThreat(event.event_type)}</td>
                      <td>{event.ip_address}</td>
                      <td>{event.location}</td>
                      <td>
                        <span
                          className={
                            event.success
                              ? "event-success"
                              : "event-failed"
                          }
                        >
                          {event.success ? "SUCCESS" : "FAILED"}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        )}

        {activePage === "settings" && (
          <section className="panel page-panel">
            <div className="panel-header">
              <div>
                <p className="eyebrow">SYSTEM CONFIGURATION</p>
                <h2>Detection Settings</h2>
                <p>Current ITDR detection and response configuration.</p>
              </div>
            </div>

            <div className="settings-list">
              <div>
                <span>Detection Engine</span>
                <strong>Rule-Based Detection</strong>
                <b>ACTIVE</b>
              </div>

              <div>
                <span>Risk Scoring</span>
                <strong>0.0 – 1.0</strong>
                <b>ACTIVE</b>
              </div>

              <div>
                <span>Critical Response</span>
                <strong>Notify SOC + Block Recommendation</strong>
                <b>ACTIVE</b>
              </div>

              <div>
                <span>High Response</span>
                <strong>Notify SOC</strong>
                <b>ACTIVE</b>
              </div>
            </div>
          </section>
        )}

        {selectedThreat && (
          <div
            className="modal-backdrop"
            onClick={() => setSelectedThreat(null)}
          >
            <div
              className="threat-modal"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="modal-header">
                <div>
                  <span className="eyebrow">THREAT DETAILS</span>
                  <h2>{formatThreat(selectedThreat.threat_type)}</h2>
                </div>

                <button
                  className="modal-close"
                  onClick={() => setSelectedThreat(null)}
                >
                  ×
                </button>
              </div>

              <div className="modal-grid">
                <div>
                  <span>User</span>
                  <strong>{selectedThreat.user}</strong>
                </div>

                <div>
                  <span>Risk Score</span>
                  <strong>{selectedThreat.risk_score.toFixed(2)}</strong>
                </div>

                <div>
                  <span>Severity</span>
                  <strong>{selectedThreat.severity}</strong>
                </div>

                <div>
                  <span>Response</span>
                  <strong>{selectedThreat.action}</strong>
                </div>
              </div>

              <div className="modal-reason">
                <span>Detection Reason</span>
                <p>{selectedThreat.reason}</p>
              </div>
            </div>
          </div>
        )}

      </main>
    </div>
  );
}

export default App;
