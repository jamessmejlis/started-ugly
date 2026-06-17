import type { MetadataRoute } from "next";
import { siteName } from "@/lib/site";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: siteName,
    short_name: "sfd",
    description: "A directory of embarrassing first versions.",
    start_url: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#9a3328",
    icons: [{ src: "/icon.svg", sizes: "any", type: "image/svg+xml" }],
  };
}
