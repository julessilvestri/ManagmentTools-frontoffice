import { useState, useEffect, useCallback } from "react";
import { PlusCircle } from "lucide-react";
import TaskModal from "./TaskModal";
import { fetchTasks, updateTask, createTask } from "../services/taskService";

interface Task {
  _id: string;
  title: string;
  description: string;
  status: "Backlog" | "ToDo" | "InProgress" | "Done";
  dueDate: string | null;
  assignedTo: string | null;
  priority: "Low" | "Medium" | "High" | "Urgent";
}

interface User {
  _id: string;
  lastname: string;
  firstname: string;
  username: string;
  createdAt: string;
}

type KanbanColumn = "Backlog" | "ToDo" | "InProgress" | "Done";

export interface KanbanBoardProps {
  workspace: {
    _id: string;
    name: string;
    description: string;
    owner: User;
    members: User[];
    createdAt: string
  };
  token: string;
}

const KanbanBoard: React.FC<KanbanBoardProps> = ({ workspace, token }) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [initialStatus, setInitialStatus] = useState<"Backlog" | "ToDo" | "InProgress" | "Done">("Backlog");
  const [kanbanColumns, setKanbanColumns] = useState<{
    [key in KanbanColumn]: Task[];
  }>({
    Backlog: [],
    ToDo: [],
    InProgress: [],
    Done: [],
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const tasks: Task[] = await fetchTasks(token, workspace._id);
        const newColumns = {
          Backlog: tasks.filter((task) => task.status === "Backlog"),
          ToDo: tasks.filter((task) => task.status === "ToDo"),
          InProgress: tasks.filter((task) => task.status === "InProgress"),
          Done: tasks.filter((task) => task.status === "Done"),
        };
        setKanbanColumns(newColumns);
      } catch (error) {
        console.error("Erreur lors de la récupération des tâches :", error);
      }
    };

    fetchData();
  }, [workspace, token]);

  const handleTaskClick = useCallback((task: Task) => {
    setSelectedTask(task);
    setModalOpen(true);
  }, []);

  const handleDragStart = useCallback((event: React.DragEvent, taskId: string) => {
    event.dataTransfer.setData("taskId", taskId);
  }, []);

  const handleDrop = useCallback(
    async (event: React.DragEvent, column: KanbanColumn) => {
      event.preventDefault();
      const taskId = event.dataTransfer.getData("taskId");
      if (taskId) {
        const task = findTaskById(taskId);
        if (task) {
          task.status = column;
          await updateTask(token, task._id, { ...task, status: column });

          const tasks: Task[] = await fetchTasks(token, workspace._id);
          const newColumns = {
            Backlog: tasks.filter((task) => task.status === "Backlog"),
            ToDo: tasks.filter((task) => task.status === "ToDo"),
            InProgress: tasks.filter((task) => task.status === "InProgress"),
            Done: tasks.filter((task) => task.status === "Done"),
          };
          setKanbanColumns(newColumns);
        }
      }
    },
    [kanbanColumns, token, workspace._id]
  );

  const findTaskById = useCallback(
    (taskId: string) => {
      for (const column in kanbanColumns) {
        const task = kanbanColumns[column as keyof typeof kanbanColumns].find(
          (task) => task._id === taskId
        );
        if (task) return task;
      }
      return null;
    },
    [kanbanColumns]
  );

  const handleSaveTask = useCallback(
    async (taskData: Task) => {
      try {
        const taskWithWorkspaceId = { ...taskData, workspaceId: workspace._id };

        if (selectedTask) {
          await updateTask(token, selectedTask._id, taskWithWorkspaceId);
        } else {
          await createTask(token, taskWithWorkspaceId);
        }

        const tasks: Task[] = await fetchTasks(token, workspace._id);
        const newColumns = {
          Backlog: tasks.filter((task) => task.status === "Backlog"),
          ToDo: tasks.filter((task) => task.status === "ToDo"),
          InProgress: tasks.filter((task) => task.status === "InProgress"),
          Done: tasks.filter((task) => task.status === "Done"),
        };

        setKanbanColumns(newColumns);
        setModalOpen(false);
      } catch (error) {
        console.error("Erreur lors de l'enregistrement de la tâche", error);
      }
    },
    [kanbanColumns, token, selectedTask, workspace._id]
  );

  return (
    <div className="flex-1 bg-gray-100 p-4 lg:p-6 flex flex-col w-full lg:w-[80%] xl:w-[75%]">
      <div className="bg-gradient-to-r from-blue-500 to-blue-300 p-4 rounded-lg shadow-sm mb-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0 sm:space-x-6">
          <div>
            <h1 className="text-2xl sm:text-3xl font-semibold text-white">{workspace.name}</h1>
            <p className="mt-1 text-sm sm:text-base text-gray-200">{workspace.description}</p>
          </div>

          <div className="text-center">
            <p className="text-sm text-gray-200">Propriétaire</p>
            <h2 className="text-sm font-medium text-white">{workspace.owner.firstname} {workspace.owner.lastname}</h2>
          </div>
        </div>

        <div className="mt-3 flex flex-wrap sm:space-x-6 justify-start sm:justify-between items-center">
          <div className="flex items-center space-x-2">
            <p className="text-gray-300 text-sm">Membres</p>
            <span className="ml-2 text-lg sm:text-md text-white font-medium">{workspace.members.length}</span>
          </div>
          <div className="flex items-center space-x-2">
            <p className="text-gray-300 text-sm">Créé le</p>
            <span className="ml-2 text-lg sm:text-md text-white font-medium">{new Date(workspace.createdAt).toLocaleDateString()}</span>
          </div>
        </div>

        <div className="mt-3 flex -space-x-2">
          {workspace.members.slice(0, 5).map((member, index) => (
            <div key={index} className="relative">
              <img
                src="https://lindamood.net/wp-content/uploads/2019/09/Blank-profile-image.jpg"
                alt={`${member.firstname} ${member.lastname}`}
                className="w-8 h-8 sm:w-10 sm:h-10 rounded-full border-2 border-white shadow-md transform hover:scale-105 transition duration-200"
              />
            </div>
          ))}
          {workspace.members.length > 5 && (
            <div className="flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 bg-gray-700 text-white rounded-full shadow-md text-sm font-medium">
              +{workspace.members.length - 5}
            </div>
          )}
        </div>
      </div>

      <div className="flex space-x-2 sm:space-x-4 lg:space-x-6 overflow-x-auto h-full">
        {Object.keys(kanbanColumns).map((column) => (
          <div
            key={column}
            className="flex flex-col bg-white rounded-xl shadow-lg w-full sm:w-80 lg:w-96 h-full max-h-[calc(100vh-150px)] overflow-y-auto"
            onDragOver={(event) => event.preventDefault()}
            onDrop={(event) => handleDrop(event, column as KanbanColumn)}
          >
            <div className="sticky top-0 bg-white z-10 p-4">
              <div className="flex justify-between items-center">
                <h2 className="text-lg sm:text-xl font-semibold capitalize text-gray-800">{column}</h2>
                <button
                  onClick={() => {
                    setSelectedTask(null);
                    setModalOpen(true);
                    setInitialStatus(column as "Backlog" | "ToDo" | "InProgress" | "Done");
                  }}
                  className="text-blue-500 hover:text-blue-700"
                >
                  <PlusCircle size={24} />
                </button>
              </div>
            </div>

            <div className="space-y-4 p-3">
              {kanbanColumns[column as KanbanColumn].map((task) => (
                <div
                  key={task._id}
                  className="bg-white p-4 rounded-xl shadow-md hover:shadow-xl transition-all cursor-pointer transform hover:scale-[1.02] border-l-4 border-blue-300"
                  draggable
                  onDragStart={(event) => handleDragStart(event, task._id)}
                  onClick={() => handleTaskClick(task)}
                >
                  <div className="flex justify-between items-center mb-3">
                    <p className="text-lg font-semibold text-gray-800 truncate">{task.title}</p>
                    <div className={`text-xs font-semibold px-2 py-1 rounded-full ${task.priority === "Low"
                      ? "bg-green-100 text-green-700"
                      : task.priority === "Medium"
                        ? "bg-yellow-100 text-yellow-700"
                        : task.priority === "High"
                          ? "bg-orange-100 text-orange-700"
                          : "bg-red-100 text-red-700"
                      }`}>
                      {task.priority}
                    </div>
                  </div>

                  <p className="text-sm text-gray-600 mt-2 line-clamp-3">{task.description}</p>

                  <div className="mt-4 flex justify-between items-center">
                    <span className="text-xs text-gray-500">
                      {task.dueDate ? "📅 " + new Date(task.dueDate).toLocaleDateString() : ""}
                    </span>

                    {task.assignedTo ? (
                      <img
                        src={`https://lindamood.net/wp-content/uploads/2019/09/Blank-profile-image.jpg`} // Avatar temporaire
                        alt="Assignee"
                        className="w-8 h-8 rounded-full border border-gray-300"
                      />
                    ) : (
                      <span className="text-xs text-gray-400">Non assigné</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <TaskModal
        modalOpen={modalOpen}
        setModalOpen={setModalOpen}
        selectedTask={selectedTask}
        token={token}
        workspaceId={workspace._id}
        onSave={handleSaveTask}
        initialStatus={initialStatus}
      />
    </div>
  );
};

export default KanbanBoard;
