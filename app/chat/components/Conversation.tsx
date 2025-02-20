import React, { useEffect, useState } from "react";

interface Message {
    sender: { _id: string; username: string };
    message: string;
    createdAt: string;
}

interface User {
    _id: string;
    lastname: string;
    firstname: string;
    username: string;
    createdAt: string;
}

interface ConversationProps {
    conversation: Message[];
    receiver: User;
    userId: string | null;
    handleSendMessage: (message: string) => void;
    newMessage: string;
    setNewMessage: (message: string) => void;
    conversationEndRef: any;
}

const Conversation: React.FC<ConversationProps> = ({
    conversation,
    receiver,
    userId,
    handleSendMessage,
    newMessage,
    setNewMessage,
    conversationEndRef
}) => {
    const [firstMessage, setFirstMessage] = useState<boolean>(false);

    useEffect(() => {
        if (conversation.length === 0) {
            setFirstMessage(true);
        }
    }, [conversation]);

    return (
        <div className="flex-1 bg-gray-100 p-6 flex flex-col w-[77%]">
            <div className="flex items-center space-x-4 rounded-lg ">
                <div className="w-12 h-12 bg-white text-blue-500 flex items-center justify-center rounded-full text-lg font-bold">
                    {receiver.username[0].toUpperCase()}
                </div>

                <div>
                    <p className="font-semibold">{receiver.firstname} {receiver.lastname} - <span className="font-normal italic text-gray-500">@{receiver.username}</span></p>
                    <p className="text-sm">Inscrit depuis le {new Date(receiver.createdAt).toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" })}
                    </p>
                </div>
            </div>
            <hr className="my-4 border-gray-300" />
            <div className="flex-1 overflow-y-auto space-y-4 px-4 py-2">
                {firstMessage && (
                    <div className="flex justify-center items-center space-x-4 mb-6">
                        <div className="p-4 rounded-lg text-center max-w-md w-full">
                            <p className="text-lg font-medium mb-2">
                                Vous avez commencé une discussion avec <strong>{receiver.username}</strong> !
                            </p>
                            <img
                                src="https://media.giphy.com/media/66rL8PmB42HOn3tgZe/giphy.gif"
                                alt="Welcome GIF"
                                className="w-32 h-32 mx-auto mb-4"
                            />
                            <p className="text-sm text-gray-600 mb-2">
                                Prêt à démarrer cette conversation ? N'hésitez pas à poser vos questions ou à dire bonjour !
                            </p>
                            <hr className="my-4 border-gray-300" />
                            <p className="text-xs text-gray-500">
                                Vous pouvez toujours revenir à cette conversation à tout moment. Laissez un message pour commencer !
                            </p>
                        </div>
                    </div>
                )}

                {conversation.map((msg, index) => (
                    <div key={index} className={`flex ${msg.sender._id === userId ? "justify-end" : "justify-start"}`}>
                        <div className={`flex flex-col max-w-[45%] ${msg.sender._id === userId ? "text-right" : "text-left"}`}>
                            <div className={`px-4 py-3 rounded-2xl w-fit max-w-full break-words ${msg.sender._id === userId ? "bg-blue-500 text-white" : "bg-gray-200 text-gray-900"}`}>
                                <p className={`text-sm break-words whitespace-pre-wrap ${msg.sender._id === userId ? "text-right" : "text-left"}`}>{msg.message}</p>
                            </div>

                            <p className={`text-xs text-gray-400 mt-1 ${msg.sender._id === userId ? "text-right" : "text-left"}`}>
                                {new Date(msg.createdAt).toLocaleDateString("fr-FR", { day: "2-digit", month: "2-digit" })} -
                                {new Date(msg.createdAt).toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" }).replace(":", "h")}
                            </p>
                        </div>
                    </div>
                ))}

                <div ref={conversationEndRef}></div>
            </div>

            <hr className="border-gray-300" />

            <div className="flex items-center space-x-4">
                <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                            handleSendMessage(newMessage);
                        }
                    }}
                    placeholder="Écrire un message..."
                    className="w-full p-3 rounded-xl border border-gray-300 mt-4"
                />
                <div className="flex items-center space-x-4 mt-4">
                    <button
                        onClick={() => handleSendMessage(newMessage)}
                        className="bg-blue-500 text-white p-3 rounded-xl flex items-center justify-center"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-6 h-6">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11.5003 12H5.41872M5.24634 12.7972L4.24158 15.7986C3.69128 17.4424 3.41613 18.2643 3.61359 18.7704C3.78506 19.21 4.15335 19.5432 4.6078 19.6701C5.13111 19.8161 5.92151 19.4604 7.50231 18.7491L17.6367 14.1886C19.1797 13.4942 19.9512 13.1471 20.1896 12.6648C20.3968 12.2458 20.3968 11.7541 20.1896 11.3351C19.9512 10.8529 19.1797 10.5057 17.6367 9.81135L7.48483 5.24303C5.90879 4.53382 5.12078 4.17921 4.59799 4.32468C4.14397 4.45101 3.77572 4.78336 3.60365 5.22209C3.40551 5.72728 3.67772 6.54741 4.22215 8.18767L5.24829 11.2793C5.34179 11.561 5.38855 11.7019 5.407 11.8459C5.42338 11.9738 5.42321 12.1032 5.40651 12.231C5.38768 12.375 5.34057 12.5157 5.24634 12.7972Z" />
                        </svg>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Conversation;
