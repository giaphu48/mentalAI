"use client";

import { useState, useRef, useEffect } from 'react';
import { PaperAirplaneIcon, Bars3Icon, XMarkIcon } from '@heroicons/react/24/solid';
import axiosInstance from '@/helpers/api/config';
import { useSelector } from 'react-redux';
import { RootState } from '@/hooks/useAppDispatch';
import { useRouter, useParams, useSearchParams } from 'next/navigation';
import Sidebar from "@/components/chatSidebar/chatSidebar";



type Message = {
  id: string;
  content: string;
  role: 'client' | 'ai' | 'expert';
};

type ChatSession = {
  id: string;
  title: string;
  type: 'ai' | 'expert';
  lastMessage: string;
  updatedAt: string;
};

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      content: 'Xin chào! Tôi là trợ lý AI. Tôi có thể giúp gì cho bạn?',
      role: 'ai',
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'ai' | 'expert'>('ai');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const router = useRouter();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const user = useSelector((state: RootState) => state.user.currentUser) || null;
  const userId = user ? user.id : null;
  const { sessionId } = useParams();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
    console.log(sessionId)
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: input,
      role: 'client',
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const endpoint = activeTab === 'ai' ? `/chats/AI/` : `/chats/expert/`;
      const response = await axiosInstance.post(endpoint, {
        userId,
        message: input,
      });

      // const replyMessage: Message = {
      //   id: Date.now().toString(),
      //   content: response.data.reply,
      //   role: activeTab === 'ai' ? 'ai' : 'expert',
      // };

      // setMessages((prev) => [...prev, replyMessage]);

      // Nếu server trả về redirect (tức là session mới được tạo)
      if (response.status === 201 && response.data.sessionId) {
        const newSessionId = response.data.sessionId;
        router.push(`/dich-vu/tu-van/${newSessionId}`);
        return; // Dừng lại để không xử lý thêm
      }

      // Nếu là phiên cũ, hiển thị phản hồi AI như bình thường
      const replyMessage: Message = {
        id: Date.now().toString(),
        content: response.data.reply,
        role: activeTab === 'ai' ? 'ai' : 'expert',
      };

      setMessages((prev) => [...prev, replyMessage]);
    } catch (error) {
      console.error('Error:', error);
      const errorMessage: Message = {
        id: Date.now().toString(),
        content: 'Xin lỗi, đã có lỗi xảy ra. Vui lòng thử lại sau.',
        role: activeTab === 'ai' ? 'ai' : 'expert',
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const createNewSession = () => {
    router.push('/dich-vu/tu-van/');
  };

  const selectSession = (sessionId: string) => {
    // In a real app, you would fetch messages for this session
    console.log('Selected session:', sessionId);
    // For demo, just show a placeholder
    setMessages([
      {
        id: '1',
        content: `Đang tải cuộc trò chuyện ${sessionId}...`,
        role: activeTab === 'ai' ? 'ai' : 'expert',
      },
    ]);
  };

  useEffect(() => {
    if (!sessionId) return;

    const fetchChatHistory = async () => {
      try {
        const res = await axiosInstance.get(`/chats/history/${sessionId}`);
        const messagesFromServer = res.data.messages;

        const formattedMessages: Message[] = messagesFromServer.map((msg: any) => ({
          id: msg.id,
          content: msg.content,
          role: msg.role,
        }));

        setMessages(formattedMessages);
      } catch (error) {
        console.error('Lỗi khi tải lịch sử chat:', error);
      }
    };

    fetchChatHistory();
  }, [sessionId]);

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <Sidebar
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        createNewSession={createNewSession}
        selectSession={selectSession}
      />

      {/* Main chat area */}
      <div className="flex-1 flex flex-col">
        <header className="bg-blue-600 text-white p-4 shadow-md flex items-center">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="mr-4 p-1 rounded-md hover:bg-blue-700"
          >
            <Bars3Icon className="h-6 w-6" />
          </button>
          <h1 className="text-2xl font-bold">
            {activeTab === 'ai' ? 'Trợ lý AI' : 'Chuyên gia tư vấn'}
          </h1>
        </header>

        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.role === 'client' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-3/4 rounded-lg p-3 ${message.role === 'client'
                  ? 'bg-blue-500 text-white'
                  : message.role === 'ai'
                    ? 'bg-white text-gray-800 shadow'
                    : 'bg-green-100 text-gray-800 shadow'
                  }`}
              >
                {message.content}
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex justify-start">
              <div className={`rounded-lg p-3 ${activeTab === 'ai' ? 'bg-white' : 'bg-green-100'
                } shadow`}>
                <div className="flex space-x-2">
                  <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce"></div>
                  <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce delay-100"></div>
                  <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce delay-200"></div>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        <form
          onSubmit={handleSubmit}
          className="p-4 border-t border-gray-300 bg-white"
        >
          <div className="flex space-x-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Nhập tin nhắn..."
              className="flex-1 border border-gray-300 rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={isLoading}
            />
            <button
              type="submit"
              disabled={isLoading || !input.trim()}
              className="bg-blue-600 text-white rounded-full p-2 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-blue-300"
            >
              <PaperAirplaneIcon className="h-5 w-5" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}