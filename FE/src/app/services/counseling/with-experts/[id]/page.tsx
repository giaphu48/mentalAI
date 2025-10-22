"use client";

import { useState, useRef, useEffect, useCallback, useMemo } from "react";
import {
  PaperAirplaneIcon,
  Bars3Icon,
  XMarkIcon,
  ClipboardDocumentIcon,
  CheckIcon,
  ArrowPathIcon,
  ExclamationTriangleIcon,
} from "@heroicons/react/24/solid";
import axiosInstance from "@/helpers/api/config";
import { useSelector } from "react-redux";
import { RootState } from "@/hooks/useAppDispatch";
import { useRouter, useParams } from "next/navigation";
import Sidebar from "@/components/chatSidebar/chatSidebar";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

// --- Types ---
 type RoleType = "client" | "expert" | "ai";
 type Message = {
  id: string;
  content: string;
  role: RoleType;
  createdAt?: number;
  error?: boolean;
};

export default function ChatWithExpertPage() {
  // --- State ---
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<"ai" | "expert">("expert");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [sessionName, setSessionName] = useState("Phiên tư vấn");
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [banner, setBanner] = useState<string | null>(null);

  const router = useRouter();
  const { id: sessionId } = useParams<{ id?: string }>();

  // Redux user
  const user = useSelector((state: RootState) => state.user.currentUser) || null;
  const userId = user ? user.id : null;

  // Refs
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const lastUserMsgRef = useRef<Message | null>(null);

  // --- UX helpers ---
  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, []);

  const autoGrow = useCallback(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = "0px";
    el.style.height = Math.min(el.scrollHeight, 200) + "px";
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  // Connection banner
  useEffect(() => {
    const on = () => setBanner(null);
    const off = () => setBanner("Mất kết nối mạng. Một số thao tác có thể không hoạt động.");
    window.addEventListener("online", on);
    window.addEventListener("offline", off);
    if (!navigator.onLine) off();
    return () => {
      window.removeEventListener("online", on);
      window.removeEventListener("offline", off);
    };
  }, []);

  // --- Utilities ---
  const getReplyRole = useCallback((): RoleType => {
    if (activeTab === "ai") return "ai";
    // expert chat: reply role is the *other* side
    return user?.role === "client" ? "expert" : "client";
  }, [activeTab, user?.role]);

  // --- Load history ---
  useEffect(() => {
    if (!sessionId) return;
    let cancelled = false;

    
    const fetchChatHistory = async () => {
      try {
        const res = await axiosInstance.get(`/chats/history/${sessionId}`);
        console.log(res.data)
        if (cancelled) return;

        const { messages: serverMessages = [], sessionName, sessionType } = res.data ?? {};
        if (sessionType === "ai" || sessionType === "expert") {
          setActiveTab(sessionType);
        }
        if (sessionName) setSessionName(sessionName);

        const formatted: Message[] = serverMessages.map((msg: any) => ({
          id: String(msg.id ?? crypto.randomUUID()),
          content: String(msg.content ?? ""),
          role: (msg.role as RoleType) ?? "expert",
          createdAt: Number(msg.createdAt ?? Date.now()),
        }));
        setMessages(formatted);
      } catch (error) {
        console.error("Lỗi khi tải lịch sử chat:", error);
        setBanner("Không thể tải lịch sử. Vui lòng thử lại.");
      }
    };

    fetchChatHistory();
    return () => {
      cancelled = true;
    };
  }, [sessionId]);

  // --- Actions ---
  const createNewSession = useCallback(() => {
    router.push("/services/counseling/");
  }, [router]);

  const selectSession = useCallback(
    (sid: string) => {
      router.push(`/services/counseling/${sid}`);
    },
    [router]
  );

  const sendToServer = useCallback(
    async (payload: { userId: string; message: string; userRole?: string }) => {
      const endpoint = activeTab === "ai"
        ? (sessionId ? `/chats/AI/${sessionId}` : "/chats/AI/")
        : (sessionId ? `/chats/expert/${sessionId}` : "/chats/expert");
      return axiosInstance.post(endpoint, payload);
    },
    [activeTab, sessionId]
  );

  const handleSubmit = useCallback(
    async (e?: React.FormEvent) => {
      e?.preventDefault();
      const trimmed = input.trim();
      if (!trimmed || isLoading || !userId) return;

      const userMessage: Message = {
        id: crypto.randomUUID(),
        content: trimmed,
        role: (user?.role ?? "client") as RoleType,
        createdAt: Date.now(),
      };

      // optimistic
      setMessages((prev) => [...prev, userMessage]);
      setInput("");
      setIsLoading(true);
      autoGrow();
      lastUserMsgRef.current = userMessage;

      try {
        const response = await sendToServer({ userId, message: trimmed, userRole: user?.role });

        // Case A: backend returns only reply
        if (!Array.isArray(response.data?.messages)) {
          const replyMessage: Message = {
            id: crypto.randomUUID(),
            content: String(response.data?.reply ?? "(không có nội dung)"),
            role: getReplyRole(),
            createdAt: Date.now(),
          };
        //   setMessages((prev) => [...prev, replyMessage]);
        } else {
          // Case B: backend returns entire history
          const formatted: Message[] = response.data.messages.map((msg: any) => ({
            id: String(msg.id ?? crypto.randomUUID()),
            content: String(msg.content ?? ""),
            role: (msg.role as RoleType) ?? "expert",
            createdAt: Number(msg.createdAt ?? Date.now()),
          }));
          setMessages(formatted);
        }
      } catch (error) {
        console.error("Error:", error);
        setBanner("Lỗi mạng hoặc server. Bạn có thể thử gửi lại.");
        setMessages((prev) => [
          ...prev,
          {
            id: crypto.randomUUID(),
            content: "Tin nhắn chưa gửi được. Nhấn \"Gửi lại\" để thử lại.",
            role: (user?.role ?? "client") as RoleType,
            createdAt: Date.now(),
            error: true,
          },
        ]);
      } finally {
        setIsLoading(false);
      }
    },
    [autoGrow, getReplyRole, input, isLoading, sendToServer, user?.role, userId]
  );

  const handleResend = useCallback(async () => {
    const last = lastUserMsgRef.current;
    if (!last || !userId) return;
    setIsLoading(true);
    try {
      const response = await sendToServer({ userId, message: last.content, userRole: user?.role });
      const replyMessage: Message = {
        id: crypto.randomUUID(),
        content: String(response.data?.reply ?? "(không có nội dung)"),
        role: getReplyRole(),
        createdAt: Date.now(),
      };
      setMessages((prev) => [...prev, replyMessage]);
      setBanner(null);
    } catch (e) {
      setBanner("Gửi lại thất bại. Kiểm tra kết nối và thử lần nữa.");
    } finally {
      setIsLoading(false);
    }
  }, [getReplyRole, sendToServer, user?.role, userId]);

  // Keyboard: Enter to send, Shift+Enter newline
  const onKeyDown = useCallback((e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  }, [handleSubmit]);

  // Copy
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
  return (
    <div className="flex h-dvh bg-gray-50">
      {/* Sidebar */}
      <Sidebar
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        createNewSession={createNewSession}
        selectSession={(sid) => router.push(`/services/counseling/${sid}`)}
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

            <div className="flex items-center gap-2">
              {banner && (
                <div className="hidden sm:flex items-center gap-2 bg-amber-50 text-amber-800 px-3 py-1.5 rounded-lg border border-amber-200">
                  <ExclamationTriangleIcon className="h-5 w-5" />
                  <span className="text-sm">{banner}</span>
                </div>
              )}
              {banner && (
                <button
                  onClick={handleResend}
                  disabled={isLoading}
                  className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 px-3 py-1.5 rounded-lg"
                >
                  <ArrowPathIcon className={`h-5 w-5 ${isLoading ? "animate-spin" : ""}`} />
                  <span className="text-sm">Gửi lại</span>
                </button>
              )}
            </div>
          </div>
        </header>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-3 sm:px-6 py-4 space-y-4">
          <MessageList
            messages={messages}
            currentUserRole={(user?.role ?? "client") as RoleType}
            copiedId={copiedId}
            onCopy={copyMessage}
          />
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
              placeholder="Nhập tin nhắn (Enter để gửi, Shift+Enter xuống dòng)"
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
function MessageList({
  messages,
  currentUserRole,
  copiedId,
  onCopy,
}: {
  messages: Message[];
  currentUserRole: RoleType;
  copiedId: string | null;
  onCopy: (id: string, text: string) => void;
}) {
  // Group by day for subtle separators
  const groups = useMemo(() => {
    const byDay: Record<string, Message[]> = {};
    for (const m of messages) {
      const d = new Date(m.createdAt ?? Date.now());
      const key = d.toLocaleDateString();
      byDay[key] = byDay[key] || [];
      byDay[key].push(m);
    }
    return Object.entries(byDay);
  }, [messages]);

  return (
    <div className="space-y-4">
      {groups.map(([day, list]) => (
        <div key={day} className="space-y-2">
          <div className="sticky top-12 z-0 flex items-center gap-2 opacity-70 text-xs text-gray-500 select-none">
            <div className="h-px bg-gray-200 flex-1" />
            <span>{day}</span>
            <div className="h-px bg-gray-200 flex-1" />
          </div>
          {list.map((m) => (
            <MessageBubble
              key={m.id}
              message={m}
              isSender={m.role === currentUserRole}
              onCopy={onCopy}
              copied={copiedId === m.id}
            />
          ))}
        </div>
      ))}
    </div>
  );
}

function MessageBubble({
  message,
  isSender,
  onCopy,
  copied,
}: {
  message: Message;
  isSender: boolean;
  onCopy: (id: string, text: string) => void;
  copied: boolean;
}) {
  const isAI = message.role === "ai";
  const bubbleClasses = isSender
    ? "bg-blue-600 text-white"
    : isAI
    ? "bg-white text-gray-900 shadow"
    : "bg-green-100 text-gray-900 shadow";

  const ts = message.createdAt ? new Date(message.createdAt) : null;
  const time = ts ? ts.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) : "";

  return (
    <div className={`flex ${isSender ? "justify-end" : "justify-start"}`}>
      <div className={`group max-w-[85%] sm:max-w-[70%] rounded-2xl px-4 py-3 ${bubbleClasses}`}>
        <div className="mb-1 flex items-center justify-between text-xs opacity-70 select-none">
          {time && <span>{time}</span>}
        </div>
        <div className="prose prose-sm max-w-none prose-p:my-2 prose-pre:my-2 prose-pre:rounded-xl prose-pre:p-3 prose-code:before:content-[''] prose-code:after:content-['']">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>{message.content}</ReactMarkdown>
        </div>
        {message.error && (
          <div className="mt-2 inline-flex items-center gap-1 text-xs text-red-700">
            <ExclamationTriangleIcon className="h-4 w-4" />
            <span>Tin nhắn này chưa được gửi thành công.</span>
          </div>
        )}
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
    <span className={`inline-block h-2 w-2 rounded-full bg-gray-400 animate-bounce ${className}`} />
  );
}
