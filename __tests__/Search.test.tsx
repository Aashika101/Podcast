import { render, screen } from "@testing-library/react";
import { vi } from "vitest";
import { useQuery } from "convex/react";
import Discover from "@/app/(root)/discover/page";
import { useRouter, usePathname } from "next/navigation";

// Mock the `useQuery` hook from Convex
vi.mock("convex/react", () => ({
  useQuery: vi.fn(),
}));

// Mock the Next.js `useRouter` and `usePathname` hooks
vi.mock("next/navigation", () => ({
  useRouter: vi.fn(),
  usePathname: vi.fn(),
}));

describe("Discover Page", () => {
  beforeEach(() => {
    // Clear all mocks before each test to ensure a clean state
    vi.clearAllMocks();

    // Mock `useRouter` and `usePathname`
    vi.mocked(useRouter).mockReturnValue({
      push: vi.fn(),
    } as any);

    vi.mocked(usePathname).mockReturnValue("/discover");
  });

  // Test case to check if podcasts are displayed based on the genre filter
  it("should display podcasts based on the genre filter", () => {
    // Mock the `useQuery` to return filtered podcast data
    vi.mocked(useQuery).mockReturnValue([
      {
        _id: "podcast_1",
        podcastTitle: "Tech Talks",
        podcastDescription: "A podcast about technology.",
        imageUrl: "https://example.com/tech.jpg",
        genre: "Technology",
      },
      {
        _id: "podcast_2",
        podcastTitle: "Code Stories",
        podcastDescription: "A podcast about programming.",
        imageUrl: "https://example.com/code.jpg",
        genre: "Technology",
      },
    ]);

    // Render the `Discover` component with a search query
    render(<Discover searchParams={{ search: "Technology" }} />);

    // Assert that the correct podcasts are displayed
    expect(screen.getByText("Tech Talks")).toBeInTheDocument();
    expect(screen.getByText("A podcast about technology.")).toBeInTheDocument();
    expect(screen.getByText("Code Stories")).toBeInTheDocument();
    expect(screen.getByText("A podcast about programming.")).toBeInTheDocument();
  });

  //Test case to check if an empty state is displayed when no podcasts match the search query
  it("should display an empty state if no podcasts match the search query", () => {
    // Mock the `useQuery` to return an empty array
    vi.mocked(useQuery).mockReturnValue([]);

    // Render the `Discover` component with a search query
    render(<Discover searchParams={{ search: "Nonexistent Genre" }} />);

    // Assert that the empty state is displayed
    expect(
      screen.getByText(
        "No results found. Try adjusting your search to find what you are looking for"
      )
    ).toBeInTheDocument();
  });

  it("should display a loader while fetching data", () => {
    // Mock the `useQuery` to return `undefined` (loading state)
    vi.mocked(useQuery).mockReturnValue(undefined);

    // Render the `Discover` component
    render(<Discover searchParams={{ search: "Technology" }} />);

    // Assert that the loader is displayed
    expect(screen.getByTestId("loader-spinner")).toBeInTheDocument();
  });
});