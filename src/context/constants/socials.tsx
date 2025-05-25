import type { SocialLink } from "@/types/home/socials";
import {
  IconBrandFacebook,
  IconBrandInstagram,
  IconBrandTwitter,
  IconBrandLinkedin,
  IconBrandGithub,
} from "@tabler/icons-react";
import { JSX } from "react";

export const Socials: Omit<SocialLink, "icon">[] = [
  {
    name: "Facebook",
    username: "@yourfacebook",
    url: "https://facebook.com/yourfacebook",
  },
  {
    name: "Instagram",
    username: "@yourinstagram",
    url: "https://instagram.com/yourinstagram",
  },
  {
    name: "Twitter",
    username: "@yourtwitter",
    url: "https://twitter.com/yourtwitter",
  },
  {
    name: "LinkedIn",
    username: "@yourlinkedin",
    url: "https://linkedin.com/in/yourlinkedin",
  },
  {
    name: "GitHub",
    username: "@yourgithub",
    url: "https://github.com/yourgithub",
  },
] as const;

export const IconMap: Record<string, JSX.Element> = {
  Facebook: <IconBrandFacebook size={32} stroke={1.5} />,
  Instagram: <IconBrandInstagram size={32} stroke={1.5} />,
  Twitter: <IconBrandTwitter size={32} stroke={1.5} />,
  LinkedIn: <IconBrandLinkedin size={32} stroke={1.5} />,
  GitHub: <IconBrandGithub size={32} stroke={1.5} />,
};
