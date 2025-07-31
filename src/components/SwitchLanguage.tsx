'use client';
import Link from 'next/link';
import { Languages } from 'lucide-react';
import { usePathname, useSearchParams } from 'next/navigation';
import { useState, useRef, useEffect } from 'react';
import Image from 'next/image';

// Add as many languages as you want here
const locales = [
  { code: 'en', label: 'English', flag: '/UkFlag.png', short: 'English' },
  { code: 'ar', label: 'العربية', flag: '/SaudiaFlag.png', short: 'العربية' },
  // Add more languages as needed
];

function getPathWithLocale(pathname: string, locale: string) {
  const localeCodes = locales.map(l => l.code);
  const segments = pathname.split('/');
  if (segments[0] === '') segments.shift();
  if (localeCodes.includes(segments[0])) segments.shift();
  return `/${locale}/${segments.join('/')}`;
}

export function SwitchLanguage({ CLASSNAME }: { CLASSNAME?: string }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Get current locale from pathname
  const segments = pathname.split('/').filter(Boolean);
  const currentLocaleCode = segments[0] && locales.some(l => l.code === segments[0]) ? segments[0] : 'en';
  const currentLocale = locales.find(l => l.code === currentLocaleCode) || locales[0];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={CLASSNAME}
      >
        <span className="text-base">
          <Languages size={20} />
        </span>
        <span className="uppercase">{currentLocale.code}</span>
        <svg
          className={`w-3 h-3 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute top-full right-0 mt-2 
        bg-blue-50 rounded-lg shadow-lg 
        border border-gray-200 overflow-hidden z-50 min-w-[120px] w-full">
          {locales.map(({ code, flag, short }) => {
            const newPath = getPathWithLocale(pathname, code);
            const search = searchParams.toString();
            const href = search ? `${newPath}?${search}` : newPath;

            return (
              <Link
                key={code}
                href={href}
                locale={false}
                replace
                onClick={() => setIsOpen(false)}
              >
                <button
                  className={`flex items-center gap-2 w-full px-3 py-2 
                    text-sm transition-colors text-left 
                    ${currentLocaleCode === code ? 
                      'bg-blue-600 text-white' 
                      : 
                      'text-gray-700 hover:bg-neutral-200'
                  }`}
                >
                  <div
                    className='relative w-6 h-6 overflow-hidden rounded-lg'
                  >
                    <Image 
                      src={flag}
                      fill
                      alt={`${short} flag`}
                      className='object-contain'
                    />
                  </div>
                  <span className="font-medium">{short}</span>
                </button>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}