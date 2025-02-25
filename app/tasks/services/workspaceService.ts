// services/workspaceService.ts

export const fetchWorkspaces = async (token: string) => {
    const response = await fetch(`http://${process.env.NEXT_PUBLIC_API_URL_SERVER_IP}:${process.env.NEXT_PUBLIC_API_URL_SERVER_PORT}/api/v1/workspaces`, {
        method: "GET",
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });

    if (!response.ok) {
        throw new Error(`Erreur HTTP! Statut: ${response.status}`);
    }

    return await response.json();
};

export const createWorkspaces = async (token: string, newWorkspace: { name: string; description: string }) => {
    const response = await fetch(`http://${process.env.NEXT_PUBLIC_API_URL_SERVER_IP}:${process.env.NEXT_PUBLIC_API_URL_SERVER_PORT}/api/v1/workspaces`, {
        method: "POST",
        headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            ...newWorkspace,
            owner: "",
            members: [],
        }),
    });

    if (!response.ok) {
        throw new Error(`Erreur HTTP! Statut: ${response.status}`);
    }

    return await response.json();
};
