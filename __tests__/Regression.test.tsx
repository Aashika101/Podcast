import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, Mock } from 'vitest';
import GeneratePodcast from '../components/GeneratePodcast';
import GeneratePodcastScript from '../components/GeneratePodcastScript';
import { GeneratePodcastProps } from '@/types';
import { generatePodcastScript } from '@/convex/googleGenerativeAI';
import { ConvexProvider, ConvexReactClient } from 'convex/react';

// Mock Convex client
const mockConvexClient = new ConvexReactClient('http://localhost:3000');

// Mock dependencies
vi.mock('@/convex/googleGenerativeAI', () => ({
  generatePodcastScript: vi.fn(),
}));

vi.mock('@xixixao/uploadstuff/react', () => ({
  UploadButton: () => <div>Mocked UploadButton</div>,
  useUploadFiles: vi.fn(() => ({
    startUpload: vi.fn(), // Mock the startUpload function
  })),
}));

const mockProps: GeneratePodcastProps = {
  setAudio: vi.fn(),
  setGeneratedGenre: vi.fn(),
  setAudioStorageId: vi.fn(),
  setImprovedText: vi.fn(),
  setVoiceTypes: vi.fn(),
  setVoicePrompt: vi.fn(),
  onFinalTextChange: vi.fn(),
  genre: '',
  voicePrompt: '',
  improvedText: '',
  audio: '',
  setAudioDuration: vi.fn(),
  setGenre: vi.fn(),
  setGeneratedScript: vi.fn(),
  voiceTypes: [],
};

describe('Integration Test: GeneratePodcast and GeneratePodcastScript', () => {
  it('should generate a podcast script and set it in GeneratePodcast', async () => {
    const mockGeneratedScript = 'Generated podcast script';
    (generatePodcastScript as Mock).mockResolvedValue(mockGeneratedScript);

    render(
      <ConvexProvider client={mockConvexClient}>
        <GeneratePodcastScript setGeneratedScript={mockProps.setGeneratedScript} />
        <GeneratePodcast {...mockProps} />
      </ConvexProvider>
    );

    // Simulate entering a prompt and generating a script
    const scriptInput = screen.getByPlaceholderText('Enter prompt for podcast script');
    fireEvent.change(scriptInput, { target: { value: 'Test prompt' } });

    const generateButton = screen.getByText('Generate Podcast Script');
    fireEvent.click(generateButton);

    await waitFor(() => {
      expect(generatePodcastScript).toHaveBeenCalledWith('Test prompt');
      expect(mockProps.setGeneratedScript).toHaveBeenCalledWith(mockGeneratedScript);
    });

    // Verify that the generated script is displayed in the GeneratePodcast component
    expect(screen.getByDisplayValue(mockGeneratedScript)).toBeInTheDocument();
  });
});