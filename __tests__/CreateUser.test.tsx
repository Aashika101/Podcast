import { createUser } from "@/convex/users";
import { vi } from "vitest";

// Mock the server-side context
const mockCtx = {
  db: {
    insert: vi.fn(),
  },
};    //The code imports the createUser mutation from your Convex users module and the vi object from Vitest for mocking.

describe("createUser Mutation", () => {    //The describe block defines a test suite for the createUser mutation.
  beforeEach(() => {            //This hook clears all mocks before each test to ensure a clean state.
    vi.clearAllMocks();
  });

  //This test checks if the createUser mutation successfully creates a user with valid inputs.
  it("should create a user successfully with valid inputs", async () => {     
    // Arrange: Set up test data
    const validUserData = {
      clerkId: "clerk_123456789",
      email: "test@example.com",
      imageUrl: "https://example.com/image.jpg",
      name: "Test User",
    };

    // Act: Call the mutation directly with the mocked context
    await createUser(mockCtx as any, validUserData);

    // Assert: Verify that the database insert was called with the correct data
    expect(mockCtx.db.insert).toHaveBeenCalledTimes(1);
    expect(mockCtx.db.insert).toHaveBeenCalledWith("users", {
      clerkId: validUserData.clerkId,
      email: validUserData.email,
      imageUrl: validUserData.imageUrl,
      name: validUserData.name,
    });
    // Log success message
    console.log("PASS: should create a user successfully with valid inputs");
  });

  it("should throw an error if the database insert fails", async () => {
    // Arrange: Mock the database insert to throw an error
    mockCtx.db.insert.mockImplementation(() => {
      throw new Error("Database error");
    });

    const invalidUserData = {
      clerkId: "clerk_123456789",
      email: "test@example.com",
      imageUrl: "https://example.com/image.jpg",
      name: "Test User",
    };

    // Act & Assert: Call the mutation and expect it to throw an error
    await expect(createUser(mockCtx as any, invalidUserData)).rejects.toThrow("Database error");

    // Log success message
    console.log("PASS: should throw an error if the database insert fails");
  });
});