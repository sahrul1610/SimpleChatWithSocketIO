import { useState, useEffect, useRef } from "react";
import PropTypes from "prop-types";

export default function Chat({ user, selected, sendMessage, messageList }) {
    const [message, setMessage] = useState('');
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(scrollToBottom, [messageList]);

    const onSubmit = (e) => {
        e.preventDefault();
        if (message.trim()) {
            sendMessage({
                receiver: selected,
                message,
                sender: user
            });
            setMessage('');
        }
    };

    if (selected) {
        return (
            <div className="flex-1 h-full flex flex-col bg-gray-100">
                <div className="bg-blue-200 flex gap-4 p-4 items-center px-8">
                    <div className="avatar">
                        <div className="w-12 rounded-full">
                            <img src="https://th.bing.com/th/id/OIP.eKW9vXzdfmaRQV2PtPD7kwHaHa?rs=1&pid=ImgDetMain" alt="Avatar" />
                        </div>
                    </div>
                    <span className="text-md font-bold">{selected}</span>
                </div>
                <div className="flex-1 w-full flex flex-col p-4 px-8 overflow-auto">
                    {messageList?.map((u, i) => (
                        <div key={i} className={`flex mb-2 ${u?.sender === user ? 'justify-end' : 'justify-start'}`}>
                            <div className={`max-w-[75%] px-4 py-2 rounded-lg ${u?.sender === user ? 'bg-blue-500 text-white' : 'bg-white text-gray-800'}`}>
                                {u?.message}
                            </div>
                        </div>
                    ))}
                    <div ref={messagesEndRef} />
                </div>
                <form onSubmit={onSubmit} className="flex items-center justify-between bg-gray-200 p-4 rounded-lg">
                    <input 
                        value={message} 
                        onChange={(e) => setMessage(e.target.value)} 
                        className="flex-1 mr-4 py-2 px-3 rounded-lg focus:outline-none focus:ring focus:border-blue-500" 
                        placeholder="Type your message..." 
                    />
                    <button type="submit" className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-lg focus:outline-none focus:ring focus:border-blue-500">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" className="bi bi-send" viewBox="0 0 16 16">
                            <path d="M15.854.146a.5.5 0 0 1 .11.54l-5.819 14.547a.75.75 0 0 1-1.329.124l-3.178-4.995L.643 7.184a.75.75 0 0 1 .124-1.33L15.314.037a.5.5 0 0 1 .54.11ZM6.636 10.07l2.761 4.338L14.13 2.576zm6.787-8.201L1.591 6.602l4.339 2.76z"/>
                        </svg>
                    </button>
                </form>
            </div>
        );
    } else {
        return (
            <div className="flex-1 h-full flex items-center justify-center bg-gray-100">
                <p className="text-xl text-gray-500">Select a user to start chatting</p>
            </div>
        );
    }
}

Chat.propTypes = {
    user: PropTypes.string.isRequired,
    selected: PropTypes.string,
    sendMessage: PropTypes.func.isRequired,
    messageList: PropTypes.array.isRequired
};