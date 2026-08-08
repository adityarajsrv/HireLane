import { useState, useEffect } from "react";
import api from "../lib/axios.js";

const ExtensionSetup = () => {
  const [connectionInfo, setConnectionInfo] = useState(null);

  useEffect(() => {
    api.get("/api/profile").then((res) => {
      if (res.data.profile) {
        setConnectionInfo({
          enabled: res.data.profile.extensionEnabled !== false,
          lastConnected: res.data.profile.extensionLastConnectedAt,
        });
      }
    });
  }, []);

  const isConnected = connectionInfo?.lastConnected &&
    (Date.now() - new Date(connectionInfo.lastConnected).getTime()) < 1000 * 60 * 60 * 24 * 7;

  const stepStyle = { display: "flex", gap: 12, marginBottom: 16 };
  const numberStyle = {
    width: 24, height: 24, borderRadius: "50%", background: "#5b3df5", color: "white",
    fontSize: 12, fontFamily: "JetBrains Mono, monospace", fontWeight: 600,
    display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
  };

  return (
    <div>
      <div className="mb-6">
        <h1 style={{ fontFamily: "Syne, sans-serif", fontSize: 22, fontWeight: 500, color: "#0a0a0f", marginBottom: 4 }}>
          Browser Extension
        </h1>
        <span style={{ fontSize: 11, fontFamily: "JetBrains Mono, monospace", color: "#9ca3af" }}>
          Autofill applications directly on Workday, Greenhouse, Lever, and more
        </span>
      </div>

      <div style={{ maxWidth: 640 }}>

        <div
          className="flex items-center gap-3 rounded-2xl p-4 mb-5"
          style={{
            background: isConnected ? "#e1f5ee" : "#faeeda",
            border: `1px solid ${isConnected ? "#5dcaa5" : "#fde68a"}`,
          }}
        >
          <span className="rounded-full" style={{ width: 8, height: 8, background: isConnected ? "#1bd29c" : "#ef9f27", flexShrink: 0 }} />
          <div>
            <div style={{ fontSize: 13, fontFamily: "DM Sans, sans-serif", fontWeight: 500, color: isConnected ? "#0f6e56" : "#854f0b" }}>
              {isConnected ? "Extension connected and active" : "Extension not connected yet"}
            </div>
            {connectionInfo?.lastConnected && (
              <div style={{ fontSize: 10, fontFamily: "JetBrains Mono, monospace", color: isConnected ? "#0f6e56" : "#854f0b" }}>
                Last seen: {new Date(connectionInfo.lastConnected).toLocaleString()}
              </div>
            )}
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 mb-4" style={{ border: "1px solid #f0f0f4" }}>
          <div style={{ fontSize: 14, fontFamily: "DM Sans, sans-serif", fontWeight: 500, color: "#0a0a0f", marginBottom: 4 }}>
            Step 1 — Download
          </div>
          <p style={{ fontSize: 12, fontFamily: "DM Sans, sans-serif", color: "#6b7280", marginBottom: 16 }}>
            HireLane isn't on the Chrome Web Store yet — install it manually in Developer Mode. This is completely free and takes about 2 minutes.
          </p>
          <a
            href="/hirelane-extension.zip"
            download
            className="inline-flex items-center justify-center rounded-xl text-white"
            style={{ height: 38, padding: "0 20px", background: "#5b3df5", fontSize: 13, fontFamily: "Syne, sans-serif", fontWeight: 500, textDecoration: "none" }}
          >
            Download Extension (.zip)
          </a>
        </div>

        <div className="bg-white rounded-2xl p-5 mb-4" style={{ border: "1px solid #f0f0f4" }}>
          <div style={{ fontSize: 14, fontFamily: "DM Sans, sans-serif", fontWeight: 500, color: "#0a0a0f", marginBottom: 16 }}>
            Step 2 — Install in Chrome
          </div>

          {[
            { text: "Unzip the downloaded file anywhere on your computer (e.g. your Downloads folder)." },
            { text: "Open a new Chrome tab and go to chrome://extensions" },
            { text: 'Turn on "Developer mode" using the toggle in the top-right corner.' },
            { text: 'Click "Load unpacked" and select the unzipped hirelane-extension folder.' },
            { text: "HireLane will appear in your extensions list — click the puzzle-piece icon in your toolbar and pin it for easy access." },
          ].map((step, i) => (
            <div key={i} style={stepStyle}>
              <div style={numberStyle}>{i + 1}</div>
              <p style={{ fontSize: 12, fontFamily: "DM Sans, sans-serif", color: "#374151", lineHeight: 1.6, paddingTop: 2 }}>
                {step.text}
              </p>
            </div>
          ))}
        </div>

        <div className="bg-white rounded-2xl p-5 mb-4" style={{ border: "1px solid #f0f0f4" }}>
          <div style={{ fontSize: 14, fontFamily: "DM Sans, sans-serif", fontWeight: 500, color: "#0a0a0f", marginBottom: 16 }}>
            Step 3 — Connect Your Account
          </div>
          <div style={stepStyle}>
            <div style={numberStyle}>1</div>
            <p style={{ fontSize: 12, fontFamily: "DM Sans, sans-serif", color: "#374151", lineHeight: 1.6, paddingTop: 2 }}>
              Click the HireLane icon in your Chrome toolbar.
            </p>
          </div>
          <div style={stepStyle}>
            <div style={numberStyle}>2</div>
            <p style={{ fontSize: 12, fontFamily: "DM Sans, sans-serif", color: "#374151", lineHeight: 1.6, paddingTop: 2 }}>
              Click "Connect Account" and sign in with the same email and password you use here.
            </p>
          </div>
          <div style={stepStyle}>
            <div style={numberStyle}>3</div>
            <p style={{ fontSize: 12, fontFamily: "DM Sans, sans-serif", color: "#374151", lineHeight: 1.6, paddingTop: 2 }}>
              Visit any supported job posting (Workday, Greenhouse, Lever, Internshala, or Naukri) and click "Fill Application" from the popup.
            </p>
          </div>
        </div>

        <div className="rounded-2xl p-4" style={{ background: "#f5f4ff", border: "1px solid #ede8ff" }}>
          <p style={{ fontSize: 11, fontFamily: "DM Sans, sans-serif", color: "#374151", lineHeight: 1.6 }}>
            The extension autofills using your Profile data. The more complete your Profile — especially work history, education, and eligibility answers — the more fields it can fill automatically on complex applications like Workday.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ExtensionSetup;