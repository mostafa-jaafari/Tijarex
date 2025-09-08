import Link from 'next/link';
import { Facebook, Twitter, Instagram, Linkedin, MapPin, Phone, Mail, Send } from 'lucide-react';

// --- Data for Footer Links (Easy to update) ---
const helpLinks = [
  { href: '/shipping', text: 'Shipping & Delivery' },
  { href: '/contact', text: 'Contact Us' },
  { href: '/cancellation', text: 'Cancellation & Return' },
  { href: '/faq', text: 'FAQ' },
];

const quickLinks = [
  { href: '/offer-zone', text: 'Offer Zone' },
  { href: '/sitemap', text: 'Sitemap' },
  { href: '/login', text: 'Login / Register' },
  { href: '/career', text: 'Career' },
];


// --- Main Footer Component ---
const Footer = () => {
  return (
    <footer className="bg-teal-950 text-neutral-200">
      <div className="container mx-auto px-6 lg:px-8">
        
        {/* === Section 1: Newsletter Subscription === */}
        <div className="py-12 flex flex-col lg:flex-row justify-between items-center gap-8 border-b border-teal-800">
          <div className="text-center lg:text-left">
            <h2 className="text-2xl font-bold text-white">Subscribe to Our Newsletter</h2>
            <p className="mt-2 text-neutral-400">Get the latest updates on new products and upcoming sales.</p>
          </div>
          <form className="w-full max-w-md">
            <div className="flex items-center border border-teal-700 rounded-lg overflow-hidden bg-teal-900 focus-within:ring-2 focus-within:ring-teal-500">
              <input 
                type="email" 
                placeholder="Your email address" 
                className="w-full px-4 py-3 bg-transparent text-white placeholder-neutral-400 focus:outline-none"
              />
              <button 
                type="submit" 
                aria-label="Subscribe"
                className="px-5 py-3 bg-teal-600 hover:bg-teal-500 transition-colors"
              >
                <Send size={20} />
              </button>
            </div>
          </form>
        </div>

        {/* === Section 2: Main Footer Links & Info === */}
        <div className="py-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* About Us Column */}
          <div className="sm:col-span-2 lg:col-span-1">
            <h3 className="text-xl font-semibold text-white mb-4">TIJAREX</h3>
            <p className="text-neutral-400 leading-relaxed">
              Your trusted marketplace for quality products. We are dedicated to bringing you the best deals and an unparalleled shopping experience.
            </p>
          </div>

          {/* Help Column */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">Help</h3>
            <ul className="space-y-3">
              {helpLinks.map(link => (
                <li key={link.href}>
                  <Link href={link.href} className="text-neutral-400 hover:text-teal-400 transition-colors">
                    {link.text}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Quick Links Column */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">Quick Links</h3>
            <ul className="space-y-3">
              {quickLinks.map(link => (
                <li key={link.href}>
                  <Link href={link.href} className="text-neutral-400 hover:text-teal-400 transition-colors">
                    {link.text}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Column */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">Contact</h3>
            <ul className="space-y-4 text-neutral-400">
              <li className="flex items-start gap-3">
                <MapPin size={20} className="mt-1 flex-shrink-0 text-teal-400" />
                <span>3548 Columbia Mine Road, Wheeling, WV 26003</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone size={20} className="flex-shrink-0 text-teal-400" />
                <a href="tel:304-559-3023" className="hover:text-teal-400">304-559-3023</a>
              </li>
              <li className="flex items-center gap-3">
                <Mail size={20} className="flex-shrink-0 text-teal-400" />
                <a href="mailto:shopnow@store.com" className="hover:text-teal-400">shopnow@store.com</a>
              </li>
            </ul>
          </div>
        </div>
        
        {/* === Section 3: Copyright & Social Links === */}
        <div className="py-6 flex flex-col-reverse sm:flex-row justify-between items-center border-t border-teal-800">
          <p className="text-sm text-neutral-500 mt-4 sm:mt-0">
            &copy; {new Date().getFullYear()} Tijarex. All Rights Reserved.
          </p>
          <div className="flex space-x-5">
            <Link href="#" aria-label="Facebook" className="text-neutral-400 hover:text-teal-400 transition-colors">
              <Facebook size={22} />
            </Link>
            <Link href="#" aria-label="Twitter" className="text-neutral-400 hover:text-teal-400 transition-colors">
              <Twitter size={22} />
            </Link>
            <Link href="#" aria-label="Instagram" className="text-neutral-400 hover:text-teal-400 transition-colors">
              <Instagram size={22} />
            </Link>
            <Link href="#" aria-label="LinkedIn" className="text-neutral-400 hover:text-teal-400 transition-colors">
              <Linkedin size={22} />
            </Link>
          </div>
        </div>

      </div>
    </footer>
  );
};

export default Footer;