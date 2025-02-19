export interface User {
    _id: string;
    lastname: string;
    firstname: string;
    username: string;
    createdAt: string;
  }
  
  export interface Contact {
    _id: string;
    lastMessage: string;
    lastMessageTime: string;
    sender: User;
    receiver: User;
  }
  
  export interface Message {
    sender: User;
    receiver: User;
    message: string;
    createdAt: string;
  }
  