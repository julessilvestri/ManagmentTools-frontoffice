"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [formData, setFormData] = useState({ username: "", password: "" });
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
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
    setLoading(true);
    setMessage("Connexion en cours...");

    try {
      const response = await fetch(`http://${process.env.NEXT_PUBLIC_API_URL_SERVER_IP}:${process.env.NEXT_PUBLIC_API_URL_SERVER_PORT}/api/v1/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const data = await response.json();
        document.cookie = `token=${data.token}; path=/; SameSite=Strict`;
        document.cookie = `userId=${data.userId}; path=/; SameSite=Strict`;
        setMessage("Connexion réussie !");
        router.push("/chat");
      } else {
        setMessage("Échec de la connexion");
      }
    } catch (error) {
      setMessage("Erreur lors de la connexion.");
    } finally {
      setLoading(false);
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

        <h1 className="text-3xl font-bold text-white mb-6">Connexion</h1>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="relative">
            <input
              id="username"
              name="username"
              type="text"
              placeholder="Nom d'utilisateur"
              onChange={handleChange}
              required
              className="w-full p-3 text-white bg-transparent border-b-2 border-white focus:outline-none focus:border-white placeholder-gray-200"
            />
          </div>
          <div className="relative">
            <input
              id="password"
              name="password"
              type="password"
              placeholder="Mot de passe"
              onChange={handleChange}
              required
              className="w-full p-3 text-white bg-transparent border-b-2 border-white focus:outline-none focus:border-white placeholder-gray-200"
            />
          </div>
          <button
            type="submit"
            className="w-full p-3 rounded-xl bg-white text-gray-900 font-bold text-lg hover:bg-white transition-transform transform hover:scale-105"
            disabled={loading}
          >
            {loading ? "Connexion..." : "Se connecter"}
          </button>
        </form>
        {message && <p className="mt-4 text-white">{message}</p>}
        <a href="/register" className="mt-4 block text-white hover:text-white">
          Je n'ai pas de compte
        </a>
      </div>
    </div>
  );
}
