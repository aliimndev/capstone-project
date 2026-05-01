// components/WhyUseSection.tsx
import React from 'react';

interface FeatureItemProps {
  icon: React.ReactNode;
  text: string;
}

const FeatureItem: React.FC<FeatureItemProps> = ({ icon, text }) => {
  return (
    <div className="flex items-center gap-3 bg-gray-200 hover:bg-gray-300 transition-colors duration-200 rounded-full px-4 py-3 w-full max-w-2xl mx-auto">
      <div className="flex-shrink-0 text-gray-800">
        {icon}
      </div>
      <span className="text-gray-800 text-sm md:text-base font-medium">
        {text}
      </span>
    </div>
  );
};

const WhyUseSection: React.FC = () => {
  const features = [
    {
      icon: (
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          className="h-5 w-5" 
          viewBox="0 0 20 20" 
          fill="currentColor"
          aria-hidden="true"
        >
          <path 
            fillRule="evenodd" 
            d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" 
            clipRule="evenodd" 
          />
        </svg>
      ),
      text: "Personalized recommendations based on your favorite movies",
    },
    {
      icon: (
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          className="h-5 w-5" 
          viewBox="0 0 20 20" 
          fill="currentColor"
          aria-hidden="true"
        >
          <path 
            fillRule="evenodd" 
            d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" 
            clipRule="evenodd" 
          />
        </svg>
      ),
      text: "Discover movies similar to what you already enjoy",
    },
    {
      icon: (
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          className="h-5 w-5" 
          viewBox="0 0 20 20" 
          fill="currentColor"
          aria-hidden="true"
        >
          <path 
            fillRule="evenodd" 
            d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" 
            clipRule="evenodd" 
          />
        </svg>
      ),
      text: "Find what to watch quickly and easily",
    },
  ];

  return (
    <section 
      className="w-full bg-white py-16 md:py-20 px-4 sm:px-6 lg:px-8"
      aria-labelledby="why-use-heading"
    >
      <div className="max-w-4xl mx-auto">
        {/* Heading */}
        <h2 
          id="why-use-heading"
          className="text-3xl md:text-4xl font-bold text-center text-gray-900 mb-10 md:mb-12"
        >
          Why Use This?
        </h2>

        {/* Features List */}
        <div className="space-y-4">
          {features.map((feature, index) => (
            <FeatureItem
              key={index}
              icon={feature.icon}
              text={feature.text}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhyUseSection;