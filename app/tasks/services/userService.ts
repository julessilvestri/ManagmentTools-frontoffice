// services/messageService.ts
export const fetchUsers = async (userId: string, token: string) => {
  const response = await fetch(`http://${process.env.NEXT_PUBLIC_API_URL_SERVER_IP}:${process.env.NEXT_PUBLIC_API_URL_SERVER_PORT}/api/v1/users`, {
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
