"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Link, Loader } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue, } from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import GeneratePodcast from "@/components/GeneratePodcast";
import GenerateThumbnail from "@/components/GenerateThumbnail";
import { Id } from "@/convex/_generated/dataModel";
import { genres, getVoicesForGenre } from "@/constants";
import { useToast } from "@/hooks/use-toast";
import { Authenticated, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useRouter } from "next/navigation";

const formSchema = z.object({
  podcastTitle: z.string().min(2),
  podcastDescription: z.string().min(2),
});

const CreatePodcast = () => {
  const router = useRouter();
  const [imagePrompt, setImagePrompt] = useState('');
  const [imageStorageId, setImageStorageId] = useState<Id<"_storage"> | null>(null);
  const [imageUrl, setImageUrl] = useState('');
  const [audioUrl, setAudioUrl] = useState('');
  const [audioStorageId, setAudioStorageId] = useState<Id<"_storage"> | null>(null);
  const [audioDuration, setAudioDuration] = useState(0);
  const [voicePrompt, setVoicePrompt] = useState('');
  const [improvedText, setImprovedText] = useState('');
  const [genre, setGenre] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [generatedScript, setGeneratedScript] = useState('');
  const [generatedGenre, setGeneratedGenre] = useState('');
  const [generatedText, setGeneratedText] = useState('');
  

  const createPodcast = useMutation(api.podcasts.createPodcast);

  const { toast } = useToast();

  // Define your form
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      podcastTitle: "",
      podcastDescription: "",
    },
  });

  // Define a submit handler
  async function onSubmit(data: z.infer<typeof formSchema>) {
    try {
      console.log("Form data received:", data);
      setIsSubmitting(true);

      // Validate required fields
      if (!data.podcastTitle || !data.podcastDescription) {
        console.log("Validation error: Missing required fields.");
        toast({
          title: "Validation Error",
          description: "Please fill in all required fields.",
          variant: "destructive",
        });
        setIsSubmitting(false);
        return;
      }
      if (!audioUrl || !audioStorageId) {
        console.log("Validation error: Please generate and upload the podcast audio.");
        toast({
          title: "Validation Error",
          description: "Please generate and upload the podcast audio.",
          variant: "destructive",
        });
        setIsSubmitting(false);
        return;
      }
      if (!imageUrl || !imageStorageId) {
        console.log("Validation error: Please generate and upload the podcast thumbnail.");
        toast({
          title: "Validation Error",
          description: "Please generate and upload the podcast thumbnail.",
          variant: "destructive",
        });
        setIsSubmitting(false);
        return;
      }

      console.log("Submitting data:", {
        podcastTitle: data.podcastTitle,
        podcastDescription: data.podcastDescription,
        audioUrl,
        imageUrl,
        imagePrompt: imagePrompt || '',
        audioDuration,
        finalText: generatedText,
        voicePrompt,
        views: 0,
        audioStorageId: audioStorageId!,
        imageStorageId: imageStorageId!,
        voiceTypes: genre ? getVoicesForGenre(genre) : [],
      });

      console.log("reached bloody here");
      const podcast = await createPodcast({
        podcastTitle: data.podcastTitle,
        podcastDescription: data.podcastDescription,
        audioUrl,
        imageUrl,
        imagePrompt: imagePrompt || '',
        audioDuration,
        finalText: generatedText,
        voicePrompt,
        views: 0,
        audioStorageId: audioStorageId!,
        imageStorageId: imageStorageId!,
        voiceTypes: genre ? getVoicesForGenre(genre) : [],
        podcastGenre: generatedGenre,
      });

      console.log("Podcast created:", podcast);

      toast({
        title: "Success",
        description: "Podcast created successfully.",
      });
      setIsSubmitting(false);
      router.push('/');
      console.log("Form passed validation.");

    } catch (error) {
      console.error("Error submitting podcast:", error);
      toast({
        title: "Submission Error",
        description: (error as any).message || "An error occurred while submitting the podcast.",
        variant: "destructive",
      });
      setIsSubmitting(false);
    }
  }
  
  // Automatically select the voices based on the genre
  const selectedVoices = genre ? getVoicesForGenre(genre) : [];

  function setVoiceTypes(voices: string[]): void {
    // Do not modify the voicePrompt state here
  }

  return (
    <section className="mt-10 flex flex-col">
      <h1 className='text-20 font-bold text-white-1'>Create Podcast</h1>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="mt-12 flex w-full flex-col">
          <div className="flex flex-col gap-[30px] border-b border-black-5 pb-10">
            <FormField control={form.control} name="podcastTitle" render={({ field }) => (
              <FormItem className="flex flex-col gap-2.5">
                <FormLabel className="text-16 font-bold text-white-1">Title</FormLabel>
                <FormControl>
                  <Input className="input-class focus-visible:ring-red-1" placeholder="Selfcare Podcast" autoComplete="off" {...field} />
                </FormControl>
                <FormMessage className="text-white-1" />
              </FormItem>
            )} />
            <FormField control={form.control} name="podcastDescription" render={({ field }) => (
              <FormItem className="flex flex-col gap-2.5">
                <FormLabel className="text-16 font-bold text-white-1">Description</FormLabel>
                <FormControl>
                  <Textarea className="input-class focus-visible:ring-red-1" placeholder="Write a short podcast description" {...field} />
                </FormControl>
                <FormMessage className="text-white-1" />
              </FormItem>
            )} />
            {/* <FormField control={form.control} name="podcastGenre" render={({ field }) => (
              <FormItem className="flex flex-col gap-2.5">
                <FormLabel className="text-16 font-bold text-white-1">Genre</FormLabel>
                <FormControl>
                  <Select onValueChange={(value) => { field.onChange(value); setGenre(value); }}>
                    <SelectTrigger className={cn('text-16 w-full border-none focus-visible:ring-offset-red-1 bg-black-1 text-gray-1')}>
                      <SelectValue placeholder="Select Genre" />
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
            )} /> */}
          </div>
          <div className="flex flex-col pt-5">
            <GeneratePodcast
              setAudioStorageId={setAudioStorageId}
              setAudio={setAudioUrl}
              voiceTypes={selectedVoices}
              audio={audioUrl}
              voicePrompt={voicePrompt}
              setVoicePrompt={setVoicePrompt}
              setAudioDuration={setAudioDuration}
              improvedText={improvedText}
              setImprovedText={setImprovedText}
              setGenre={setGenre}
              setVoiceTypes={setVoiceTypes}
              setGeneratedScript={setGeneratedScript}
              onFinalTextChange={setGeneratedText}
              setGeneratedGenre={setGeneratedGenre}
            />
            <GenerateThumbnail
              setImage={setImageUrl}
              setImageStorageId={setImageStorageId}
              image={imageUrl}
              imagePrompt={imagePrompt}
              setImagePrompt={setImagePrompt}
            />
            <div className="mt-10 w-full">
              <Button type="submit" className="text-16 w-full bg-red-1 py-4 font-extrabold text-black-1 transition-all duration-500 hover:bg-red-600">
                {isSubmitting ? (
                  <>
                    Submitting
                    <Loader size={20} className="animate-spin ml-2" />
                  </>
                ) : (
                  'Submit and Publish Podcast'
                )}
              </Button>
            </div> 
          </div>
        </form>
      </Form>
    </section>
  );
};

export default CreatePodcast;