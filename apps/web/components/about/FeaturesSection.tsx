// components/FeaturesSection.tsx
import React from 'react';

interface FeatureProps {
  title: string;
  description: string;
  align?: 'left' | 'right';
}

const Feature: React.FC<FeatureProps> = ({ title, description, align = 'left' }) => {
  return (
    <div className={`flex flex-col ${align === 'right' ? 'items-end text-right' : 'items-start text-left'}`}>
      <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
        {title}
      </h2>
      <p className="text-gray-600 text-base md:text-lg leading-relaxed max-w-2xl">
        {description}
      </p>
    </div>
  );
};

const FeaturesSection: React.FC = () => {
  const features = [
    {
      title: "No pressure. Just better picks.",
      description:
        "Choosing what to watch can be overwhelming. With so many movies available across different platforms, users often spend more time scrolling than actually watching. This leads to frustration and decision fatigue, making the experience less enjoyable.",
      align: 'left' as const,
    },
    {
      title: "We make it personal.",
      description:
        "By selecting just a few movies you like, the system quickly learns your preferences and identifies patterns in your choices. It then recommends movies that closely match your taste, helping you find something enjoyable without wasting time.",
      align: 'right' as const,
    },
  ];

  return (
    <section 
      className="w-full bg-white py-16 md:py-24 lg:py-32 px-4 sm:px-6 lg:px-8"
      aria-labelledby="features-heading"
    >
      <div className="max-w-7xl mx-auto">
        <div className="space-y-20 md:space-y-32">
          {features.map((feature, index) => (
            <div
              key={index}
              className="flex flex-col justify-center"
            >
              <Feature
                title={feature.title}
                description={feature.description}
                align={feature.align}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;