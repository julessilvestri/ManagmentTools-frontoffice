export const fetchTasks = async (token: string, workspaceId: string) => {
    try {
        const response = await fetch(`http://${process.env.NEXT_PUBLIC_API_URL_SERVER_IP}:${process.env.NEXT_PUBLIC_API_URL_SERVER_PORT}/api/v1/tasks?workspace=${workspaceId}`, {
            headers: { Authorization: `Bearer ${token}` },
        });

        if (!response.ok) {
            throw new Error("Erreur lors de la récupération des tâches");
        }

        return await response.json();

    } catch (error) {
        console.error("Erreur:", error);
    }
};

export const createTask = async (token: string, newTask: {
    _id: string | null
    title: string;
    description: string;
    status: string;
    priority: string;
    dueDate: string | null;
    workspaceId: string;
    assignedTo: string | null;
}) => {
    const response = await fetch(`http://${process.env.NEXT_PUBLIC_API_URL_SERVER_IP}:${process.env.NEXT_PUBLIC_API_URL_SERVER_PORT}/api/v1/tasks`, {
        method: "POST",
        headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
        },

        body: JSON.stringify({
            title: newTask.title,
            description: newTask.description,
            status: newTask.status,
            priority: newTask.priority,
            dueDate: newTask.dueDate,
            workspaceId: newTask.workspaceId,
            assignedTo: newTask.assignedTo,
        }),
    });

    if (!response.ok) {
        throw new Error(`Erreur HTTP! Statut: ${response.status}`);
    }

    return await response.json();
};

export const updateTask = async (token: string, taskId: string, updatedTask: {
    title: string;
    description: string;
    status: string;
    priority: string;
    dueDate: string | null;
    assignedTo: string | null;
}) => {
    const response = await fetch(`http://${process.env.NEXT_PUBLIC_API_URL_SERVER_IP}:${process.env.NEXT_PUBLIC_API_URL_SERVER_PORT}/api/v1/tasks/${taskId}`, {
        method: "PUT",
        headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            title: updatedTask.title,
            description: updatedTask.description,
            status: updatedTask.status,
            priority: updatedTask.priority,
            dueDate: updatedTask.dueDate,
            assignedTo: updatedTask.assignedTo,
        }),
    });

    if (!response.ok) {
        throw new Error(`Erreur HTTP! Statut: ${response.status}`);
    }

    return await response.json();
};
