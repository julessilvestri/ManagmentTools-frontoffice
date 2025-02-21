"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    lastname: "",
    firstname: "",
    username: "",
    password: "",
  });
  const [message, setMessage] = useState("");
  const router = useRouter();

  useEffect(() => {
      const tokenFromCookie = document.cookie.match(/token=([^;]+)/)?.[1];
      if (tokenFromCookie) {
        router.push("/chat"); // Rediriger vers /chat si un token est présent
      }
    }, [router]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("Enregistrement en cours...");

    try {
      const response = await fetch(`http://${process.env.NEXT_PUBLIC_API_URL_SERVER_IP}:${process.env.NEXT_PUBLIC_API_URL_SERVER_PORT}/api/v1/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!response.ok) throw new Error("Erreur d'inscription");

      setMessage("Inscription réussie !");
      router.push("/login"); // Rediriger après inscription
    } catch (error) {
      setMessage("Erreur lors de l'inscription");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-400 to-purple-600 p-6">
      <div className="bg-white bg-opacity-20 backdrop-blur-lg shadow-xl rounded-3xl p-8 w-full max-w-md text-center">

        <div className="flex justify-center items-center w-36 h-36 rounded-full bg-white shadow-lg mb-8 mx-auto">
          <img
            src="https://cdn-icons-png.flaticon.com/512/9909/9909360.png"
            alt="Logo"
            className="w-24 h-24 object-cover rounded-full"
          />
        </div>

        <h1 className="text-3xl font-bold text-white mb-6">Inscription</h1>
        <form onSubmit={handleSubmit} className="space-y-6">

          {/* Lastname Input */}
          <div className="relative">
            <input
              id="lastname"
              name="lastname"
              type="text"
              placeholder="Nom"
              value={formData.lastname}
              onChange={handleChange}
              required
              className="w-full p-3 text-white bg-transparent border-b-2 border-white focus:outline-none focus:border-blue-500 placeholder-gray-200"
            />
          </div>

          {/* Firstname Input */}
          <div className="relative">
            <input
              id="firstname"
              name="firstname"
              type="text"
              placeholder="Prénom"
              value={formData.firstname}
              onChange={handleChange}
              required
              className="w-full p-3 text-white bg-transparent border-b-2 border-white focus:outline-none focus:border-blue-500 placeholder-gray-200"
            />
          </div>

          {/* Username Input */}
          <div className="relative">
            <input
              id="username"
              name="username"
              type="text"
              placeholder="Nom d'utilisateur"
              value={formData.username}
              onChange={handleChange}
              required
              className="w-full p-3 text-white bg-transparent border-b-2 border-white focus:outline-none focus:border-blue-500 placeholder-gray-200"
            />
          </div>

          {/* Password Input */}
          <div className="relative">
            <input
              id="password"
              name="password"
              type="password"
              placeholder="Mot de passe"
              value={formData.password}
              onChange={handleChange}
              required
              className="w-full p-3 text-white bg-transparent border-b-2 border-white focus:outline-none focus:border-blue-500 placeholder-gray-200"
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full p-3 rounded-xl bg-white text-gray-900 font-bold text-lg hover:bg-white transition-transform transform hover:scale-105"
          >
            S'inscrire
          </button>
        </form>

        {message && <p className="mt-4 text-white">{message}</p>}
        <a href="/login" className="mt-4 block text-white hover:text-white">
          J'ai déjà un compte
        </a>
      </div>
    </div>
  );
}
