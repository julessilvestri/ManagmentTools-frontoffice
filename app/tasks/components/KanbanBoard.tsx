import React, { useState } from "react";
import { PlusCircle } from "lucide-react";

const KanbanBoard = () => {
  const [kanbanColumns, setKanbanColumns] = useState({
    Backlog: [],
    ToDo: [],
    InProgress: [],
    Done: []
  });

  const handleAddTask = (column) => {
    const taskTitle = prompt("Titre de la tâche :");
    if (taskTitle) {
      const newTask = { id: Date.now(), title: taskTitle, description: "Nouvelle tâche" };
      setKanbanColumns({
        ...kanbanColumns,
        [column]: [...kanbanColumns[column], newTask]
      });
    }
  };

  return (
    <div className="flex-1 bg-gray-100 p-6 flex flex-col w-[77%]">
      <div className="bg-white p-6 rounded-lg shadow-md mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Mon Workspace</h1>
        <p className="text-gray-600">Gérez vos tâches efficacement.</p>
      </div>
      
      <div className="flex space-x-4 overflow-auto">
        {Object.keys(kanbanColumns).map((column) => (
          <div key={column} className="flex flex-col bg-white p-4 rounded-lg shadow-lg w-1/4">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold capitalize">{column}</h2>
              <button onClick={() => handleAddTask(column)} className="text-blue-500 hover:text-blue-700">
                <PlusCircle size={24} />
              </button>
            </div>
            <div className="space-y-4">
              {kanbanColumns[column].map((task) => (
                <div key={task.id} className="bg-gray-100 p-3 rounded-md shadow-sm cursor-pointer">
                  <p className="font-semibold">{task.title}</p>
                  <p className="text-sm text-gray-500">{task.description}</p>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default KanbanBoard;
