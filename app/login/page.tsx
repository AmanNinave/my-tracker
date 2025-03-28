"use client";
import { useState, ChangeEvent, FormEvent } from "react";
const BACKEND_API = process.env.NEXT_PUBLIC_BACKEND_API;

interface FormData {
  username: string;
  password: string;
}

export default function LoginPage() {
  const [loading, setLoading] = useState<boolean>(false);
  const [formData, setFormData] = useState<FormData>({ username: "", password: "" });
  
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await fetch(`${BACKEND_API}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({
          username: formData.username, 
          password: formData.password,
        }).toString(),
      });
      const result = await response.json();
      
      if (result.access_token) {
        localStorage.setItem("token", result.access_token);
        console.log("Token stored in localStorage");
      }
      console.log("Login Response:", result);
    } catch (error) {
      console.error("Login Failed:", error);
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 p-4">
      <div className="w-full max-w-md bg-white shadow-lg rounded-2xl p-6">
        <h2 className="text-center text-2xl font-bold">Login</h2>
        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div>
            <label className="block text-sm font-medium">Username</label>
            <input
              type="username"
              name="username"
              value={formData.username}
              onChange={handleChange}
              className="w-full mt-1 px-3 py-2 border rounded-lg"
              placeholder="Enter your username"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full mt-1 px-3 py-2 border rounded-lg"
              placeholder="Enter your password"
              required
            />
          </div>
          <button
            type="submit"
            className={`w-full py-2 bg-blue-600 text-white rounded-lg ${loading ? "opacity-50" : ""}`}
            disabled={loading}
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>
      </div>
    </div>
  );
}
