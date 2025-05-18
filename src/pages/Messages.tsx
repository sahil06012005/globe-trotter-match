
import { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { Card, CardContent } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/context/AuthContext';
import { useMessages, ConversationPartner } from '@/hooks/use-messages';
import { Send, Search, ArrowLeft } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { Badge } from '@/components/ui/badge';

const Messages = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const { isLoading, conversations, messages, getConversations, getConversationWithUser, sendMessage } = useMessages();
  
  const [selectedUser, setSelectedUser] = useState<ConversationPartner | null>(null);
  const [messageText, setMessageText] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [isMobileView, setIsMobileView] = useState(window.innerWidth < 768);
  const [showConversations, setShowConversations] = useState(true);
  
  // Load conversations when component mounts
  useEffect(() => {
    if (user) {
      getConversations();
    }
    
    // Set up screen size listener
    const handleResize = () => {
      const isMobile = window.innerWidth < 768;
      setIsMobileView(isMobile);
      if (!isMobile) {
        setShowConversations(true);
      }
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [user, getConversations]);
  
  // Filter conversations based on search query
  const filteredConversations = conversations.filter(conversation => {
    if (!searchQuery) return true;
    
    const fullName = conversation.full_name?.toLowerCase() || '';
    return fullName.includes(searchQuery.toLowerCase());
  });
  
  // Handle conversation selection
  const handleSelectConversation = async (conversation: ConversationPartner) => {
    setSelectedUser(conversation);
    await getConversationWithUser(conversation.id);
    
    if (isMobileView) {
      setShowConversations(false);
    }
    
    // Scroll to bottom after messages load
    setTimeout(() => {
      scrollToBottom();
    }, 100);
  };
  
  // Handle sending a message
  const handleSendMessage = async (e?: React.FormEvent) => {
    e?.preventDefault();
    
    if (!selectedUser || !messageText.trim()) return;
    
    const success = await sendMessage(selectedUser.id, messageText);
    if (success) {
      setMessageText('');
      scrollToBottom();
    }
  };
  
  // Scroll to bottom of messages
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };
  
  // Format time for display
  const formatMessageTime = (dateStr: string) => {
    try {
      return formatDistanceToNow(new Date(dateStr), { addSuffix: true });
    } catch (error) {
      return 'Unknown time';
    }
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8 mt-16">
        <h1 className="text-3xl font-bold mb-6">Messages</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 h-[calc(100vh-200px)]">
          {/* Conversations List - Left Side */}
          {(showConversations || !isMobileView) && (
            <div className="md:col-span-1 border rounded-lg overflow-hidden flex flex-col">
              <div className="p-3 bg-gray-50">
                <div className="relative">
                  <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search conversations"
                    className="pl-9"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </div>
              
              <ScrollArea className="flex-1">
                {isLoading && filteredConversations.length === 0 ? (
                  <div className="flex justify-center items-center h-32">
                    <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-triplink-blue"></div>
                  </div>
                ) : filteredConversations.length > 0 ? (
                  <div className="divide-y">
                    {filteredConversations.map((conversation) => (
                      <div
                        key={conversation.id}
                        className={`p-4 cursor-pointer hover:bg-gray-50 flex items-center gap-3 ${
                          selectedUser?.id === conversation.id ? 'bg-gray-100' : ''
                        }`}
                        onClick={() => handleSelectConversation(conversation)}
                      >
                        <Avatar className="h-12 w-12">
                          <AvatarImage src={conversation.avatar_url || ''} />
                          <AvatarFallback>
                            {(conversation.full_name?.[0] || 'U').toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        
                        <div className="flex-1 min-w-0">
                          <div className="flex justify-between items-center mb-1">
                            <h3 className="font-medium truncate">
                              {conversation.full_name || 'Unknown User'}
                            </h3>
                            {conversation.last_message_time && (
                              <span className="text-xs text-gray-500">
                                {formatMessageTime(conversation.last_message_time)}
                              </span>
                            )}
                          </div>
                          
                          <div className="flex items-center justify-between">
                            <p className="text-sm text-gray-500 truncate">
                              {conversation.last_message || 'No messages yet'}
                            </p>
                            
                            {conversation.unread_count > 0 && (
                              <Badge variant="default" className="ml-2 bg-triplink-teal">
                                {conversation.unread_count}
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-6 text-center">
                    <p className="text-gray-500">
                      {searchQuery
                        ? 'No conversations match your search'
                        : 'No conversations yet'}
                    </p>
                  </div>
                )}
              </ScrollArea>
            </div>
          )}
          
          {/* Messages - Right Side */}
          <div className={`${isMobileView ? '' : 'col-span-2'} border rounded-lg overflow-hidden flex flex-col ${
            isMobileView && showConversations ? 'hidden' : 'flex'
          }`}>
            {selectedUser ? (
              <>
                {/* Message Header */}
                <div className="p-4 border-b flex items-center gap-3 bg-gray-50">
                  {isMobileView && (
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      onClick={() => setShowConversations(true)}
                    >
                      <ArrowLeft className="h-5 w-5" />
                    </Button>
                  )}
                  
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={selectedUser.avatar_url || ''} />
                    <AvatarFallback>
                      {(selectedUser.full_name?.[0] || 'U').toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  
                  <div>
                    <h3 className="font-medium">
                      {selectedUser.full_name || 'Unknown User'}
                    </h3>
                  </div>
                </div>
                
                {/* Messages Area */}
                <ScrollArea className="flex-1 p-4">
                  {messages.length > 0 ? (
                    <div className="space-y-4">
                      {messages.map((message) => {
                        const isCurrentUser = message.sender_id === user?.id;
                        
                        return (
                          <div
                            key={message.id}
                            className={`flex ${isCurrentUser ? 'justify-end' : 'justify-start'}`}
                          >
                            <div className={`flex items-start gap-2 max-w-[80%] ${isCurrentUser ? 'flex-row-reverse' : ''}`}>
                              {!isCurrentUser && (
                                <Avatar className="h-8 w-8 mt-1">
                                  <AvatarImage src={message.profiles?.avatar_url || ''} />
                                  <AvatarFallback>
                                    {(message.profiles?.full_name?.[0] || 'U').toUpperCase()}
                                  </AvatarFallback>
                                </Avatar>
                              )}
                              
                              <div>
                                <Card className={isCurrentUser ? 'bg-triplink-teal text-white' : ''}>
                                  <CardContent className="p-3">
                                    <p className="whitespace-pre-wrap break-words">
                                      {message.content}
                                    </p>
                                  </CardContent>
                                </Card>
                                <p className="text-xs text-gray-500 mt-1">
                                  {formatMessageTime(message.created_at)}
                                </p>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                      <div ref={messagesEndRef} />
                    </div>
                  ) : (
                    <div className="flex items-center justify-center h-full">
                      <p className="text-gray-500">No messages yet. Start the conversation!</p>
                    </div>
                  )}
                </ScrollArea>
                
                {/* Message Input */}
                <div className="p-4 border-t">
                  <form onSubmit={handleSendMessage} className="flex gap-2">
                    <Input
                      placeholder="Type a message..."
                      value={messageText}
                      onChange={(e) => setMessageText(e.target.value)}
                      className="flex-1"
                    />
                    <Button 
                      type="submit" 
                      disabled={!messageText.trim()} 
                      className="bg-triplink-teal hover:bg-triplink-darkBlue"
                    >
                      <Send className="h-4 w-4" />
                    </Button>
                  </form>
                </div>
              </>
            ) : (
              <div className="flex flex-col items-center justify-center h-full p-6 text-center">
                <div className="mb-4">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-16 w-16 text-gray-300"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1}
                      d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-medium mb-2">Your Messages</h3>
                <p className="text-gray-500 mb-4">
                  Select a conversation to start messaging
                </p>
                {isMobileView && (
                  <Button 
                    variant="outline" 
                    onClick={() => setShowConversations(true)}
                  >
                    View Conversations
                  </Button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Messages;
