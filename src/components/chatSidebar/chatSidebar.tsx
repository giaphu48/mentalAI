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
  const [chatSessions, setChatSessions] = useState<{
    ai: ChatSession[];
    expert: ChatSession[];
  }>({
    ai: [],
    expert: [],
  });

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

        const sessions = filteredSessions.map((s: any) => ({
          id: s.id,
          title: s.session_name,
          type: s.session_type,
          lastMessage: "",
          updatedAt: s.updated_at,
        }));

        setChatSessions({
          ai: sessions.filter((s: any) => s.type === "ai"),
          expert: sessions.filter((s: any) => s.type === "expert"),
        });
      } catch (err) {
        console.error("Error fetching chat sessions:", err);
      }
    };

    fetchSessions();
  }, [userId, userRole]);

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
                      router.push(`/dich-vu/tu-van/voi-AI/${session.id}`);
                    }}
                    className={`p-3 rounded-lg cursor-pointer ${
                      activeTab === "ai" ? "bg-blue-50" : "hover:bg-gray-100"
                    }`}
                  >
                    <div className="font-medium truncate">{session.title}</div>
                    <div className="text-sm text-gray-500 truncate">
                      {session.lastMessage}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Luôn hiển thị Chat với chuyên gia */}
          <div>
            <h3 className="font-semibold text-gray-700 mb-2 flex items-center">
              <span
                className={`w-2 h-2 rounded-full mr-2 ${
                  activeTab === "expert" ? "bg-green-500" : "bg-gray-300"
                }`}
              ></span>
              Chat với khách hàng
            </h3>
            <div className="space-y-2">
              {chatSessions.expert.map((session) => (
                <div
                  key={session.id}
                  onClick={() => {
                      setActiveTab("ai");
                      router.push(`/dich-vu/tu-van/voi-chuyen-gia/${session.id}`);
                    }}
                  className={`p-3 rounded-lg cursor-pointer ${
                    activeTab === "expert"
                      ? "bg-green-50"
                      : "hover:bg-gray-100"
                  }`}
                >
                  <div className="font-medium truncate">{session.title}</div>
                  <div className="text-sm text-gray-500 truncate">
                    {session.lastMessage}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
