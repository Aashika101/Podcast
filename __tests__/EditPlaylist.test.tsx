import { Id } from "@/convex/_generated/dataModel";
import { createPlaylist, deletePodcastFromPlaylist } from "@/convex/playlists";
import { vi } from "vitest";

describe("Edit Playlist", () => {
  const mockCtx = {
    auth: {
      getUserIdentity: vi.fn(), // Mock function for user identity
    },
    db: {
      query: vi.fn(), // Mock function for database queries
      insert: vi.fn(), // Mock function for database insertions
      patch: vi.fn(), // Mock function for database updates
      get: vi.fn(), // Mock function for database retrieval
    },
  };

  beforeEach(() => {
    vi.clearAllMocks(); // Clear all mocks before each test
  });

  it("should add a podcast to an existing playlist", async () => {
    // Mock user identity
    mockCtx.auth.getUserIdentity.mockResolvedValue({ email: "test@example.com" });

    // Mock user query
    mockCtx.db.query.mockImplementation((tableName) => {
      if (tableName === "users") {
        return {
          filter: vi.fn().mockReturnValue({
            collect: vi.fn().mockResolvedValue([{ _id: "user_123" }]), // Mock user data
          }),
        };
      }
      if (tableName === "playlists") {
        return {
          filter: vi.fn().mockReturnValue({
            filter: vi.fn().mockReturnValue({
              collect: vi.fn().mockResolvedValue([
                {
                  _id: "playlist_123",
                  playlistName: "My Playlist",
                  podcasts: ["podcast_456"],
                },
              ]), // Mock existing playlist data
            }),
          }),
        };
      }
    });

    // Mock playlist update
    mockCtx.db.patch.mockResolvedValue({
      _id: "playlist_123",
      playlistName: "My Playlist",
      podcasts: ["podcast_456", "podcast_123"],
    });

    const args = {
      podcastId: "podcast_123" as Id<"podcasts">,
      playlistName: "My Playlist",
    };

    const result = await createPlaylist(mockCtx as any, args);

    // Assertions
    expect(mockCtx.auth.getUserIdentity).toHaveBeenCalled(); // Check if user identity was called
    expect(mockCtx.db.query).toHaveBeenCalledTimes(2); // Check if queries were called twice
    expect(mockCtx.db.patch).toHaveBeenCalledWith("playlist_123", {
      podcasts: ["podcast_456", "podcast_123"],
    }); // Check if patch was called with correct data
    expect(result).toEqual({
      _id: "playlist_123",
      playlistName: "My Playlist",
      podcasts: ["podcast_456", "podcast_123"],
    }); // Check if result matches expected value
  });

  it("should remove a podcast from a playlist", async () => {
    // Mock user identity
    mockCtx.auth.getUserIdentity.mockResolvedValue({ email: "test@example.com" });

    // Mock user query
    mockCtx.db.query.mockImplementation((tableName) => {
      if (tableName === "users") {
        return {
          filter: vi.fn().mockReturnValue({
            collect: vi.fn().mockResolvedValue([{ _id: "user_123" }]), // Mock user data
          }),
        };
      }
    });

    // Mock playlist retrieval
    mockCtx.db.get.mockResolvedValue({
      _id: "playlist_123",
      playlistName: "My Playlist",
      podcasts: ["podcast_123", "podcast_456"],
    });

    // Mock playlist update
    mockCtx.db.patch.mockResolvedValue({
      _id: "playlist_123",
      playlistName: "My Playlist",
      podcasts: ["podcast_456"],
    });

    const args = {
      podcastId: "podcast_123" as Id<"podcasts">,
      playlistId: "playlist_123" as Id<"playlists">,
    };

    const result = await deletePodcastFromPlaylist(mockCtx as any, args);

    // Assertions
    expect(mockCtx.auth.getUserIdentity).toHaveBeenCalled(); // Check if user identity was called
    expect(mockCtx.db.get).toHaveBeenCalledWith("playlist_123"); // Check if playlist retrieval was called
    expect(mockCtx.db.patch).toHaveBeenCalledWith("playlist_123", {
      podcasts: ["podcast_456"],
    }); // Check if patch was called with correct data
    expect(result).toEqual({ success: true }); // Check if result matches expected value
  });

  it("should throw an error if the playlist does not exist when removing a podcast", async () => {
    // Mock user identity
    mockCtx.auth.getUserIdentity.mockResolvedValue({ email: "test@example.com" });

    // Mock playlist retrieval to return null
    mockCtx.db.get.mockResolvedValue(null);

    const args = {
      podcastId: "podcast_123" as Id<"podcasts">,
      playlistId: "playlist_123" as Id<"playlists">,
    };

    await expect(deletePodcastFromPlaylist(mockCtx as any, args)).rejects.toThrow(
      "Playlist not found."
    ); // Check if error is thrown when playlist is not found

    // Assertions
    expect(mockCtx.auth.getUserIdentity).toHaveBeenCalled(); // Check if user identity was called
    expect(mockCtx.db.get).toHaveBeenCalledWith("playlist_123"); // Check if playlist retrieval was called
    expect(mockCtx.db.patch).not.toHaveBeenCalled(); // Check if patch was not called
  });
});