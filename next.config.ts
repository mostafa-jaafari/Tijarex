import createNextIntlPlugin from "next-intl/plugin";

const nextConfig = {
  images: {
    domains: [
      "images.pexels.com",
      "lh3.googleusercontent.com",
      "spaceseller.ma",
      "images.unsplash.com",
      "s.gravatar.com",
      "i.pravatar.cc",
      "res.cloudinary.com"
    ]
  }
};
const withNextIntl = createNextIntlPlugin();
export default withNextIntl(nextConfig);