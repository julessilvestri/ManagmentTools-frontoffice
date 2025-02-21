// components/ContactList.tsx
import React from "react";

interface User {
  _id: string;
  username: string;
  firstname: string;
  lastname: string;
  createdAt: string;
}

interface Contact {
  _id: string;
  sender: User;
  receiver: User;
  lastMessage: string;
  lastMessageTime: string;
}

interface ContactListProps {
  contacts: Contact[];
  userId: string | null;
  selectedContact: User;
  onSelectContact: (contact: Contact) => void;
}

const ContactList: React.FC<ContactListProps> = ({ contacts, userId, selectedContact, onSelectContact }) => {
  return (
    <div>
      <h1 className="text-xl font-semibold mb-4 text-gray-800">Conversations</h1>
      {contacts.map((contact) => {
        const isSender = contact.sender._id === userId;
        const otherUser = isSender ? contact.receiver : contact.sender;
        let isSelected = false

        if (selectedContact) {
          isSelected = selectedContact._id === contact._id;
        }

        return (
          <div
            key={contact._id}
            onClick={() => onSelectContact(contact)}
            className={`flex items-center justify-between p-3 rounded-md hover:bg-gray-50 cursor-pointer transition-all duration-200 
              ${isSelected ? 'bg-blue-50' : ''}`}
          >
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-blue-500 text-white flex items-center justify-center rounded-full text-lg font-bold">
                {otherUser.username[0].toUpperCase()}
              </div>
              <div>
                <p className="font-semibold text-gray-800">
                  {otherUser.firstname} {otherUser.lastname}
                </p>
                <p className="text-sm text-gray-500">
                  <span className="italic">{isSender ? "Vous : " : `${otherUser.username} : `}</span>
                  {contact.lastMessage.length > 25
                    ? `${contact.lastMessage.substring(0, 25)}...`
                    : contact.lastMessage}
                </p>

              </div>
            </div>
            <div className="text-sm text-gray-500">
              {new Date(contact.lastMessageTime).toLocaleDateString("fr-FR", { day: "2-digit", month: "2-digit" })} -
              {new Date(contact.lastMessageTime).toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" }).replace(":", "h")}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default ContactList;
