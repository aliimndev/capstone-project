// components/HeroSection.tsx
import React from 'react';

const HeroSection: React.FC = () => {
  return (
    <section className="min-h-screen flex items-center justify-center bg-white px-6 py-12">
      <div className="max-w-3xl mx-auto text-center">
        {/* Subtitle */}
        <p className="text-gray-600 text-lg mb-4 font-medium">
          About CineMatch
        </p>

        {/* Main Heading */}
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight">
          Smarter movie recommendations,
          <br />
          made simple.
        </h1>

        {/* Description */}
        <p className="text-gray-600 text-lg md:text-xl mb-8 max-w-2xl mx-auto leading-relaxed">
          This system learns your preferences from a few movies you choose,
          then suggests films that match your taste—so you can spend less time
          searching and more time watching.
        </p>

        {/* CTA Button */}
        <button className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-3 px-8 rounded-full transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2">
          Get Started
        </button>
      </div>
    </section>
  );
};

export default HeroSection;