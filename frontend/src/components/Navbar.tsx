import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from './ui/Button';
import { Menu, X, Command } from 'lucide-react';
import { Link } from 'react-router-dom';

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${
        scrolled 
          ? 'bg-white border-b border-slate-200 py-4 shadow-sm' 
          : 'bg-transparent py-6'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 cursor-pointer">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-cyan-400 flex items-center justify-center shadow-lg shadow-indigo-500/20">
              <Command className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold tracking-tight text-slate-900">
              BusinessOS
            </span>
          </div>
          
          <div className="hidden md:flex items-center gap-8">
            <a href="#features" className="text-sm font-medium text-slate-600 hover:text-indigo-600 transition-colors">Features</a>
            <a href="#product" className="text-sm font-medium text-slate-600 hover:text-indigo-600 transition-colors">Product</a>
            <a href="#pricing" className="text-sm font-medium text-slate-600 hover:text-indigo-600 transition-colors">Pricing</a>
            <div className="flex items-center gap-4 ml-4">
              <a href="/login" className="text-sm font-medium text-slate-600 hover:text-indigo-600 transition-colors">Sign in</a>
              <Link to="/register">
                <Button size="sm">Start Free Trial</Button>
              </Link>
            </div>
          </div>

          <button 
            className="md:hidden p-2 text-slate-600 hover:text-indigo-600 transition-colors cursor-pointer"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white border-b border-slate-200 overflow-hidden shadow-lg"
          >
            <div className="px-6 py-6 flex flex-col gap-4">
              <a href="#features" className="text-base font-medium text-slate-700 hover:text-indigo-600">Features</a>
              <a href="#product" className="text-base font-medium text-slate-700 hover:text-indigo-600">Product</a>
              <a href="#pricing" className="text-base font-medium text-slate-700 hover:text-indigo-600">Pricing</a>
              <hr className="border-slate-200 my-2" />
              <a href="/login" className="text-base font-medium text-slate-700 hover:text-indigo-600">Sign in</a>
              <Link to="/register" className="w-full mt-2">
                <Button className="w-full">Start Free Trial</Button>
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}
