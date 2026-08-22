import { useState } from "react";
import { Link } from "react-router-dom";
import api from "../lib/axios.js";

const Contact = () => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    message: "",
  });

  const [sent, setSent] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");

  const inputStyle = {
    width: "100%",
    height: 40,
    padding: "0 14px",
    border: "1px solid #e0e0ea",
    borderRadius: 10,
    fontSize: 13,
    fontFamily: "DM Sans, sans-serif",
    outline: "none",
    marginBottom: 14,
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setSending(true);

    try {
      await api.post("/contact", {
        name: form.name,
        email: form.email,
        message: form.message,
      });

      setSent(true);

      setForm({
        name: "",
        email: "",
        message: "",
      });
    } catch (err) {
      console.error("[Contact] Send failed:", err);

      setError(
        err.response?.data?.message ||
        "Unable to send your message. Please try again."
      );
    } finally {
      setSending(false);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center p-4"
      style={{ background: "#f5f4ff" }}
    >
      <div
        className="bg-white rounded-2xl p-8"
        style={{
          width: 420,
          border: "1px solid #f0f0f4",
        }}
      >
        <Link
          to="/"
          style={{
            fontSize: 13,
            color: "#5b3df5",
            textDecoration: "none",
          }}
        >
          ← Back to home
        </Link>

        <h1
          style={{
            fontFamily: "Syne, sans-serif",
            fontSize: 22,
            fontWeight: 600,
            color: "#0a0a0f",
            marginTop: 16,
            marginBottom: 4,
          }}
        >
          Get in touch
        </h1>

        <p
          style={{
            fontSize: 13,
            fontFamily: "DM Sans, sans-serif",
            color: "#9ca3af",
            marginBottom: 24,
          }}
        >
          Bug report, feature idea, or just saying hi — I read everything.
        </p>

        {sent ? (
          <div>
            <p
              style={{
                fontSize: 13,
                fontFamily: "DM Sans, sans-serif",
                color: "#0f6e56",
                background: "#e1f5ee",
                padding: "12px 14px",
                borderRadius: 10,
              }}
            >
              Message sent successfully. Thanks for reaching out!
            </p>

            <button
              type="button"
              onClick={() => setSent(false)}
              style={{
                marginTop: 12,
                background: "none",
                border: "none",
                color: "#5b3df5",
                fontSize: 12,
                cursor: "pointer",
              }}
            >
              Send another message
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <input
              placeholder="Your name"
              value={form.name}
              onChange={(e) =>
                setForm((p) => ({
                  ...p,
                  name: e.target.value,
                }))
              }
              style={inputStyle}
            />

            <input
              type="email"
              placeholder="Your email"
              required
              value={form.email}
              onChange={(e) =>
                setForm((p) => ({
                  ...p,
                  email: e.target.value,
                }))
              }
              style={inputStyle}
            />

            <textarea
              placeholder="What's on your mind?"
              required
              value={form.message}
              onChange={(e) =>
                setForm((p) => ({
                  ...p,
                  message: e.target.value,
                }))
              }
              style={{
                ...inputStyle,
                height: 100,
                resize: "none",
                paddingTop: 10,
              }}
            />

            {error && (
              <p
                style={{
                  fontSize: 12,
                  color: "#e24b4a",
                  background: "#fcebeb",
                  padding: "8px 12px",
                  borderRadius: 8,
                  marginBottom: 12,
                }}
              >
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={sending}
              className="w-full rounded-xl text-white"
              style={{
                height: 42,
                background: sending ? "#9b8de8" : "#5b3df5",
                border: "none",
                fontSize: 13,
                fontFamily: "Syne, sans-serif",
                fontWeight: 500,
                cursor: sending ? "not-allowed" : "pointer",
              }}
            >
              {sending ? "Sending..." : "Send Message"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default Contact;