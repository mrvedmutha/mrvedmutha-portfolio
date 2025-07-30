import { ANIMALS, ADJECTIVES, COLORS, type AnimalType, type AdjectiveType, type ColorType } from "@/enums/comments/anonymous-names.enum";

interface AnonymousNameOptions {
  includeNumbers?: boolean;
  includeColor?: boolean;
  seed?: string; // For consistent names per user
}

export class AnonymousNameGenerator {
  private static getRandomElement<T>(array: readonly T[], seed?: string): T {
    if (seed) {
      // Simple seeded random for consistent names
      let hash = 0;
      for (let i = 0; i < seed.length; i++) {
        const char = seed.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash = hash & hash; // Convert to 32bit integer
      }
      const index = Math.abs(hash) % array.length;
      return array[index];
    }
    return array[Math.floor(Math.random() * array.length)];
  }

  static generate(options: AnonymousNameOptions = {}): string {
    const { includeNumbers = true, includeColor = false, seed } = options;
    
    const adjective = this.getRandomElement(ADJECTIVES, seed ? `${seed}_adj` : undefined);
    const animal = this.getRandomElement(ANIMALS, seed ? `${seed}_animal` : undefined);
    
    let name = `${adjective}${animal}`;
    
    // Optionally add color
    if (includeColor && Math.random() > 0.7) {
      const color = this.getRandomElement(COLORS, seed ? `${seed}_color` : undefined);
      name = `${adjective}${color}${animal}`;
    }
    
    // Add numbers for uniqueness
    if (includeNumbers) {
      const number = seed 
        ? Math.abs(seed.split('').reduce((a, b) => a + b.charCodeAt(0), 0)) % 999 + 1
        : Math.floor(Math.random() * 999) + 1;
      name += number;
    }
    
    return name;
  }

  // Generate consistent name for a user ID
  static generateForUser(userId: string): string {
    return this.generate({
      includeNumbers: true,
      includeColor: false,
      seed: userId
    });
  }

  // Generate completely random name
  static generateRandom(): string {
    return this.generate({
      includeNumbers: true,
      includeColor: Math.random() > 0.8, // 20% chance for color
    });
  }

  // Get avatar URL for anonymous user
  static getAvatarUrl(anonymousName: string): string {
    const colors = ['FF6B6B', '4ECDC4', '45B7D1', '96CEB4', 'FFEAA7', 'DDA0DD', 'F4A261'];
    const colorIndex = anonymousName.length % colors.length;
    const color = colors[colorIndex];
    
    return `https://ui-avatars.com/api/?name=${encodeURIComponent(anonymousName)}&background=${color}&color=fff&bold=true&size=128`;
  }
}

// Usage examples:
// AnonymousNameGenerator.generateForUser('user123') => 'SwiftEagle742' (always same for this user)
// AnonymousNameGenerator.generateRandom() => 'CleverBunny156'
// AnonymousNameGenerator.generateRandom() => 'BrightGoldenFox89'