import createNextIntlPlugin from "next-intl/plugin";

const nextConfig = {
  images: {
    domains: [
      "images.pexels.com",
      "lh3.googleusercontent.com",
      "spaceseller.ma",
      "images.unsplash.com",
      "s.gravatar.com",
    ]
  }
};
const withNextIntl = createNextIntlPlugin();
export default withNextIntl(nextConfig);