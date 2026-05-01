// components/TeamSection.tsx
import React from 'react';

interface TeamMemberProps {
  name: string;
  jobdesk: string;
  photoUrl?: string;
}

const TeamCard: React.FC<TeamMemberProps> = ({ name, jobdesk, photoUrl }) => {
  return (
    <div className="w-full max-w-[300px] bg-gray-200 rounded-xl overflow-hidden flex flex-col transition-transform hover:-translate-y-1 hover:shadow-lg">
      {/* Photo Area */}
      <div className="h-64 md:h-72 bg-gray-300 flex items-center justify-center">
        {photoUrl ? (
          <img 
            src={photoUrl} 
            alt={name} 
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="flex flex-col items-center gap-2 text-gray-500">
            {/* Icon Placeholder */}
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              className="h-10 w-10 opacity-60" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={1.5} 
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" 
              />
            </svg>
            <span className="text-sm font-medium">Photo</span>
          </div>
        )}
      </div>

      {/* Info Area */}
      <div className="bg-gray-300/80 p-4 text-center backdrop-blur-sm">
        <h3 className="text-gray-900 font-bold text-base md:text-lg mb-1 truncate">
          {name}
        </h3>
        <p className="text-gray-700 text-sm md:text-base">
          {jobdesk}
        </p>
      </div>
    </div>
  );
};

const TeamSection: React.FC = () => {
  const teamMembers = [
    { name: "Andi Pratama", jobdesk: "Lead Developer" },
    { name: "Sari Dewi", jobdesk: "UI/UX Designer" },
    { name: "Budi Santoso", jobdesk: "Backend Engineer" },
    { name: "Rina Lestari", jobdesk: "Project Manager" },
    { name: "Dian Kurnia", jobdesk: "QA Engineer" },
  ];

  return (
    <section className="w-full bg-white py-16 md:py-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-900 mb-12">
          Our Team
        </h2>

        {/* 
         
        */}
        <div className="flex flex-wrap justify-center gap-6 md:gap-8">
          {teamMembers.map((member, index) => (
            <TeamCard
              key={index}
              name={member.name}
              jobdesk={member.jobdesk}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default TeamSection;