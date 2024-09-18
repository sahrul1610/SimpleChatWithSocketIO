import axios from "axios";
import { useState } from "react";
import PropTypes from 'prop-types';

export default function Login({ onSubmit }) {
    const [name, setName] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        axios.post("http://localhost:3000/register", { name })
            .then(() => {
                onSubmit(name);
            })
            .catch((e) => {
                if (e?.response?.data?.message) {
                    setError(e?.response?.data?.message);
                }
            });
    };

    return (
        <main className="bg-gray-200 flex items-center justify-center min-h-screen">
            <form onSubmit={handleSubmit} className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4 w-full max-w-lg">
                <h1 className="text-2xl font-bold mb-6 text-center">Simple Chatting App</h1>
                <div className="mb-4">
                    <input
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        type="text"
                        placeholder="Insert Your Name"
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    />
                </div>
                {error && (
                    <div className="mb-4">
                        <span className="text-base text-red-600">{error}</span>
                    </div>
                )}
                <div className="flex items-center justify-center">
                    <button
                        type="submit"
                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                    >
                        Submit
                    </button>
                </div>
            </form>
        </main>
    );
}

Login.propTypes = {
    onSubmit: PropTypes.func.isRequired,
}; 