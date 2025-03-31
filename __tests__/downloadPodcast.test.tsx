import { downloadPodcast } from "@/convex/downloadPodcast";
import { IDBPDatabase, openDB } from "idb";
import { vi } from "vitest";

// Mock the `openDB` function from the `idb` library
vi.mock("idb", () => ({
  openDB: vi.fn(),
}));

describe("downloadPodcast", () => {
  beforeEach(() => {
    // Clear all mocks before each test to ensure a clean state
    vi.clearAllMocks();
  });

  it("should download and save the podcast successfully", async () => {
    // Mock the `fetch` API to return a fake response
    const mockBlob = new Blob(["audio data"], { type: "audio/mpeg" });
    global.fetch = vi.fn().mockResolvedValue({
      blob: vi.fn().mockResolvedValue(mockBlob),
    });

    // Mock the `openDB` function to return a mock database instance
    const mockPut = vi.fn();
    vi.mocked(openDB).mockResolvedValue({
      put: mockPut,
      add: vi.fn(),
      clear: vi.fn(),
      count: vi.fn(),
      countFromIndex: vi.fn(),
      delete: vi.fn(),
      deleteFromIndex: vi.fn(),
      get: vi.fn(),
      getAll: vi.fn(),
      getAllFromIndex: vi.fn(),
      getFromIndex: vi.fn(),
      getKey: vi.fn(),
      getKeyFromIndex: vi.fn(),
      getAllKeys: vi.fn(),
      getAllKeysFromIndex: vi.fn(),
      openCursor: vi.fn(),
      openCursorFromIndex: vi.fn(),
      openKeyCursor: vi.fn(),
      openKeyCursorFromIndex: vi.fn(),
      transaction: vi.fn(),
      close: vi.fn(),
      name: "mockDB",
      version: 1,
      objectStoreNames: [],
    } as unknown as IDBPDatabase<unknown>);

    // Call the `downloadPodcast` function with test data
    const audioUrl = "https://example.com/audio.mp3";
    const podcastId = "podcast_123";
    const podcastTitle = "Test Podcast";
    const imageUrl = "https://example.com/image.jpg";
    const audioDuration = 3600;

    await downloadPodcast(audioUrl, podcastId, podcastTitle, imageUrl, audioDuration);

    // Assertions to verify the expected behavior
    expect(global.fetch).toHaveBeenCalledWith(audioUrl);
    expect(mockPut).toHaveBeenCalledWith(
      "podcasts",
      { blob: mockBlob, podcastTitle, imageUrl, audioDuration },
      podcastId
    );
    console.log(`Podcast with ID ${podcastId} downloaded successfully.`);
  });

  it("should throw an error if the fetch fails", async () => {
    // Mock the `fetch` API to throw an error
    global.fetch = vi.fn().mockRejectedValue(new Error("Network error"));

    // Call the `downloadPodcast` function and expect it to throw an error
    const audioUrl = "https://example.com/audio.mp3";
    const podcastId = "podcast_123";
    const podcastTitle = "Test Podcast";
    const imageUrl = "https://example.com/image.jpg";
    const audioDuration = 3600;

    await expect(
      downloadPodcast(audioUrl, podcastId, podcastTitle, imageUrl, audioDuration)
    ).rejects.toThrow("Network error");

    // Assertions to verify the expected behavior
    expect(global.fetch).toHaveBeenCalledWith(audioUrl);
    console.error(`Error downloading podcast with ID ${podcastId}:`, "Network error");
  });

  it("should throw an error if IndexedDB fails", async () => {
    // Mock the `fetch` API to return a fake response
    const mockBlob = new Blob(["audio data"], { type: "audio/mpeg" });
    global.fetch = vi.fn().mockResolvedValue({
      blob: vi.fn().mockResolvedValue(mockBlob),
    });

    // Mock the `openDB` function to throw an error
    vi.mocked(openDB).mockRejectedValue(new Error("IndexedDB error"));

    // Call the `downloadPodcast` function and expect it to throw an error
    const audioUrl = "https://example.com/audio.mp3";
    const podcastId = "podcast_123";
    const podcastTitle = "Test Podcast";
    const imageUrl = "https://example.com/image.jpg";
    const audioDuration = 3600;

    await expect(
      downloadPodcast(audioUrl, podcastId, podcastTitle, imageUrl, audioDuration)
    ).rejects.toThrow("IndexedDB error");

    // Assertions to verify the expected behavior
    expect(global.fetch).toHaveBeenCalledWith(audioUrl);
    console.error(`Error downloading podcast with ID ${podcastId}:`, "IndexedDB error");
  });
});