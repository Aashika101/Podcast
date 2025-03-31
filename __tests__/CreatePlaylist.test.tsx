import { Id } from "@/convex/_generated/dataModel";
import { createPlaylist } from "@/convex/playlists";
import { vi } from "vitest";

describe("createPlaylist Mutation", () => {
  const mockCtx = {
    auth: {
      getUserIdentity: vi.fn(),    // Mock function for user identity
    },
    db: {
      query: vi.fn(),       // Mock function for querying the database
      insert: vi.fn(),      // Mock function for inserting into the database
      patch: vi.fn(),       // Mock function for patching the database
    },
  };

  beforeEach(() => {
    vi.clearAllMocks();     // Clear all mocks before each test
  });

  it("should create a new playlist if it doesn't exist", async () => {
    // Mock user identity
    mockCtx.auth.getUserIdentity.mockResolvedValue({ email: "test@example.com" });

    // Mock user query
    mockCtx.db.query.mockImplementation((tableName) => {
      if (tableName === "users") {
        return {
          filter: vi.fn().mockReturnValue({
            collect: vi.fn().mockResolvedValue([{ _id: "user_123" }]),   // Mock user data
          }),
        };
      }
      if (tableName === "playlists") {
        return {
          filter: vi.fn().mockReturnValue({
            filter: vi.fn().mockReturnValue({
              collect: vi.fn().mockResolvedValue([]), // No existing playlist
            }),
          }),
        };
      }
    });

    // Mock playlist creation
    mockCtx.db.insert.mockResolvedValue({ _id: "playlist_123" });

    const args = {
      podcastId: "podcast_123" as Id<"podcasts">,
      playlistName: "My Playlist",
    };

    const result = await createPlaylist(mockCtx as any, args);

    // Assertions
    expect(mockCtx.auth.getUserIdentity).toHaveBeenCalled();   // Check if user identity was called
    expect(mockCtx.db.query).toHaveBeenCalledTimes(2);     // Check if query was called twice
    expect(mockCtx.db.insert).toHaveBeenCalledWith("playlists", {      
      user: "user_123",
      playlistName: "My Playlist",
      podcasts: ["podcast_123"],
    });
    expect(result).toEqual({ _id: "playlist_123" });     // Check if the result matches the expected playlist
  });

  it("should add a podcast to an existing playlist", async () => {
    // Mock user identity
    mockCtx.auth.getUserIdentity.mockResolvedValue({ email: "test@example.com" });

    // Mock user query
    mockCtx.db.query.mockImplementation((tableName) => {
      if (tableName === "users") {
        return {
          filter: vi.fn().mockReturnValue({
            collect: vi.fn().mockResolvedValue([{ _id: "user_123" }]),   // Mock user data
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
                  podcasts: ["podcast_456"],       // Existing podcasts
                },
              ]),
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
    expect(mockCtx.auth.getUserIdentity).toHaveBeenCalled();  // Check if user identity was called
    expect(mockCtx.db.query).toHaveBeenCalledTimes(2);        // Check if query was called twice
    expect(mockCtx.db.patch).toHaveBeenCalledWith("playlist_123", {    
      podcasts: ["podcast_456", "podcast_123"],
    });
    expect(result).toEqual({
      _id: "playlist_123",
      playlistName: "My Playlist",
      podcasts: ["podcast_456", "podcast_123"],
    });
  });

  it("should throw an error if the user is not logged in", async () => {
    // Mock user identity to return null
    mockCtx.auth.getUserIdentity.mockResolvedValue(null);

    const args = {
      podcastId: "podcast_123" as Id<"podcasts">,
      playlistName: "My Playlist",
    };

    await expect(createPlaylist(mockCtx as any, args)).rejects.toThrow(
      "Please log in to create a playlist."
    );

    // Assertions
    expect(mockCtx.auth.getUserIdentity).toHaveBeenCalled(); 
    expect(mockCtx.db.query).not.toHaveBeenCalled();
    expect(mockCtx.db.insert).not.toHaveBeenCalled();
  });
});