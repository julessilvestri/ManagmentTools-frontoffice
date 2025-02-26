import React from "react";

interface User {
  _id: string;
  username: string;
  firstname: string;
  lastname: string;
  createdAt: string;
}

interface Workspace {
  _id: string;
  name: string;
  description: string;
  owner: User;
  members: User[];
  tasks: { id: string; title: string; description: string; status: string; priority: string; assignedTo: string; dueDate: string }[];
  createdAt: string;
}

interface WorkspaceListProps {
  workspaces: Workspace[];
  selectedWorkspace: Workspace | null;
  setSelectedWorkspace: React.Dispatch<React.SetStateAction<Workspace | null>>;
  token: string;
}

const WorkspaceList: React.FC<WorkspaceListProps> = ({ workspaces, selectedWorkspace, setSelectedWorkspace, token }) => {

  const handleWorkspaceClick = (workspace: Workspace) => {
    setSelectedWorkspace(workspace);
  };

  return (
    <div>
      <h1 className="text-xl font-semibold mb-4 text-gray-800">Espaces de travail</h1>
      {workspaces.map((workspace) => {
        const isSelected = selectedWorkspace?._id === workspace._id;

        return (
          <div
            key={workspace._id}
            className={`flex items-center justify-between p-3 rounded-md hover:bg-gray-50 cursor-pointer transition-all duration-200 
                ${isSelected ? 'bg-blue-50' : ''}`}
            onClick={() => handleWorkspaceClick(workspace)}
          >
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-blue-500 text-white flex items-center justify-center rounded-full text-lg font-bold">
                {workspace.name[0].toUpperCase()}
              </div>
              <div>
                <p className="font-semibold text-gray-800">
                  {workspace.name}
                </p>
                <div className="text-sm text-gray-500">
                  Créé le {new Date(workspace.createdAt).toLocaleDateString("fr-FR", { day: "2-digit", month: "2-digit" })} -
                  {new Date(workspace.createdAt).toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" }).replace(":", "h")}
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default WorkspaceList;
