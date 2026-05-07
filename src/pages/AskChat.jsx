import { useState, useRef, useEffect } from "react";
import {askAgraharam} from "../api/dashboardsApi";

export default function AskChat() {
  const [open, setOpen] = useState(false);
  const [question, setQuestion] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);

  const chatRef = useRef(null);

  // auto scroll
  useEffect(() => {
    chatRef.current?.scrollTo(0, chatRef.current.scrollHeight);
  }, [messages]);

  const handleAsk = async () => {
    if (!question.trim()) return;

    const userMsg = { role: "user", text: question };
    setMessages((prev) => [...prev, userMsg]);

    setLoading(true);
    setQuestion("");

    try {
      const res = await askAgraharam(question);
      const botMsg = {
        role: "bot",
        text: res.data.answer,
      };


      setMessages((prev) => [...prev, botMsg]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        { role: "bot", text: "Something went wrong" },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Floating Button */}
      <div className="bg-orange-600 text-white p-4 rounded-full shadow-lg" style={styles.floatingButton} onClick={() => setOpen(!open)}>
        💬
      </div>

      {/* Chat Box */}
      {open && (
        <div style={styles.chatContainer}>
          <div className="bg-orange-600 text-white p-4 flex justify-between items-center" style={styles.header}>
            <span>Ask AI</span>
            <button onClick={() => setOpen(false)} style={styles.closeBtn}>
              ✖
            </button>
          </div>

          <div ref={chatRef} style={styles.chatBody}>
            {messages.map((msg, i) => (
              <div
                key={i}
                style={{
                  ...styles.message,
                  alignSelf:
                    msg.role === "user" ? "flex-end" : "flex-start",
                  background:
                    msg.role === "user" ? "#DCF8C6" : "#EEE",
                }}
              >
                {msg.text}
              </div>
            ))}

            {loading && <div style={styles.bot}>Thinking...</div>}
          </div>

          <div style={styles.inputRow}>
            <input
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="Ask something..."
              style={styles.input}
              onKeyDown={(e) => e.key === "Enter" && handleAsk()}
            />
            <button className="bg-orange-600 hover:bg-orange-700 text-white font-bold py-2 px-4 rounded" onClick={handleAsk} style={styles.sendBtn}>
              ➤
            </button>
          </div>
        </div>
      )}
    </>
  );
}

const styles = {
  floatingButton: {
    position: "fixed",
    bottom: "20px",
    right: "20px",
    width: "60px",
    height: "60px",
    borderRadius: "50%",
    // backgroundColor: "#007bff",
    color: "white",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "24px",
    cursor: "pointer",
    boxShadow: "0 4px 10px rgba(0,0,0,0.2)",
    zIndex: 1000,
  },

  chatContainer: {
    position: "fixed",
    bottom: "90px",
    right: "20px",
    width: "320px",
    height: "420px",
    background: "#fff",
    borderRadius: "10px",
    boxShadow: "0 4px 20px rgba(0,0,0,0.2)",
    display: "flex",
    flexDirection: "column",
    overflow: "hidden",
    zIndex: 1000,
  },

  header: {
    // background: "#007bff",
    color: "#fff",
    padding: "10px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },

  closeBtn: {
    background: "transparent",
    border: "none",
    color: "#fff",
    cursor: "pointer",
  },

  chatBody: {
    flex: 1,
    padding: "10px",
    overflowY: "auto",
    display: "flex",
    flexDirection: "column",
    gap: "8px",
  },

  message: {
    padding: "8px 10px",
    borderRadius: "10px",
    maxWidth: "80%",
  },

  bot: {
    fontStyle: "italic",
    fontSize: "12px",
  },

  inputRow: {
    display: "flex",
    borderTop: "1px solid #ddd",
  },

  input: {
    flex: 1,
    padding: "10px",
    border: "none",
    outline: "none",
  },

  sendBtn: {
    padding: "10px",
    border: "none",
    // background: "#007bff",
    color: "#fff",
    cursor: "pointer",
  },
};
