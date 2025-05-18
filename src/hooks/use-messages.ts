
import { useState, useCallback, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/hooks/use-toast';

export interface Message {
  id: string;
  sender_id: string;
  receiver_id: string;
  content: string;
  created_at: string;
  read: boolean;
  profiles?: {
    full_name: string | null;
    avatar_url: string | null;
  };
}

export interface ConversationPartner {
  id: string;
  full_name: string | null;
  avatar_url: string | null;
  last_message?: string;
  last_message_time?: string;
  unread_count: number;
}

export const useMessages = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [conversations, setConversations] = useState<ConversationPartner[]>([]);

  // Get all conversations for the current user
  const getConversations = useCallback(async () => {
    if (!user) return;
    
    setIsLoading(true);
    try {
      // Get all messages where the current user is either sender or receiver
      const { data, error } = await supabase
        .from('messages')
        .select(`
          id,
          sender_id,
          receiver_id,
          content,
          created_at,
          read
        `)
        .or(`sender_id.eq.${user.id},receiver_id.eq.${user.id}`)
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Create a map of conversation partners
      const partners = new Map<string, {
        id: string;
        last_message?: string;
        last_message_time?: string;
        unread_count: number;
      }>();
      
      // Process messages to get unique conversation partners
      data?.forEach(message => {
        const partnerId = message.sender_id === user.id ? message.receiver_id : message.sender_id;
        
        // Check if this partner is already in our map
        if (!partners.has(partnerId)) {
          partners.set(partnerId, {
            id: partnerId,
            last_message: message.content,
            last_message_time: message.created_at,
            unread_count: message.receiver_id === user.id && !message.read ? 1 : 0
          });
        } else if (!message.read && message.receiver_id === user.id) {
          // Increment unread count if this is an unread message to the current user
          const partner = partners.get(partnerId)!;
          partners.set(partnerId, {
            ...partner,
            unread_count: partner.unread_count + 1
          });
        }
      });
      
      // Fetch profile information for all partners
      const partnerIds = Array.from(partners.keys());
      
      if (partnerIds.length > 0) {
        const { data: profiles, error: profilesError } = await supabase
          .from('profiles')
          .select('id, full_name, avatar_url')
          .in('id', partnerIds);
        
        if (profilesError) throw profilesError;
        
        // Combine partner data with profile data
        const conversationsList = profiles?.map(profile => {
          const partnerData = partners.get(profile.id);
          return {
            ...profile,
            ...partnerData,
            unread_count: partnerData?.unread_count || 0
          };
        }) || [];
        
        // Sort by most recent message
        conversationsList.sort((a, b) => {
          return new Date(b.last_message_time || 0).getTime() - new Date(a.last_message_time || 0).getTime();
        });
        
        setConversations(conversationsList);
      } else {
        setConversations([]);
      }
    } catch (error: any) {
      console.error('Error fetching conversations:', error);
      toast({
        title: 'Error',
        description: 'Failed to load your conversations',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  }, [user, toast]);

  // Get messages between the current user and another user
  const getConversationWithUser = useCallback(async (partnerId: string): Promise<Message[]> => {
    if (!user) return [];
    
    setIsLoading(true);
    try {
      // Get all messages between the current user and the partner
      const { data, error } = await supabase
        .from('messages')
        .select(`
          id,
          sender_id,
          receiver_id,
          content,
          created_at,
          read,
          profiles!sender_id(full_name, avatar_url)
        `)
        .or(`and(sender_id.eq.${user.id},receiver_id.eq.${partnerId}),and(sender_id.eq.${partnerId},receiver_id.eq.${user.id})`)
        .order('created_at', { ascending: true });

      if (error) throw error;
      
      const messages = data as Message[] || [];
      setMessages(messages);

      // Mark all unread messages from this partner as read
      const unreadMessages = messages.filter(
        msg => msg.read === false && msg.receiver_id === user.id && msg.sender_id === partnerId
      );
      
      if (unreadMessages.length > 0) {
        const unreadIds = unreadMessages.map(msg => msg.id);
        
        const { error: updateError } = await supabase
          .from('messages')
          .update({ read: true })
          .in('id', unreadIds);
        
        if (updateError) {
          console.error('Error marking messages as read:', updateError);
        } else {
          // Update local messages to reflect the read status
          setMessages(prevMessages => 
            prevMessages.map(msg => 
              unreadIds.includes(msg.id) ? { ...msg, read: true } : msg
            )
          );
        }
      }
      
      return messages;
    } catch (error: any) {
      console.error('Error fetching conversation:', error);
      toast({
        title: 'Error',
        description: 'Failed to load messages',
        variant: 'destructive',
      });
      return [];
    } finally {
      setIsLoading(false);
    }
  }, [user, toast]);

  // Send a message to another user
  const sendMessage = useCallback(async (receiverId: string, content: string): Promise<boolean> => {
    if (!user) {
      toast({
        title: 'Error',
        description: 'You must be logged in to send messages',
        variant: 'destructive',
      });
      return false;
    }

    if (!content.trim()) {
      toast({
        title: 'Error',
        description: 'Message cannot be empty',
        variant: 'destructive',
      });
      return false;
    }

    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('messages')
        .insert({
          sender_id: user.id,
          receiver_id: receiverId,
          content: content.trim(),
          read: false
        })
        .select();

      if (error) throw error;

      // Refresh conversation with this user to include the new message
      await getConversationWithUser(receiverId);
      
      return true;
    } catch (error: any) {
      console.error('Error sending message:', error);
      toast({
        title: 'Error',
        description: 'Failed to send message',
        variant: 'destructive',
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [user, toast, getConversationWithUser]);

  // Set up real-time subscription for new messages
  useEffect(() => {
    if (!user) return;

    const channel = supabase
      .channel('messages-channel')
      .on('postgres_changes', 
        {
          event: '*',
          schema: 'public',
          table: 'messages',
          filter: `receiver_id=eq.${user.id}`
        }, 
        payload => {
          console.log('Received real-time messages update:', payload);
          
          // Refresh conversations when a new message arrives
          getConversations();
          
          // If we're currently viewing a conversation with this sender,
          // refresh the conversation to include the new message
          if (payload.new && payload.eventType === 'INSERT') {
            const partnerId = payload.new.sender_id;
            const currentPartner = conversations.find(conv => conv.id === partnerId);
            
            if (currentPartner) {
              getConversationWithUser(partnerId);
            }
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user, conversations, getConversations, getConversationWithUser]);

  return {
    isLoading,
    messages,
    conversations,
    getConversations,
    getConversationWithUser,
    sendMessage
  };
};
