"use client";
import { useEffect } from "react";

export default function FontLoader() {
  useEffect(() => {
    // Create and inject the font stylesheet asynchronously
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600;700&family=Open+Sans:wght@400;500;600&family=Poppins:wght@400;500;600;700&family=Lato:wght@400;500;600&display=swap';
    link.media = 'all';

    // Add to head
    document.head.appendChild(link);

    return () => {
      // Cleanup
      if (document.head.contains(link)) {
        document.head.removeChild(link);
      }
    };
  }, []);

  return null;
}