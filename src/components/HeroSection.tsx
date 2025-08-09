import Image from "next/image";
import Link from "next/link";

export function HeroSection() {
  const products = [
    {
      name: "Cozy Armchair",
      img: "https://images.pexels.com/photos/276224/pexels-photo-276224.jpeg",
      link: "#",
    },
    {
      name: "Minimal Sofa",
      img: "https://images.pexels.com/photos/276528/pexels-photo-276528.jpeg",
      link: "#",
    },
  ];

  return (
    <section 
      className="max-w-7xl mx-auto px-4 my-14 
        grid grid-cols-1 md:grid-cols-3 gap-4">
      {/* CTA Block */}
      <div 
        className="bg-teal-50 rounded-xl p-8 flex flex-col 
          justify-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Refresh your space
        </h1>
        <p className="text-gray-700 mb-6">
          Discover curated picks for your home — from statement chairs to warm
          rugs.
        </p>
        <Link
          href="#"
          className="primary-button flex justify-center 
            px-6 py-3 rounded-xl font-semibold transition"
        >
          Go Shop Now
        </Link>
      </div>

      {/* Product 1 */}
      {products.map((p, i) => (
        <Link
          href={p.link}
          key={i}
          className="relative rounded-xl overflow-hidden group"
        >
          <Image
            src={p.img}
            alt={p.name}
            width={500}
            height={500}
            className="object-cover w-full h-full group-hover:scale-105 transition duration-300"
          />
          <div className="absolute bottom-4 left-4 text-white">
            <h3 className="text-lg font-semibold">{p.name}</h3>
            <p className="text-sm opacity-90">Shop now</p>
          </div>
        </Link>
      ))}
    </section>
  );
}
