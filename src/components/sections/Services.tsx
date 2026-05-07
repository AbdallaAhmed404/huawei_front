"use client";
import { motion } from "framer-motion";
import { Monitor, Layout, Database, ArrowRight } from "lucide-react";
import Link from "next/link"; // Imported Link

const services = [
  {
    title: "Web Architecture",
    slug: "web-architecture", // Added slug
    description:
      "Development of high-velocity web environments. We engineer for sub-second latency and global scalability using Next.js and the React ecosystem.",
    icon: <Monitor size={22} />,
    tags: ["High Performance", "Scalability", "Next.js"],
    accent: "border-scarab-gold",
  },
  {
    title: "UI/UX Design",
    slug: "ui-ux-design", // Added slug
    description:
      "Systematic visual design focused on user retention. We build research-backed interfaces that bridge the gap between human intuition and digital logic.",
    icon: <Layout size={22} />,
    tags: ["Visual Systems", "User Psychology"],
    accent: "border-foreground/20",
  },
  {
    title: "Custom Systems",
    slug: "custom-systems", // Added slug
    description:
      "Technical integration of complex business logic. From inventory management to custom CRM engines, we build the backbone of your operations.",
    icon: <Database size={22} />,
    tags: ["Logic Engines", "DB Management", "Node.js"],
    accent: "border-foreground/20",
  },
];

export default function Services() {
  return (
    <section
      id="services"
      className="py-24 md:py-48 bg-background text-foreground font-linseed transition-colors duration-500 overflow-hidden"
    >
      <div className="container mx-auto px-6 max-w-7xl">
        {/* HEADER: Technical & Industrial */}
        <div className="mb-20 md:mb-32 flex flex-col md:flex-row justify-between items-center md:items-end gap-8 md:gap-12 border-b-2 border-foreground/10 pb-16 text-center md:text-left">
          <div className="relative">
            <span className="text-[10px] font-bold uppercase tracking-[0.5em] text-scarab-gold block mb-4">
              Capabilities
            </span>
            <h2 className="text-5xl md:text-9xl font-black tracking-tighter uppercase leading-none italic">
              Our <span className="text-scarab-gold">Expertise.</span>
            </h2>
          </div>
          <div className="max-w-[320px] space-y-6 flex flex-col items-center md:items-end">
            <div className="h-px w-12 bg-scarab-gold" />
            <p className="text-[11px] uppercase tracking-widest leading-relaxed text-foreground/60 font-bold">
              Providing specialized digital solutions through an uncompromising
              engineering lens and focused architectural standards.
            </p>
          </div>
        </div>

        {/* SERVICE ROWS */}
        <div className="space-y-6 md:space-y-8">
          {services.map((service, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.8,
                delay: index * 0.1,
                ease: [0.16, 1, 0.3, 1],
              }}
              viewport={{ once: true }}
              className={`group relative flex flex-col md:grid md:grid-cols-12 gap-8 p-10 md:p-20 rounded-sm bg-foreground/2 border-2 transition-all duration-700 hover:bg-foreground/4 text-center md:text-left items-center md:items-stretch ${service.accent}`}
            >
              {/* 1. Icon Node */}
              <div className="md:col-span-2 flex items-center justify-center border-b md:border-b-0 md:border-r border-foreground/10 pb-8 md:pb-0 md:pr-10">
                <div className="w-16 h-16 rounded-2xl bg-foreground text-background flex items-center justify-center group-hover:bg-scarab-gold group-hover:scale-110 transition-all duration-500 shrink-0 shadow-lg">
                  {service.icon}
                </div>
              </div>

              {/* 2. Primary Content */}
              <div className="md:col-span-6 flex flex-col justify-center space-y-6">
                <h3 className="text-3xl md:text-5xl font-black uppercase tracking-tighter leading-none italic group-hover:text-scarab-gold transition-colors duration-500">
                  {service.title}
                </h3>
                <p className="text-sm md:text-base font-bold uppercase tracking-tight leading-relaxed text-foreground/70 max-w-lg mx-auto md:mx-0">
                  {service.description}
                </p>
              </div>

              {/* 3. Specs & Action */}
              <div className="md:col-span-4 flex flex-col justify-center items-center md:items-end gap-10">
                <div className="flex flex-wrap justify-center md:justify-end gap-3">
                  {service.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-4 py-1.5 border-2 border-foreground/10 rounded-full text-[9px] font-bold uppercase tracking-widest text-foreground/50 group-hover:text-foreground group-hover:border-scarab-gold transition-all"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
                {/* Arrow wrapped in Link */}
                <Link 
                  href={`/services/${service.slug}`}
                  className="w-16 h-16 rounded-full border-2 border-foreground/10 flex items-center justify-center group-hover:bg-foreground group-hover:text-background group-hover:border-foreground transition-all duration-500 hover:scale-110 cursor-pointer"
                >
                  <ArrowRight
                    size={24}
                    strokeWidth={3}
                    className="group-hover:translate-x-1 transition-transform"
                  />
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
