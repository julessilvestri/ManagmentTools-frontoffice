import { useState, useEffect } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { createTask, updateTask, deleteTask } from "../services/taskService";

export interface Task {
    _id: string; // Unique identifier for the task
    title: string;
    description: string;
    status: "Backlog" | "ToDo" | "InProgress" | "Done"; // Task status
    priority: "Low" | "Medium" | "High" | "Urgent"; // Task priority
    dueDate: string | null; // ISO date string or null
    assignedTo: string | null; // The user assigned to this task
}

interface TaskModalProps {
    modalOpen: boolean;
    setModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
    selectedTask: Task | null;
    token: string;
    workspaceId: string;
    onSave: (taskData: Task) => Promise<void>;
    onDelete: () => Promise<void>;
    initialStatus: "Backlog" | "ToDo" | "InProgress" | "Done";
}

const TaskModal: React.FC<TaskModalProps> = ({
    modalOpen,
    setModalOpen,
    selectedTask,
    token,
    workspaceId,
    onSave,
    onDelete,
    initialStatus
}) => {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [date, setDate] = useState<Date | null>(null);
    const [assignedTo, setAssignedTo] = useState("");
    const [status, setStatus] = useState<Task["status"]>("Backlog");
    const [priority, setPriority] = useState<Task["priority"]>("Low");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        if (selectedTask) {
            setTitle(selectedTask.title);
            setDescription(selectedTask.description);
            setDate(selectedTask.dueDate ? new Date(selectedTask.dueDate) : null);
            setStatus(selectedTask.status);
            setPriority(selectedTask.priority);
            setAssignedTo(selectedTask.assignedTo || "");
        } else {
            setTitle("");
            setDescription("");
            setDate(null);
            setAssignedTo("");
            setStatus(initialStatus);
            setPriority("Low");
        }
    }, [selectedTask, initialStatus]);

    const saveTask = async () => {
        if (!title.trim()) {
            setError("Le titre est obligatoire.");
            return;
        }

        const taskData = {
            _id: selectedTask?._id || "",
            title,
            description,
            status,
            priority,
            dueDate: date ? date.toISOString() : null,
            assignedTo: assignedTo || null,
            workspaceId,
        };

        try {
            setLoading(true);
            setError("");

            await onSave(taskData);

            setModalOpen(false);
        } catch (error) {
            console.error("Erreur lors de l'enregistrement de la tâche:", error);
            setError("Une erreur est survenue lors de l'enregistrement.");
        } finally {
            setLoading(false);
        }
    };

    const handleCloseModal = () => {
        setModalOpen(false);
        setTitle("");
        setDescription("");
        setDate(null);
        setAssignedTo("");
        setStatus(initialStatus);
        setPriority("Low");
    };

    return modalOpen ? (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex justify-center items-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-1/3 flex">
                <div className="w-full pr-4">
                    <h2 className="text-xl font-semibold text-gray-800 mb-4">
                        {selectedTask ? "Modifier la tâche" : "Ajouter une tâche"}
                    </h2>

                    {error && <p className="text-red-500 mb-4">{error}</p>}

                    <div className="mb-4">
                        <label className="block text-gray-600" htmlFor="task-title">
                            Titre de la tâche
                        </label>
                        <input
                            id="task-title"
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="Titre de la tâche"
                            className="w-full px-4 py-2 border rounded-md mt-2"
                            required
                        />
                    </div>

                    <div className="mb-4">
                        <label className="block text-gray-600" htmlFor="task-description">
                            Description
                        </label>
                        <textarea
                            id="task-description"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="Description"
                            className="w-full px-4 py-2 border rounded-md mt-2"
                            rows={4}
                            required
                        ></textarea>
                    </div>

                    <div className="mb-4">
                        <label className="block text-gray-600">Statut</label>
                        <div className="flex space-x-4 mt-2">
                            {["Backlog", "ToDo", "InProgress", "Done"].map((option) => (
                                <label key={option} className="flex items-center">
                                    <input
                                        type="radio"
                                        name="status"
                                        value={option}
                                        checked={status === option}
                                        onChange={(e) => setStatus(e.target.value as Task["status"])}
                                        className="mr-2"
                                    />
                                    <span className="text-sm text-gray-600">{option}</span>
                                </label>
                            ))}
                        </div>
                    </div>

                    <div className="mb-4">
                        <label className="block text-gray-600">Priorité</label>
                        <div className="flex space-x-4 mt-2">
                            {["Low", "Medium", "High", "Urgent"].map((option) => (
                                <label key={option} className="flex items-center">
                                    <input
                                        type="radio"
                                        name="priority"
                                        value={option}
                                        checked={priority === option}
                                        onChange={(e) => setPriority(e.target.value as Task["priority"])}
                                        className="mr-2"
                                    />
                                    <span className="text-sm text-gray-600">{option}</span>
                                </label>
                            ))}
                        </div>
                    </div>

                    <div className="mb-4">
                        <label className="block text-gray-600" htmlFor="task-due-date">
                            Date limite
                        </label>
                        <DatePicker
                            selected={date}
                            onChange={(date: Date | null) => setDate(date)}
                            className="w-full px-4 py-2 border rounded-md mt-2"
                            placeholderText="Sélectionner une date"
                        />
                    </div>

                    <div className="mb-4">
                        <label className="block text-gray-600" htmlFor="assigned-to">
                            Assigné à
                        </label>
                        <select
                            id="assigned-to"
                            value={assignedTo}
                            onChange={(e) => setAssignedTo(e.target.value)}
                            className="w-full px-4 py-2 border rounded-md mt-2"
                        >
                            <option value="">Sélectionner un utilisateur</option>
                            <option value="user1">User 1</option>
                            <option value="user2">User 2</option>
                            <option value="user3">User 3</option>
                        </select>
                    </div>
                    <div className="flex justify-end space-x-2 mt-4">
                        <button
                            onClick={saveTask}
                            className={`px-4 py-2 text-white rounded-md transition-all ${loading ? "bg-gray-400" : "bg-blue-500 hover:bg-blue-600"}`}
                            disabled={loading}
                        >
                            {loading ? "Enregistrement..." : "Enregistrer"}
                        </button>
                        <button
                            onClick={handleCloseModal}
                            className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-all"
                        >
                            Fermer
                        </button>
                        {selectedTask && (
                            <button
                                onClick={onDelete}
                                className={`px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-all ${loading ? "bg-gray-400" : ""}`}
                                disabled={loading}
                            >
                                {loading ? "Suppression..." : "Supprimer"}
                            </button>
                        )}
                    </div>
                </div>

            </div>
        </div>
    ) : null;
};

export default TaskModal;
