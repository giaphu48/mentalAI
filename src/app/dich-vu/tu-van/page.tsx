"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import {
  PaperAirplaneIcon,
  Bars3Icon,
  XMarkIcon,
  ClipboardDocumentIcon,
  CheckIcon,
} from "@heroicons/react/24/solid";
import axiosInstance from "@/helpers/api/config";
import { useRouter, useParams } from "next/navigation";
import Sidebar from "@/components/chatSidebar/chatSidebar";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

// Types
 type Message = {
  id: string;
  content: string;
  role: "client" | "ai" | "expert";
  createdAt?: number; // local timestamp for ordering/UX
};

export default function ChatPage() {
  // --- State ---
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      content: "Xin chào! Tôi là trợ lý AI. Tôi có thể giúp gì cho bạn?",
      role: "ai",
      createdAt: Date.now(),
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<"ai" | "expert">("ai");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const router = useRouter();
  const { sessionId } = useParams<{ sessionId?: string }>();

  // Refs
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // --- Helpers ---
  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, []);

  const autoGrow = useCallback(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = "0px";
    el.style.height = Math.min(el.scrollHeight, 200) + "px"; // cap at ~5-6 lines
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  // --- Auth check (client-only safe) ---
  useEffect(() => {
    try {
      const storedUser = typeof window !== "undefined" ? localStorage.getItem("user") : null;
      if (!storedUser) {
        router.push("/tai-khoan/dang-nhap");
        return;
      }
      const parsed = JSON.parse(storedUser);
      if (!parsed?.id) {
        router.push("/tai-khoan/dang-nhap");
        return;
      }
      setUser(parsed);
      setIsLoggedIn(true);
    } catch (err) {
      console.error("Lỗi khi kiểm tra đăng nhập:", err);
      router.push("/tai-khoan/dang-nhap");
    }
  }, [router]);

  // --- Load history when sessionId changes ---
  useEffect(() => {
    if (!sessionId) return;
    let cancelled = false;
    const fetchChatHistory = async () => {
      try {
        const res = await axiosInstance.get(`/chats/history/${sessionId}`);
        if (cancelled) return;
        const messagesFromServer = res.data?.messages ?? [];
        const formatted: Message[] = messagesFromServer.map((m: any) => ({
          id: String(m.id ?? crypto.randomUUID()),
          content: String(m.content ?? ""),
          role: (m.role as Message["role"]) ?? "ai",
          createdAt: Number(m.createdAt ?? Date.now()),
        }));
        setMessages(formatted.length ? formatted : messages);
      } catch (error) {
        console.error("Lỗi khi tải lịch sử chat:", error);
      }
    };
    fetchChatHistory();
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sessionId]);

  // --- Actions ---
  const createNewSession = useCallback(() => {
    router.push("/dich-vu/tu-van/");
  }, [router]);

  const selectSession = useCallback(
    (sid: string) => {
      setMessages([
        {
          id: "loading",
          content: `Đang tải cuộc trò chuyện ${sid}...`,
          role: activeTab === "ai" ? "ai" : "expert",
          createdAt: Date.now(),
        },
      ]);
    },
    [activeTab]
  );

  const handleSubmit = useCallback(
    async (e?: React.FormEvent) => {
      e?.preventDefault();
      const trimmed = input.trim();
      if (!trimmed || !user?.id) return;

      const userMessage: Message = {
        id: crypto.randomUUID(),
        content: trimmed,
        role: "client",
        createdAt: Date.now(),
      };

      // Optimistic UI
      setMessages((prev) => [...prev, userMessage]);
      setInput("");
      setIsLoading(true);
      autoGrow();

      try {
        const endpoint = activeTab === "ai" ? `/chats/AI/` : `/chats/expert/`;
        const response = await axiosInstance.post(endpoint, {
          userId: user.id,
          message: trimmed,
          sessionId, // let backend attach to current session if any
        });

        // If server created a new session
        if (response.status === 201 && response.data?.sessionId) {
          const newSessionId = response.data.sessionId;
          router.push(`/dich-vu/tu-van/voi-AI/${newSessionId}`);
          return;
        }

        // Normal reply for existing session
        const replyMessage: Message = {
          id: crypto.randomUUID(),
          content: String(response.data?.reply ?? "(không có nội dung)"),
          role: activeTab === "ai" ? "ai" : "expert",
          createdAt: Date.now(),
        };
        setMessages((prev) => [...prev, replyMessage]);
      } catch (error) {
        console.error("Error:", error);
        const errorMessage: Message = {
          id: crypto.randomUUID(),
          content: "Xin lỗi, đã có lỗi xảy ra. Vui lòng thử lại sau.",
          role: activeTab === "ai" ? "ai" : "expert",
          createdAt: Date.now(),
        };
        setMessages((prev) => [...prev, errorMessage]);
      } finally {
        setIsLoading(false);
      }
    },
    [activeTab, autoGrow, input, router, sessionId, user?.id]
  );

  // Keyboard: Enter to send, Shift+Enter for newline
  const onKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        handleSubmit();
      }
    },
    [handleSubmit]
  );

  // Copy handler per message
  const copyMessage = useCallback(async (id: string, text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 1500);
    } catch (err) {
      console.error("Copy failed", err);
    }
  }, []);

  // --- Render ---
  if (!isLoggedIn) {
    return (
      <div className="flex h-screen items-center justify-center text-gray-600">Đang kiểm tra đăng nhập...</div>
    );
  }

  return (
    <div className="flex h-dvh bg-gray-50">
      {/* Sidebar */}
      <Sidebar
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        createNewSession={createNewSession}
        selectSession={selectSession}
      />

      {/* Main */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="sticky top-0 z-10 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-4 py-3 shadow">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen((v) => !v)}
              className="p-2 rounded-lg hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-white/40"
              aria-label="Toggle sidebar"
            >
              {sidebarOpen ? (
                <XMarkIcon className="h-6 w-6" />
              ) : (
                <Bars3Icon className="h-6 w-6" />
              )}
            </button>
            <h1 className="text-xl sm:text-2xl font-semibold tracking-tight">
              {activeTab === "ai" ? "Trợ lý AI" : "Chuyên gia tư vấn"}
            </h1>
          </div>
        </header>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-3 sm:px-6 py-4 space-y-3">
          {messages.map((m) => (
            <MessageBubble
              key={m.id}
              message={m}
              align={m.role === "client" ? "right" : "left"}
              onCopy={copyMessage}
              copied={copiedId === m.id}
            />
          ))}

          {isLoading && (
            <TypingIndicator role={activeTab === "ai" ? "ai" : "expert"} />
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Composer */}
        <form
          onSubmit={handleSubmit}
          className="sticky bottom-0 bg-white border-t border-gray-200 px-3 sm:px-6 py-3"
        >
          <div className="flex items-end gap-2">
            <textarea
              ref={textareaRef}
              rows={1}
              value={input}
              onChange={(e) => {
                setInput(e.target.value);
                autoGrow();
              }}
              onKeyDown={onKeyDown}
              placeholder="Nhập tin nhắn..."
              className="flex-1 resize-none rounded-2xl border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white placeholder:text-gray-400"
              disabled={isLoading}
              aria-label="Soạn tin nhắn"
            />
            <button
              type="submit"
              disabled={isLoading || !input.trim()}
              className="shrink-0 rounded-2xl bg-blue-600 px-4 py-2 text-white font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-blue-300 disabled:cursor-not-allowed inline-flex items-center gap-2"
              aria-label="Gửi tin nhắn"
            >
              <PaperAirplaneIcon className="h-5 w-5" />
              <span className="hidden sm:inline">Gửi</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// --- Subcomponents ---
function MessageBubble({
  message,
  align = "left",
  onCopy,
  copied,
}: {
  message: Message;
  align?: "left" | "right";
  onCopy: (id: string, text: string) => void;
  copied: boolean;
}) {
  const isUser = message.role === "client";
  const isAI = message.role === "ai";

  const bubbleClasses = isUser
    ? "bg-blue-600 text-white"
    : isAI
    ? "bg-white text-gray-900 shadow"
    : "bg-green-100 text-gray-900 shadow";

  const badge = isUser ? "Bạn" : isAI ? "AI" : "Chuyên gia";

  return (
    <div className={`flex ${align === "right" ? "justify-end" : "justify-start"}`}>
      <div className={`group max-w-[85%] sm:max-w-[70%] rounded-2xl px-4 py-3 ${bubbleClasses}`}>
        <div className="mb-1 text-xs opacity-70 select-none">{badge}</div>
        <div className="prose prose-sm max-w-none prose-p:my-2 prose-pre:my-2 prose-pre:rounded-xl prose-pre:p-3 prose-code:before:content-[''] prose-code:after:content-['']">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>{message.content}</ReactMarkdown>
        </div>
      </div>
    </div>
  );
}

function TypingIndicator({ role }: { role: "ai" | "expert" }) {
  return (
    <div className="flex justify-start">
      <div
        className={`rounded-2xl px-4 py-3 shadow ${
          role === "ai" ? "bg-white" : "bg-green-100"
        }`}
      >
        <div className="flex items-center gap-1">
          <Dot />
          <Dot className="animation-delay-100" />
          <Dot className="animation-delay-200" />
        </div>
      </div>
    </div>
  );
}

function Dot({ className = "" }: { className?: string }) {
  return (
    <span
      className={`inline-block h-2 w-2 rounded-full bg-gray-400 animate-bounce ${className}`}
    />
  );
}
