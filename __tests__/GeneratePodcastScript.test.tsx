import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, expect, it, vi, Mock } from 'vitest';
import GeneratePodcastScript from '../components/GeneratePodcastScript';
import { generatePodcastScript } from '@/convex/googleGenerativeAI';

// Mock the generatePodcastScript function
vi.mock('@/convex/googleGenerativeAI', () => ({
  generatePodcastScript: vi.fn(),
}));

describe('GeneratePodcastScript Component', () => {
  it('renders without crashing', () => {
    render(<GeneratePodcastScript setGeneratedScript={vi.fn()} />);
    expect(screen.getByPlaceholderText('Enter prompt for podcast script')).toBeInTheDocument();
    expect(screen.getByText('Generate Podcast Script')).toBeInTheDocument();
  });

  it('handles prompt input change', () => {
    render(<GeneratePodcastScript setGeneratedScript={vi.fn()} />);
    const input = screen.getByPlaceholderText('Enter prompt for podcast script');
    fireEvent.change(input, { target: { value: 'Test prompt' } });
    expect(input).toHaveValue('Test prompt');
  });

  it('generates podcast script on button click', async () => {
    const mockSetGeneratedScript = vi.fn();
    const mockGeneratedScript = 'Generated podcast script';
    (generatePodcastScript as Mock).mockResolvedValue(mockGeneratedScript);

    render(<GeneratePodcastScript setGeneratedScript={mockSetGeneratedScript} />);
    const input = screen.getByPlaceholderText('Enter prompt for podcast script');
    fireEvent.change(input, { target: { value: 'Test prompt' } });

    const button = screen.getByText('Generate Podcast Script');
    fireEvent.click(button);

    await waitFor(() => {
      expect(generatePodcastScript).toHaveBeenCalledWith('Test prompt');
      expect(mockSetGeneratedScript).toHaveBeenCalledWith(mockGeneratedScript);
      expect(screen.getByDisplayValue(mockGeneratedScript)).toBeInTheDocument();
    });
  });

  it('handles script input change', async () => {
    const mockSetGeneratedScript = vi.fn();
    const mockGeneratedScript = 'Generated podcast script';
    (generatePodcastScript as Mock).mockResolvedValue(mockGeneratedScript);

    render(<GeneratePodcastScript setGeneratedScript={mockSetGeneratedScript} />);
    const input = screen.getByPlaceholderText('Enter prompt for podcast script');
    fireEvent.change(input, { target: { value: 'Test prompt' } });
    expect(input).toHaveValue('Test prompt');

    const button = screen.getByText('Generate Podcast Script');
    fireEvent.click(button);

    await waitFor(() => {
      expect(generatePodcastScript).toHaveBeenCalledWith('Test prompt');
      expect(mockSetGeneratedScript).toHaveBeenCalledWith(mockGeneratedScript);
      expect(screen.getByDisplayValue(mockGeneratedScript)).toBeInTheDocument();
    });

    const textarea = screen.getByDisplayValue(mockGeneratedScript);
    fireEvent.change(textarea, { target: { value: 'Updated script' } });
    expect(textarea).toHaveValue('Updated script');
    expect(mockSetGeneratedScript).toHaveBeenCalledWith('Updated script');
  });
});