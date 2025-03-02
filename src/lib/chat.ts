// Chat data fetching and utility functions
import {Conversation, Message } from '@/src/types/chat';

// In a real app, these would interact with your database or API
// Mocked functions for now

/**
 * Get all conversations for a user
 */
export async function getConversations(userId: string): Promise<Conversation[]> {
  // This would be an API or database call in a real app
  return [
    {
      id: '1',
      participants: [
        {
          id: 'user1',
          name: 'Alex Johnson',
          avatar: 'A',
        },
        {
          id: userId,
          name: 'You',
          avatar: 'Y',
        }
      ],
      lastMessage: 'Hey, how are you doing?',
      lastMessageTime: new Date(Date.now() - 1000 * 60 * 30), // 30 mins ago
      unreadCount: 2,
    },
    {
      id: '2',
      participants: [
        {
          id: 'user2',
          name: 'Robin Smith',
          avatar: 'R',
        },
        {
          id: userId,
          name: 'You',
          avatar: 'Y',
        }
      ],
      lastMessage: 'Can we meet tomorrow?',
      lastMessageTime: new Date(Date.now() - 1000 * 60 * 60 * 24), // Yesterday
      unreadCount: 0,
    },
    // Add more conversations as needed
  ];
}

/**
 * Get messages for a specific conversation
 */
export async function getMessages(conversationId: string): Promise<Message[]> {
  // This would be an API or database call in a real app
  return [
    {
      id: '1',
      conversationId,
      content: 'Hey there!',
      senderId: 'user1',
      senderName: 'Alex Johnson',
      timestamp: new Date(Date.now() - 1000 * 60 * 60), // 1 hour ago
      isRead: true,
    },
    {
      id: '2',
      conversationId,
      content: 'Hi! How can I help you today?',
      senderId: 'currentUser',
      senderName: 'You',
      timestamp: new Date(Date.now() - 1000 * 60 * 55), // 55 mins ago
      isRead: true,
    },
    {
      id: '3',
      conversationId,
      content: 'I have a question about the project.',
      senderId: 'user1',
      senderName: 'Alex Johnson',
      timestamp: new Date(Date.now() - 1000 * 60 * 30), // 30 mins ago
      isRead: false,
    },
  ];
}

/**
 * Send a new message
 */
export async function sendMessage(
  conversationId: string,
  senderId: string,
  senderName: string,
  content: string
): Promise<Message> {
  // This would be an API call in a real app
  const message: Message = {
    id: Date.now().toString(),
    conversationId,
    content,
    senderId,
    senderName,
    timestamp: new Date(),
    isRead: true,
  };
  
  // In a real app, you would save this to your database and notify other users
  console.log('Sending message:', message);
  
  return message;
}

/**
 * Mark messages as read
 */
export async function markAsRead(conversationId: string, userId: string): Promise<void> {
  // This would be an API or database call in a real app
  console.log(`Marking all messages in conversation ${conversationId} as read for user ${userId}`);
  
  // In a real app, you would update your database
  return Promise.resolve();
}

/**
 * Create a new conversation
 */
export async function createConversation(
  userId: string,
  participantId: string,
  participantName: string,
  participantAvatar: string,
  initialMessage: string
): Promise<Conversation> {
  // This would be an API or database call in a real app
  const conversation: Conversation = {
    id: Date.now().toString(),
    participants: [
      {
        id: participantId,
        name: participantName,
        avatar: participantAvatar,
      },
      {
        id: userId,
        name: 'You',
        avatar: 'Y',
      }
    ],
    lastMessage: initialMessage,
    lastMessageTime: new Date(),
    unreadCount: 0,
  };
  
  console.log('Creating new conversation:', conversation);
  
  // In a real app, you would save this to your database
  return conversation;
}