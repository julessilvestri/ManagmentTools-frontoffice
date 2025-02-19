"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";

// Création du contexte
interface SocketContextProps {
    socket: Socket | null;
}

const SocketContext = createContext<SocketContextProps>({ socket: null });

// Hook personnalisé pour utiliser le contexte socket
export const useSocket = () => useContext(SocketContext);

const SocketProvider = ({ children }: { children: React.ReactNode }) => {
    const [socket, setSocket] = useState<Socket | null>(null);

    useEffect(() => {
        const newSocket = io(`http://${process.env.NEXT_PUBLIC_API_URL_SERVER_IP}:${process.env.NEXT_PUBLIC_API_URL_SERVER_PORT}`, { withCredentials: true });

        newSocket.on("connect", () => {
            console.log("🔌 Connecté au serveur WebSocket");
        });

        newSocket.on("disconnect", () => {
            console.log("❌ Déconnecté du serveur WebSocket");
        });

        setSocket(newSocket);

        return () => {
            newSocket.disconnect();
        };
    }, []);

    return <SocketContext.Provider value={{ socket }}>{children}</SocketContext.Provider>;
};

export default SocketProvider;
