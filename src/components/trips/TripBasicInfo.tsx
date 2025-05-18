
import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import { Globe } from 'lucide-react';
import { TripFormValues } from './TripForm';
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

interface TripBasicInfoProps {
  form: UseFormReturn<TripFormValues>;
}

const TripBasicInfo = ({ form }: TripBasicInfoProps) => {
  return (
    <>
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
    </>
  );
};

export default TripBasicInfo;
