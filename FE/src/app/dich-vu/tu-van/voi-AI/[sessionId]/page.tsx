"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import {
  PaperAirplaneIcon,
  Bars3Icon,
  XMarkIcon,
} from "@heroicons/react/24/solid";
import axiosInstance from "@/helpers/api/config";
import { useSelector } from "react-redux";
import { RootState } from "@/hooks/useAppDispatch";
import { useRouter, useParams } from "next/navigation";
import Sidebar from "@/components/chatSidebar/chatSidebar";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

// Types
 type Message = {
  id: string;
  content: string;
  role: "client" | "ai" | "expert";
  createdAt?: number;
};

export default function ChatSessionPage() {
  // --- State ---
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      content: "Xin chào! Tôi là chatbot tư vấn tâm lý. Tôi có thể giúp gì cho bạn?",
      role: "ai",
      createdAt: Date.now(),
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<"ai" | "expert">("ai");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [sessionName, setSessionName] = useState<string>("Phiên tư vấn");
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [ending, setEnding] = useState(false);
  const [sessionStatus, setSessionStatus] = useState<"open" | "closed">("open");

  const router = useRouter();
  const { sessionId } = useParams<{ sessionId?: string }>();

  // Redux user (SSR-safe because useSelector only runs client side here)
  const user = useSelector((state: RootState) => state.user.currentUser) || null;
  const userId = user ? user.id : null;

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
    el.style.height = Math.min(el.scrollHeight, 200) + "px"; // cap height
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  // --- Load history ---
  useEffect(() => {
    if (!sessionId) return;
    let cancelled = false;
    const fetchChatHistory = async () => {
      try {
        const res = await axiosInstance.get(`/chats/history/${sessionId}`);
        if (cancelled) return;
        const messagesFromServer = res.data?.messages ?? [];
        const name = res.data?.sessionName ?? "Phiên tư vấn";
        const status = (res.data?.status as "open" | "closed") ?? "open"; // <-- get session status

        setSessionStatus(status); // save status
        setSessionName(name);
        const formatted: Message[] = messagesFromServer.map((msg: any) => ({
          id: String(msg.id ?? crypto.randomUUID()),
          content: String(msg.content ?? ""),
          role: (msg.role as Message["role"]) ?? "ai",
          createdAt: Number(msg.createdAt ?? Date.now()),
        }));
        setMessages(
          formatted.length
            ? formatted
            : [{ id: "empty", content: "(Chưa có tin nhắn)", role: "ai", createdAt: Date.now() }]
        );
      } catch (error) {
        console.error("Lỗi khi tải lịch sử chat:", error);
      }
    };
    fetchChatHistory();
    return () => {
      cancelled = true;
    };
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
      if (!trimmed || !userId) return;
      if (sessionStatus === "closed") return; // guard when closed

      const userMessage: Message = {
        id: crypto.randomUUID(),
        content: trimmed,
        role: "client",
        createdAt: Date.now(),
      };

      // optimistic
      setMessages((prev) => [...prev, userMessage]);
      setInput("");
      setIsLoading(true);
      autoGrow();

      try {
        // Keep API compatibility with your backend routes
        const endpoint = activeTab === "ai"
          ? (sessionId ? `/chats/AI/${sessionId}` : "/chats/AI/")
          : (sessionId ? `/chats/expert/${sessionId}` : "/chats/expert");

        const response = await axiosInstance.post(endpoint, {
          userId,
          message: trimmed,
        });

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
    [activeTab, autoGrow, input, sessionId, userId, sessionStatus]
  );

  // Keyboard: Enter to send, Shift+Enter newline
  const onKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        handleSubmit();
      }
    },
    [handleSubmit]
  );

  // End chat session -> analyze + redirect
  const handleEndChatSession = async () => {
    if (!sessionId) {
      alert("Không tìm thấy sessionId");
      return;
    }

    const clientData = localStorage.getItem('user');
    const userId = clientData ? JSON.parse(clientData).id : null;

    if (window.confirm('Bạn có chắc chắn muốn kết thúc phiên chat này?')) {
      try {
        setEnding(true);
        // Gọi API phân tích và lưu vào emotion_diaries
        const res = await axiosInstance.post(`/chats/analyze/${sessionId}`, {
          client_id: userId,
        });

        // Optional: chuyển trạng thái local ngay lập tức để khoá UI
        setSessionStatus("closed");

        alert("Đã kết thúc phiên chat và lưu phân tích cảm xúc!");

        // Điều hướng về danh sách hoặc trang khác
        router.push('/ho-so/nhat-ky');
      } catch (error) {
        console.error("Lỗi khi kết thúc phiên chat:", error);
        alert("Không thể phân tích phiên chat. Vui lòng thử lại.");
      } finally {
        setEnding(false);
      }
    }
  };

  const isClosed = sessionStatus === "closed";

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
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3 min-w-0">
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
              <h1 className="text-xl sm:text-2xl font-semibold truncate">{sessionName}</h1>
            </div>

            <button
              onClick={handleEndChatSession}
              disabled={ending || isClosed}
              className="ml-4 px-3 sm:px-4 py-2 bg-red-500 hover:bg-red-600 disabled:bg-red-300 rounded-lg font-medium transition-colors"
            >
              {isClosed ? "Phiên đã kết thúc" : ending ? "Đang kết thúc..." : "Kết thúc phiên chat và ghi nhật ký"}
            </button>
          </div>
        </header>

        {/* Messages list */}
        <div className="flex-1 overflow-y-auto px-3 sm:px-6 py-4 space-y-3">
          {isClosed && (
            <div className="text-center text-sm text-red-600 font-medium">
              Phiên chat này đã kết thúc. Bạn không thể gửi thêm tin nhắn.
            </div>
          )}

          {messages.map((m) => (
            <MessageBubble
              key={m.id}
              message={m}
              align={m.role === "client" ? "right" : "left"}
            />
          ))}
          {isLoading && <TypingIndicator role={activeTab === "ai" ? "ai" : "expert"} />}
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
              placeholder={
                isClosed
                  ? "Phiên chat đã kết thúc"
                  : "Nhập tin nhắn (Enter để gửi, Shift+Enter xuống dòng)"
              }
              className="flex-1 resize-none rounded-2xl border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white placeholder:text-gray-400"
              disabled={isLoading || isClosed}
              aria-label="Soạn tin nhắn"
            />
            <button
              type="submit"
              disabled={isLoading || !input.trim() || isClosed}
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
}: {
  message: Message;
  align?: "left" | "right";
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
