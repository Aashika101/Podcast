export const sidebarLinks = [
    {
      imgURL: "/icons/home.svg",
      route: "/",
      label: "Home",
    },
    {
      imgURL: "/icons/discover.svg",
      route: "/discover",
      label: "Discover",
    },
    {
      imgURL: "/icons/microphone.svg",
      route: "/create-podcast",
      label: "Create Podcast",
    },
    {
      imgURL: "/icons/profile.svg",
      route: "/profile",
      label: "My Profile",
    },
  

  ];

  export const genres = [
    'action', 'adult', 'adventure', 'animation', 'biography', 'comedy',
    'crime', 'documentary', 'drama', 'family', 'fantasy', 'game-show',
    'history', 'horror', 'music', 'musical', 'mystery', 'news',
    'reality-tv', 'romance', 'sci-fi', 'short', 'sport', 'talk-show',
    'thriller', 'war', 'western'
  ];
  
  export const genreToVoiceMap: { [key: string]: string[] } = {
    action: ['nova', 'ash'],
    adult: ['alloy', 'coral'],
    adventure: ['fable', 'nova'],
    animation: ['echo', 'coral'],
    biography: ['alloy', 'fable'],
    comedy: ['nova', 'echo'],
    crime: ['echo', 'fable'],
    documentary: ['ash', 'coral'],
    drama: ['fable', 'nova'],
    family: ['ash', 'echo'],
    fantasy: ['alloy', 'fable'],
    'game-show': ['nova', 'echo'],
    history: ['ash', 'alloy'],
    horror: ['fable', 'echo'],
    music: ['echo', 'nova'],
    musical: ['nova', 'coral'],
    mystery: ['fable', 'echo'],
    news: ['fable', 'ash'],
    'reality-tv': ['onyx', 'nova'],
    romance: ['coral', 'alloy'],
    'sci-fi': ['onyx', 'echo'],
    short: ['onyx', 'fable'],
    sport: ['onyx', 'nova'],
    'talk-show': ['alloy', 'coral'],
    thriller: ['ash', 'echo'],
    war: ['echo', 'fable'],
    western: ['echo', 'nova']
  };
  
  // Function to get the appropriate voices based on the genre
  export function getVoicesForGenre(genre: string): string[] {
    return genreToVoiceMap[genre] || ['alloy', 'coral']; // Default to ['alloy', 'coral'] if genre is not found
  }
