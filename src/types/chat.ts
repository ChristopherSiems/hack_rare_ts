// Types for chat functionality

export interface Message {
    id: string;
    conversationId: string;
    content: string;
    senderId: string;
    senderName: string;
    timestamp: Date;
    isRead: boolean;
  }
  
  export interface Conversation {
    id: string;
    participants: {
      id: string;
      name: string;
      avatar: string;
    }[];
    lastMessage: string;
    lastMessageTime: Date;
    unreadCount: number;
  }
  
  export type ChatViewState = 'closed' | 'conversations' | 'chat';