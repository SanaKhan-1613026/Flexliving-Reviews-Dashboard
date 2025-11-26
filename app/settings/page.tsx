"use client";

import { useSettings } from "../context/SettingsContext";

export default function SettingsPage() {
  const { theme, setTheme, fontSize, setFontSize } = useSettings();

  return (
    <div style={{ maxWidth: "900px" }}>
      <h1 className="page-title">Settings</h1>
      <p className="page-subtitle">
        Configure how you'd like to review guest feedback. (For demo only — does not persist)
      </p>

      {/* THEME */}
      <section className="card" style={{ marginBottom: 20 }}>
        <p className="card-title">Theme</p>
        <p className="card-meta">Toggle light or dark mode.</p>

        <select
          value={theme}
          onChange={(e) => setTheme(e.target.value as "light" | "dark")}
          style={{ marginTop: 10 }}
        >
          <option value="light">Light mode</option>
          <option value="dark">Dark mode</option>
        </select>
      </section>

      {/* FONT SIZE */}
      <section className="card" style={{ marginBottom: 20 }}>
        <p className="card-title">Font size</p>
        <p className="card-meta">Adjust text sizing across the dashboard.</p>

        <select
          value={fontSize}
          onChange={(e) =>
            setFontSize(e.target.value as "small" | "medium" | "large")
          }
          style={{ marginTop: 10 }}
        >
          <option value="small">Small</option>
          <option value="medium">Medium</option>
          <option value="large">Large</option>
        </select>
      </section>

      {/* DEFAULT SORTING (DEMO ONLY) */}
      <section className="card" style={{ marginBottom: 20 }}>
        <p className="card-title">Default dashboard sorting</p>
        <p className="card-meta">(In a real app this would set your preferred default sorting)</p>

        <select style={{ marginTop: 10 }}>
          <option>Newest first</option>
          <option>Oldest first</option>
          <option>Highest rating</option>
          <option>Lowest rating</option>
        </select>
      </section>

      {/* CHANNEL VISIBILITY — UI ONLY */}
      <section className="card">
        <p className="card-title">Channel visibility (demo)</p>
        <p className="card-meta">
          (These do not filter the rest of the app — demo only)
        </p>

        <div style={{ marginTop: 10 }}>
          <label>
            <input type="checkbox" defaultChecked /> Airbnb
          </label>
          <br />
          <label>
            <input type="checkbox" defaultChecked /> Booking.com
          </label>
        </div>
      </section>
    </div>
  );
}
