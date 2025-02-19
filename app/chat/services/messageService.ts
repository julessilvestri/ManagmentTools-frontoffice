// services/messageService.ts
export const fetchConversation = async (contactId: string, token: string | undefined) => {
  if (!token) throw new Error('Token is required');

  const response = await fetch(`http://${process.env.NEXT_PUBLIC_API_URL_SERVER_IP}:${process.env.NEXT_PUBLIC_API_URL_SERVER_PORT}/api/v1/messages/conversation/${contactId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) throw new Error('Erreur de récupération des messages');

  return await response.json();
};

export const sendMessage = async (messageData: { senderId: string | null, receiverId: string, message: string }, token: string | undefined) => {
  if (!token) throw new Error('Token is required');

  const response = await fetch(`http://${process.env.NEXT_PUBLIC_API_URL_SERVER_IP}:${process.env.NEXT_PUBLIC_API_URL_SERVER_PORT}/api/v1/messages`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(messageData),
  });

  if (!response.ok) throw new Error('Erreur d\'envoi du message');

  return await response.json();
};
