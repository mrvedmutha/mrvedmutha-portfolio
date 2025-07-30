// Animals for anonymous usernames
export const ANIMALS = [
  // Mammals
  "Bunny", "Fox", "Tiger", "Lion", "Bear", "Wolf", "Deer", "Rabbit",
  "Squirrel", "Otter", "Panda", "Koala", "Elephant", "Giraffe", "Zebra",
  "Dolphin", "Whale", "Seal", "Cheetah", "Leopard", "Lynx", "Badger",
  
  // Birds
  "Eagle", "Hawk", "Owl", "Robin", "Sparrow", "Cardinal", "BlueBird",
  "Raven", "Crow", "Parrot", "Peacock", "Swan", "Duck", "Goose",
  "Penguin", "Flamingo", "Hummingbird", "Woodpecker", "Falcon", "Kestrel",
  
  // Others
  "Butterfly", "Dragonfly", "Bee", "Ladybug", "Cricket", "Firefly"
] as const;

// Adjectives for personality
export const ADJECTIVES = [
  // Movement
  "Swift", "Quick", "Agile", "Nimble", "Racing", "Gliding", "Soaring",
  "Leaping", "Dancing", "Floating", "Dashing", "Sprinting",
  
  // Personality
  "Clever", "Wise", "Brave", "Bold", "Gentle", "Kind", "Cheerful",
  "Happy", "Curious", "Playful", "Calm", "Peaceful", "Friendly",
  
  // Appearance
  "Bright", "Shiny", "Golden", "Silver", "Crimson", "Azure", "Emerald",
  "Radiant", "Gleaming", "Sparkling", "Glowing", "Vibrant",
  
  // Nature
  "Wild", "Free", "Noble", "Majestic", "Graceful", "Elegant", "Mighty",
  "Fierce", "Silent", "Mystic", "Ancient", "Cosmic"
] as const;

// Color variations (optional third component)
export const COLORS = [
  "Red", "Blue", "Green", "Purple", "Orange", "Yellow", "Pink",
  "Teal", "Coral", "Mint", "Sage", "Rose", "Amber", "Violet"
] as const;

export type AnimalType = typeof ANIMALS[number];
export type AdjectiveType = typeof ADJECTIVES[number];
export type ColorType = typeof COLORS[number];