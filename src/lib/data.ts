// Mock data for the application

export interface User {
  id: string;
  name: string;
  username: string;
  email: string;
  bio: string;
  avatar: string;
  location: string;
  age: number;
  gender: string;
  interests: string[];
  languages: string[];
  tripCount: number;
  memberSince: string;
  reviews: Review[];
  preferences: {
    travelStyle: string[];
    accommodationType: string[];
    budget: string;
    tripDuration: string;
    foodPreferences: string[];
  };
}

export interface Trip {
  id: string;
  userId: string;
  title: string;
  description: string;
  destination: string;
  startDate: string;
  endDate: string;
  budget: string;
  maxTravelers: number;
  currentTravelers: number;
  interests: string[];
  imageUrl: string;
  createdAt: string;
  status: 'planning' | 'confirmed' | 'completed' | 'cancelled';
}

export interface Review {
  id: string;
  userId: string;
  reviewerId: string;
  reviewerName: string;
  reviewerAvatar: string;
  rating: number;
  text: string;
  tripId: string;
  date: string;
}

export interface Message {
  id: string;
  senderId: string;
  receiverId: string;
  text: string;
  timestamp: string;
  read: boolean;
}

// Mock Users
export const users: User[] = [
  {
    id: "1",
    name: "Alex Johnson",
    username: "travelalex",
    email: "alex@example.com",
    bio: "Adventure seeker and photography enthusiast. Always looking for my next destination.",
    avatar: "https://images.unsplash.com/photo-1472396961693-142e6e269027?auto=format&fit=crop&w=300&h=300",
    location: "San Francisco, CA",
    age: 28,
    gender: "Male",
    interests: ["Hiking", "Photography", "Food", "Culture"],
    languages: ["English", "Spanish"],
    tripCount: 12,
    memberSince: "Jan 2023",
    reviews: [],
    preferences: {
      travelStyle: ["Adventure", "Backpacking"],
      accommodationType: ["Hostel", "Camping"],
      budget: "Mid-range",
      tripDuration: "1-2 Weeks",
      foodPreferences: ["Local cuisine", "Street food"],
    }
  },
  {
    id: "2",
    name: "Emma Wilson",
    username: "emmaworldwide",
    email: "emma@example.com",
    bio: "Digital nomad and yoga instructor. Love beach destinations and meeting new people!",
    avatar: "https://images.unsplash.com/photo-1469041797191-50ace28483c3?auto=format&fit=crop&w=300&h=300",
    location: "London, UK",
    age: 31,
    gender: "Female",
    interests: ["Yoga", "Beaches", "Reading", "Vegan Food"],
    languages: ["English", "French"],
    tripCount: 24,
    memberSince: "Mar 2022",
    reviews: [],
    preferences: {
      travelStyle: ["Relaxation", "Cultural"],
      accommodationType: ["Airbnb", "Resort"],
      budget: "Mid-range to Luxury",
      tripDuration: "2-4 Weeks",
      foodPreferences: ["Vegan", "Healthy"],
    }
  },
  {
    id: "3",
    name: "Miguel Torres",
    username: "miguelexplores",
    email: "miguel@example.com",
    bio: "History buff and mountain climber. Looking for authentic cultural experiences around the world.",
    avatar: "https://images.unsplash.com/photo-1500673922987-e212871fec22?auto=format&fit=crop&w=300&h=300",
    location: "Madrid, Spain",
    age: 35,
    gender: "Male",
    interests: ["History", "Mountaineering", "Museums", "Local Markets"],
    languages: ["Spanish", "English", "Italian"],
    tripCount: 18,
    memberSince: "Aug 2022",
    reviews: [],
    preferences: {
      travelStyle: ["Cultural", "Adventure"],
      accommodationType: ["Boutique Hotel", "Home Exchange"],
      budget: "Mid-range",
      tripDuration: "1-3 Weeks",
      foodPreferences: ["Local cuisine", "Wine tasting"],
    }
  }
];

// Add reviews to users
users[0].reviews = [
  {
    id: "101",
    userId: "1",
    reviewerId: "2",
    reviewerName: "Emma Wilson",
    reviewerAvatar: "https://images.unsplash.com/photo-1469041797191-50ace28483c3?auto=format&fit=crop&w=300&h=300",
    rating: 5,
    text: "Alex was a fantastic travel partner! Always positive and adaptable.",
    tripId: "201",
    date: "2023-08-15"
  },
  {
    id: "102",
    userId: "1",
    reviewerId: "3",
    reviewerName: "Miguel Torres",
    reviewerAvatar: "https://images.unsplash.com/photo-1500673922987-e212871fec22?auto=format&fit=crop&w=300&h=300",
    rating: 4,
    text: "Great experience traveling with Alex. Has good knowledge of local spots.",
    tripId: "203",
    date: "2023-05-20"
  }
];

users[1].reviews = [
  {
    id: "103",
    userId: "2",
    reviewerId: "1",
    reviewerName: "Alex Johnson",
    reviewerAvatar: "https://images.unsplash.com/photo-1472396961693-142e6e269027?auto=format&fit=crop&w=300&h=300",
    rating: 5,
    text: "Emma is an incredible travel buddy! So organized and fun to be around.",
    tripId: "201",
    date: "2023-08-17"
  }
];

users[2].reviews = [
  {
    id: "104",
    userId: "3",
    reviewerId: "1",
    reviewerName: "Alex Johnson",
    reviewerAvatar: "https://images.unsplash.com/photo-1472396961693-142e6e269027?auto=format&fit=crop&w=300&h=300",
    rating: 5,
    text: "Miguel is knowledgeable about history and finding authentic experiences.",
    tripId: "203",
    date: "2023-05-25"
  }
];

