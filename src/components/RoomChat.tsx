import React, { useState, useEffect, useRef } from "react";
import { FaComments, FaTimes } from "react-icons/fa";

interface Message {
    username: string;
    text: string;
    roomId: number;
}

interface newMessage {
    type: string;
    message: Message;
}

interface LiveChatProps {
    username: string;
    socket: WebSocket;
    roomId: number;
}

export const RoomChat: React.FC<LiveChatProps> = ({ username, socket, roomId }) => {

    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState("");
    const messagesEndRef = useRef<HTMLDivElement | null>(null);
    const [isChatOpen, setIsChatOpen] = useState(false);


    useEffect(() => {
        const handleMessage = (event: MessageEvent) => {
            const newMessage: newMessage = JSON.parse(event.data);
            if(newMessage.type!=="liveChat") return;
            const chat = newMessage.message;
            setMessages((prevMessages) => [...prevMessages, chat]);
        };

        socket.addEventListener("message", handleMessage);

        return () => {
            socket.removeEventListener("message", handleMessage);
        };
    }, [socket]);

    useEffect(() => {
        if (isChatOpen) {
            messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
        }
    }, [messages, isChatOpen]);


    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    const handleSendMessage = () => {
        if (input.trim()) {
            const message: Message = { username, text: input.trim() ,roomId};
            socket.send(JSON.stringify({type:"liveChat" ,message:message}));
            setInput("");
        }
    };

    return (
        <div className="fixed bottom-5 right-5 z-50">

            {!isChatOpen ? (
                <button
                    onClick={() => setIsChatOpen(true)}
                    className="p-4 rounded-full bg-green-600 text-white shadow-lg hover:bg-green-800 transition-all"
                >
                    <FaComments size={29} />
                </button>
            ) : (
                <div className="flex flex-col w-96 h-[500px] bg-white/50 backdrop-blur-md shadow-lg rounded-lg overflow-hidden">

                    <div className="flex items-center justify-between bg-slate-950/80 text-white py-3 px-4 text-lg font-semibold">
                        <span>Live Chat</span>
                        <button
                            onClick={() => setIsChatOpen(false)}
                            className="p-2 rounded-full bg-slate-950/80 hover:bg-slate-950 transition-all"
                        >
                            <FaTimes />
                        </button>
                    </div>

                    <div className="flex-grow p-4 overflow-y-auto bg-gray-100/80">
                        {messages.map((msg, index) => (
                            <div
                                key={index}
                                className={`mb-2 p-1 rounded-lg max-w-[70%] ${msg.username === username
                                        ? "bg-gray-950/80 text-white self-end ml-auto"
                                        : "bg-gray-200/90 text-gray-800 self-start mr-auto"
                                    }`}
                            >
                                <strong>{msg.username}: </strong>
                                <span>{msg.text}</span>
                            </div>
                        ))}
                        <div ref={messagesEndRef} />
                    </div>


                    <div className="flex items-center gap-2 p-3 border-t bg-white/50">
                        <input
                            type="text"
                            value={input}
                            placeholder="Type your message..."
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
                            className="flex-grow px-3 py-2 border rounded-lg text-gray-800 outline-none focus:ring focus:ring-blue-300"
                        />
                        <button
                            onClick={handleSendMessage}
                            className="px-4 py-2 bg-slate-950/80 text-white rounded-lg hover:bg-slate-950"
                        >
                            Send
                        </button>
                    </div>
                </div>
            )}
        </div>

    )
}