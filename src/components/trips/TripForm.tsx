
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/hooks/use-toast';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import TripBasicInfo from './TripBasicInfo';
import TripDateSelection from './TripDateSelection';
import TripDetails from './TripDetails';
import TripInterests from './TripInterests';
import { tripFormSchema } from '@/utils/trip-constants';

export type TripFormValues = z.infer<typeof tripFormSchema>;

const TripForm = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  
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
        title: data.title,
        destination: data.destination,
        description: data.description,
        start_date: format(data.startDate, 'yyyy-MM-dd'),
        end_date: format(data.endDate, 'yyyy-MM-dd'),
        user_id: user.id,
        max_travelers: data.maxTravelers,
        budget: data.budget,
        interests: data.interests,
        current_travelers: 1, // The trip creator is the first traveler
        status: 'planning',
      };
      
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
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <TripBasicInfo form={form} />
        <TripDateSelection form={form} />
        <TripDetails form={form} />
        <TripInterests form={form} />
        
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
  );
};

export default TripForm;
