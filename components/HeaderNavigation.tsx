'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { Home, Sprout, Coins, Cog, Settings, HelpCircle, Info, Menu, X } from 'lucide-react';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface NavItem {
  href: string;
  label: string;
  icon: React.ReactNode;
  emoji: string;
}

const navItems: NavItem[] = [
  { href: '/', label: 'Home', icon: <Home className="w-5 h-5" />, emoji: '🏠' },
  { href: '/about', label: 'About', icon: <Info className="w-5 h-5" />, emoji: '🌻' },
  { href: '/garden', label: 'Garden', icon: <Sprout className="w-5 h-5" />, emoji: '🌿' },
  { href: '/cottage', label: 'Cottage', icon: <Coins className="w-5 h-5" />, emoji: '🪙' },
  { href: '/factory', label: 'Factory', icon: <Cog className="w-5 h-5" />, emoji: '⚙️' },
  { href: '/profile', label: 'My Bloom', icon: <Settings className="w-5 h-5" />, emoji: '👤' },
  { href: '/help', label: 'Help', icon: <HelpCircle className="w-5 h-5" />, emoji: '❓' },
];

export function HeaderNavigation() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isActive = (href: string) => {
    if (href === '/') {
      return pathname === '/';
    }
    return pathname?.startsWith(href);
  };

  return (
    <>
      {/* Desktop Navigation */}
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b-2 border-primary-200 shadow-soft-lg">
        <nav className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2 text-primary-700 font-bold text-xl">
              <span className="text-2xl">🌻</span>
              <span>BloomFlow</span>
            </Link>

            {/* Desktop Tabs */}
            <div className="hidden md:flex items-center gap-1 h-full">
              {navItems.map((item) => {
                const active = isActive(item.href);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`relative flex items-center gap-2 px-4 py-2 h-full transition-all rounded-t-lg ${
                      active
                        ? 'text-primary-700 font-bold'
                        : 'text-neutral-600 hover:text-primary-600'
                    }`}
                  >
                    <span className="text-lg">{item.emoji}</span>
                    <span>{item.label}</span>
                    {active && (
                      <motion.div
                        className="absolute bottom-0 left-0 right-0 h-1 bg-terracotta rounded-t-full"
                        layoutId="activeTab"
                        initial={false}
                        transition={{
                          type: 'spring',
                          stiffness: 500,
                          damping: 30,
                        }}
                      />
                    )}
                  </Link>
                );
              })}
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-neutral-600 hover:text-primary-600 transition-colors"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </nav>
      </header>

      {/* Mobile Navigation */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden fixed top-16 left-0 right-0 z-50 bg-white border-b-2 border-primary-200 shadow-soft-lg overflow-hidden"
          >
            <nav className="container mx-auto px-4 py-4">
              <div className="flex flex-col gap-2">
                {navItems.map((item) => {
                  const active = isActive(item.href);
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                        active
                          ? 'bg-primary-50 text-primary-700 font-bold border-l-4 border-terracotta'
                          : 'text-neutral-600 hover:bg-neutral-50 hover:text-primary-600'
                      }`}
                    >
                      <span className="text-xl">{item.emoji}</span>
                      <span>{item.label}</span>
                    </Link>
                  );
                })}
              </div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
