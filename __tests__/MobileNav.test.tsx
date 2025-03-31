import { render, screen, fireEvent } from "@testing-library/react";
import { vi } from "vitest";
import MobileNav from "@/components/MobileNav";
import { usePathname } from "next/navigation";

// Mock the `usePathname` hook
vi.mock("next/navigation", () => ({
  usePathname: vi.fn(),
}));

// Mock the `sidebarLinks` constant
vi.mock("@/constants", () => ({
  sidebarLinks: [
    { imgURL: "/icons/home.svg", route: "/", label: "Home" },
    { imgURL: "/icons/microphone.svg", route: "/create-podcast", label: "Create Podcast" },
    { imgURL: "/icons/sidebardownload.svg", route: "/download-podcast", label: "Downloads" },
    { imgURL: "/icons/headphone.svg", route: "/playlists", label: "Playlists" },
  ],
}));

describe("MobileNav Component", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(usePathname).mockReturnValue("/"); // Mock the current pathname
  });

  it("should render the hamburger menu icon", () => {
    render(<MobileNav />);

    // Assert that the hamburger menu icon is rendered
    const hamburgerIcon = screen.getByAltText("menu");
    expect(hamburgerIcon).toBeInTheDocument();
  });

  it("should open the navigation menu when the hamburger icon is clicked", () => {
    render(<MobileNav />);

    // Click the hamburger menu icon
    const hamburgerIcon = screen.getByAltText("menu");
    fireEvent.click(hamburgerIcon);

    // Assert that the navigation menu is visible
    const navMenu = screen.getByRole("navigation");
    expect(navMenu).toBeInTheDocument();
  });

  it("should close the navigation menu when a link is clicked", () => {
    render(<MobileNav />);

    // Click the hamburger menu icon to open the menu
    const hamburgerIcon = screen.getByAltText("menu");
    fireEvent.click(hamburgerIcon);

    // Click a link in the menu
    const link = screen.getByText("Home");
    fireEvent.click(link);

    // Assert that the navigation menu is closed
    expect(screen.queryByRole("navigation")).not.toBeInTheDocument();
  });

  it("should render correctly on small screens", () => {
    // Set the viewport to a small screen size
    global.innerWidth = 375;
    global.dispatchEvent(new Event("resize"));

    render(<MobileNav />);

    // Assert that the hamburger menu icon is visible
    const hamburgerIcon = screen.getByAltText("menu");
    expect(hamburgerIcon).toBeVisible();
  });
});