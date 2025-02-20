"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [formData, setFormData] = useState({ username: "", password: "" });
  const [message, setMessage] = useState("");
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("Connexion en cours...");

    try {
      const response = await fetch(`http://${process.env.NEXT_PUBLIC_API_URL_SERVER_IP}:${process.env.NEXT_PUBLIC_API_URL_SERVER_PORT}/api/v1/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const data = await response.json();

        // Sauvegarde le token dans les cookies
        document.cookie = `token=${data.token}; path=/; SameSite=Strict`;
        document.cookie = `userId=${data.userId}; path=/; SameSite=Strict`;

        console.log(data.token);
        

        setMessage("Connexion réussie !");
        router.push("/chat");
      } else {
        setMessage("Échec de la connexion");
      }
    } catch (error) {
      setMessage("Erreur lors de la connexion.");
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
              <h1 className="text-2xl font-semibold">Connexion</h1>
            </div>
            <div className="divide-y divide-gray-200">
              <div className="py-8 text-base leading-6 space-y-4 text-gray-700 sm:text-lg sm:leading-7">
                <form onSubmit={handleSubmit}>
                  {/* Username Input */}
                  <div className="relative pb-7">
                    <input
                      autoComplete="off"
                      id="username"
                      name="username"
                      type="text"
                      className="peer placeholder-transparent h-10 w-full border-b-2 border-gray-300 text-gray-900 focus:outline-none focus:border-rose-600"
                      placeholder="Nom d'utilisateur"
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
                  <div className="relative pb-5">
                    <input
                      autoComplete="off"
                      id="password"
                      name="password"
                      type="password"
                      className="peer placeholder-transparent h-10 w-full border-b-2 border-gray-300 text-gray-900 focus:outline-none focus:border-rose-600"
                      placeholder="Mot de passe"
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
                    <button className="bg-cyan-500 text-white rounded-md px-2 py-1" type="submit">
                      Se connecter
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
