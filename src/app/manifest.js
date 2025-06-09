export default function manifest() {
  return {
    name: "Ironclad",
    short_name: "Ironclad",
    id: "ironclad",
    description: "International application description.",
    start_url: "/",
    display: "standalone",
    background_color: "#f9f3f4",
    theme_color: "#1d293d",
    orientation: "portrait",
    form_factor: "narrow", // Optimized for mobile
    lang: "en-US",
    categories: ["Shopping", "Utilities"],
    related_applications: [
      {
        platform: "webapp",
        url: `${process.env.NEXT_PUBLIC_BASE_URL}/manifest.webmanifest`,
      },
    ],
    icons: [
      {
        src: "/img/web-app-manifest-192x192_v2.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "/img/web-app-manifest-512x512_v2.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],
    screenshots: [
      {
        src: "/img/product-image-placeholder.png",
        sizes: "817x1344",
        type: "image/png",
        form_factor: "narrow",
        label: "Ironclad App On Mobile",
      },
      // Add more screenshots as needed
    ],
  };
}
