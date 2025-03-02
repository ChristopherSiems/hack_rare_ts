'use client';

import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { X, Send } from 'lucide-react';
import Link from "next/link";

const SAMPLE_CHATTERS = [
  "joe@example.com",
  "chris@email.com", 
  "john@gmail.com",
  "alan@email.com",
  "bob@email.com"
];

// Types for chat functionality
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

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showChat, setShowChat] = useState(false);
  
  // Chat state variables
  const [chatState, setChatState] = useState<'conversations' | 'chat'>('conversations');
  const [currentUserId] = useState<string>('current-user');
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
  ]);
  
  // Form state variables
  const [chatter, setChatter] = useState("");
  
  // Chatter suggestions state
  const [chatters, setChatters] = useState<string[]>([]);
  const [filteredChatters, setFilteredChatters] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [currentConversation, setCurrentConversation] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [currentPath, setCurrentPath] = useState('/');

  // Mock for location since we're using Next.js router
  useEffect(() => {
    setCurrentPath(window.location.pathname);
  }, []);

  // Fetch chatters from the chatters.txt file
  useEffect(() => {
    const fetchChatters = async () => {
      setIsLoading(true);
      try {
        // Since we know the exact path, we'll create an API endpoint to access it
        const response = await fetch('/api/chatters');
        if (response.ok) {
          const data = await response.json();
          if (data.chatters && data.chatters.length > 0) {
            setChatters(data.chatters);
            console.log(`Loaded ${data.chatters.length} chatters from API`);
          } else {
            console.log("API returned empty chatters list, using fallback data");
            setChatters(SAMPLE_CHATTERS);
          }
        } else {
          console.error("Failed to fetch chatters from API, using fallback data");
          setChatters(SAMPLE_CHATTERS);
        }
      } catch (error) {
        console.error('Error loading chatters:', error);
        setChatters(SAMPLE_CHATTERS);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchChatters();
  }, []);

  // Filter chatters based on input
  const handleChatterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setChatter(value);
    
    if (value.trim() === '') {
        setFilteredChatters([]); 
        setShowSuggestions(false);
    } else {
        const searchTerm = value.toLowerCase();
        const filtered = chatters
            .filter(d => d.toLowerCase().includes(searchTerm)) 
            .slice(0, 5); // Limit to 5 suggestions
        
        setFilteredChatters(filtered);
        setShowSuggestions(filtered.length > 0);
    }
  };

  // Select chatter from suggestions
  const selectChatter = (selected: string) => {
    setChatter(selected);
    setShowSuggestions(false);
  };

  // Check whether user is logged in when component mounts
  useEffect(() => {
    const loggedIn = localStorage.getItem("isLoggedIn") === "true";
    setIsLoggedIn(loggedIn);
  }, []);

  // Handle user navigation based on login status
  const handleUsernameClick = () => {
    console.log("Username clicked, isLoggedIn:", isLoggedIn);
    console.log("localStorage value:", localStorage.getItem("isLoggedIn"));
    
    if (isLoggedIn) {
      console.log("Navigating to profile page");
      router.push("/profile");
    } else {
      console.log("Navigating to signin page");
      router.push("/auth/signin");
    }
  };
  
  // Reset chat state when closing
  const closeChat = () => {
    setChatState('conversations');
    setShowChat(false);
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
        senderId: currentUserId,
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
    
    setChatState('chat');
  };

  // Send a new message
  const sendMessage = () => {
    if (!newMessage.trim() || !currentConversation) return;
    
    // Create a new message
    const message: Message = {
      id: Date.now().toString(),
      content: newMessage,
      senderId: currentUserId,
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
  };

  // Handle Enter key press
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-white">
      {/* Main header - no gap above */}
      <header className="bg-gradient-to-r from-blue-500 to-purple-600 text-white py-4">
        <div className="px-6">
          <Link href="/">
            <h1 className="text-2xl font-bold cursor-pointer hover:text-blue-100 transition-colors">LabBrats</h1>
          </Link>
        </div>
      </header>
      
      {/* Main content area */}
      <main className="flex-1">
        {/* Page content - let the children handle their own header */}
        {children}
      </main>
    
      
      {/* Navigation Bar */}
      <nav className="bg-white border-t border-blue-300 sticky bottom-0">
        <div className="max-w-screen-xl mx-auto px-6">
          <div className="flex justify-around py-3">
            {/* Event Button */}
            <Link href="/event">
              <button className="flex flex-col items-center focus:outline-none group">
                <div className="w-10 h-10 rounded-full border border-blue-400 flex items-center justify-center mb-1 group-hover:border-2 group-hover:border-blue-400 group-hover:bg-blue-50 transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-500 group-hover:text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <span className="text-blue-500 text-sm group-hover:text-blue-500 transition-colors">Event</span>
              </button>
            </Link>
            
            {/* Username Button */}
            <button
              className="flex flex-col items-center focus:outline-none group"
              onClick={handleUsernameClick}
            >
              <div className="w-10 h-10 rounded-full border border-blue-400 flex items-center justify-center mb-1 group-hover:border-2 group-hover:border-blue-400 group-hover:bg-blue-50 transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-500 group-hover:text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <span className="text-blue-500 text-sm group-hover:text-blue-500 transition-colors">Username</span>
            </button>
            
            {/* Chat Button */}
            <button
              className="flex flex-col items-center focus:outline-none group"
              onClick={() => setShowChat(!showChat)}
            >
              <div className={`w-10 h-10 rounded-full border border-blue-400 flex items-center justify-center mb-1 group-hover:border-2 group-hover:border-blue-400 group-hover:bg-blue-50 transition-colors ${showChat ? 'border-2 border-blue-400 bg-blue-50' : ''}`}>
                <svg xmlns="http://www.w3.org/2000/svg" className={`h-6 w-6 text-blue-500 group-hover:text-blue-500 ${showChat ? 'text-blue-500' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                </svg>
              </div>
              <span className={`text-blue-500 text-sm group-hover:text-blue-500 transition-colors ${showChat ? 'text-blue-500' : ''}`}>Chat</span>
            </button>
          </div>
        </div>
      </nav>
      
      {/* Enhanced Chat Interface */}
      {showChat && (
        <div className="fixed bottom-20 right-4 w-80 md:w-96 h-96 bg-white rounded-lg shadow-xl flex flex-col overflow-hidden z-50 border border-gray-200">
          {/* Header */}
          <div className="bg-blue-600 text-white p-3 flex justify-between items-center">
            <h3 className="font-medium">
              {chatState === 'conversations' 
                ? 'Messages' 
                : currentConversation?.participantName}
            </h3>
            <button 
              onClick={closeChat}
              className="text-white hover:text-gray-200 transition-colors"
              aria-label="Close chat"
            >
              <X size={20} />
            </button>
          </div>
          
          {/* Back button when in chat view */}
          {chatState === 'chat' && (
            <button 
              onClick={() => setChatState('conversations')}
              className="flex items-center p-2 text-blue-600 hover:bg-blue-50 transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Back to Messages
            </button>
          )}
          
          {/* Chatter search (only shown in conversations view) */}
          {chatState === 'conversations' && (
            <div className="relative border-b border-gray-200">
              <div className="flex items-center px-3 py-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <input
                  id="chatter"
                  name="chatter"
                  type="text"
                  autoComplete="off"
                  className="w-full px-2 py-1 outline-none text-sm"
                  placeholder="Search by email"
                  value={chatter}
                  onChange={handleChatterChange}
                  onFocus={() => {
                    if (chatter.trim() !== '') {
                      const filtered = chatters
                        .filter(d => d.toLowerCase().includes(chatter.toLowerCase()))
                        .slice(0, 5);
                      setFilteredChatters(filtered);
                      setShowSuggestions(filtered.length > 0);
                    }
                  }}
                />
              </div>
              
              {/* Suggestions dropdown */}
              {showSuggestions && filteredChatters.length > 0 && (
                <div className="absolute z-10 w-full bg-white text-black border border-gray-300 shadow-lg max-h-60 overflow-y-auto">
                  <ul className="py-1">
                    {filteredChatters.map((suggestion, index) => (
                      <li 
                        key={index}
                        className="px-3 py-2 text-sm hover:bg-gray-100 cursor-pointer"
                        onClick={() => selectChatter(suggestion)}
                        onMouseDown={(e) => {
                          // Prevent the onBlur from firing before the click
                          e.preventDefault();
                        }}
                      >
                        {suggestion}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}

          {/* Content */}
          <div className="flex-1 overflow-y-auto bg-gray-50">
            {chatState === 'conversations' ? (
              // Conversations list
              <div>
                {conversations.length > 0 ? (
                  conversations.map(conversation => (
                    <div 
                      key={conversation.id}
                      onClick={() => openChat(conversation)}
                      className="flex items-center p-3 border-b border-gray-200 hover:bg-gray-100 cursor-pointer transition-colors"
                    >
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white ${conversation.unreadCount > 0 ? 'bg-blue-600' : 'bg-gray-500'}`}>
                        {conversation.participantAvatar}
                      </div>
                      <div className="ml-3 flex-1">
                        <div className="flex justify-between">
                          <span className={`font-medium ${conversation.unreadCount > 0 ? 'text-black' : 'text-gray-800'}`}>
                            {conversation.participantName}
                          </span>
                          <span className="text-xs text-gray-500">
                            {formatTime(conversation.lastMessageTime)}
                          </span>
                        </div>
                        <div className="flex justify-between mt-1">
                          <p className={`text-sm truncate ${conversation.unreadCount > 0 ? 'font-medium text-black' : 'text-gray-600'}`} style={{ maxWidth: '70%' }}>
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
                  ))
                ) : (
                  <div className="p-6 text-center text-gray-500">
                    <p>No conversations yet</p>
                    <p className="text-sm mt-2">Start a new chat by searching for someone</p>
                  </div>
                )}
              </div>
            ) : (
              // Individual chat
              <div className="flex flex-col h-full">
                <div className="flex-1 p-3 space-y-3 overflow-y-auto">
                  {messages.map(message => (
                    <div 
                      key={message.id}
                      className={`flex ${message.senderId === currentUserId ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-xs px-3 py-2 rounded-lg ${
                          message.senderId === currentUserId
                            ? "bg-blue-600 text-white rounded-br-none"
                            : "bg-white text-gray-800 rounded-bl-none border border-gray-200"
                        }`}
                      >
                        <p className="break-words">{message.content}</p>
                        <div
                          className={`text-right text-xs mt-1 ${
                            message.senderId === currentUserId
                              ? "text-blue-100"
                              : "text-gray-500"
                          }`}
                        >
                          {formatTime(message.timestamp)}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                
                {/* Input area */}
                <div className="p-3 bg-white border-t border-gray-200">
                  <div className="flex items-center">
                    <input
                      type="text"
                      placeholder="Type a message..."
                      className="flex-1 border border-gray-300 rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-300"
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      onKeyDown={handleKeyPress}
                    />
                    <button
                      onClick={sendMessage}
                      disabled={!newMessage.trim()}
                      className={`ml-2 p-2 rounded-full ${
                        newMessage.trim() 
                          ? 'bg-blue-600 text-white hover:bg-blue-700' 
                          : 'bg-gray-200 text-gray-400'
                      } transition-colors`}
                      aria-label="Send message"
                    >
                      <Send size={20} />
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}