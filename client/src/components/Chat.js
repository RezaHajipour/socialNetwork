import { useEffect, useState, useRef } from "react";
import io from "socket.io-client";
import ChatMessage from "./ChatMessage";

let socket;

// const socket = io.connect();

function Chat() {
    const [messages, setMessages] = useState([]);
    const lastMessageRef = useRef(null);

    useEffect(() => {
        if (!socket) {
            socket = io.connect();
        }

        socket.on("recentMessages", (messages) => {
            // console.log("recentMessages ...", messages);
            setMessages(messages);
        });
        return () => {
            socket.off("recentMessages");
            socket.disconnect();
            socket = null;
        };
    }, []);

    useEffect(() => {
        socket.on("newMessage", (newMessage) => {
            // console.log("newMessage", newMessage);
            setMessages([...messages, newMessage]);
            lastMessageRef.current.scrollIntoView({ behavior: "smooth" });
        });
        return () => {
            socket.off("newMessage");
        };
    }, [messages]);

    function onSubmit(e) {
        e.preventDefault();
        socket.emit("sendMessage", e.target.text.value);
        e.target.text.value = "";
    }
    return (
        <section className="chat_container">
            <h1 className="chat_title">CHATROOM</h1>

            {messages.length ? (
                <ul className="chat_ul">
                    {messages.map((message) => (
                        <li key={message.id} ref={lastMessageRef}>
                            <ChatMessage {...message} />
                        </li>
                    ))}
                </ul>
            ) : (
                <div>no messages yet</div>
            )}
            <form onSubmit={onSubmit}>
                <input
                    type="text"
                    name="text"
                    required
                    placeholder="write your message"
                    className="chat_input"
                />
                <button className="chat_button">send</button>
            </form>
        </section>
    );
}

export default Chat;
