
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/hooks/use-toast';
import Layout from '@/components/layout/Layout';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { 
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { Badge } from '@/components/ui/badge';
import { CalendarIcon, Globe, X } from 'lucide-react';
import { cn } from '@/lib/utils';

// Available interests for trips
const availableInterests = [
  'Adventure', 'Art', 'Beach', 'Camping', 'City Exploration',
  'Culture', 'Cuisine', 'Diving', 'Festivals', 'Hiking',
  'History', 'Local Experience', 'Luxury', 'Mountains', 'Museums',
  'Music', 'Nature', 'Nightlife', 'Photography', 'Relaxation',
  'Road Trip', 'Shopping', 'Sightseeing', 'Solo Travel', 'Sports',
  'Study', 'Trekking', 'Volunteering', 'Wellness', 'Wildlife',
  'Winter Sports', 'Work Retreat', 'Yoga'
];

// Budget options
const budgetOptions = [
  'Budget',
  'Mid-range',
  'Mid-range to High',
  'Mid-range to Luxury',
  'Luxury'
];

// Form schema definition
const tripFormSchema = z.object({
  title: z.string().min(5, 'Title must be at least 5 characters'),
  destination: z.string().min(3, 'Destination must be at least 3 characters'),
  description: z.string().min(20, 'Description must be at least 20 characters'),
  startDate: z.date({
    required_error: "Start date is required",
  }),
  endDate: z.date({
    required_error: "End date is required",
  }),
  maxTravelers: z.coerce
    .number()
    .min(2, 'Need at least 2 travelers')
    .max(20, 'Maximum 20 travelers allowed'),
  budget: z.string({
    required_error: "Budget category is required",
  }),
  interests: z.array(z.string()).min(1, 'Select at least one interest'),
});

type TripFormValues = z.infer<typeof tripFormSchema>;

const CreateTrip = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [interestSearch, setInterestSearch] = useState('');
  
  // Initialize form
  const form = useForm<TripFormValues>({
    resolver: zodResolver(tripFormSchema),
    defaultValues: {
      title: '',
      destination: '',
      description: '',
      maxTravelers: 2,
      budget: '',
      interests: [],
    },
  });
  
  // Filter interests based on search
  const filteredInterests = availableInterests.filter(interest => 
    interest.toLowerCase().includes(interestSearch.toLowerCase())
  );
  
  // Handle interest selection/deselection
  const toggleInterest = (interest: string) => {
    const currentInterests = form.getValues('interests');
    if (currentInterests.includes(interest)) {
      form.setValue(
        'interests', 
        currentInterests.filter(i => i !== interest),
        { shouldValidate: true }
      );
    } else {
      form.setValue(
        'interests', 
        [...currentInterests, interest],
        { shouldValidate: true }
      );
    }
  };
  
  // Handle form submission
  const onSubmit = async (data: TripFormValues) => {
    if (!user) {
      toast({
        title: "Authentication Error",
        description: "You must be logged in to create a trip",
        variant: "destructive",
      });
      return;
    }
    
    setIsLoading(true);
    
    try {
      // Format dates for database storage
      const formattedData = {
        ...data,
        start_date: format(data.startDate, 'yyyy-MM-dd'),
        end_date: format(data.endDate, 'yyyy-MM-dd'),
        user_id: user.id,
        current_travelers: 1, // The trip creator is the first traveler
        status: 'planning',
      };
      
      // Remove frontend-only fields
      delete (formattedData as any).startDate;
      delete (formattedData as any).endDate;
      
      // Insert into database
      const { data: trip, error } = await supabase
        .from('trips')
        .insert(formattedData)
        .select()
        .single();
      
      if (error) throw error;
      
      toast({
        title: "Trip Created",
        description: "Your trip was successfully created!",
      });
      
      // Navigate to the new trip page
      navigate(`/trips/${trip.id}`);
    } catch (error: any) {
      console.error('Error creating trip:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to create trip. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8 mt-16 max-w-3xl">
        <h1 className="text-3xl font-bold mb-6">Create a Trip</h1>
        
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {/* Trip Title */}
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Trip Title</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="Give your trip a catchy title" 
                        {...field} 
                      />
                    </FormControl>
                    <FormDescription>
                      E.g., "Weekend Getaway to the Mountains" or "European Summer Adventure"
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              {/* Destination */}
              <FormField
                control={form.control}
                name="destination"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Destination</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Globe className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                        <Input 
                          placeholder="Where are you going?" 
                          className="pl-10"
                          {...field} 
                        />
                      </div>
                    </FormControl>
                    <FormDescription>
                      City, country, or region
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              {/* Trip Description */}
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Trip Description</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Tell potential travelers about your trip plans, activities, and what you're looking for in travel companions" 
                        className="min-h-32"
                        {...field} 
                      />
                    </FormControl>
                    <FormDescription>
                      Be specific about your expectations, planned activities, and what you're looking for in travel companions
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              {/* Date Range */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="startDate"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Start Date</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant={"outline"}
                              className={cn(
                                "pl-3 text-left font-normal",
                                !field.value && "text-muted-foreground"
                              )}
                            >
                              {field.value ? (
                                format(field.value, "PPP")
                              ) : (
                                <span>Pick a date</span>
                              )}
                              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={field.onChange}
                            disabled={(date) => date < new Date()}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="endDate"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>End Date</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant={"outline"}
                              className={cn(
                                "pl-3 text-left font-normal",
                                !field.value && "text-muted-foreground"
                              )}
                            >
                              {field.value ? (
                                format(field.value, "PPP")
                              ) : (
                                <span>Pick a date</span>
                              )}
                              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={field.onChange}
                            disabled={(date) => {
                              const startDate = form.getValues("startDate");
                              return date < (startDate || new Date());
                            }}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              {/* Travel Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="maxTravelers"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Maximum Travelers</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          min={2} 
                          max={20} 
                          {...field} 
                        />
                      </FormControl>
                      <FormDescription>
                        Including yourself
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="budget"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Budget Category</FormLabel>
                      <Select 
                        onValueChange={field.onChange} 
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select budget range" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {budgetOptions.map(option => (
                            <SelectItem key={option} value={option}>
                              {option}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormDescription>
                        Give potential companions an idea of the trip's cost
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              {/* Interests */}
              <FormField
                control={form.control}
                name="interests"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Trip Interests</FormLabel>
                    <FormDescription className="mt-0 mb-3">
                      Select interests that match your trip plans (this helps find compatible travel companions)
                    </FormDescription>
                    
                    {/* Show selected interests */}
                    <div className="flex flex-wrap gap-2 mb-3">
                      {field.value.map(interest => (
                        <Badge 
                          key={interest} 
                          variant="default"
                          className="bg-triplink-teal hover:bg-triplink-teal/80 px-3 py-1"
                        >
                          {interest}
                          <X 
                            className="ml-1 h-3 w-3 cursor-pointer" 
                            onClick={() => toggleInterest(interest)}
                          />
                        </Badge>
                      ))}
                    </div>
                    
                    {/* Search and select interests */}
                    <div className="border rounded-md">
                      <Input 
                        placeholder="Search for interests..." 
                        value={interestSearch}
                        onChange={(e) => setInterestSearch(e.target.value)}
                        className="border-0 border-b rounded-t-md rounded-b-none focus-visible:ring-0"
                      />
                      
                      <div className="p-2 max-h-40 overflow-y-auto">
                        <div className="flex flex-wrap gap-2">
                          {filteredInterests.map(interest => (
                            <Badge 
                              key={interest}
                              variant={field.value.includes(interest) ? "default" : "outline"}
                              className={`cursor-pointer px-2 py-1 text-xs ${
                                field.value.includes(interest) 
                                  ? "bg-triplink-teal hover:bg-triplink-teal/80" 
                                  : "hover:bg-triplink-teal/10"
                              }`}
                              onClick={() => toggleInterest(interest)}
                            >
                              {interest}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              {/* Submit Button */}
              <Button 
                type="submit" 
                className="w-full bg-triplink-teal hover:bg-triplink-darkBlue"
                disabled={isLoading}
              >
                {isLoading ? "Creating Trip..." : "Create Trip"}
              </Button>
            </form>
          </Form>
        </div>
      </div>
    </Layout>
  );
};

export default CreateTrip;
