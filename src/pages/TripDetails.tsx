
import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import {
  Calendar,
  DollarSign,
  Users,
  MapPin,
  User,
  MessageSquare,
  Edit,
  Send,
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/context/AuthContext";

// Message interface
interface Message {
  id: string;
  content: string;
  created_at: string;
  sender: {
    id: string;
    full_name: string;
    avatar_url: string;
  };
}

// User interface
interface UserProfile {
  id: string;
  full_name: string;
  avatar_url: string;
  location: string;
  bio: string;
  age: number;
  interests: string[];
  created_at: string;
}

const TripDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();
  
  // State for trip data
  const [trip, setTrip] = useState<any>(null);
  const [host, setHost] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [matches, setMatches] = useState<UserProfile[]>([]);
  
  // State for messaging
  const [messageText, setMessageText] = useState("");
  const [discussionMessages, setDiscussionMessages] = useState<Message[]>([]);
  const [sendingMessage, setSendingMessage] = useState(false);

  // Fetch trip data
  useEffect(() => {
    const fetchTripData = async () => {
      if (!id) return;
      
      try {
        // Get trip details
        const { data: tripData, error: tripError } = await supabase
          .from("trips")
          .select("*")
          .eq("id", id)
          .single();
        
        if (tripError) throw tripError;
        
        setTrip(tripData);
        
        // Get host profile
        if (tripData.user_id) {
          const { data: hostData, error: hostError } = await supabase
            .from("profiles")
            .select("*")
            .eq("id", tripData.user_id)
            .single();
          
          if (hostError) throw hostError;
          
          setHost(hostData);
        }
        
        // Get potential matches (users with similar interests)
        if (tripData.interests && tripData.interests.length > 0) {
          const { data: matchedUsers, error: matchesError } = await supabase
            .from("profiles")
            .select("*")
            .neq("id", tripData.user_id)
            .limit(4);
          
          if (!matchesError && matchedUsers) {
            setMatches(matchedUsers);
          }
        }
        
        // Load discussion messages
        await loadDiscussionMessages();
        
      } catch (error: any) {
        console.error("Error fetching trip details:", error);
        toast({
          title: "Error loading trip",
          description: error.message || "Could not load trip details",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchTripData();
  }, [id, toast]);
  
  // Load discussion messages
  const loadDiscussionMessages = async () => {
    if (!id) return;
    
    try {
      // Use the database function to get trip discussion messages
      const { data, error } = await supabase
        .rpc('get_trip_discussion_messages', { trip_id: id })
        .order('created_at', { ascending: true });
      
      if (error) throw error;
      
      setDiscussionMessages(data || []);
    } catch (error: any) {
      console.error("Error loading messages:", error);
    }
  };

  // Send a message
  const handleSendMessage = async () => {
    if (!messageText.trim() || !user || !trip) return;
    
    setSendingMessage(true);
    
    try {
      // Use the database function to add a message
      const { error } = await supabase
        .rpc('add_trip_discussion_message', { 
          trip_id: trip.id,
          message_content: messageText.trim()
        });
      
      if (error) throw error;
      
      toast({
        title: "Message sent",
        description: "Your message has been posted to the discussion.",
      });
      
      setMessageText("");
      
      // Reload messages
      await loadDiscussionMessages();
      
    } catch (error: any) {
      toast({
        title: "Error sending message",
        description: error.message || "Failed to send message. Please try again.",
        variant: "destructive",
      });
    } finally {
      setSendingMessage(false);
    }
  };

  // Request to join the trip
  const handleJoinRequest = async (message: string) => {
    if (!user || !trip) {
      toast({
        title: "Authentication required",
        description: "Please log in to request joining this trip.",
        variant: "destructive",
      });
      return;
    }
    
    try {
      const { error } = await supabase
        .from("trip_requests")
        .insert({
          trip_id: trip.id,
          user_id: user.id,
          message: message,
          status: "pending"
        });
      
      if (error) throw error;
      
      toast({
        title: "Request sent!",
        description: `Your request to join ${trip.title} has been sent.`,
      });
    } catch (error: any) {
      toast({
        title: "Error sending request",
        description: error.message || "Failed to send join request. Please try again.",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-20 text-center">
          <p>Loading trip details...</p>
        </div>
      </Layout>
    );
  }

  if (!trip || !host) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-20 text-center">
          <h1 className="text-3xl font-bold mb-4">Trip not found</h1>
          <p className="mb-8">The trip you're looking for doesn't exist or has been removed.</p>
          <Button onClick={() => navigate("/explore")}>Browse Other Trips</Button>
        </div>
      </Layout>
    );
  }

  const isOwner = user && user.id === trip.user_id;
  const memberSince = host.created_at ? new Date(host.created_at).getFullYear().toString() : 'Unknown';

  return (
    <Layout>
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          {/* Trip Details Card */}
          <div className="lg:col-span-2">
            <div className="mb-6">
              <div className="flex items-center gap-2 mb-2">
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-triplink-blue"
                  onClick={() => navigate(-1)}
                >
                  ← Back
                </Button>
                <Badge
                  variant={trip.status === "planning" ? "default" : "outline"}
                  className="ml-auto"
                >
                  {trip.status === "planning" ? "Open to Join" : "Confirmed"}
                </Badge>
                
                {isOwner && (
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => navigate(`/edit-trip/${trip.id}`)}
                    className="flex items-center gap-1"
                  >
                    <Edit className="h-4 w-4" /> Edit
                  </Button>
                )}
              </div>
              <h1 className="text-3xl font-bold mb-2">{trip.title}</h1>
              <div className="flex items-center gap-2 text-gray-600 mb-4">
                <MapPin className="h-5 w-5 text-triplink-teal" />
                <span>{trip.destination}</span>
              </div>
            </div>

            <div className="relative h-80 rounded-lg overflow-hidden mb-8">
              <img
                src={trip.image_url}
                alt={trip.title}
                className="w-full h-full object-cover"
              />
            </div>

            <Card className="mb-8">
              <CardHeader>
                <CardTitle>About this trip</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-5 w-5 text-triplink-teal" />
                    <div>
                      <div className="font-medium">Dates</div>
                      <div className="text-sm">
                        {new Date(trip.start_date).toLocaleDateString("en-US", {
                          day: "numeric",
                          month: "short",
                        })}{" "}
                        -{" "}
                        {new Date(trip.end_date).toLocaleDateString("en-US", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <DollarSign className="h-5 w-5 text-triplink-teal" />
                    <div>
                      <div className="font-medium">Budget</div>
                      <div className="text-sm">{trip.budget}</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Users className="h-5 w-5 text-triplink-teal" />
                    <div>
                      <div className="font-medium">Group Size</div>
                      <div className="text-sm">
                        {trip.current_travelers} of {trip.max_travelers} travelers
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="font-medium mb-2">Description</h3>
                  <p className="text-gray-600 mb-4">{trip.description}</p>

                  <h3 className="font-medium mb-2">Interests</h3>
                  <div className="flex flex-wrap gap-2">
                    {trip.interests && trip.interests.map((interest: string) => (
                      <Badge
                        key={interest}
                        variant="secondary"
                        className="bg-triplink-lightBlue text-triplink-darkBlue"
                      >
                        {interest}
                      </Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            <Tabs defaultValue="discussion">
              <TabsList className="mb-6">
                <TabsTrigger value="matches">Potential Matches</TabsTrigger>
                <TabsTrigger value="discussion">Discussion</TabsTrigger>
              </TabsList>

              <TabsContent value="matches">
                <div className="grid gap-6 md:grid-cols-2">
                  {matches.length > 0 ? (
                    matches.map((match) => (
                      <Card key={match.id}>
                        <CardHeader className="flex flex-row items-center gap-4 pb-2">
                          <Avatar className="h-12 w-12">
                            <AvatarImage src={match.avatar_url} alt={match.full_name} />
                            <AvatarFallback>
                              {match.full_name?.charAt(0) || 'T'}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <CardTitle className="text-lg">{match.full_name}</CardTitle>
                            <CardDescription>
                              {match.location} • {match.age}
                            </CardDescription>
                          </div>
                        </CardHeader>

                        <CardContent className="pb-2">
                          <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                            {match.bio || "No bio available"}
                          </p>

                          <div className="mb-2">
                            <span className="text-xs font-medium text-gray-500">
                              Interests
                            </span>
                            <div className="flex flex-wrap gap-1 mt-1">
                              {match.interests?.slice(0, 3).map((interest: string) => (
                                <Badge
                                  key={interest}
                                  variant="outline"
                                  className="text-xs"
                                >
                                  {interest}
                                </Badge>
                              ))}
                              {match.interests?.length > 3 && (
                                <span className="text-xs text-gray-500">
                                  +{match.interests.length - 3} more
                                </span>
                              )}
                            </div>
                          </div>
                        </CardContent>

                        <CardFooter className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            className="flex-1"
                            onClick={() => navigate(`/profile/${match.id}`)}
                          >
                            <User className="h-4 w-4 mr-2" /> View Profile
                          </Button>
                          <Button
                            size="sm"
                            className="flex-1 bg-triplink-teal hover:bg-triplink-darkBlue"
                            onClick={() => navigate(`/messages?user=${match.id}`)}
                          >
                            <MessageSquare className="h-4 w-4 mr-2" /> Message
                          </Button>
                        </CardFooter>
                      </Card>
                    ))
                  ) : (
                    <div className="col-span-2 text-center py-12">
                      <p className="text-gray-500 mb-2">
                        No matches found for this trip yet.
                      </p>
                      <p className="text-sm text-gray-400">
                        Check back later or adjust your trip preferences to find more matches.
                      </p>
                    </div>
                  )}
                </div>
              </TabsContent>

              <TabsContent value="discussion">
                <Card>
                  <CardHeader>
                    <CardTitle>Trip Discussion</CardTitle>
                    <CardDescription>
                      Ask questions and discuss details about this trip
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="mb-4 space-y-4">
                      {discussionMessages.length > 0 ? (
                        discussionMessages.map((message) => (
                          <div key={message.id} className="flex gap-3">
                            <Avatar className="h-8 w-8">
                              <AvatarImage 
                                src={message.sender.avatar_url} 
                                alt={message.sender.full_name} 
                              />
                              <AvatarFallback>
                                {message.sender.full_name?.charAt(0) || 'U'}
                              </AvatarFallback>
                            </Avatar>
                            <div className="flex-1">
                              <div className="flex justify-between items-center mb-1">
                                <h4 className="font-medium text-sm">
                                  {message.sender.full_name}
                                </h4>
                                <span className="text-xs text-gray-500">
                                  {new Date(message.created_at).toLocaleString()}
                                </span>
                              </div>
                              <p className="text-gray-700">{message.content}</p>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="p-4 bg-gray-50 rounded-lg text-center">
                          <p className="text-gray-500">
                            Be the first to start a conversation about this trip!
                          </p>
                        </div>
                      )}
                    </div>

                    {user ? (
                      <div className="border rounded-lg p-4">
                        <h4 className="font-medium mb-2">Post a message</h4>
                        <Textarea
                          placeholder="Ask a question or share your thoughts about this trip..."
                          value={messageText}
                          onChange={(e) => setMessageText(e.target.value)}
                          className="mb-4"
                        />
                        <div className="flex justify-end">
                          <Button
                            onClick={handleSendMessage}
                            className="bg-triplink-teal hover:bg-triplink-darkBlue"
                            disabled={!messageText.trim() || sendingMessage}
                          >
                            {sendingMessage ? (
                              "Sending..."
                            ) : (
                              <>
                                <Send className="mr-2 h-4 w-4" /> Send Message
                              </>
                            )}
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <div className="border rounded-lg p-4 text-center">
                        <p className="text-gray-500 mb-3">
                          Please sign in to join the conversation
                        </p>
                        <Button
                          onClick={() => navigate("/login")}
                          className="bg-triplink-teal hover:bg-triplink-darkBlue"
                        >
                          Sign In to Comment
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          {/* Host Info and Actions */}
          <div>
            <Card className="mb-6 sticky top-20">
              <CardHeader>
                <CardTitle>Trip Host</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-4 mb-4">
                  <Avatar className="h-14 w-14">
                    <AvatarImage src={host.avatar_url} alt={host.full_name} />
                    <AvatarFallback>{host.full_name?.charAt(0) || 'H'}</AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="font-medium">{host.full_name}</h3>
                    <p className="text-sm text-gray-500">{host.location || "No location set"}</p>
                  </div>
                </div>

                <p className="text-sm text-gray-600 mb-4">
                  Member since {memberSince} • 
                  {trip.current_travelers} traveler{trip.current_travelers !== 1 ? 's' : ''}
                </p>

                {!isOwner && (
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button className="w-full bg-triplink-coral hover:bg-triplink-coral/80">
                        Request to Join
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-md">
                      <DialogHeader>
                        <DialogTitle>Request to join this trip</DialogTitle>
                        <DialogDescription>
                          Send a message to {host.full_name} explaining why you'd like to join this trip
                        </DialogDescription>
                      </DialogHeader>
                      <Textarea
                        id="join-message"
                        placeholder="Introduce yourself and explain why you're interested in this trip..."
                        className="min-h-32"
                      />
                      <DialogFooter className="sm:justify-start">
                        <Button
                          type="button"
                          className="bg-triplink-teal hover:bg-triplink-darkBlue"
                          onClick={() => {
                            const messageEl = document.getElementById('join-message') as HTMLTextAreaElement;
                            handleJoinRequest(messageEl?.value || '');
                          }}
                        >
                          Send Request
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                )}

                <div className="mt-4 flex flex-col gap-2">
                  {!isOwner && (
                    <Button 
                      variant="outline" 
                      className="w-full"
                      onClick={() => navigate(`/messages?user=${host.id}`)}
                    >
                      <MessageSquare className="mr-2 h-4 w-4" /> Message Host
                    </Button>
                  )}
                  <Button
                    variant="ghost"
                    className="w-full"
                    onClick={() => navigate(`/profile/${host.id}`)}
                  >
                    <User className="mr-2 h-4 w-4" /> View Full Profile
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default TripDetails;
