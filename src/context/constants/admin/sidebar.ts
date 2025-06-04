import {
  FileText,
  Layers,
  Folder,
  Tag,
  Home,
  Brain,
  BriefcaseBusiness,
  Book,
  FolderKanban,
  CircleFadingPlus,
} from "lucide-react";

export const AdminSidebarNav = [
  { title: "Home", url: "/admin", icon: Home },
  {
    title: "Pages",
    url: "/admin/pages",
    icon: FileText,
    items: [
      { title: "Skills", url: "/admin/pages/skills", icon: Brain },
      {
        title: "Experience",
        url: "/admin/pages/experience",
        icon: BriefcaseBusiness,
      },
      { title: "Education", url: "/admin/pages/education", icon: Book },
      { title: "Projects", url: "/admin/pages/projects", icon: FolderKanban },
      { title: "Socials", url: "/admin/pages/socials", icon: CircleFadingPlus },
    ],
  },
  { title: "Sections", url: "/admin/sections", icon: Layers },
  {
    title: "Posts",
    icon: FileText,
    items: [{ title: "Blogs", url: "/admin/blogs", icon: FileText }],
  },
];
