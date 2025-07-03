'use client';

import { useState } from "react";

const NhatKyPage = () => {
    const [entries, setEntries] = useState<{ date: string; content: string }[]>([]);
    const [content, setContent] = useState("");

    const handleSave = () => {
        if (content.trim() === "") return;
        setEntries([
            { date: new Date().toLocaleString(), content },
            ...entries,
        ]);
        setContent("");
    };

    return (
        <div style={{ maxWidth: 600, margin: "40px auto", padding: 24, background: "#fff", borderRadius: 8, boxShadow: "0 2px 8px #eee" }}>
            <h1>Nhật ký cá nhân</h1>
            <textarea
                value={content}
                onChange={e => setContent(e.target.value)}
                placeholder="Viết nhật ký của bạn..."
                rows={5}
                style={{ width: "100%", marginBottom: 12, padding: 8, fontSize: 16 }}
            />
            <button onClick={handleSave} style={{ padding: "8px 16px", fontSize: 16 }}>
                Lưu nhật ký
            </button>
            <hr style={{ margin: "24px 0" }} />
            <h2>Nhật ký đã lưu</h2>
            <ul style={{ listStyle: "none", padding: 0 }}>
                {entries.map((entry, idx) => (
                    <li key={idx} style={{ marginBottom: 16, background: "#f9f9f9", padding: 12, borderRadius: 6 }}>
                        <div style={{ fontSize: 12, color: "#888" }}>{entry.date}</div>
                        <div style={{ marginTop: 4 }}>{entry.content}</div>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default NhatKyPage;