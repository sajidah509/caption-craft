export interface SamplePhoto {
  id: string;
  title: string;
  category: string;
  url: string;
  alt: string;
  mockCaption?: {
    funny: string;
    professional: string;
    question: string;
    hashtags: string[];
  };
}

export const SAMPLE_PHOTOS: SamplePhoto[] = [
  {
    id: "coffee-desk",
    title: "Aesthetic Coffee & Workspace",
    category: "Productivity",
    url: "https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&w=1000&q=80",
    alt: "Artisan coffee cup on a warm rustic wooden desk with laptop and notebook",
    mockCaption: {
      funny: "90% of my personality is just waiting for the next sip of espresso to kick in. ☕️⚡️",
      professional: "Productivity isn't about doing more things; it's about intentional focus on what truly moves the needle.",
      question: "Espresso, pour-over, or cold brew: what's keeping your creative engines running today?",
      hashtags: [
        "#CoffeeCulture",
        "#WorkspaceInspo",
        "#DeepWork",
        "#DailyProductivity",
        "#CreatorDesk",
        "#CoffeeLovers",
        "#MorningRoutine",
        "#FocusMode",
        "#CreativeFlow",
        "#CoffeeBreak",
      ],
    },
  },
  {
    id: "mountain-sunset",
    title: "Golden Hour Mountain Ridge",
    category: "Travel & Nature",
    url: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1000&q=80",
    alt: "Breathtaking mountain peaks reflecting the golden sun over mist valleys",
    mockCaption: {
      funny: "I climbed all the way up here just to make sure the view was worth complaining about my sore legs. 🏔️😅",
      professional: "True clarity often requires stepping back from the noise to see the broader horizon.",
      question: "If you could teleport to any mountain peak right now, where would you go?",
      hashtags: [
        "#GoldenHour",
        "#MountainViews",
        "#Wanderlust",
        "#NatureLovers",
        "#AdventureAwaits",
        "#WildernessCulture",
        "#LandscapePhotography",
        "#ScenicVistas",
        "#ExploreMore",
        "#EarthOutdoors",
      ],
    },
  },
  {
    id: "puppy-joy",
    title: "Golden Retriever Puppy",
    category: "Pets & Joy",
    url: "https://images.unsplash.com/photo-1552053831-71594a27632d?auto=format&fit=crop&w=1000&q=80",
    alt: "Adorable golden retriever puppy sitting happily in green lawn grass",
    mockCaption: {
      funny: "I'm not saying I'm spoiled, but my humans definitely schedule their meetings around my belly rubs. 🐶🐾",
      professional: "Unconditional loyalty and authentic enthusiasm are the best leadership traits anyone could practice.",
      question: "Rate this smile from 10 to infinity — what does your furry best friend do that makes your day?",
      hashtags: [
        "#DogsofInstagram",
        "#GoldenRetrieverLife",
        "#PuppyLove",
        "#PawsomeMoments",
        "#GoodBoyVibes",
        "#PetTherapy",
        "#DoggoDay",
        "#HappinessIsADog",
        "#FurryFriend",
        "#CanineLove",
      ],
    },
  },
  {
    id: "urban-street",
    title: "Cyberpunk Urban Street",
    category: "Street & Architecture",
    url: "https://images.unsplash.com/photo-1514565131-fce0801e5785?auto=format&fit=crop&w=1000&q=80",
    alt: "Vibrant neon-lit city street at dusk with reflections on wet asphalt",
    mockCaption: {
      funny: "Walking through the city like I have an epic main-character synthwave soundtrack playing in my head. 🌆🕶️",
      professional: "Innovation thrives at the intersection of dense energy, modern architecture, and relentless human ambition.",
      question: "Night city walks vs. early sunrise strolls: which one unlocks your best ideas?",
      hashtags: [
        "#CityLights",
        "#UrbanExploration",
        "#NeonVibes",
        "#StreetAesthetic",
        "#NightPhotography",
        "#MetropolisLife",
        "#ModernCityscape",
        "#CyberpunkVibes",
        "#ArchitecturalLines",
        "#UrbanSoul",
      ],
    },
  },
];
