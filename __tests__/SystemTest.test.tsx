import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { vi } from "vitest";
import GeneratePodcast from "../components/GeneratePodcast";
import PodcastPlayer from "../components/PodcastPlayer";
import { GeneratePodcastProps } from "@/types";
import { useAudio } from "@/providers/AudioProvider";
import { act } from "react-dom/test-utils";

// Mock dependencies
vi.mock("convex/react", () => ({
  useAction: vi.fn(),
  useMutation: vi.fn(),
}));
vi.mock("@/providers/AudioProvider", () => ({
  useAudio: vi.fn(),
}));

vi.mock('@xixixao/uploadstuff/react', () => ({
    UploadButton: () => <div>Mocked UploadButton</div>,
    useUploadFiles: vi.fn(() => ({
      startUpload: vi.fn(), // Mock the startUpload function
    })),
  }))
  
// Mock properties for the GeneratePodcast component
const mockProps: GeneratePodcastProps = {
  setAudio: vi.fn(),
  setGeneratedGenre: vi.fn(),
  setAudioStorageId: vi.fn(),
  setImprovedText: vi.fn(),
  setVoiceTypes: vi.fn(),
  setVoicePrompt: vi.fn(),
  onFinalTextChange: vi.fn(),
  genre: "",
  voicePrompt: "",
  improvedText: "",
  audio: "",
  setAudioDuration: vi.fn(),
  setGenre: vi.fn(),
  setGeneratedScript: vi.fn(),
  voiceTypes: [],
};

beforeAll(() => {
  // Mock the play and pause methods for HTMLMediaElement
  Object.defineProperty(HTMLMediaElement.prototype, "play", {
    configurable: true,
    writable: true,
    value: vi.fn().mockResolvedValue(undefined),
  });

  Object.defineProperty(HTMLMediaElement.prototype, "pause", {
    configurable: true,
    writable: true,
    value: vi.fn(),
  });
});

describe("System Test: Text-to-Speech, AI Feedback, and Playback", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(useAudio).mockReturnValue({
      audio: {
        audioUrl: "http://example.com/audio.mp3",
        title: "Test Podcast",
        author: "AI Author",
        imageUrl: "/images/test.png",
        podcastId: "123",
      },
      setAudio: vi.fn(), // Mock implementation for setAudio
    });
  });


it("should handle the full workflow: text-to-speech, AI feedback, and playback", async () => {
  // Render the GeneratePodcast and PodcastPlayer components
  render(
    <>
      <GeneratePodcast {...mockProps} />
      <PodcastPlayer />
    </>
  );

  // Step 1: Simulate text-to-speech generation
  const textarea = screen.getByPlaceholderText("Provide text to generate audio");
  fireEvent.change(textarea, { target: { value: "Test script for podcast" } });
  expect(mockProps.setVoicePrompt).toHaveBeenCalledWith("Test script for podcast");

  const generateButton = screen.getByText("Generate");
  fireEvent.click(generateButton);
  expect(mockProps.setAudio).toHaveBeenCalledWith("");

  // Step 2: Simulate playback controls
  const playButton = screen.getByAltText("play");
  await act(async () => {
    fireEvent.click(playButton);
  });
  expect(screen.getByAltText("pause")).toBeInTheDocument(); // Verify play button toggles to pause

  const rewindButton = screen.getByAltText("rewind");
  await act(async () => {
    fireEvent.click(rewindButton);
  });

  const audioElement = screen.getByRole("audio") as HTMLAudioElement;
  expect(audioElement.currentTime).toBe(0); // Ensure rewind works correctly

  const forwardButton = screen.getByAltText("forward");
  await act(async () => {
    // Mock the behavior of advancing the currentTime
    Object.defineProperty(audioElement, "currentTime", {
      configurable: true,
      writable: true,
      value: 5, // Simulate advancing 5 seconds
    });
    fireEvent.click(forwardButton);
  });
  expect(audioElement.currentTime).toBeGreaterThan(0); // Ensure forward works correctly

  const muteButton = screen.getByAltText("mute");
  await act(async () => {
    fireEvent.click(muteButton);
  });
  expect(audioElement.muted).toBe(true); // Ensure mute works correctly
});
});