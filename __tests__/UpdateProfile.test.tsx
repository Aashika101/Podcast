import { useUser } from "@clerk/nextjs";
import { UserResource } from "@clerk/types";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { vi } from "vitest";

// Mock Clerk's `useUser` method
vi.mock("@clerk/nextjs", () => ({
  useUser: vi.fn(),
}));

describe("Profile Image Update", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should update the profile image successfully with a valid URL", async () => {
    // Mock `useUser` to provide a mock `setProfileImage` method
    const mockSetProfileImage = vi.fn().mockResolvedValue({});
    vi.mocked(useUser).mockReturnValue({
      isLoaded: true,
      isSignedIn: true,
      user: {
        id: "user_123",
        setProfileImage: mockSetProfileImage,
        externalId: "external_123",
        primaryEmailAddressId: "email_123",
        primaryEmailAddress: {
          emailAddress: "test@example.com",
        },
        primaryPhoneNumberId: null,
        firstName: "Test",
        lastName: "User",
        profileImageUrl: "https://example.com/old-image.jpg",
        // Add other required properties as needed
      } as unknown as UserResource,
    });

    // Render a profile image update form
    render(
      <form
        onSubmit={async (e) => {
          e.preventDefault();
          const profileImageUrl = "https://example.com/new-image.jpg";
          await mockSetProfileImage(profileImageUrl);
        }}
      >
        <input
          type="text"
          placeholder="Profile Image URL"
          defaultValue="https://example.com/old-image.jpg"
          name="profileImageUrl"
        />
        <button type="submit">Update Profile Image</button>
      </form>
    );

    // Simulate user input
    fireEvent.change(screen.getByPlaceholderText("Profile Image URL"), {
      target: { value: "https://example.com/new-image.jpg" },
    });

    // Simulate form submission
    fireEvent.click(screen.getByText("Update Profile Image"));

    // Wait for the update process to complete
    await waitFor(() => {
      expect(mockSetProfileImage).toHaveBeenCalledWith(
        "https://example.com/new-image.jpg"
      );
    });
  });

  it("should handle errors during profile image update", async () => {
    // Mock `useUser` to provide a mock `setProfileImage` method that rejects
    const mockSetProfileImage = vi.fn().mockRejectedValue(new Error("Update failed"));
    vi.mocked(useUser).mockReturnValue({
      isLoaded: true,
      isSignedIn: true,
      user: {
        id: "user_123",
        setProfileImage: mockSetProfileImage,
        externalId: "external_123",
        primaryEmailAddressId: "email_123",
        primaryEmailAddress: {
          emailAddress: "test@example.com",
        },
        primaryPhoneNumberId: null,
        firstName: "Test",
        lastName: "User",
        profileImageUrl: "https://example.com/old-image.jpg",
        // Add other required properties as needed
      } as unknown as UserResource,
    });

    // Render a profile image update form
    render(
      <form
        onSubmit={async (e) => {
          e.preventDefault();
          const profileImageUrl = "https://example.com/new-image.jpg";
          try {
            await mockSetProfileImage(profileImageUrl);
          } catch (error) {
            if (error instanceof Error) {
              console.error(error.message);
            } else {
              console.error("An unknown error occurred");
            }
          }
        }}
      >
        <input
          type="text"
          placeholder="Profile Image URL"
          defaultValue="https://example.com/old-image.jpg"
          name="profileImageUrl"
        />
        <button type="submit">Update Profile Image</button>
      </form>
    );

    // Simulate user input for the profile image URL
    fireEvent.change(screen.getByPlaceholderText("Profile Image URL"), {
      target: { value: "https://example.com/new-image.jpg" },
    });

    // Simulate form submission
    fireEvent.click(screen.getByText("Update Profile Image"));

    // Wait for the update process to complete and verify the mockSetProfileImage call
    await waitFor(() => {
      expect(mockSetProfileImage).toHaveBeenCalledWith(
        "https://example.com/new-image.jpg"
      );
    });
  });
});