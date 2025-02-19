"use client";
import { useState } from "react";
import "@/styles/style.css";

interface Post {
  id: number;
  title: string;
}

export default function HomePage() {
  const [formData, setFormData] = useState({
    lastname: "",
    firstname: "",
    username: "",
    password: "",
  });

  const [message, setMessage] = useState("");

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
    } catch (error) {
      setMessage("Erreur lors de l'inscription");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-6 flex flex-col justify-center sm:py-12">
      <div className="relative py-3 sm:max-w-xl sm:mx-auto">
        <div
          className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-sky-500 shadow-lg transform -skew-y-6 sm:skew-y-0 sm:-rotate-6 sm:rounded-3xl"
        ></div>
        <div className="relative px-4 py-10 bg-white shadow-lg sm:rounded-3xl sm:p-20">
          <div className="max-w-md mx-auto">
            <div>
              <h1 className="text-2xl font-semibold">Inscription</h1>
            </div>
            <div className="divide-y divide-gray-200">
              <div className="py-8 text-base leading-6 space-y-4 text-gray-700 sm:text-lg sm:leading-7">
                <form onSubmit={handleSubmit}>
                  {/* Lastname Input */}
                  <div className="relative pb-7">
                    <input
                      autoComplete="off"
                      id="lastname"
                      name="lastname"
                      type="text"
                      className="peer placeholder-transparent h-10 w-full border-b-2 border-gray-300 text-gray-900 focus:outline-none focus:border-rose-600"
                      placeholder="Nom"
                      value={formData.lastname}
                      onChange={handleChange}
                      required
                    />
                    <label
                      htmlFor="lastname"
                      className="absolute left-0 -top-3.5 text-gray-600 text-sm peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-440 peer-placeholder-shown:top-2 transition-all peer-focus:-top-3.5 peer-focus:text-gray-600 peer-focus:text-sm"
                    >
                      Nom
                    </label>
                  </div>

                  {/* Firstname Input */}
                  <div className="relative pb-7">
                    <input
                      autoComplete="off"
                      id="firstname"
                      name="firstname"
                      type="text"
                      className="peer placeholder-transparent h-10 w-full border-b-2 border-gray-300 text-gray-900 focus:outline-none focus:border-rose-600"
                      placeholder="Prénom"
                      value={formData.firstname}
                      onChange={handleChange}
                      required
                    />
                    <label
                      htmlFor="firstname"
                      className="absolute left-0 -top-3.5 text-gray-600 text-sm peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-440 peer-placeholder-shown:top-2 transition-all peer-focus:-top-3.5 peer-focus:text-gray-600 peer-focus:text-sm"
                    >
                      Prénom
                    </label>
                  </div>

                  {/* Username Input */}
                  <div className="relative pb-7">
                    <input
                      autoComplete="off"
                      id="username"
                      name="username"
                      type="text"
                      className="peer placeholder-transparent h-10 w-full border-b-2 border-gray-300 text-gray-900 focus:outline-none focus:border-rose-600"
                      placeholder="Nom d'utilisateur"
                      value={formData.username}
                      onChange={handleChange}
                      required
                    />
                    <label
                      htmlFor="username"
                      className="absolute left-0 -top-3.5 text-gray-600 text-sm peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-440 peer-placeholder-shown:top-2 transition-all peer-focus:-top-3.5 peer-focus:text-gray-600 peer-focus:text-sm"
                    >
                      Nom d'utilisateur
                    </label>
                  </div>

                  {/* Password Input */}
                  <div className="relative pb-7">
                    <input
                      autoComplete="off"
                      id="password"
                      name="password"
                      type="password"
                      className="peer placeholder-transparent h-10 w-full border-b-2 border-gray-300 text-gray-900 focus:outline-none focus:border-rose-600"
                      placeholder="Mot de passe"
                      value={formData.password}
                      onChange={handleChange}
                      required
                    />
                    <label
                      htmlFor="password"
                      className="absolute left-0 -top-3.5 text-gray-600 text-sm peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-440 peer-placeholder-shown:top-2 transition-all peer-focus:-top-3.5 peer-focus:text-gray-600 peer-focus:text-sm"
                    >
                      Mot de passe
                    </label>
                  </div>

                  {/* Submit Button */}
                  <div className="relative">
                    <button className="bg-cyan-500 text-white rounded-md px-4 py-2" type="submit">
                      S'inscrire
                    </button>
                  </div>
                </form>

                {/* Message Display */}
                {message && <p className="mt-4 text-center text-gray-700">{message}</p>}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
