"use client";
import { useState, ChangeEvent, FormEvent } from "react";
const BACKEND_API = process.env.NEXT_PUBLIC_BACKEND_API;

interface UserFormData {
  name: string;
  email: string;
  password: string;
}

export default function AddUserPage() {
  const [loading, setLoading] = useState<boolean>(false);
  const [formData, setFormData] = useState<UserFormData>({ name: "", email: "", password: "" });
  
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await fetch(`${BACKEND_API}/user`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const result = await response.json();
      console.log("User Created:", result);
    } catch (error) {
      console.error("User Creation Failed:", error);
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 p-4">
      <div className="w-full max-w-md bg-white shadow-lg rounded-2xl p-6">
        <h2 className="text-center text-2xl font-bold">Add New User</h2>
        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div>
            <label className="block text-sm font-medium">Username</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full mt-1 px-3 py-2 border rounded-lg"
              placeholder="Enter your username"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full mt-1 px-3 py-2 border rounded-lg"
              placeholder="Enter your email"
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
            {loading ? "Adding User..." : "Add User"}
          </button>
        </form>
      </div>
    </div>
  );
}
