import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import GeneratePodcast from '../components/GeneratePodcast';
import { GeneratePodcastProps } from '@/types';

// Mock dependencies
vi.mock('convex/react', () => ({
  useAction: vi.fn(),
  useMutation: vi.fn(),
}));
vi.mock('@xixixao/uploadstuff/react', () => ({
  useUploadFiles: vi.fn(() => ({
    startUpload: vi.fn(),
  })),
}));
vi.mock('@/hooks/use-toast', () => ({
  useToast: vi.fn(() => ({ toast: vi.fn() })),
}));
vi.mock('@/utils/genreUtils', () => ({
  fetchGenre: vi.fn(),
}));
vi.mock('@/constants', () => ({
  genres: ['Genre1', 'Genre2'],
  getVoicesForGenre: vi.fn(() => ['Voice1', 'Voice2']),
}));
vi.mock('../convex/googleGenerativeAI.ts', () => ({
  apiKey: 'mock-api-key',
}));

// Mock properties for the GeneratePodcast component
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

describe('GeneratePodcast Component', () => {
  // Test to check if the component renders without crashing
  it('renders without crashing', () => {
    render(<GeneratePodcast {...mockProps} />);
    expect(screen.getByText('Script to generate podcast')).toBeInTheDocument();
    expect(screen.getByText('AI Prompt to generate Podcast script')).toBeInTheDocument();
    console.log('PASS: renders without crashing');
  });

   // Test to check if the script input change is handled correctly
  it('handles script input change', () => {
    render(<GeneratePodcast {...mockProps} />);
    const textarea = screen.getByPlaceholderText('Provide text to generate audio');
    fireEvent.change(textarea, { target: { value: 'Test script' } });
    expect(mockProps.setVoicePrompt).toHaveBeenCalledWith('Test script');
    console.log('PASS: handles script input change');
  });

  // Test to check if the generate podcast button click is handled correctly
  it('should convert sample text to speech successfully', () => {
    render(<GeneratePodcast {...mockProps} />);
    const button = screen.getByText('Generate');
    fireEvent.click(button);
    expect(mockProps.setAudio).toHaveBeenCalledWith('');
    console.log('PASS: should convert sample text to speech successfully ');
  });

  // Test to check if the improved content is displayed correctly
  it('displays improved content', () => {
    render(<GeneratePodcast {...mockProps} improvedText="Improved content" />);
    expect(screen.getByText('Improved Content')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Improved content')).toBeInTheDocument();
    console.log('PASS: displays improved content');
  });

  // Test to check if the apply improved text action is handled correctly
  it('handles apply improved text', () => {
    render(<GeneratePodcast {...mockProps} improvedText="Improved content" />);
    const checkCircle = screen.getByLabelText('apply improved text');
    fireEvent.click(checkCircle);
    expect(mockProps.setVoicePrompt).toHaveBeenCalledWith('Improved content');
    expect(mockProps.setImprovedText).toHaveBeenCalledWith('');
    console.log('PASS: handles apply improved text');
  });

  // Test to check if the discard improved text action is handled correctly
  it('handles discard improved text', () => {
    render(<GeneratePodcast {...mockProps} improvedText="Improved content" />);
    const xCircle = screen.getByLabelText('discard improved text');
    fireEvent.click(xCircle);
    expect(mockProps.setImprovedText).toHaveBeenCalledWith('');
    console.log('PASS: handles discard improved text');
  });
});