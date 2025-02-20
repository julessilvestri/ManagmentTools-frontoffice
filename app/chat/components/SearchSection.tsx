"use client";
import React, { useState } from "react";

interface SearchSectionProps {
    startConversation: (user: any) => void;
    token: string | null;
}

const SearchSection: React.FC<SearchSectionProps> = ({ startConversation, token }) => {
    const [query, setQuery] = useState("");
    const [searchResults, setSearchResults] = useState<any[]>([]);
    const [showResults, setShowResults] = useState(false);

    const handleSearch = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const searchQuery = e.target.value;
        setQuery(searchQuery);

        if (!token || searchQuery.trim() === "") {
            setSearchResults([]);
            setShowResults(false);
            return;
        }

        try {
            const response = await fetch(`http://172.20.10.14:5000/api/v1/users/search?query=${searchQuery}`, {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (!response.ok) throw new Error("Erreur de recherche");

            const results = await response.json();
            setSearchResults(results);
            setShowResults(results.length > 0);
        } catch (error) {
            console.error("Erreur de recherche :", error);
            setSearchResults([]);
            setShowResults(false);
        }
    };

    const handleBlur = () => {
        setTimeout(() => setShowResults(false), 100);
    };

    const handleFocus = () => {
        if (query.trim() !== "") {
            setShowResults(true);
        }
    };

    const handleSelectUser = (user: any) => {
        startConversation(user);
        setQuery("");
        setSearchResults([]);
        setShowResults(false);
    };

    return (
        <div className="relative">
            <input
                type="text"
                placeholder="Rechercher un utilisateur..."
                value={query}
                onChange={handleSearch}
                onFocus={handleFocus}
                onBlur={handleBlur}
                className="w-full p-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
            />

            {showResults && searchResults.length > 0 && (
                <div className="mt-2 bg-white shadow-lg rounded-md p-2 absolute top-full left-0 right-0 z-10">
                    {searchResults.map((user) => (
                        <div
                            key={user._id}
                            onClick={() => handleSelectUser(user)}
                            className="flex items-center space-x-4 p-2 hover:bg-gray-50 rounded-md cursor-pointer"
                        >
                            <img
                                src="https://lindamood.net/wp-content/uploads/2019/09/Blank-profile-image.jpg"
                                alt={user.username}
                                className="w-12 h-12 rounded-full object-cover"
                            />
                            <div>
                                <p className="font-semibold text-gray-800">
                                    {user.firstname} {user.lastname}
                                </p>
                                <p className="text-sm italic text-gray-500">
                                    @{user.username}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default SearchSection;
