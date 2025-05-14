
import { useParams, useNavigate } from "react-router-dom";
import { useState } from "react";
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
import { toast } from "@/hooks/use-toast";
import {
  Calendar,
  DollarSign,
  Users,
  MapPin,
  User,
  MessageSquare,
} from "lucide-react";
import { getTripById, getUserById, getMatchesForTrip } from "@/lib/data";

const TripDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [messageText, setMessageText] = useState("");

  const trip = id ? getTripById(id) : undefined;
  const host = trip ? getUserById(trip.userId) : undefined;
  const matches = trip ? getMatchesForTrip(trip) : [];

  const handleSendMessage = () => {
    if (messageText.trim()) {
      // In a real app, we'd send this message to an API
      toast({
        title: "Message sent!",
        description: "Your message has been sent to the trip host.",
      });
      setMessageText("");
    }
  };

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
              </div>
              <h1 className="text-3xl font-bold mb-2">{trip.title}</h1>
              <div className="flex items-center gap-2 text-gray-600 mb-4">
                <MapPin className="h-5 w-5 text-triplink-teal" />
                <span>{trip.destination}</span>
              </div>
            </div>

            <div className="relative h-80 rounded-lg overflow-hidden mb-8">
              <img
                src={trip.imageUrl}
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
                        {new Date(trip.startDate).toLocaleDateString("en-US", {
                          day: "numeric",
                          month: "short",
                        })}{" "}
                        -{" "}
                        {new Date(trip.endDate).toLocaleDateString("en-US", {
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
                        {trip.currentTravelers} of {trip.maxTravelers} travelers
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="font-medium mb-2">Description</h3>
                  <p className="text-gray-600 mb-4">{trip.description}</p>

                  <h3 className="font-medium mb-2">Interests</h3>
                  <div className="flex flex-wrap gap-2">
                    {trip.interests.map((interest) => (
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

            <Tabs defaultValue="matches">
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
                            <AvatarImage src={match.avatar} alt={match.name} />
                            <AvatarFallback>
                              {match.name.charAt(0)}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <CardTitle className="text-lg">{match.name}</CardTitle>
                            <CardDescription>
                              {match.location} • {match.age}
                            </CardDescription>
                          </div>
                        </CardHeader>

                        <CardContent className="pb-2">
                          <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                            {match.bio}
                          </p>

                          <div className="mb-2">
                            <span className="text-xs font-medium text-gray-500">
                              Interests
                            </span>
                            <div className="flex flex-wrap gap-1 mt-1">
                              {match.interests.slice(0, 3).map((interest) => (
                                <Badge
                                  key={interest}
                                  variant="outline"
                                  className="text-xs"
                                >
                                  {interest}
                                </Badge>
                              ))}
                              {match.interests.length > 3 && (
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
                    <div className="mb-4 p-4 bg-gray-50 rounded-lg">
                      <p className="text-gray-500 text-center">
                        Be the first to start a conversation about this trip!
                      </p>
                    </div>

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
                          disabled={!messageText.trim()}
                        >
                          <MessageSquare className="mr-2 h-4 w-4" /> Send Message
                        </Button>
                      </div>
                    </div>
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
                    <AvatarImage src={host.avatar} alt={host.name} />
                    <AvatarFallback>{host.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="font-medium">{host.name}</h3>
                    <p className="text-sm text-gray-500">{host.location}</p>
                  </div>
                </div>

                <p className="text-sm text-gray-600 mb-4">
                  Member since {host.memberSince} • {host.tripCount} trips
                </p>

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
                        Send a message to {host.name} explaining why you'd like to join this trip
                      </DialogDescription>
                    </DialogHeader>
                    <Textarea
                      placeholder="Introduce yourself and explain why you're interested in this trip..."
                      className="min-h-32"
                    />
                    <DialogFooter className="sm:justify-start">
                      <Button
                        type="button"
                        className="bg-triplink-teal hover:bg-triplink-darkBlue"
                        onClick={() => {
                          toast({
                            title: "Request sent!",
                            description: `Your request to join ${trip.title} has been sent to ${host.name}.`,
                          });
                        }}
                      >
                        Send Request
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>

                <div className="mt-4 flex flex-col gap-2">
                  <Button variant="outline" className="w-full">
                    <MessageSquare className="mr-2 h-4 w-4" /> Message Host
                  </Button>
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
