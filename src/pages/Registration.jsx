import { useState } from "react";

function Registration() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const [message, setMessage] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage("");
        setError("");
        setLoading(true);
        try {
            const response = await fetch(
                "http://127.0.0.1:8000/api/register",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Accept: "application/json",
                    },
                    body: JSON.stringify({
                        name,
                        email,
                        password,
                    }),
                }
            );

            const data = await response.json();

            console.log("Status:", response.status);
            console.log("Laravel:", data);

            if (!response.ok) {
                if (data.errors) {
                    const errors = Object.values(data.errors)
                        .flat()
                        .join(" ");

                    setError(errors);
                } else {
                    setError(
                        data.message || "Registration failed."
                    );
                }

                return;
            }
            setMessage(
                data.message || "Registration successful!"
            );
            setName("");
            setEmail("");
            setPassword("");

        } catch (error) {
            console.error("Registration error:", error);

            setError(
                "Unable to connect to Laravel server."
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">

            <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8">

                <h2 className="text-3xl font-bold text-gray-800 text-center">
                    Create Account
                </h2>

                <p className="text-gray-500 text-center mt-2 mb-8">
                    Register your account
                </p>

                {message && (
                    <div className="mb-5 p-3 bg-green-100 text-green-700 rounded-lg">
                        {message}
                    </div>
                )}

                {error && (
                    <div className="mb-5 p-3 bg-red-100 text-red-700 rounded-lg">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-5">

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Full Name
                        </label>

                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Enter your name"
                            required
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Email
                        </label>

                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Enter your email"
                            required
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Password
                        </label>

                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Enter your password"
                            required
                            minLength={6}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-semibold py-3 rounded-lg transition"
                    >
                        {loading
                            ? "Registering..."
                            : "Register"}
                    </button>

                </form>

            </div>

        </div>
    );
}

export default Registration;