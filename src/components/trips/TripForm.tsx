
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { Form } from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import TripBasicInfo from './TripBasicInfo';
import TripDateSelection from './TripDateSelection';
import TripDetails from './TripDetails';
import TripInterests from './TripInterests';
import TripImageUpload from './TripImageUpload';
import { tripFormSchema } from '@/utils/trip-constants';

export type TripFormValues = z.infer<typeof tripFormSchema>;

interface TripFormProps {
  mode?: 'create' | 'edit';
  tripId?: string;
  defaultValues?: TripFormValues;
  currentImageUrl?: string;
}

const TripForm = ({ 
  mode = 'create', 
  tripId, 
  defaultValues,
  currentImageUrl = ''
}: TripFormProps) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [imageUrl, setImageUrl] = useState<string>(currentImageUrl);
  
  // Initialize form
  const form = useForm<TripFormValues>({
    resolver: zodResolver(tripFormSchema),
    defaultValues: defaultValues || {
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
        // Use the uploaded image or fall back to unsplash image or current image
        image_url: imageUrl || (mode === 'edit' ? currentImageUrl : `https://source.unsplash.com/800x600/?${encodeURIComponent(data.destination)}`)
      };

      let trip;
      
      if (mode === 'create') {
        // Insert new trip into database
        const { data: newTrip, error } = await supabase
          .from('trips')
          .insert({
            ...formattedData,
            current_travelers: 1, // The trip creator is the first traveler
            status: 'planning',
          })
          .select()
          .single();
        
        if (error) throw error;
        trip = newTrip;
        
        toast({
          title: "Trip Created",
          description: "Your trip was successfully created!",
        });
      } else {
        // Update existing trip
        if (!tripId) throw new Error("Trip ID is required for updates");
        
        const { data: updatedTrip, error } = await supabase
          .from('trips')
          .update(formattedData)
          .eq('id', tripId)
          .eq('user_id', user.id) // Ensure user owns this trip
          .select()
          .single();
        
        if (error) throw error;
        trip = updatedTrip;
        
        toast({
          title: "Trip Updated",
          description: "Your trip was successfully updated!",
        });
      }
      
      // Navigate to the trip page
      navigate(`/trips/${trip.id}`);
    } catch (error: any) {
      console.error('Error with trip:', error);
      toast({
        title: `Error ${mode === 'create' ? 'Creating' : 'Updating'} Trip`,
        description: error.message || `Failed to ${mode === 'create' ? 'create' : 'update'} trip. Please try again.`,
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
        <TripImageUpload onChange={setImageUrl} value={imageUrl} />
        <TripDateSelection form={form} />
        <TripDetails form={form} />
        <TripInterests form={form} />
        
        {/* Submit Button */}
        <Button 
          type="submit" 
          className="w-full bg-triplink-teal hover:bg-triplink-darkBlue text-white"
          disabled={isLoading}
        >
          {isLoading 
            ? (mode === 'create' ? "Creating Trip..." : "Updating Trip...") 
            : (mode === 'create' ? "Create Trip" : "Update Trip")
          }
        </Button>
      </form>
    </Form>
  );
};

export default TripForm;
