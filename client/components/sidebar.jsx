import axios from "axios";
import { useEffect, useState } from "react";
import PropTypes from "prop-types";

export default function Sidebar({ refresh, user, setSelectedUser, selectedUser, messageList, setMessageList }) {
    const [userList, setUserList] = useState([]);

    useEffect(() => {
        axios.get("http://localhost:3000/users")
            .then((res) => {
                setUserList(res.data);
            })
            .catch((e) => {
                console.log(e);
            });
    }, [refresh]);

    const handleSelect = (selected) => {
        setSelectedUser(selected);
        setMessageList(prev => prev.map((u) => {
            if ((u.sender === selected || u.sender === selectedUser) && u.receiver === user && !u.isRead) {
                return ({ ...u, isRead: true });
            } else return u;
        }));
    };

    return (
        <div className="w-[300px] bg-gray-200 h-full flex flex-col border-r-[1px] border-neutral">
            <div className="bg-base-300 p-4 font-bold text-xl px-8">Contacts</div>
            <div className="w-full px-4 mt-2 flex-1 overflow-y-auto">
                {userList.filter(u => u !== user).map((u, i) => (
                    <button
                        key={i}
                        onClick={() => { handleSelect(u) }}
                        className={`flex items-center p-4 hover:bg-base-100 ${u === selectedUser ? 'bg-blue-200' : ''} w-full`}
                    >
                        <img src="https://th.bing.com/th/id/OIP.eKW9vXzdfmaRQV2PtPD7kwHaHa?rs=1&pid=ImgDetMain" className="w-12 h-12 rounded-full mr-4" />
                        <span className="text-md">{u}</span>
                        <div className="ml-auto">
                            {messageList.filter(m => m.sender === u && !m.isRead).length > 0 && (
                                <div className="rounded-full bg-blue-500 text-white w-6 h-6 flex justify-center items-center ml-10">
                                    {messageList.filter(m => m.sender === u && !m.isRead).length}
                                </div>
                            )}
                        </div>
                    </button>
                ))}
            </div>
            <div className="bg-base-300 flex items-center p-4 px-8">
                <img src="https://th.bing.com/th/id/OIP.eKW9vXzdfmaRQV2PtPD7kwHaHa?rs=1&pid=ImgDetMain" className="w-12 h-12 rounded-full mr-4" />
                <span className="text-md">{user}</span>
                <button className="ml-auto" onClick={() => { window.location.href = "/" }}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" fill="blue" className="bi bi-box-arrow-right" viewBox="0 0 16 16">
                        <path fillRule="evenodd" d="M10 12.5a.5.5 0 0 1-.5.5h-8a.5.5 0 0 1-.5-.5v-9a.5.5 0 0 1 .5-.5h8a.5.5 0 0 1 .5.5v2a.5.5 0 0 0 1 0v-2A1.5 1.5 0 0 0 9.5 2h-8A1.5 1.5 0 0 0 0 3.5v9A1.5 1.5 0 0 0 1.5 14h8a1.5 1.5 0 0 0 1.5-1.5v-2a.5.5 0 0 0-1 0z" />
                        <path fillRule="evenodd" d="M15.854 8.354a.5.5 0 0 0 0-.708l-3-3a.5.5 0 0 0-.708.708L14.293 7.5H5.5a.5.5 0 0 0 0 1h8.793l-2.147 2.146a.5.5 0 0 0 .708.708z" />
                    </svg>
                </button>
            </div>
        </div>
    );
}

Sidebar.propTypes = {
    refresh: PropTypes.any.isRequired,
    user: PropTypes.string.isRequired,
    setSelectedUser: PropTypes.func.isRequired,
    selectedUser: PropTypes.string,
    messageList: PropTypes.array.isRequired,
    setMessageList: PropTypes.func.isRequired
};