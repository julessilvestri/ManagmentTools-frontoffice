"use client";

import React, { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSocket } from "../providers/SocketProvider";

const ChatPage = () => {
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const { socket } = useSocket();
  const router = useRouter();

  useEffect(() => {
    setLoading(false);
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <img
          src="https://www.rhs.org.uk/assets/styles/images/bg/loading.gif"
          className="w-24 h-24"
        />
      </div>
    );
  }

  if (error) return <p style={{ color: "red" }}>{error}</p>;

  return (
    <div className="flex h-screen bg-gray-100">
      <div className="w-1/4 bg-white shadow-lg p-6 rounded-r-lg">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-800">Gestion des tâches</h1>
        </div>
      </div>

      <button
        onClick={() => router.push("/chat")}
        className="fixed top-4 right-6 bg-blue-500 text-white rounded-full p-3 shadow-lg hover:bg-blue-600 transition duration-200"
      >
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-8 h-8">
        <path d="M8 10.5H16M8 14.5H11M21.0039 12C21.0039 16.9706 16.9745 21 12.0039 21C9.9675 21 3.00463 21 3.00463 21C3.00463 21 4.56382 17.2561 3.93982 16.0008C3.34076 14.7956 3.00391 13.4372 3.00391 12C3.00391 7.02944 7.03334 3 12.0039 3C16.9745 3 21.0039 7.02944 21.0039 12Z" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </button>
    </div>
  );
};

export default ChatPage;
