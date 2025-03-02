'use client';

import React, { useState, useEffect } from 'react';
import { MessageCircle, User, ArrowLeft } from 'lucide-react';

interface Message {
  id: string;
  content: string;
  senderId: string;
  senderName: string;
  timestamp: Date;
  isRead: boolean;
}

interface Conversation {
  id: string;
  participantId: string;
  participantName: string;
  participantAvatar: string;
  lastMessage: string;
  lastMessageTime: Date;
  unreadCount: number;
}

export default function ChatPage() {
  // Chat state: conversations list or specific chat
  const [view, setView] = useState<'conversations' | 'chat'>('conversations');
  
  // Sample conversations data (replace with API call in production)
  const [conversations, setConversations] = useState<Conversation[]>([
    {
      id: '1',
      participantId: 'user1',
      participantName: 'Alex Johnson',
      participantAvatar: 'A',
      lastMessage: 'Hey, how are you doing?',
      lastMessageTime: new Date(Date.now() - 1000 * 60 * 30), // 30 mins ago
      unreadCount: 2,
    },
    {
      id: '2',
      participantId: 'user2',
      participantName: 'Robin Smith',
      participantAvatar: 'R',
      lastMessage: 'Can we meet tomorrow?',
      lastMessageTime: new Date(Date.now() - 1000 * 60 * 60 * 24), // Yesterday
      unreadCount: 0,
    },
    {
      id: '3',
      participantId: 'user3',
      participantName: 'Casey Williams',
      participantAvatar: 'C',
      lastMessage: 'I sent you the files',
      lastMessageTime: new Date(Date.now() - 1000 * 60 * 60 * 24), // Yesterday
      unreadCount: 0,
    },
    {
      id: '4',
      participantId: 'user4',
      participantName: 'Dana Brown',
      participantAvatar: 'D',
      lastMessage: 'Thanks for your help!',
      lastMessageTime: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3), // 3 days ago
      unreadCount: 0,
    },
  ]);

  // Currently selected conversation
  const [currentConversation, setCurrentConversation] = useState<Conversation | null>(null);
  
  // Messages for the current conversation
  const [messages, setMessages] = useState<Message[]>([]);
  
  // New message input
  const [newMessage, setNewMessage] = useState('');

  // Open a specific chat
  const openChat = (conversation: Conversation) => {
    setCurrentConversation(conversation);
    
    // Mark conversation as read
    setConversations(prevConversations => 
      prevConversations.map(conv => 
        conv.id === conversation.id 
          ? { ...conv, unreadCount: 0 } 
          : conv
      )
    );
    
    // Fetch or set messages for this conversation
    // In production, you would fetch these from your API
    setMessages([
      {
        id: '1',
        content: 'Hey there!',
        senderId: conversation.participantId,
        senderName: conversation.participantName,
        timestamp: new Date(Date.now() - 1000 * 60 * 60), // 1 hour ago
        isRead: true,
      },
      {
        id: '2',
        content: 'Hi! How can I help you today?',
        senderId: 'currentUser', // Your user ID
        senderName: 'You',
        timestamp: new Date(Date.now() - 1000 * 60 * 55), // 55 mins ago
        isRead: true,
      },
      {
        id: '3',
        content: conversation.lastMessage,
        senderId: conversation.participantId,
        senderName: conversation.participantName,
        timestamp: conversation.lastMessageTime,
        isRead: conversation.unreadCount === 0,
      },
    ]);
    
    setView('chat');
  };

  // Send a new message
  const sendMessage = () => {
    if (!newMessage.trim() || !currentConversation) return;
    
    // Create a new message
    const message: Message = {
      id: Date.now().toString(),
      content: newMessage,
      senderId: 'currentUser', // Your user ID
      senderName: 'You',
      timestamp: new Date(),
      isRead: true,
    };
    
    // Add message to the current conversation
    setMessages([...messages, message]);
    
    // Update the conversation with the new last message
    setConversations(prevConversations => 
      prevConversations.map(conv => 
        conv.id === currentConversation.id 
          ? { 
              ...conv, 
              lastMessage: newMessage,
              lastMessageTime: new Date(),
            } 
          : conv
      )
    );
    
    // Clear the input
    setNewMessage('');
    
    // In production, you would send this message to your API
  };

  // Handle Enter key press
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  // Format timestamp to a readable string
  const formatTime = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    
    // If less than 24 hours, show time
    if (diff < 24 * 60 * 60 * 1000) {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }
    
    // If less than 7 days, show day name
    if (diff < 7 * 24 * 60 * 60 * 1000) {
      return date.toLocaleDateString([], { weekday: 'short' });
    }
    
    // Otherwise show date
    return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
  };

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white p-4 border-b">
        <div className="flex items-center">
          {view === 'chat' && (
            <button 
              onClick={() => setView('conversations')}
              className="mr-3 text-gray-500 hover:text-gray-700"
              aria-label="Back to conversations"
            >
              <ArrowLeft size={20} />
            </button>
          )}
          <h1 className="text-xl font-bold text-gray-800">
            {view === 'conversations' ? 'Messages' : currentConversation?.participantName}
          </h1>
        </div>
      </header>

      {/* Main content */}
      <main className="flex-1 overflow-y-auto">
        {view === 'conversations' ? (
          // Conversations list
          <div className="divide-y">
            {conversations.map(conversation => (
              <div 
                key={conversation.id}
                onClick={() => openChat(conversation)}
                className="flex items-center p-4 bg-white hover:bg-gray-50 cursor-pointer"
              >
                <div className={`w-12 h-12 rounded-full flex items-center justify-center text-white text-lg ${conversation.unreadCount > 0 ? 'bg-blue-600' : 'bg-gray-400'}`}>
                  {conversation.participantAvatar}
                </div>
                <div className="ml-4 flex-1">
                  <div className="flex justify-between">
                    <span className={`font-medium ${conversation.unreadCount > 0 ? 'text-black' : 'text-gray-700'}`}>
                      {conversation.participantName}
                    </span>
                    <span className="text-sm text-gray-500">
                      {formatTime(conversation.lastMessageTime)}
                    </span>
                  </div>
                  <div className="flex justify-between mt-1">
                    <p className={`truncate ${conversation.unreadCount > 0 ? 'font-medium text-black' : 'text-gray-500'}`}>
                      {conversation.lastMessage}
                    </p>
                    {conversation.unreadCount > 0 && (
                      <span className="ml-2 bg-blue-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                        {conversation.unreadCount}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          // Individual chat
          <div className="p-4 space-y-4">
            {messages.map(message => (
              <div 
                key={message.id}
                className={`flex ${message.senderId === 'currentUser' ? 'justify-end' : 'justify-start'}`}
              >
                {message.senderId !== 'currentUser' && (
                  <div className="w-8 h-8 rounded-full flex items-center justify-center text-white bg-gray-400 mr-2">
                    {currentConversation?.participantAvatar}
                  </div>
                )}
                <div className={`max-w-xs md:max-w-md px-4 py-2 rounded-lg ${
                  message.senderId === 'currentUser'
                    ? 'bg-blue-600 text-white rounded-br-none'
                    : 'bg-white text-gray-800 rounded-bl-none shadow'
                }`}>
                  <p>{message.content}</p>
                  <div className={`text-right text-xs mt-1 ${message.senderId === 'currentUser' ? 'text-blue-100' : 'text-gray-500'}`}>
                    {formatTime(message.timestamp)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Input area (only shown in chat view) */}
      {view === 'chat' && (
        <footer className="p-4 bg-white border-t">
          <div className="flex">
            <input
              type="text"
              placeholder="Type a message..."
              className="flex-1 border rounded-full px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-300"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyDown={handleKeyPress}
            />
            <button
              onClick={sendMessage}
              disabled={!newMessage.trim()}
              className={`ml-2 p-3 rounded-full ${
                newMessage.trim() 
                  ? 'bg-blue-600 text-white hover:bg-blue-700' 
                  : 'bg-gray-200 text-gray-400'
              }`}
              aria-label="Send message"
            >
              <MessageCircle size={20} />
            </button>
          </div>
        </footer>
      )}
    </div>
  );
}