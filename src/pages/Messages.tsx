
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/hooks/use-toast";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { 
  Avatar, 
  AvatarFallback, 
  AvatarImage 
} from "@/components/ui/avatar";
import { Send } from "lucide-react";

interface Message {
  id: string;
  sender_id: string;
  receiver_id: string;
  content: string;
  created_at: string;
  read: boolean;
}

interface User {
  id: string;
  username: string | null;
  full_name: string | null;
  avatar_url: string | null;
}

const Messages = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [contacts, setContacts] = useState<User[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [selectedContact, setSelectedContact] = useState<User | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<User[]>([]);

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }

    // Load user's contacts (people they've exchanged messages with)
    const loadContacts = async () => {
      setIsLoading(true);
      try {
        // Get users who have sent messages to the current user
        const { data: sentTo, error: sentError } = await supabase
          .from("messages")
          .select("receiver_id")
          .eq("sender_id", user.id)
          .not("receiver_id", "eq", user.id);

        // Get users who have received messages from the current user
        const { data: receivedFrom, error: receivedError } = await supabase
          .from("messages")
          .select("sender_id")
          .eq("receiver_id", user.id)
          .not("sender_id", "eq", user.id);

        if (sentError || receivedError) throw new Error("Failed to load contacts");

        // Combine and deduplicate user IDs
        const contactIds = new Set<string>();
        sentTo?.forEach(item => contactIds.add(item.receiver_id));
        receivedFrom?.forEach(item => contactIds.add(item.sender_id));

        if (contactIds.size === 0) {
          setIsLoading(false);
          return;
        }

        // Get user details for all contacts
        const { data: contactDetails, error: contactsError } = await supabase
          .from("profiles")
          .select("id, username, full_name, avatar_url")
          .in("id", Array.from(contactIds));

        if (contactsError) throw contactsError;

        setContacts(contactDetails || []);
      } catch (error) {
        console.error("Error loading contacts:", error);
        toast({
          title: "Error",
          description: "Failed to load your contacts",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    loadContacts();
  }, [user, navigate, toast]);

  const searchUsers = async (query: string) => {
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }
    
    try {
      // Search by username or full name
      const { data, error } = await supabase
        .from("profiles")
        .select("id, username, full_name, avatar_url")
        .or(`username.ilike.%${query}%,full_name.ilike.%${query}%`)
        .neq("id", user?.id || '')
        .limit(5);
        
      if (error) throw error;
      setSearchResults(data || []);
    } catch (error) {
      console.error("Error searching users:", error);
    }
  };

  useEffect(() => {
    // Debounce search
    const timeoutId = setTimeout(() => {
      if (searchQuery) searchUsers(searchQuery);
    }, 300);
    
    return () => clearTimeout(timeoutId);
  }, [searchQuery]);

  useEffect(() => {
    // Load messages with selected contact
    const loadMessages = async () => {
      if (!selectedContact || !user) return;
      
      try {
        const { data, error } = await supabase
          .from("messages")
          .select("*")
          .or(`and(sender_id.eq.${user.id},receiver_id.eq.${selectedContact.id}),and(sender_id.eq.${selectedContact.id},receiver_id.eq.${user.id})`)
          .order("created_at", { ascending: true });
          
        if (error) throw error;
        setMessages(data || []);
        
        // Mark unread messages as read
        const unreadMessages = data?.filter(msg => 
          msg.receiver_id === user.id && !msg.read
        ).map(msg => msg.id);
        
        if (unreadMessages && unreadMessages.length > 0) {
          await supabase
            .from("messages")
            .update({ read: true })
            .in("id", unreadMessages);
        }
      } catch (error) {
        console.error("Error loading messages:", error);
        toast({
          title: "Error",
          description: "Failed to load messages",
          variant: "destructive",
        });
      }
    };

    loadMessages();
    
    // Subscribe to new messages
    const messageSubscription = supabase
      .channel('public:messages')
      .on('postgres_changes', 
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: `receiver_id=eq.${user?.id}`
        }, 
        payload => {
          // Only update if message is from currently selected contact
          if (selectedContact && payload.new.sender_id === selectedContact.id) {
            setMessages(prev => [...prev, payload.new as Message]);
            
            // Mark as read immediately
            supabase
              .from("messages")
              .update({ read: true })
              .eq("id", payload.new.id);
          }
        }
      )
      .subscribe();
      
    return () => {
      supabase.removeChannel(messageSubscription);
    };
  }, [selectedContact, user, toast]);

  const sendMessage = async () => {
    if (!newMessage.trim() || !selectedContact || !user) return;
    
    try {
      const { error } = await supabase
        .from("messages")
        .insert({
          sender_id: user.id,
          receiver_id: selectedContact.id,
          content: newMessage.trim(),
          read: false
        });
        
      if (error) throw error;
      
      // Optimistically add to UI
      setMessages(prev => [...prev, {
        id: Date.now().toString(), // temporary ID
        sender_id: user.id,
        receiver_id: selectedContact.id,
        content: newMessage.trim(),
        created_at: new Date().toISOString(),
        read: false
      }]);
      
      setNewMessage("");
    } catch (error) {
      console.error("Error sending message:", error);
      toast({
        title: "Error",
        description: "Failed to send message",
        variant: "destructive",
      });
    }
  };

  const selectContact = (contact: User) => {
    setSelectedContact(contact);
    setSearchQuery("");
    setSearchResults([]);
  };

  const startNewConversation = (user: User) => {
    setSelectedContact(user);
    if (!contacts.some(c => c.id === user.id)) {
      setContacts(prev => [...prev, user]);
    }
    setSearchQuery("");
    setSearchResults([]);
  };

  // Helper function to format username display
  const getUserDisplayName = (user: User) => {
    return user.full_name || user.username || `User-${user.id.slice(0, 6)}`;
  };

  return (
    <Layout>
      <div className="container mx-auto py-10 h-[calc(100vh-200px)]">
        <Card className="h-full">
          <CardHeader className="pb-3">
            <CardTitle>Messages</CardTitle>
          </CardHeader>
          <CardContent className="p-0 h-[calc(100%-56px)]">
            <div className="grid grid-cols-1 md:grid-cols-12 h-full">
              {/* Contacts List */}
              <div className="md:col-span-4 border-r h-full flex flex-col">
                <div className="p-4 border-b">
                  <Input
                    placeholder="Search for users..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="mb-2"
                  />
                  
                  {/* Search Results */}
                  {searchResults.length > 0 && (
                    <div className="mt-2 border rounded-md bg-white">
                      {searchResults.map(result => (
                        <div 
                          key={result.id} 
                          className="p-2 hover:bg-slate-50 cursor-pointer flex items-center"
                          onClick={() => startNewConversation(result)}
                        >
                          <Avatar className="h-8 w-8 mr-2">
                            <AvatarImage src={result.avatar_url || ""} />
                            <AvatarFallback>{getUserDisplayName(result)[0]}</AvatarFallback>
                          </Avatar>
                          <div className="text-sm">{getUserDisplayName(result)}</div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                
                {/* Contacts */}
                <div className="overflow-y-auto flex-1">
                  {isLoading ? (
                    <div className="flex justify-center items-center h-40">
                      <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
                    </div>
                  ) : contacts.length > 0 ? (
                    contacts.map(contact => (
                      <div 
                        key={contact.id}
                        className={`p-3 border-b hover:bg-slate-50 cursor-pointer flex items-center ${
                          selectedContact?.id === contact.id ? 'bg-slate-100' : ''
                        }`}
                        onClick={() => selectContact(contact)}
                      >
                        <Avatar className="h-10 w-10 mr-3">
                          <AvatarImage src={contact.avatar_url || ""} />
                          <AvatarFallback>{getUserDisplayName(contact)[0]}</AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium">{getUserDisplayName(contact)}</div>
                          <div className="text-xs text-gray-500">
                            {contact.username ? `@${contact.username}` : 'No username'}
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="p-6 text-center text-gray-500">
                      No conversations yet. Search for users to start chatting!
                    </div>
                  )}
                </div>
              </div>
              
              {/* Messages Area */}
              <div className="md:col-span-8 flex flex-col h-full">
                {selectedContact ? (
                  <>
                    {/* Contact header */}
                    <div className="p-3 border-b flex items-center">
                      <Avatar className="h-10 w-10 mr-3">
                        <AvatarImage src={selectedContact.avatar_url || ""} />
                        <AvatarFallback>{getUserDisplayName(selectedContact)[0]}</AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-medium">{getUserDisplayName(selectedContact)}</div>
                        <div className="text-xs text-gray-500">
                          {selectedContact.username ? `@${selectedContact.username}` : ''}
                        </div>
                      </div>
                    </div>
                    
                    {/* Messages */}
                    <div className="flex-1 overflow-y-auto p-4 space-y-4">
                      {messages.length > 0 ? (
                        messages.map(message => (
                          <div 
                            key={message.id} 
                            className={`flex ${message.sender_id === user?.id ? 'justify-end' : 'justify-start'}`}
                          >
                            <div 
                              className={`max-w-[70%] rounded-lg p-3 ${
                                message.sender_id === user?.id 
                                  ? 'bg-blue-500 text-white' 
                                  : 'bg-gray-100'
                              }`}
                            >
                              {message.content}
                              <div className={`text-xs mt-1 ${
                                message.sender_id === user?.id ? 'text-blue-100' : 'text-gray-500'
                              }`}>
                                {new Date(message.created_at).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                              </div>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="text-center text-gray-500 mt-10">
                          No messages yet. Send the first message!
                        </div>
                      )}
                    </div>
                    
                    {/* Message input */}
                    <div className="p-3 border-t flex">
                      <Input
                        placeholder="Type a message..."
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        className="mr-2"
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') sendMessage();
                        }}
                      />
                      <Button onClick={sendMessage} disabled={!newMessage.trim()}>
                        <Send className="h-4 w-4" />
                      </Button>
                    </div>
                  </>
                ) : (
                  <div className="flex items-center justify-center h-full text-gray-500">
                    Select a contact to start messaging
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default Messages;
