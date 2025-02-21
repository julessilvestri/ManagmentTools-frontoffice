import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";


interface User {
    _id: string;
    lastname: string;
    firstname: string;
    username: string;
    createdAt: string;
}

interface UserConnectedProps {
    userId: string | null;
    token: string | null;
}

const UserConnected: React.FC<UserConnectedProps> = ({ userId, token }) => {
    const [user, setUser] = useState<User | null>(null);
    const router = useRouter();

    useEffect(() => {
        const fetchUser = async () => {
            console.log(token);
            if (!userId || !token) return;

            try {
                const response = await fetch(
                    `http://${process.env.NEXT_PUBLIC_API_URL_SERVER_IP}:5000/api/v1/users/${userId}`,
                    {
                        method: "GET",
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );

                if (!response.ok) throw new Error("Erreur de récupération de l'utilisateur");

                const result = await response.json();
                setUser(result);
            } catch (error) {
                console.error("Erreur lors de la récupération de l'utilisateur :", error);
            }
        };

        fetchUser();
    }, [userId, token]);

    const handleLogout = () => {
        Cookies.remove("token");
        Cookies.remove("userId");
        router.push("/login"); // Redirection vers la page de connexion
    };

    return (
        <div className="flex items-center justify-between bg-white shadow-md p-4 border border-gray-200 rounded-lg">
            {/* Profil */}
            <div className="flex items-center space-x-3">
                <img
                    src="https://lindamood.net/wp-content/uploads/2019/09/Blank-profile-image.jpg"
                    alt="Avatar utilisateur"
                    className="w-10 h-10 rounded-full object-cover"
                />
                <div className="flex flex-col">
                    <span className="text-gray-800 font-semibold">
                        {user ? `${user.firstname} ${user.lastname} - @${user.username}` : "Utilisateur inconnu"}
                    </span>
                    <div className="flex items-center space-x-1">
                        <span className="w-3 h-3 bg-green-500 rounded-full"></span>
                        <span className="text-sm text-gray-500">En ligne</span>
                    </div>
                </div>
            </div>

            {/* Icône Paramètres */}
            <button className="p-2 rounded-full hover:bg-gray-100 transition" onClick={handleLogout}>
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={2}
                    stroke="currentColor"
                    className="w-6 h-6 text-gray-600"
                >
                    <path d="M21 12L13 12" stroke="#ff0000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M18 15L20.913 12.087V12.087C20.961 12.039 20.961 11.961 20.913 11.913V11.913L18 9" stroke="#ff0000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M16 5V4.5V4.5C16 3.67157 15.3284 3 14.5 3H5C3.89543 3 3 3.89543 3 5V19C3 20.1046 3.89543 21 5 21H14.5C15.3284 21 16 20.3284 16 19.5V19.5V19" stroke="#ff0000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
            </button>
        </div>

    );
};

export default UserConnected;
