
import React, { useState } from 'react';
import { UseFormReturn } from 'react-hook-form';
import { X } from 'lucide-react';
import { TripFormValues } from './TripForm';
import { availableInterests } from '@/utils/trip-constants';
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';

interface TripInterestsProps {
  form: UseFormReturn<TripFormValues>;
}

const TripInterests = ({ form }: TripInterestsProps) => {
  const [interestSearch, setInterestSearch] = useState('');
  
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

  return (
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
  );
};

export default TripInterests;
