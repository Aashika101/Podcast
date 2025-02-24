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


export const podcastData = [
  {
    id: 1,
    title: "The Joe Rogan Experience",
    description: "A long form, in-depth conversation",
    genre: "comedy",
    imgURL:
      "https://lovely-flamingo-139.convex.cloud/api/storage/3106b884-548d-4ba0-a179-785901f69806",
    voice: getVoicesForGenre("comedy"),
  },
  {
    id: 2,
    title: "The Futur",
    description: "This is how the news should sound",
    genre: "documentary",
    imgURL:
      "https://lovely-flamingo-139.convex.cloud/api/storage/16fbf9bd-d800-42bc-ac95-d5a586447bf6",
    voice: getVoicesForGenre("documentary"),
  },
  {
    id: 3,
    title: "Waveform",
    description: "Join Michelle Obama in conversation",
    genre: "talk-show",
    imgURL:
      "https://lovely-flamingo-139.convex.cloud/api/storage/60f0c1d9-f2ac-4a96-9178-f01d78fa3733",
    voice: getVoicesForGenre("talk-show"),
  },
  {
    id: 4,
    title: "The Tech Talks Daily Podcast",
    description: "This is how the news should sound",
    genre: "documentary",
    imgURL:
      "https://lovely-flamingo-139.convex.cloud/api/storage/5ba7ed1b-88b4-4c32-8d71-270f1c502445",
    voice: getVoicesForGenre("documentary"),
  },
];