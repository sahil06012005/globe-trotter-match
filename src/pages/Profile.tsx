
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { useProfile, Profile } from "@/hooks/use-profile";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { CalendarIcon, MapPin, Globe, Upload, Edit, Save } from "lucide-react";

const Profile = () => {
  const { user } = useAuth();
  const { profile, updateProfile, uploadAvatar, isLoading: isProfileLoading } = useProfile();
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  
  const [isCurrentUser, setIsCurrentUser] = useState<boolean>(false);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [viewedProfile, setViewedProfile] = useState<Profile | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  
  const [formData, setFormData] = useState({
    full_name: "",
    username: "",
    bio: "",
    location: "",
    age: "",
    gender: "",
    interests: [] as string[],
    languages: [] as string[]
  });
  
  const [newInterest, setNewInterest] = useState("");
  const [newLanguage, setNewLanguage] = useState("");
  const [uploadingAvatar, setUploadingAvatar] = useState(false);

  useEffect(() => {
    // Check if viewing own profile or another user's
    if (user && id) {
      setIsCurrentUser(user.id === id);
    }

    // If we're viewing someone else's profile, fetch it
    if (id && id !== user?.id) {
      fetchUserProfile(id);
    } else if (profile) {
      // For own profile, use the data from the hook
      setViewedProfile(profile);
      setFormData({
        full_name: profile.full_name || "",
        username: profile.username || "",
        bio: profile.bio || "",
        location: profile.location || "",
        age: profile.age?.toString() || "",
        gender: profile.gender || "",
        interests: profile.interests || [],
        languages: profile.languages || []
      });
      setIsLoading(false);
    }
  }, [user, id, profile]);

  const fetchUserProfile = async (userId: string) => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", userId)
        .single();
      
      if (error) throw error;
      
      setViewedProfile(data);
      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching profile:", error);
      toast({
        title: "Error loading profile",
        description: "Unable to load this user's profile.",
        variant: "destructive"
      });
      navigate("/");
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const addInterest = () => {
    if (newInterest && !formData.interests.includes(newInterest)) {
      setFormData(prev => ({
        ...prev,
        interests: [...prev.interests, newInterest]
      }));
      setNewInterest("");
    }
  };

  const removeInterest = (interest: string) => {
    setFormData(prev => ({
      ...prev,
      interests: prev.interests.filter(i => i !== interest)
    }));
  };

  const addLanguage = () => {
    if (newLanguage && !formData.languages.includes(newLanguage)) {
      setFormData(prev => ({
        ...prev,
        languages: [...prev.languages, newLanguage]
      }));
      setNewLanguage("");
    }
  };

  const removeLanguage = (language: string) => {
    setFormData(prev => ({
      ...prev,
      languages: prev.languages.filter(l => l !== language)
    }));
  };

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    
    const file = e.target.files[0];
    const fileSize = file.size / 1024 / 1024; // size in MB
    
    if (fileSize > 2) {
      toast({
        title: "File too large",
        description: "Please select an image smaller than 2MB",
        variant: "destructive"
      });
      return;
    }
    
    setUploadingAvatar(true);
    
    try {
      await uploadAvatar(file);
    } finally {
      setUploadingAvatar(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isCurrentUser) return;
    
    try {
      const updates = {
        ...formData,
        age: formData.age ? parseInt(formData.age) : null,
        updated_at: new Date().toISOString()
      };
      
      await updateProfile(updates);
      setIsEditing(false);
    } catch (error) {
      console.error("Error updating profile:", error);
    }
  };

  if (isLoading || isProfileLoading) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-20 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-triplink-blue mx-auto"></div>
          <p className="mt-4">Loading profile...</p>
        </div>
      </Layout>
    );
  }

  const displayProfile = isCurrentUser ? profile : viewedProfile;

  if (!displayProfile) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-20 text-center">
          <h1 className="text-3xl font-bold mb-4">Profile not found</h1>
          <p className="mb-8">The user you're looking for doesn't exist or has been removed.</p>
          <Button onClick={() => navigate("/")}>Back to Home</Button>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-12">
        <Card className="mb-8">
          <CardHeader className="relative pb-0">
            {isCurrentUser && (
              <div className="absolute top-4 right-4 flex gap-2">
                {isEditing ? (
                  <Button 
                    onClick={() => setIsEditing(false)} 
                    variant="outline"
                    size="sm"
                  >
                    Cancel
                  </Button>
                ) : (
                  <Button 
                    onClick={() => setIsEditing(true)} 
                    variant="outline"
                    size="sm"
                    className="flex items-center gap-1"
                  >
                    <Edit className="h-4 w-4" /> Edit Profile
                  </Button>
                )}
              </div>
            )}

            <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
              <div className="relative">
                <Avatar className="h-24 w-24">
                  <AvatarImage src={displayProfile.avatar_url || undefined} />
                  <AvatarFallback className="text-2xl">
                    {displayProfile.full_name ? displayProfile.full_name.charAt(0).toUpperCase() : "U"}
                  </AvatarFallback>
                </Avatar>
                {isCurrentUser && isEditing && (
                  <div className="absolute bottom-0 right-0">
                    <label 
                      htmlFor="avatar-upload" 
                      className="rounded-full bg-triplink-teal p-2 text-white cursor-pointer hover:bg-triplink-darkBlue"
                    >
                      {uploadingAvatar ? (
                        <div className="h-4 w-4 animate-spin rounded-full border-2 border-t-transparent" />
                      ) : (
                        <Upload className="h-4 w-4" />
                      )}
                    </label>
                    <input 
                      id="avatar-upload" 
                      type="file" 
                      accept="image/*"
                      className="hidden"
                      onChange={handleAvatarUpload}
                      disabled={uploadingAvatar}
                    />
                  </div>
                )}
              </div>
              
              <div className="flex-1">
                <CardTitle className="text-2xl">
                  {isEditing ? (
                    <Input 
                      name="full_name"
                      value={formData.full_name}
                      onChange={handleChange}
                      className="text-2xl font-bold"
                      placeholder="Your name"
                    />
                  ) : (
                    displayProfile.full_name || "Unnamed Traveler"
                  )}
                </CardTitle>
                
                {isEditing ? (
                  <div className="mt-2">
                    <Label htmlFor="username" className="text-sm text-gray-500">Username</Label>
                    <div className="flex items-center">
                      <span className="text-gray-500 mr-1">@</span>
                      <Input 
                        id="username"
                        name="username"
                        value={formData.username || ""}
                        onChange={handleChange}
                        className="text-sm"
                        placeholder="username"
                      />
                    </div>
                  </div>
                ) : (
                  displayProfile.username && (
                    <CardDescription className="mt-1">
                      @{displayProfile.username}
                    </CardDescription>
                  )
                )}
                
                <div className="flex flex-wrap gap-4 mt-3">
                  {isEditing ? (
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-gray-500" />
                      <Input 
                        name="location"
                        value={formData.location || ""}
                        onChange={handleChange}
                        className="text-sm"
                        placeholder="Your location"
                      />
                    </div>
                  ) : (
                    displayProfile.location && (
                      <div className="flex items-center gap-2 text-gray-600">
                        <MapPin className="h-4 w-4 text-triplink-teal" />
                        <span>{displayProfile.location}</span>
                      </div>
                    )
                  )}
                  
                  {isEditing ? (
                    <div className="flex items-center gap-2">
                      <CalendarIcon className="h-4 w-4 text-gray-500" />
                      <Input 
                        name="age"
                        type="number"
                        value={formData.age || ""}
                        onChange={handleChange}
                        className="text-sm w-24"
                        placeholder="Age"
                      />
                    </div>
                  ) : (
                    displayProfile.age && (
                      <div className="flex items-center gap-2 text-gray-600">
                        <CalendarIcon className="h-4 w-4 text-triplink-teal" />
                        <span>{displayProfile.age} years old</span>
                      </div>
                    )
                  )}
                </div>
              </div>
            </div>
          </CardHeader>

          <CardContent className="pt-6">
            {isEditing ? (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="bio">Bio</Label>
                  <Textarea
                    id="bio"
                    name="bio"
                    value={formData.bio || ""}
                    onChange={handleChange}
                    placeholder="Tell us about yourself and your travel style..."
                    rows={4}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="gender">Gender</Label>
                  <Input
                    id="gender"
                    name="gender"
                    value={formData.gender || ""}
                    onChange={handleChange}
                    placeholder="Male, Female, Non-binary, etc."
                  />
                </div>

                <div className="space-y-2">
                  <Label>Interests</Label>
                  <div className="flex flex-wrap gap-2 mb-2">
                    {formData.interests.map((interest, index) => (
                      <Badge key={index} variant="secondary" className="flex items-center gap-1">
                        {interest}
                        <button
                          type="button"
                          className="ml-1 text-gray-500 hover:text-gray-700"
                          onClick={() => removeInterest(interest)}
                        >
                          ×
                        </button>
                      </Badge>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <Input
                      value={newInterest}
                      onChange={(e) => setNewInterest(e.target.value)}
                      placeholder="Add interest (e.g. Hiking, Photography)"
                    />
                    <Button type="button" onClick={addInterest} variant="outline">Add</Button>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Languages</Label>
                  <div className="flex flex-wrap gap-2 mb-2">
                    {formData.languages.map((language, index) => (
                      <Badge key={index} variant="outline" className="flex items-center gap-1">
                        {language}
                        <button
                          type="button"
                          className="ml-1 text-gray-500 hover:text-gray-700"
                          onClick={() => removeLanguage(language)}
                        >
                          ×
                        </button>
                      </Badge>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <Input
                      value={newLanguage}
                      onChange={(e) => setNewLanguage(e.target.value)}
                      placeholder="Add language (e.g. English, Spanish)"
                    />
                    <Button type="button" onClick={addLanguage} variant="outline">Add</Button>
                  </div>
                </div>

                <div className="flex justify-end">
                  <Button type="submit" className="bg-triplink-teal hover:bg-triplink-darkBlue flex items-center gap-1">
                    <Save className="h-4 w-4" /> Save Changes
                  </Button>
                </div>
              </form>
            ) : (
              <div className="space-y-6">
                {displayProfile.bio && (
                  <div>
                    <h3 className="text-lg font-medium mb-2">About</h3>
                    <p className="text-gray-600">{displayProfile.bio}</p>
                  </div>
                )}
                
                <Separator />
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {displayProfile.interests && displayProfile.interests.length > 0 && (
                    <div>
                      <h3 className="text-lg font-medium mb-3">Interests</h3>
                      <div className="flex flex-wrap gap-2">
                        {displayProfile.interests.map((interest, index) => (
                          <Badge key={index} variant="secondary" className="bg-triplink-lightBlue text-triplink-darkBlue">
                            {interest}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {displayProfile.languages && displayProfile.languages.length > 0 && (
                    <div>
                      <h3 className="text-lg font-medium mb-3">Languages</h3>
                      <div className="flex flex-wrap gap-2">
                        {displayProfile.languages.map((language, index) => (
                          <Badge key={index} variant="outline">
                            {language}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <Tabs defaultValue="trips">
          <TabsList className="mb-8">
            <TabsTrigger value="trips">Trips</TabsTrigger>
            <TabsTrigger value="reviews">Reviews</TabsTrigger>
          </TabsList>
          
          <TabsContent value="trips">
            <div className="text-center py-16">
              <Globe className="mx-auto h-12 w-12 text-gray-300" />
              <h3 className="text-xl font-medium mt-4 mb-2">No trips yet</h3>
              {isCurrentUser ? (
                <>
                  <p className="text-gray-500 mb-6">Create your first trip and find travel companions</p>
                  <Button onClick={() => navigate("/create-trip")} className="bg-triplink-teal hover:bg-triplink-darkBlue">
                    Create a Trip
                  </Button>
                </>
              ) : (
                <p className="text-gray-500">This user hasn't created any trips yet</p>
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="reviews">
            <div className="text-center py-16">
              <h3 className="text-xl font-medium mb-2">No reviews yet</h3>
              <p className="text-gray-500">Reviews will appear here after traveling with others</p>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default Profile;
