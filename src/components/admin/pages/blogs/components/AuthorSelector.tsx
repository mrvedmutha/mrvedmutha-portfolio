import * as React from "react";
import axios from "axios";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";

interface Author {
  _id: string;
  name: string;
  email: string;
  avatarUrl?: string;
}

interface AuthorSelectorProps {
  authorId: string;
  setAuthorId: (id: string) => void;
}

const AuthorSelector: React.FC<AuthorSelectorProps> = ({
  authorId,
  setAuthorId,
}) => {
  const { toast } = useToast();
  const [authors, setAuthors] = React.useState<Author[]>([]);
  const [showAddAuthor, setShowAddAuthor] = React.useState(false);
  const [newAuthorName, setNewAuthorName] = React.useState("");
  const [newAuthorEmail, setNewAuthorEmail] = React.useState("");
  const [newAuthorAvatarUrl, setNewAuthorAvatarUrl] = React.useState("");
  const [newAuthorAvatarFile, setNewAuthorAvatarFile] =
    React.useState<File | null>(null);
  const [loading, setLoading] = React.useState(false);

  const fetchAuthors = async () => {
    try {
      const res = await axios.get("/api/v1/admin/blogs/authors");
      setAuthors(res.data.data || res.data);
      toast({
        title: "Success",
        description: "Authors fetched successfully",
      });
    } catch (e: any) {
      toast({
        title: "Error",
        description: "Failed to fetch authors",
        variant: "destructive",
      });
    }
  };

  React.useEffect(() => {
    fetchAuthors();
  }, []);

  const handleAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setNewAuthorAvatarFile(file);
      const reader = new FileReader();
      reader.onload = (ev) => {
        setNewAuthorAvatarUrl(ev.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async () => {
    if (!newAuthorName || !newAuthorEmail) return;
    setLoading(true);
    try {
      let res;
      if (newAuthorAvatarFile) {
        const formData = new FormData();
        formData.append("name", newAuthorName);
        formData.append("email", newAuthorEmail);
        formData.append("avatar", newAuthorAvatarFile);
        res = await axios.post("/api/v1/admin/blogs/authors/create", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      } else {
        res = await axios.post("/api/v1/admin/blogs/authors/create", {
          name: newAuthorName,
          email: newAuthorEmail,
          avatarUrl: newAuthorAvatarUrl,
        });
      }
      toast({ title: "Success", description: "Author added" });
      setNewAuthorName("");
      setNewAuthorEmail("");
      setNewAuthorAvatarUrl("");
      setNewAuthorAvatarFile(null);
      setShowAddAuthor(false);
      await fetchAuthors();
      if (res.data && res.data.data && res.data.data._id) {
        setAuthorId(res.data.data._id);
      }
    } catch (e: any) {
      toast({
        title: "Error",
        description:
          e?.response?.data?.message || e.message || "Failed to add author",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Accordion type="single" collapsible className="mb-8">
      <AccordionItem value="author">
        <AccordionTrigger>Author</AccordionTrigger>
        <AccordionContent>
          <div className="flex flex-col gap-4">
            <Select value={authorId} onValueChange={setAuthorId}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select author" />
              </SelectTrigger>
              <SelectContent>
                {authors.map((a) => (
                  <SelectItem key={a._id} value={a._id}>
                    {a.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {!showAddAuthor ? (
              <Button
                size="sm"
                className="w-full"
                onClick={() => setShowAddAuthor(true)}
              >
                Add Author
              </Button>
            ) : (
              <div className="flex flex-col gap-2 w-full">
                <Input
                  placeholder="New author name"
                  value={newAuthorName}
                  onChange={(e) => setNewAuthorName(e.target.value)}
                  className="w-full"
                />
                <Input
                  placeholder="New author email"
                  value={newAuthorEmail}
                  onChange={(e) => setNewAuthorEmail(e.target.value)}
                  className="w-full"
                  type="email"
                />
                <div className="flex items-center gap-2">
                  <Input
                    placeholder="Avatar URL"
                    value={newAuthorAvatarUrl}
                    onChange={(e) => {
                      setNewAuthorAvatarUrl(e.target.value);
                      setNewAuthorAvatarFile(null);
                    }}
                    className="w-full"
                  />
                  <label className="cursor-pointer px-2 py-1 border rounded text-xs bg-gray-100 hover:bg-gray-200">
                    Upload
                    <input
                      type="file"
                      accept="image/*"
                      style={{ display: "none" }}
                      onChange={handleAvatarUpload}
                    />
                  </label>
                </div>
                {newAuthorAvatarUrl && (
                  <img
                    src={newAuthorAvatarUrl}
                    alt="Avatar Preview"
                    className="w-12 h-12 object-cover rounded border"
                  />
                )}
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    className="flex-1"
                    variant="outline"
                    onClick={() => setShowAddAuthor(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    size="sm"
                    className="flex-1"
                    onClick={handleSave}
                    disabled={loading}
                  >
                    {loading ? "Saving..." : "Save"}
                  </Button>
                </div>
              </div>
            )}
          </div>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
};

export default AuthorSelector;
