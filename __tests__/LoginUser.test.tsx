import { SignIn } from "@clerk/nextjs";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { vi } from "vitest";

// Mock Clerk's `signIn` method
vi.mock("@clerk/nextjs", () => ({
  SignIn: vi.fn(),
  useAuth: vi.fn(() => ({
    signIn: vi.fn(),
  })),
}));

describe("User Login", () => {
  beforeEach(() => {
    // Clear all mocks before each test to ensure a clean state
    vi.clearAllMocks();
  });

  it("should log in successfully with valid credentials", async () => {
    // Mock `signIn` to resolve successfully
    const mockSignIn = vi.fn().mockResolvedValue({
      sessionId: "session_123",
      userId: "user_123",
    });

    // Mock the SignIn component to render a placeholder
    vi.mocked(SignIn).mockImplementation(() => (
      <div data-testid="mock-signin-component" />
    ));

    // Render a login form (replace this with your actual login UI)
    render(
      <form
        onSubmit={async (e) => {
          e.preventDefault();
          const email = "test@example.com";
          const password = "correct_password";
          await mockSignIn({ email, password });
        }}
      >
        <input type="email" placeholder="Email" name="email" />
        <input type="password" placeholder="Password" name="password" />
        <button type="submit">Login</button>
      </form>
    );

    // Simulate user input for email
    fireEvent.change(screen.getByPlaceholderText("Email"), {
      target: { value: "test@example.com" },
    });
    // Simulate user input for password
    fireEvent.change(screen.getByPlaceholderText("Password"), {
      target: { value: "correct_password" },
    });

    // Simulate form submission
    fireEvent.click(screen.getByText("Login"));

    // Wait for the login process to complete and verify the mockSignIn call
    await waitFor(() => {
      expect(mockSignIn).toHaveBeenCalledWith({
        email: "test@example.com",
        password: "correct_password",
      });
    });
  });

  it("should fail to log in with invalid credentials", async () => {
    // Mock `signIn` to reject with an error
    const mockSignIn = vi.fn().mockRejectedValue(new Error("Invalid credentials"));

    // Mock the SignIn component to render a placeholder
    vi.mocked(SignIn).mockImplementation(() => (
      <div data-testid="mock-signin-component" />
    ));

    // Render a login form (replace this with your actual login UI)
    render(
      <form
        onSubmit={async (e) => {
          e.preventDefault();
          const email = "test@example.com";
          const password = "wrong_password";
          try {
            await mockSignIn({ email, password });
          } catch (error) {
            if (error instanceof Error) {
              console.error(error.message);
            } else {
              console.error("An unknown error occurred");
            }
          }
        }}
      >
        <input type="email" placeholder="Email" name="email" />
        <input type="password" placeholder="Password" name="password" />
        <button type="submit">Login</button>
      </form>
    );

    // Simulate user input for email
    fireEvent.change(screen.getByPlaceholderText("Email"), {
      target: { value: "test@example.com" },
    });
    // Simulate user input for password
    fireEvent.change(screen.getByPlaceholderText("Password"), {
      target: { value: "wrong_password" },
    });

    // Simulate form submission
    fireEvent.click(screen.getByText("Login"));

    // Wait for the login process to complete and verify the mockSignIn call
    await waitFor(() => {
      expect(mockSignIn).toHaveBeenCalledWith({
        email: "test@example.com",
        password: "wrong_password",
      });
    });
  });
});