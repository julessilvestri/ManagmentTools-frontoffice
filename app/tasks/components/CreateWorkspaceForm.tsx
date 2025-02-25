import React, { useState, useEffect } from "react";
import { fetchUsers } from "../services/userService"; // Assurez-vous d'avoir une fonction pour récupérer les utilisateurs

interface CreateWorkspaceFormProps {
    userId: string;
    token: string;
    onCreateWorkspace: (newWorkspace: { name: string; description: string; members: string[] }) => void;
    onClose: () => void;
}

const CreateWorkspaceForm: React.FC<CreateWorkspaceFormProps> = ({ userId, token, onCreateWorkspace, onClose }) => {
    const [name, setName] = useState<string>("");
    const [description, setDescription] = useState<string>("");
    const [members, setMembers] = useState<string[]>([]); // Stocke les membres sélectionnés
    const [availableUsers, setAvailableUsers] = useState<any[]>([]); // Liste des utilisateurs disponibles
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null); // Pour afficher les erreurs
    const [searchQuery, setSearchQuery] = useState<string>(""); // Requête de recherche

    // Récupérer les utilisateurs disponibles
    useEffect(() => {
        const fetchAvailableUsers = async () => {
            try {
                const users = await fetchUsers(userId, token); // Supposons que vous avez une fonction pour obtenir les utilisateurs
                console.log(users);
                setAvailableUsers(users);
            } catch (error) {
                setError("Erreur lors de la récupération des utilisateurs");
                console.error("Erreur lors de la récupération des utilisateurs", error);
            } finally {
                setLoading(false);
            }
        };

        fetchAvailableUsers();
    }, [userId, token]);

    // Filtrer les utilisateurs en fonction de la recherche
    const filteredUsers = availableUsers.filter((user) =>
        user.username.toLowerCase().includes(searchQuery.toLowerCase())
    );

    // Ajouter un membre à la liste des membres
    const addMember = (userId: string) => {
        if (!members.includes(userId)) {
            setMembers([...members, userId]);
        }
    };

    // Retirer un membre de la liste des membres
    const removeMember = (userId: string) => {
        setMembers(members.filter((member) => member !== userId));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (name && description && members.length > 0) {
            onCreateWorkspace({ name, description, members });
            onClose();  // Fermer le modal après création
        }
    };

    return (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex justify-center items-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-1/3">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">Créer un nouvel espace de travail</h2>
                {error && <div className="text-red-500 text-sm mb-4">{error}</div>} {/* Affichage de l'erreur */}
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label className="block text-gray-600" htmlFor="workspace-name">Nom de l'espace de travail</label>
                        <input
                            id="workspace-name"
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full px-4 py-2 border rounded-md mt-2"
                            required
                            aria-describedby="workspace-name-helper"
                        />
                        <small id="workspace-name-helper" className="text-xs text-gray-500">Nom de votre nouvel espace de travail.</small>
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-600" htmlFor="workspace-description">Description</label>
                        <textarea
                            id="workspace-description"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            className="w-full px-4 py-2 border rounded-md mt-2"
                            rows={4}
                            required
                            aria-describedby="workspace-description-helper"
                        ></textarea>
                        <small id="workspace-description-helper" className="text-xs text-gray-500">Décrivez brièvement votre espace de travail.</small>
                    </div>

                    <div className="mb-4">
                        <label className="block text-gray-600">Rechercher des Membres</label>
                        <input
                            type="text"
                            placeholder="Rechercher par nom..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full px-4 py-2 border rounded-md mt-2"
                        />
                        <div className="mt-4">
                            {loading ? (
                                <p>Chargement des utilisateurs...</p>
                            ) : (
                                <div className="space-y-2">
                                    {filteredUsers.map((user) => (
                                        <div key={user._id} className="flex justify-between items-center p-2 rounded-lg hover:bg-gray-100 transition-all">
                                            <div className="flex items-center">
                                                <img
                                                    src="https://lindamood.net/wp-content/uploads/2019/09/Blank-profile-image.jpg"
                                                    alt={user.username}
                                                    className="w-12 h-12 rounded-full object-cover"
                                                />
                                                <div className="ml-4">
                                                    <p className="font-semibold text-gray-800">{user.firstname} {user.lastname}</p>
                                                    <p className="text-sm italic text-gray-500">@{user.username}</p>
                                                </div>
                                            </div>
                                            <button
                                                type="button"
                                                onClick={() => addMember(user._id)}
                                                className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-all font-extrabold"
                                            >
                                                +
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="mb-4">
                        <label className="block text-gray-600">Membres sélectionnés</label>
                        <div className="space-y-2">
                            {members.map((memberId) => {
                                const user = availableUsers.find((user) => user._id === memberId);
                                return (
                                    user && (
                                        <div key={user._id} className="flex justify-between items-center  p-2 rounded-lg hover:bg-gray-100 transition-all">
                                            <div className="flex items-center">
                                                <img
                                                    src="https://lindamood.net/wp-content/uploads/2019/09/Blank-profile-image.jpg"
                                                    alt={user.username}
                                                    className="w-12 h-12 rounded-full object-cover"
                                                />
                                                <div className="ml-4">
                                                    <p className="font-semibold text-gray-800">{user.firstname} {user.lastname}</p>
                                                    <p className="text-sm italic text-gray-500">@{user.username}</p>
                                                </div>
                                            </div>
                                            <button
                                                type="button"
                                                onClick={() => removeMember(user._id)}
                                                className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-all font-extrabold"
                                            >
                                                -
                                            </button>
                                        </div>
                                    )
                                );
                            })}
                        </div>
                    </div>

                    <div className="flex justify-end space-x-2">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 bg-gray-300 text-gray-800 rounded-md"
                        >
                            Annuler
                        </button>
                        <button
                            type="submit"
                            className="px-4 py-2 bg-blue-500 text-white rounded-md"
                        >
                            Créer
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CreateWorkspaceForm;
