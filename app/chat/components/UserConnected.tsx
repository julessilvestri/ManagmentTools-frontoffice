import React, { useEffect, useState } from "react";

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

    return (
        <div className="flex items-center space-x-3 bg-white shadow-md p-4 border border-gray-200 rounded-lg">
            <img
                src="https://lindamood.net/wp-content/uploads/2019/09/Blank-profile-image.jpg"
                alt="Avatar utilisateur"
                className="w-10 h-10 rounded-full object-cover"
            />
            <div className="flex flex-col">
                <span className="text-gray-800 font-semibold">
                    {user ? `${user.firstname} ${user.lastname} - @${user.username}` : "Utilisateur inconnu" }
                </span>
                <div className="flex items-center space-x-1">
                    <span className="w-3 h-3 bg-green-500 rounded-full"></span>
                    <span className="text-sm text-gray-500">En ligne</span>
                </div>
            </div>
        </div>
    );
};

export default UserConnected;