// Mock Trips
export const trips: Trip[] = [
  {
    id: "201",
    userId: "1",
    title: "Backpacking through Southeast Asia",
    description: "Looking for 2-3 people to join me on a backpacking adventure through Thailand, Vietnam, and Cambodia. Planning to visit major cities, explore temples, try local food, and relax on beaches.",
    destination: "Thailand, Vietnam, Cambodia",
    startDate: "2023-11-10",
    endDate: "2023-12-15",
    budget: "Mid-range",
    maxTravelers: 4,
    currentTravelers: 1,
    interests: ["Backpacking", "Culture", "Food", "Beaches"],
    imageUrl: "https://images.unsplash.com/photo-1501928384086-adfef1c2d497?auto=format&fit=crop&w=800&h=500",
    createdAt: "2023-08-01",
    status: "planning"
  },
  {
    id: "202",
    userId: "2",
    title: "Yoga Retreat in Bali",
    description: "Join me for a rejuvenating yoga retreat in Bali. Daily yoga sessions, meditation, healthy food, and exploring the island's beautiful beaches and temples.",
    destination: "Bali, Indonesia",
    startDate: "2023-10-05",
    endDate: "2023-10-19",
    budget: "Mid-range to Luxury",
    maxTravelers: 6,
    currentTravelers: 3,
    interests: ["Yoga", "Wellness", "Beaches", "Spiritual"],
    imageUrl: "https://images.unsplash.com/photo-1518548419970-58e3b4079ab2?auto=format&fit=crop&w=800&h=500",
    createdAt: "2023-07-15",
    status: "confirmed"
  },
  {
    id: "203",
    userId: "3",
    title: "Historic Tour of Italy",
    description: "Exploring the rich history and culture of Italy. Rome, Florence, Venice, and smaller historic towns. Museums, architecture, and lots of amazing food and wine!",
    destination: "Italy",
    startDate: "2023-09-20",
    endDate: "2023-10-10",
    budget: "Mid-range",
    maxTravelers: 3,
    currentTravelers: 1,
    interests: ["History", "Culture", "Food", "Architecture"],
    imageUrl: "https://images.unsplash.com/photo-1523906834658-6e24ef2386f9?auto=format&fit=crop&w=800&h=500",
    createdAt: "2023-07-05",
    status: "planning"
  },
  {
    id: "204",
    userId: "1",
    title: "Hiking in the Swiss Alps",
    description: "Planning a hiking adventure in the Swiss Alps. Beautiful trails, mountain views, and cozy alpine villages. Moderate fitness level required.",
    destination: "Switzerland",
    startDate: "2023-08-15",
    endDate: "2023-08-28",
    budget: "Mid-range to High",
    maxTravelers: 5,
    currentTravelers: 2,
    interests: ["Hiking", "Nature", "Photography", "Adventure"],
    imageUrl: "https://images.unsplash.com/photo-1527254013619-20d054e4b665?auto=format&fit=crop&w=800&h=500",
    createdAt: "2023-06-10",
    status: "completed"
  },
  {
    id: "205",
    userId: "2",
    title: "Island Hopping in Greece",
    description: "Let's explore the beautiful Greek islands! Santorini, Mykonos, and maybe some lesser-known gems. Beach relaxation, local cuisine, and stunning sunsets.",
    destination: "Greece",
    startDate: "2023-07-01",
    endDate: "2023-07-14",
    budget: "Mid-range",
    maxTravelers: 4,
    currentTravelers: 2,
    interests: ["Beaches", "Island Life", "Food", "Photography"],
    imageUrl: "https://images.unsplash.com/photo-1567959928640-917065089d75?auto=format&fit=crop&w=800&h=500",
    createdAt: "2023-05-01",
    status: "completed"
  },
  {
    id: "206",
    userId: "3",
    title: "Cultural Exploration in Japan",
    description: "Experiencing the unique blend of traditional and modern Japan. Tokyo, Kyoto, Osaka, and countryside. Temples, technology, amazing food, and beautiful landscapes.",
    destination: "Japan",
    startDate: "2023-11-01",
    endDate: "2023-11-20",
    budget: "Mid-range to High",
    maxTravelers: 3,
    currentTravelers: 1,
    interests: ["Culture", "Food", "Technology", "History"],
    imageUrl: "https://images.unsplash.com/photo-1528360983277-13d401cdc186?auto=format&fit=crop&w=800&h=500",
    createdAt: "2023-08-05",
    status: "planning"
  }
];

// Helper function to find trips by user ID
export const getTripsByUserId = (userId: string): Trip[] => {
  return trips.filter(trip => trip.userId === userId);
};

// Helper function to find a user by ID
export const getUserById = (userId: string): User | undefined => {
  return users.find(user => user.id === userId);
};

// Helper function to find a trip by ID
export const getTripById = (tripId: string): Trip | undefined => {
  return trips.find(trip => trip.id === tripId);
};

// Helper function to find matches for a trip
export const getMatchesForTrip = (trip: Trip): User[] => {
  // In a real app, we'd implement a sophisticated matching algorithm
  // For now, return some sample matches excluding the trip creator
  return users.filter(user => 
    user.id !== trip.userId && 
    user.preferences.budget === trip.budget &&
    user.interests.some(interest => trip.interests.includes(interest))
  );
};

// We'll leave this file alone as it has dummy data that is still used in other parts of the application
// The FeaturedTrips component now uses real data from the database
// When the rest of the app is fully migrated to use real data, this file can be safely refactored or removed
