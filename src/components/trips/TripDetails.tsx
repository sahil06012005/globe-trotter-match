
import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import { TripFormValues } from './TripForm';
import { budgetOptions } from '@/utils/trip-constants';
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface TripDetailsProps {
  form: UseFormReturn<TripFormValues>;
}

const TripDetails = ({ form }: TripDetailsProps) => {
  return (
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
  );
};

export default TripDetails;
