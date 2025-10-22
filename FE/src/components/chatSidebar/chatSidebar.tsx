"use client";

import { XMarkIcon } from "@heroicons/react/24/solid";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import { RootState } from "@/hooks/useAppDispatch";
import { useEffect, useState } from "react";
import axiosInstance from "@/helpers/api/config";

type ChatSession = {
  id: string;
  title: string;
  type: "ai" | "expert";
  lastMessage: string;
  updatedAt: string;
};

type SidebarProps = {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  activeTab: "ai" | "expert";
  setActiveTab: (tab: "ai" | "expert") => void;
  createNewSession: () => void;
  selectSession: (sessionId: string) => void;
};

export default function Sidebar({
  sidebarOpen,
  setSidebarOpen,
  activeTab,
  setActiveTab,
  createNewSession,
  selectSession,
}: SidebarProps) {
  const [chatSessions, setChatSessions] = useState<{ ai: ChatSession[]; expert: ChatSession[]; }>({
    ai: [],
    expert: [],
  });

  const [deletingId, setDeletingId] = useState<string | null>(null);

  const router = useRouter();
  const user = useSelector((state: RootState) => state.user.currentUser) || null;
  const userId = user ? user.id : null;
  const userRole = user ? user.role : null;

  useEffect(() => {
    if (!userId) return;

    const fetchSessions = async () => {
      try {
        const res = await axiosInstance.get("/chats/sessions", {
          params: { userId },
        });

        // Nếu userRole = expert -> chỉ lấy session_type = expert
        const filteredSessions = res.data.filter((s: any) =>
          userRole === "expert" ? s.session_type === "expert" : true
        );

        const sessions: ChatSession[] = filteredSessions.map((s: any) => ({
          id: s.id,
          title: s.session_name,
          type: s.session_type, // "ai" | "expert"
          lastMessage: s.last_message ?? "",
          updatedAt: s.updated_at,
        }));

        setChatSessions({
          ai: sessions.filter((s) => s.type === "ai"),
          expert: sessions.filter((s) => s.type === "expert"),
        });
      } catch (err) {
        console.error("Error fetching chat sessions:", err);
      }
    };

    fetchSessions();
  }, [userId, userRole]);

  const handleDeleteSession = async (
    sessionId: string,
    type: "ai" | "expert",
    e: React.MouseEvent
  ) => {
    e.stopPropagation();
    if (!confirm("Bạn có chắc muốn xóa cuộc trò chuyện này?")) return;

    try {
      setDeletingId(sessionId);
      await axiosInstance.delete(`/chats/session/${sessionId}`);

      setChatSessions((prev) => ({
        ...prev,
        [type]: prev[type].filter((s) => s.id !== sessionId),
      }));

      // Nếu đang đứng trong session vừa bị xóa -> điều hướng về danh sách
      // (tuỳ cấu trúc route của bạn; dưới đây chỉ là xử lý an toàn)
      // router.push(activeTab === "ai" ? "/dich-vu/tu-van/voi-AI" : "/dich-vu/tu-van/voi-chuyen-gia");

    } catch (err) {
      console.error("Error deleting session:", err);
      alert("Không thể xóa phiên chat");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div
      className={`${
        sidebarOpen ? "w-64" : "w-0"
      } bg-white shadow-md transition-all duration-300 overflow-hidden`}
    >
      <div className="p-4 h-full flex flex-col">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-gray-800">Chat Sessions</h2>
          <button
            onClick={() => setSidebarOpen(false)}
            className="text-gray-500 hover:text-gray-700"
            aria-label="Đóng sidebar"
          >
            <XMarkIcon className="h-5 w-5" />
          </button>
        </div>

        {/* Chỉ hiện nút tạo chat mới nếu không phải chuyên gia */}
        {userRole !== "expert" && (
          <button
            onClick={createNewSession}
            className="mb-4 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition"
          >
            + Tạo cuộc trò chuyện mới
          </button>
        )}

        <div className="flex-1 overflow-y-auto">
          {/* Chỉ hiển thị Chat với AI nếu không phải chuyên gia */}
          {userRole !== "expert" && (
            <div className="mb-6">
              <h3 className="font-semibold text-gray-700 mb-2 flex items-center">
                <span
                  className={`w-2 h-2 rounded-full mr-2 ${
                    activeTab === "ai" ? "bg-blue-500" : "bg-gray-300"
                  }`}
                ></span>
                Chat với AI
              </h3>

              <div className="space-y-2">
                {chatSessions.ai.map((session) => (
                  <div
                    key={session.id}
                    onClick={() => {
                      setActiveTab("ai");
                      // selectSession(session.id); // nếu bạn muốn dùng props này
                      router.push(`/services/counseling/with-AI/${session.id}`);
                    }}
                    className={`p-3 rounded-lg cursor-pointer flex items-center justify-between ${
                      activeTab === "ai" ? "bg-blue-50" : "hover:bg-gray-100"
                    }`}
                  >
                    <div className="flex-1 min-w-0 pr-2">
                      <div className="font-medium truncate">{session.title}</div>
                      <div className="text-sm text-gray-500 truncate">
                        {session.lastMessage}
                      </div>
                    </div>

                    <button
                      onClick={(e) => handleDeleteSession(session.id, "ai", e)}
                      className="p-1 rounded hover:bg-red-50"
                      aria-label="Xóa phiên chat AI"
                      disabled={deletingId === session.id}
                      title="Xóa phiên chat"
                    >
                      <XMarkIcon
                        className={`h-5 w-5 ${
                          deletingId === session.id
                            ? "text-red-300"
                            : "text-gray-400 hover:text-red-600"
                        }`}
                      />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Luôn hiển thị Chat với khách hàng (expert) */}
          <div>
  <h3 className="font-semibold text-gray-700 mb-2 flex items-center">
    <span
      className={`w-2 h-2 rounded-full mr-2 ${
        activeTab === "expert" ? "bg-green-500" : "bg-gray-300"
      }`}
    ></span>
    {userRole === "client" ? "Chat với chuyên gia" : "Chat với khách hàng"}
  </h3>

  <div className="space-y-2">
    {chatSessions.expert.map((session) => (
      <div
        key={session.id}
        onClick={() => {
          setActiveTab("expert");
          router.push(`/services/counseling/with-expert/${session.id}`);
        }}
        className={`p-3 rounded-lg cursor-pointer flex items-center justify-between ${
          activeTab === "expert" ? "bg-green-50" : "hover:bg-gray-100"
        }`}
      >
        <div className="flex-1 min-w-0 pr-2">
          <div className="font-medium truncate">{session.title}</div>
          <div className="text-sm text-gray-500 truncate">
            {session.lastMessage}
          </div>
        </div>

        <button
          onClick={(e) => handleDeleteSession(session.id, "expert", e)}
          className="p-1 rounded hover:bg-red-50"
          aria-label="Xóa phiên chat"
          disabled={deletingId === session.id}
          title="Xóa phiên chat"
        >
          <XMarkIcon
            className={`h-5 w-5 ${
              deletingId === session.id
                ? "text-red-300"
                : "text-gray-400 hover:text-red-600"
            }`}
          />
        </button>
      </div>
    ))}
  </div>
</div>
        </div>

      </div>
    </div>
  );
}
