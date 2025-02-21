"use client";

import React, { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import ContactList from "./components/ContactList";
import Conversation from "./components/Conversation";
import UserConnected from "./components/UserConnected";
import SearchSection from "./components/SearchSection";
import { fetchConversation, sendMessage } from "./services/messageService";
import { fetchContacts } from "./services/contactService";
import { useSocket } from "../providers/SocketProvider";

const ChatPage = () => {
    const [contacts, setContacts] = useState<any[]>([]);
    const [conversation, setConversation] = useState<any[]>([]);
    const [selectedContact, setSelectedContact] = useState<any | null>(null);
    const [newMessage, setNewMessage] = useState<string>("");
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [userId, setUserId] = useState<string | null>(null);
    const [token, setToken] = useState<string | null>(null);
    const conversationEndRef = useRef<HTMLDivElement>(null);
    const [refreshContacts, setRefreshContacts] = useState(false);

    const { socket } = useSocket();
    const router = useRouter();

    useEffect(() => {
        const tokenFromCookie = document.cookie.match(/token=([^;]+)/)?.[1];
        if (!tokenFromCookie) {
            setError("Token manquant ou utilisateur non connecté.");
            setLoading(false);
            return;
        }

        setToken(tokenFromCookie);
        const userIdFromCookie = document.cookie.match(/userId=([^;]+)/)?.[1] ?? null;
        setUserId(userIdFromCookie);

        const fetchData = async () => {
            try {
                const contactsData = await fetchContacts(tokenFromCookie);
                setContacts(contactsData);
            } catch (e) {
                setError("Erreur lors de la récupération des contacts.");
                console.error(e);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    useEffect(() => {
        if (conversationEndRef.current) {
            conversationEndRef.current.scrollIntoView({ behavior: "smooth" });
        }
    }, [conversation]);

    useEffect(() => {
        if (!token) return;

        fetchContacts(token)
            .then((contactsData) => setContacts(contactsData))
            .catch((e) => console.error("Erreur lors du rafraîchissement des contacts", e));
    }, [token, refreshContacts]);

    useEffect(() => {
        if (socket && userId && token) {
            socket.emit("joinRoom", userId);

            socket.on("receiveMessage", (newMessage) => {

                fetchContacts(token)
                    .then((contacts) => setContacts(contacts))
                    .catch((e) => {
                        console.error("Erreur lors du rafraîchissement des contacts", e);
                    });

                const formattedMessage = {
                    sender: { _id: newMessage.senderId },
                    receiver: { _id: newMessage.receiverId },
                    message: newMessage.message,
                    createdAt: new Date().toISOString(),
                };

                if (selectedContact && newMessage.senderId === selectedContact._id) {
                    setConversation((prevConversation) => [...prevConversation, formattedMessage]);
                }

                setRefreshContacts((prev) => !prev);
            });
        }
        return () => {
            if (socket) {
                socket.off("receiveMessage");
            }
        };
    }, [socket, userId, selectedContact, token]);

    const handleSelectContact = async (contact: any) => {
        setSelectedContact(contact);
        if (!token) {
            setError("Token manquant.");
            return;
        }
        try {
            const messages = await fetchConversation(contact._id, token);
            setConversation(messages);
        } catch (e) {
            setError("Erreur lors de la récupération des messages.");
            console.error(e);
        }
    };

    const handleSendMessage = (newMessage: string) => {
        if (!newMessage || !selectedContact || !token) return;

        const messageData = {
            senderId: userId,
            receiverId: selectedContact._id,
            message: newMessage,
        };

        if (socket) {
            socket.emit("sendMessage", messageData, (response: any) => {
                if (response?.success) {
                    setConversation((prev) => [...prev, response.message]);
                } else {
                    console.error("Erreur WebSocket:", response?.error || "Message non envoyé");
                    setError("Le message n'a pas pu être envoyé.");
                }
            });
            setRefreshContacts((prev) => !prev);
        }

        sendMessage(messageData, token)
            .then(() => {
                setNewMessage("");
                handleSelectContact(selectedContact);

                fetchContacts(token)
                    .then((contactsData) => setContacts(contactsData))
                    .catch((e) => {
                        console.error("Erreur lors du rafraîchissement des contacts", e);
                    });
            })
            .catch((error) => setError(error.message));
    };

    const startConversation = async (user: any) => {
        setSelectedContact(user);
        if (!token) return;

        try {
            const messages = await fetchConversation(user._id, token);
            setConversation(messages);
        } catch (e) {
            setError("Erreur lors de la récupération des messages.");
            console.error(e);
        }
    };

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

    if (error) return <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 text-center p-6">
        <img
            src="https://media.giphy.com/media/pgOEYWP6BKT4yh1NdY/giphy.gif?cid=ecf05e47g9bt19hudd9r568y5wxz9z1crewhcwy6iluziode&ep=v1_stickers_search&rid=giphy.gif&ct=s"
            alt="Erreur"
            className="w-64 h-64 mb-6"
        />
        <h1 className="text-3xl font-bold text-red-600">Oups ! Une erreur est survenue</h1>
        {error && <p className="text-lg text-gray-700 mt-2">{error}</p>}
        <button
            className="mt-6 px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
            onClick={() => router.push("/login")}
        >
            Retour à la connexion
        </button>
    </div>;

    return (
        <div className="flex h-screen bg-gray-100">

            <div className="w-[23%] bg-white shadow-lg p-6 rounded-r-lg">
                <div className="flex items-center space-x-3">
                    <img
                        src="https://cdn-icons-png.flaticon.com/512/9909/9909360.png"
                        alt="Logo"
                        className="w-10 h-10 object-cover"
                    />
                    <h1 className="text-3xl font-bold text-gray-800">Zynko</h1>
                </div>

                <hr className="my-4 border-gray-300" />

                <div className="mb-6">
                    <h1 className="text-2xl font-bold text-gray-800">Messagerie</h1>
                    <p className="text-sm text-gray-500 mt-2">
                        Commencez une nouvelle conversation ou consultez vos contacts
                    </p>
                </div>

                <SearchSection startConversation={startConversation} token={token} />

                <div className="mt-6">
                    <ContactList
                        contacts={contacts}
                        userId={userId}
                        selectedContact={selectedContact}
                        onSelectContact={handleSelectContact}
                    />
                </div>

                <div className="absolute bottom-0 left-0 w-[23%]">
                    <UserConnected userId={userId} token={token} />
                </div>
            </div>


            {selectedContact && (
                <Conversation
                    conversation={conversation}
                    receiver={selectedContact}
                    userId={userId}
                    handleSendMessage={handleSendMessage}
                    newMessage={newMessage}
                    setNewMessage={setNewMessage}
                    conversationEndRef={conversationEndRef}
                />
            )}

            <button
                onClick={() => router.push("/tasks")}
                className="fixed top-4 right-6 bg-blue-500 text-white rounded-full p-3 shadow-lg hover:bg-blue-600 transition duration-200"
            >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-8 h-8">
                    <path d="M3 3V21M8.6 10H19.4C19.9601 10 20.2401 10 20.454 9.89101C20.6422 9.79513 20.7951 9.64215 20.891 9.45399C21 9.24008 21 8.96005 21 8.4V6.6C21 6.03995 21 5.75992 20.891 5.54601C20.7951 5.35785 20.6422 5.20487 20.454 5.10899C20.2401 5 19.9601 5 19.4 5H8.6C8.03995 5 7.75992 5 7.54601 5.10899C7.35785 5.20487 7.20487 5.35785 7.10899 5.54601C7 5.75992 7 6.03995 7 6.6V8.4C7 8.96005 7 9.24008 7.10899 9.45399C7.20487 9.64215 7.35785 9.79513 7.54601 9.89101C7.75992 10 8.03995 10 8.6 10ZM8.6 19H13.4C13.9601 19 14.2401 19 14.454 18.891C14.6422 18.7951 14.7951 18.6422 14.891 18.454C15 18.2401 15 17.9601 15 17.4V15.6C15 15.0399 15 14.7599 14.891 14.546C14.7951 14.3578 14.6422 14.2049 14.454 14.109C14.2401 14 13.9601 14 13.4 14H8.6C8.03995 14 7.75992 14 7.54601 14.109C7.35785 14.2049 7.20487 14.3578 7.10899 14.546C7 14.7599 7 15.0399 7 15.6V17.4C7 17.9601 7 18.2401 7.10899 18.454C7.20487 18.6422 7.35785 18.7951 7.54601 18.891C7.75992 19 8.03995 19 8.6 19Z" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
            </button>
        </div>
    );
};

export default ChatPage;
