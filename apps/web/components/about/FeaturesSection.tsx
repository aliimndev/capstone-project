// components/FeaturesSection.tsx
import React from 'react';

interface FeatureProps {
  title: string;
  description: string;
  align?: 'left' | 'right';
}

const Feature: React.FC<FeatureProps> = ({ title, description, align = 'left' }) => {
  // Untuk align right, balik urutan: teks dulu, baru garis
  if (align === 'right') {
    return (
      <div className="flex gap-6 justify-end">
        {/* Content - DI KIRI GARIS */}
        <div className="flex-1 max-w-2xl text-right">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            {title}
          </h2>
          <p className="text-gray-400 text-base md:text-lg leading-relaxed">
            {description}
          </p>
        </div>
        
        {/* Accent Line (Orange Vertical Line) - DI KANAN */}
        <div className="w-1 h-full min-h-[150px] bg-orange-500 flex-shrink-0" />
      </div>
    );
  }

  // Untuk align left: garis dulu, baru teks
  return (
    <div className="flex gap-6 justify-start">
      {/* Accent Line (Orange Vertical Line) - DI KIRI */}
      <div className="w-1 h-full min-h-[150px] bg-orange-500 flex-shrink-0" />
      
      {/* Content - DI KANAN GARIS */}
      <div className="flex-1 max-w-2xl text-left">
        <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
          {title}
        </h2>
        <p className="text-gray-400 text-base md:text-lg leading-relaxed">
          {description}
        </p>
      </div>
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
      className="w-full bg-black py-16 md:py-24 lg:py-32 px-4 sm:px-6 lg:px-8"
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