import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-linear-to-r from-gray-800 via-gray-900 to-gray-800 text-white mt-auto border-t border-gray-700">
      <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="text-center md:text-left">
            <p className="text-sm text-gray-300 flex items-center gap-2">
              <span className="text-xl">🛍️</span>
              © {new Date().getFullYear()} Grocery Management System. All rights reserved.
            </p>
            <p className="text-xs text-gray-400 mt-1">Made with ❤️ for better grocery management</p>
          </div>
          <div className="flex space-x-6">
            <a href="#" className="text-gray-400 hover:text-white transition-all hover:scale-110 transform">
              <span className="sr-only">About</span>
              <span className="text-sm font-medium">About</span>
            </a>
            <a href="#" className="text-gray-400 hover:text-white transition-all hover:scale-110 transform">
              <span className="sr-only">Privacy</span>
              <span className="text-sm font-medium">Privacy</span>
            </a>
            <a href="#" className="text-gray-400 hover:text-white transition-all hover:scale-110 transform">
              <span className="sr-only">Terms</span>
              <span className="text-sm font-medium">Terms</span>
            </a>
            <a href="#" className="text-gray-400 hover:text-white transition-all hover:scale-110 transform">
              <span className="sr-only">Contact</span>
              <span className="text-sm font-medium">Contact</span>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
