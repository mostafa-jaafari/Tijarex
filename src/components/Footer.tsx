import Link from 'next/link';

const Footer = () => {
  return (
    <footer className="bg-teal-900 text-white">
      <div className="container mx-auto px-4 pt-8 pb-3">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-lg  mb-4">About Us</h3>
            <p className="text-gray-400">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit.
            </p>
          </div>
          <div>
            <h3 className="text-lg  mb-4">Help</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/shipping" className="text-gray-400 hover:text-white">
                  Shipping & Delivery
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-gray-400 hover:text-white">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link href="/cancellation" className="text-gray-400 hover:text-white">
                  Cancellation & Return
                </Link>
              </li>
              <li>
                <Link href="/location" className="text-gray-400 hover:text-white">
                  Location
                </Link>
              </li>
              <li>
                <Link href="/lost-password" className="text-gray-400 hover:text-white">
                  Lost Password
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg  mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/offer-zone" className="text-gray-400 hover:text-white">
                  Offer Zone
                </Link>
              </li>
              <li>
                <Link href="/sitemap" className="text-gray-400 hover:text-white">
                  Sitemap
                </Link>
              </li>
              <li>
                <Link href="/new-launch" className="text-gray-400 hover:text-white">
                  New Launch
                </Link>
              </li>
              <li>
                <Link href="/login" className="text-gray-400 hover:text-white">
                  Login
                </Link>
              </li>
              <li>
                <Link href="/career" className="text-gray-400 hover:text-white">
                  Career
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg  mb-4">Contact</h3>
            <p className="text-gray-400">
              Address: 3548 Columbia Mine Road, Wheeling, West Virginia, 26003
            </p>
            <p className="text-gray-400">Contact: 304-559-3023</p>
            <p className="text-gray-400">E-mail: shopnow@store.com</p>
          </div>
        </div>
        <div className="mt-8 border-t border-gray-700 pt-4 text-center text-gray-400">
          <p>
            Copyright | Th Shop Mania| Developed by ThemeHunk
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;