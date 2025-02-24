import React, { useState, useEffect } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FormField, FormItem, FormLabel, FormMessage, FormControl } from "@/components/ui/form";
import { genres } from "@/constants"; 
import { cn } from "@/lib/utils";
import { useToast } from '@/hooks/use-toast';
import { fetchGenre } from '@/utils/genreUtils';

interface GenreSelectorProps {
  control: any;
  setGenre: (genre: string) => void;
  script: string;
}


const GenreSelector: React.FC<GenreSelectorProps> = ({ control, setGenre, script }) => {
  const [isFetching, setIsFetching] = useState(false);
  const { toast } = useToast();

  const fetchAndSetGenre = async (text: string) => {
    try {
      setIsFetching(true);
      const genre = await fetchGenre(text);
      setGenre(genre || genres[0]); 
      setIsFetching(false);
    } catch (error) {
      toast({
        title: "Error determining genre",
        variant: "destructive",
      });
      setIsFetching(false);
    }
  };

  useEffect(() => {
    if (!control.watch('podcastGenre') && script) {
      fetchAndSetGenre(script);
    }
  }, [script]);

  return (
    <FormField
      control={control}
      name="podcastGenre"
      render={({ field }) => (
        <FormItem className="flex flex-col gap-2.5">
          <FormLabel className="text-16 font-bold text-white-1">Genre</FormLabel>
          <FormControl>
            <Select onValueChange={(value) => field.onChange(value)}>
              <SelectTrigger className={cn('text-16 w-full border-none focus-visible:ring-offset-red-1 bg-black-1 text-gray-1')}>
                <SelectValue placeholder={isFetching ? "Determining genre..." : "Select Genre"} />
              </SelectTrigger>
              <SelectContent className="text-16 border-none bg-black-1 font-bold text-white-1 focus:ring-red-1">
                {genres.map((genre) => (
                  <SelectItem key={genre} value={genre} className="capitalize focus:bg-red-1">
                    {genre}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </FormControl>
          <FormMessage className="text-white-1" />
        </FormItem>
      )}
    />
  );
};

export default GenreSelector;
