// Functions for sending / receiving messages
'use server';

import { getConversations, getMessages, sendMessage, markAsRead, createConversation } from '@/lib/chat';

// Check if user is logged in (this would normally be done server-side with a proper auth system)
// Since we're using 'use server', we'll need to pass the user ID from the client component
async function checkAuth(userId: string | null) {
  if (!userId) {
    throw new Error('Not authenticated');
  }
  return userId;
}

/**
 * Get all conversations for the current user
 */
export async function getUserConversations(userId: string) {
  const authenticatedUserId = await checkAuth(userId);
  return getConversations(authenticatedUserId);
}

/**
 * Get messages for a specific conversation
 */
export async function getConversationMessages(conversationId: string, userId: string) {
  await checkAuth(userId);
  return getMessages(conversationId);
}

/**
 * Send a new message in a conversation
 */
export async function sendNewMessage(conversationId: string, content: string, userId: string, userName: string) {
  const authenticatedUserId = await checkAuth(userId);
  return sendMessage(conversationId, authenticatedUserId, userName || 'User', content);
}

/**
 * Mark all messages in a conversation as read
 */
export async function markConversationAsRead(conversationId: string, userId: string) {
  const authenticatedUserId = await checkAuth(userId);
  return markAsRead(conversationId, authenticatedUserId);
}

/**
 * Start a new conversation with another user
 */
export async function startNewConversation(
  userId: string,
  participantId: string,
  participantName: string,
  participantAvatar: string,
  initialMessage: string
) {
  const authenticatedUserId = await checkAuth(userId);
  return createConversation(
    authenticatedUserId,
    participantId,
    participantName,
    participantAvatar,
    initialMessage
  );
}