export type GalleryItem = {
  id: string;
  type: "image" | "video";
  src: string;
  title: string;
  caption?: string;
  date?: string;
};
