"use client"

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSocket } from "../providers/SocketProvider";
import UserConnected from "./components/UserConnected";
import WorkspaceList from "./components/WorkspaceList";
import KanbanBoard from "./components/KanbanBoard";
import { fetchWorkspaces, createWorkspaces } from "./services/workspaceService";
import CreateWorkspaceForm from "./components/WorkspaceModal";

const TasksPage = () => {
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [workspaces, setWorkspaces] = useState<any[]>([]);
  const [selectedWorkspace, setSelectedWorkspace] = useState<any | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { socket } = useSocket();
  const router = useRouter();

  useEffect(() => {
    const tokenFromCookie = document.cookie.match(/token=([^;]+)/)?.[1];
    if (!tokenFromCookie) {
      setError("Token manquant ou utilisateur non connecté.");
      setLoading(false);
      return;
    }

    setToken(tokenFromCookie);
    const userIdFromCookie = document.cookie.match(/userId=([^;]+)/)?.[1] ?? null;
    setUserId(userIdFromCookie);

    const fetchData = async () => {
      try {
        const workspacesData = await fetchWorkspaces(tokenFromCookie);
        setWorkspaces(workspacesData);
      } catch (e) {
        setError("Erreur lors de la récupération des workspaces.");
        console.error(e);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleCreateWorkspace = async (newWorkspace: { name: string; description: string; members: string[] }) => {
    try {
      if (!token) {
        setError("Token manquant.");
        return;
      }

      const createdWorkspace = await createWorkspaces(token, newWorkspace);

      // Ajoute l'espace de travail créé à la liste
      setWorkspaces((prevWorkspaces) => [...prevWorkspaces, createdWorkspace]);
      setIsModalOpen(false);  // Ferme le modal après création
    } catch (error) {
      setError("Erreur lors de la création de l'espace de travail.");
      console.error(error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <img
          src="https://www.rhs.org.uk/assets/styles/images/bg/loading.gif"
          className="w-24 h-24"
          alt="Loading"
        />
      </div>
    );
  }

  if (error) return <p style={{ color: "red" }}>{error}</p>;

  return (
    <div className="flex h-screen bg-gray-100">
      <div className="w-[23%] bg-white shadow-lg p-6 rounded-r-lg">
        <div className="flex items-center justify-between space-x-4 ">
          <div className="flex items-center space-x-3">
            <img
              src="https://cdn-icons-png.flaticon.com/512/9909/9909360.png"
              alt="Logo"
              className="w-10 h-10 object-cover"
            />
            <h1 className="text-3xl font-bold text-gray-800">Zynko</h1>
          </div>

          <button
            onClick={() => router.push("/chat")}
            className="bg-blue-500 text-white rounded-full p-3 shadow-lg hover:bg-blue-600 transition duration-200 flex items-center justify-center"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-8 h-8">
              <path d="M8 10.5H16M8 14.5H11M21.0039 12C21.0039 16.9706 16.9745 21 12.0039 21C9.9675 21 3.00463 21 3.00463 21C3.00463 21 4.56382 17.2561 3.93982 16.0008C3.34076 14.7956 3.00391 13.4372 3.00391 12C3.00391 7.02944 7.03334 3 12.0039 3C16.9745 3 21.0039 7.02944 21.0039 12Z" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>


        <hr className="my-4 border-gray-300" />

        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Gestion des tâches</h1>
          <p className="text-sm text-gray-500 mt-2">
            Consultez vos espaces de travail ou créez en un nouveau
          </p>
        </div>

        <div className="mt-6">
          <WorkspaceList
            workspaces={workspaces}
            token={token!}
            selectedWorkspace={selectedWorkspace}
            setSelectedWorkspace={setSelectedWorkspace}
          />
        </div>

        <div className="flex justify-end mt-6">
          <button
            onClick={() => setIsModalOpen(true)}
            className="bg-blue-500 text-white px-4 py-2 rounded-md"
          >
            Créer un projet
          </button>
        </div>

        <div className="absolute bottom-0 left-0 w-[23%]">
          <UserConnected userId={userId} token={token} />
        </div>
      </div>

      {selectedWorkspace ? (
        <KanbanBoard workspace={selectedWorkspace} token={token!} />
      ) : (
        <p className="text-gray-500">Veuillez sélectionner un espace de travail pour afficher le KanbanBoard.</p>
      )}


      {/* Modal de création de workspace */}
      {isModalOpen && (
        <CreateWorkspaceForm
          userId={userId ?? ""}
          token={token ?? ""}
          onCreateWorkspace={handleCreateWorkspace}
          onClose={() => setIsModalOpen(false)}
        />
      )}


    </div>
  );
};

export default TasksPage;
