"use client";

// components/TeamSection.tsx
import React from 'react';
import { motion } from "motion/react";

interface TeamMemberProps {
  name: string;
  jobdesk: string;
  photoUrl?: string;
}

const TeamCard: React.FC<TeamMemberProps> = ({ name, jobdesk, photoUrl }) => {
  return (
    <div className="w-full bg-[#091020]/50 backdrop-blur-sm rounded-xl overflow-hidden flex flex-col transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_0_30px_rgba(0,210,255,0.15)] border border-white/10 hover:border-[#00d2ff]/30">
      {/* Photo Area */}
      <div className="aspect-square bg-[#091020] flex items-center justify-center overflow-hidden">
        {photoUrl ? (
          <img
            src={photoUrl}
            alt={name}
            className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
            loading="lazy"
          />
        ) : (
          <div className="flex flex-col items-center gap-2 text-gray-500">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-12 w-12 opacity-60"
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
      <div className="bg-[#091020]/80 p-4 text-center backdrop-blur-sm border-t border-white/5">
        <h3 className="text-white font-bold text-base md:text-lg mb-1 truncate">
          {name}
        </h3>
        <p className="text-gray-400 text-sm md:text-base">
          {jobdesk}
        </p>
      </div>
    </div>
  );
};

const TeamSection: React.FC = () => {
  const teamMembers = [
    {
      name: "Ali Imannudin",
      jobdesk: "Full Stack Engineer",
      photoUrl: "/team/ali.jpeg"
    },
    {
      name: "Arinda Setyo Rini",
      jobdesk: "UI/UX Designer",
      photoUrl: "/team/arinda.jpg"
    },
    {
      name: "Joshua Christian Benedict",
      jobdesk: "Backend Engineer",
      photoUrl: "/team/joshua.jpg"
    },
    {
      name: "Shandy Putraniar Budianto",
      jobdesk: "ML Engineer",
      photoUrl: "/team/shandy.jpg"
    },
    {
      name: "Rizki Dwi Febriansyahia",
      jobdesk: "QA Engineer",
      photoUrl: "/team/dwi.png"
    },
  ];

  return (
    <section className="w-full bg-transparent py-16 md:py-24 px-4 sm:px-6 lg:px-8 relative z-10">
      <div className="max-w-6xl mx-auto">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="text-3xl md:text-4xl font-bold text-center text-white mb-12"
        >
          Our Team
        </motion.h2>

        {/* ✨ Flexbox dengan justify-center agar baris yang tidak penuh otomatis center */}
        <div className="flex flex-wrap justify-center gap-6 md:gap-8">
          {teamMembers.map((member, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              whileInView={{ opacity: 1, scale: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: index * 0.1, ease: [0.22, 1, 0.36, 1] }}

              className="w-full sm:w-[calc(50%-12px)] lg:w-[calc(33.333%-22px)] max-w-[300px]"
            >
              <TeamCard
                name={member.name}
                jobdesk={member.jobdesk}
                photoUrl={member.photoUrl}
              />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TeamSection;