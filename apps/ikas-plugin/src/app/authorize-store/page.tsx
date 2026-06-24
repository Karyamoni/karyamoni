"use client";

import { useState } from "react";

export default function AuthorizeStorePage() {
  const [storeName, setStoreName] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (storeName.trim()) {
      window.location.replace(`/api/oauth/authorize/ikas?storeName=${storeName.trim()}`);
    }
  };

  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "100vh", background: "var(--paper)" }}>
      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "16px", width: "320px" }}>
        <h1 style={{ fontSize: "24px", fontWeight: 500, letterSpacing: "-0.02em" }}>Connect Store</h1>
        <input
          type="text"
          value={storeName}
          onChange={(e) => setStoreName(e.target.value)}
          placeholder="your-store-name"
          style={{ padding: "10px 14px", border: "1px solid var(--ink-10)", borderRadius: "4px", fontSize: "14px" }}
        />
        <button
          type="submit"
          style={{ padding: "10px 14px", background: "var(--ink)", color: "var(--paper)", border: "none", borderRadius: "4px", fontSize: "14px", cursor: "pointer" }}
        >
          Authorize
        </button>
      </form>
    </div>
  );
}
