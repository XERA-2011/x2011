'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, useScroll, useTransform, MotionValue } from 'framer-motion';

// ==========================================
// REUSABLE COMPONENTS
// ==========================================

// 1. ContactButton
const ContactButton = () => {
  return (
    <button
      style={{
        background: 'linear-gradient(123deg, #18011F 7%, #B600A8 37%, #7621B0 72%, #BE4C00 100%)',
        boxShadow: '0px 4px 4px rgba(181, 1, 167, 0.25), inset 4px 4px 12px #7721B1',
        outline: '2px solid white',
        outlineOffset: '-3px',
      }}
      className="rounded-full px-8 py-3 sm:px-10 sm:py-3.5 md:px-12 md:py-4 text-white font-medium uppercase tracking-widest text-xs sm:text-sm md:text-base cursor-pointer hover:scale-105 active:scale-95 transition-transform shrink-0"
    >
      Contact Me
    </button>
  );
};

// 2. LiveProjectButton
const LiveProjectButton = () => {
  return (
    <button className="rounded-full border-2 border-[#D7E2EA] text-[#D7E2EA] font-medium uppercase tracking-widest px-8 py-3 sm:px-10 sm:py-3.5 text-sm sm:text-base hover:bg-[#D7E2EA]/10 active:scale-95 transition-all cursor-pointer inline-flex items-center justify-center">
      Live Project
    </button>
  );
};

// 3. FadeIn (Framer Motion wrapper)
interface FadeInProps {
  children: React.ReactNode;
  delay?: number;
  duration?: number;
  x?: number;
  y?: number;
  as?: 'div' | 'span' | 'p' | 'nav' | 'section';
  className?: string;
}

const FadeIn: React.FC<FadeInProps> = ({
  children,
  delay = 0,
  duration = 0.7,
  x = 0,
  y = 30,
  as = 'div',
  className = '',
}) => {
  const MotionComponent =
    as === 'span' ? motion.span :
    as === 'p' ? motion.p :
    as === 'nav' ? motion.nav :
    as === 'section' ? motion.section :
    motion.div;

  return (
    <MotionComponent
      initial={{ opacity: 0, x, y }}
      whileInView={{ opacity: 1, x: 0, y: 0 }}
      viewport={{ once: true, margin: '50px', amount: 0 }}
      transition={{
        delay,
        duration,
        ease: [0.25, 0.1, 0.25, 1],
      }}
      className={className}
    >
      {children}
    </MotionComponent>
  );
};

// 4. Magnet (Mouse-following magnetic hover effect)
interface MagnetProps {
  children: React.ReactNode;
  padding?: number;
  strength?: number;
  activeTransition?: string;
  inactiveTransition?: string;
  className?: string;
}

const Magnet: React.FC<MagnetProps> = ({
  children,
  padding = 150,
  strength = 3,
  activeTransition = 'transform 0.3s ease-out',
  inactiveTransition = 'transform 0.6s ease-in-out',
  className = '',
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const [transform, setTransform] = useState('translate3d(0px, 0px, 0px)');
  const [transition, setTransition] = useState(inactiveTransition);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!ref.current) return;

      const rect = ref.current.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const mx = e.clientX;
      const my = e.clientY;

      const isWithinX = mx >= rect.left - padding && mx <= rect.right + padding;
      const isWithinY = my >= rect.top - padding && my <= rect.bottom + padding;

      if (isWithinX && isWithinY) {
        const dx = (mx - cx) / strength;
        const dy = (my - cy) / strength;

        setTransition(activeTransition);
        setTransform(`translate3d(${dx}px, ${dy}px, 0px)`);
      } else {
        setTransition(inactiveTransition);
        setTransform('translate3d(0px, 0px, 0px)');
      }
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, [padding, strength, activeTransition, inactiveTransition]);

  return (
    <div
      ref={ref}
      style={{
        transform,
        transition,
        willChange: 'transform',
      }}
      className={className}
    >
      {children}
    </div>
  );
};

// 5. AnimatedText (Scroll-reveal character-by-character animation)
interface AnimatedTextProps {
  text: string;
  className?: string;
  style?: React.CSSProperties;
}

interface AnimatedCharProps {
  char: string;
  index: number;
  totalChars: number;
  progress: MotionValue<number>;
}

const AnimatedChar: React.FC<AnimatedCharProps> = ({ char, index, totalChars, progress }) => {
  const start = index / totalChars;
  const end = Math.min(1, (index + 4) / totalChars);
  const opacity = useTransform(progress, [start, end], [0.2, 1]);

  return (
    <span className="relative inline-block whitespace-pre">
      <span className="opacity-0">{char}</span>
      <motion.span
        style={{ opacity }}
        className="absolute inset-0 select-none"
      >
        {char}
      </motion.span>
    </span>
  );
};

const AnimatedText: React.FC<AnimatedTextProps> = ({ text, className = '', style }) => {
  const containerRef = useRef<HTMLParagraphElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start 0.8', 'end 0.2'],
  });

  const characters = text.split('');
  const totalChars = characters.length;

  return (
    <div ref={containerRef} style={style} className={`${className} relative`}>
      {/* Visually hidden text for screen readers and SEO */}
      <span className="sr-only">{text}</span>

      {/* Animated text hidden from screen readers to prevent duplicate reading */}
      <span aria-hidden="true" className="flex flex-wrap justify-center">
        {characters.map((char, index) => (
          <AnimatedChar
            key={index}
            char={char}
            index={index}
            totalChars={totalChars}
            progress={scrollYProgress}
          />
        ))}
      </span>
    </div>
  );
};

// ==========================================
// SECTIONS
// ==========================================

// 1. Hero Section
const HeroSection = () => {
  return (
    <section className="relative h-screen w-full flex flex-col justify-between overflow-hidden bg-[#0C0C0C]">
      {/* Navbar wrapper */}
      <FadeIn delay={0} y={-20} className="w-full px-6 md:px-10 pt-6 md:pt-8 z-30">
        <header className="flex justify-between items-center w-full">
          <nav className="flex justify-between w-full text-sm md:text-lg lg:text-[1.4rem] text-[#D7E2EA] font-medium uppercase tracking-wider">
            <a href="#about" className="hover:opacity-70 transition-opacity duration-200">About</a>
            <a href="#lab" className="hover:opacity-70 transition-opacity duration-200">Lab</a>
            <a href="#projects" className="hover:opacity-70 transition-opacity duration-200">Projects</a>
            <a href="#contact" className="hover:opacity-70 transition-opacity duration-200">Contact</a>
          </nav>
        </header>
      </FadeIn>

      {/* Hero Portrait - absolutely positioned behind titles/content but above video/background */}
      <FadeIn
        delay={0.6}
        y={30}
        className="absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2 sm:top-auto sm:translate-y-0 sm:bottom-0 z-10"
      >
        <Magnet
          padding={150}
          strength={3}
          activeTransition="transform 0.3s ease-out"
          inactiveTransition="transform 0.6s ease-in-out"
          className="w-[280px] sm:w-[360px] md:w-[440px] lg:w-[520px] flex justify-center"
        >
          <img
            src="https://shrug-person-78902957.figma.site/_components/v2/d24c01ad3a56fc65e942a1f501eb73db42d7cf9a/Rectangle_40443.81459862.png"
            alt="Jack portrait"
            className="w-full h-auto object-contain pointer-events-none select-none"
          />
        </Magnet>
      </FadeIn>

      {/* Hero Heading wrapper */}
      <div className="relative z-0 mt-6 sm:mt-4 md:-mt-5 overflow-hidden w-full select-none pointer-events-none">
        <FadeIn delay={0.15} y={40}>
          <h1 className="hero-heading text-[14vw] sm:text-[15vw] md:text-[16vw] lg:text-[17.5vw] font-black uppercase tracking-tight leading-none whitespace-nowrap w-full text-center">
            Hi, i&apos;m jack
          </h1>
        </FadeIn>
      </div>

      {/* Bottom Bar */}
      <div className="relative z-20 flex justify-between items-end w-full px-6 md:px-10 pb-7 sm:pb-8 md:pb-10">
        <FadeIn delay={0.35} y={20}>
          <p className="text-[#D7E2EA] font-light uppercase tracking-wide leading-snug max-w-[160px] sm:max-w-[220px] md:max-w-[260px]" style={{ fontSize: 'clamp(0.75rem, 1.4vw, 1.5rem)' }}>
            a 3d creator driven by crafting striking and unforgettable projects
          </p>
        </FadeIn>

        <FadeIn delay={0.5} y={20}>
          <ContactButton />
        </FadeIn>
      </div>
    </section>
  );
};

// 2. Marquee Section
const row1Images = [
  'https://motionsites.ai/assets/hero-space-voyage-preview-eECLH3Yc.gif',
  'https://motionsites.ai/assets/hero-codenest-preview-Cgppc2qV.gif',
  'https://motionsites.ai/assets/hero-vex-ventures-preview-BczMFIiw.gif',
  'https://motionsites.ai/assets/hero-stellar-ai-v2-preview-DjvxjG3C.gif',
  'https://motionsites.ai/assets/hero-asme-preview-B_nGDnTP.gif',
  'https://motionsites.ai/assets/hero-transform-data-preview-Cx5OU29N.gif',
  'https://motionsites.ai/assets/hero-vitara-preview-Cjz2QYyU.gif',
  'https://motionsites.ai/assets/hero-terra-preview-BFjrCr7T.gif',
  'https://motionsites.ai/assets/hero-skyelite-preview-DHaZIgUv.gif',
  'https://motionsites.ai/assets/hero-aethera-preview-DknSlcTa.gif',
  'https://motionsites.ai/assets/hero-designpro-preview-D8c5_een.gif',
];

const row2Images = [
  'https://motionsites.ai/assets/hero-stellar-ai-preview-D3HL6bw1.gif',
  'https://motionsites.ai/assets/hero-xportfolio-preview-D4A8maiC.gif',
  'https://motionsites.ai/assets/hero-orbit-web3-preview-BXt4OttD.gif',
  'https://motionsites.ai/assets/hero-nexora-preview-cx5HmUgo.gif',
  'https://motionsites.ai/assets/hero-evr-ventures-preview-DZxeVFEX.gif',
  'https://motionsites.ai/assets/hero-planet-orbit-preview-DWAP8Z1P.gif',
  'https://motionsites.ai/assets/hero-new-era-preview-CocuDUm9.gif',
  'https://motionsites.ai/assets/hero-wealth-preview-B70idl_u.gif',
  'https://motionsites.ai/assets/hero-luminex-preview-CxOP7ce6.gif',
  'https://motionsites.ai/assets/hero-celestia-preview-0yO3jXO8.gif',
];

const MarqueeSection = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [offset, setOffset] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      if (!sectionRef.current) return;
      const rect = sectionRef.current.getBoundingClientRect();
      const sectionTop = window.scrollY + rect.top;
      const currentOffset = (window.scrollY - sectionTop + window.innerHeight) * 0.3;
      setOffset(currentOffset);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      className="bg-[#0C0C0C] pt-24 sm:pt-32 md:pt-40 pb-10 overflow-hidden flex flex-col gap-3 w-full"
    >
      {/* Row 1: Moves right on scroll */}
      <div className="overflow-hidden w-full">
        <div
          style={{
            transform: `translate3d(${offset - 200}px, 0px, 0px)`,
            willChange: 'transform',
          }}
          className="flex gap-3 whitespace-nowrap w-max"
        >
          {[...row1Images, ...row1Images, ...row1Images].map((url, i) => (
            <img
              key={`row1-${i}`}
              src={url}
              alt={`Gallery item row1-${i}`}
              loading="lazy"
              className="w-[420px] h-[270px] rounded-2xl object-cover shrink-0 select-none pointer-events-none"
            />
          ))}
        </div>
      </div>

      {/* Row 2: Moves left on scroll */}
      <div className="overflow-hidden w-full">
        <div
          style={{
            transform: `translate3d(${-(offset - 200)}px, 0px, 0px)`,
            willChange: 'transform',
          }}
          className="flex gap-3 whitespace-nowrap w-max"
        >
          {[...row2Images, ...row2Images, ...row2Images].map((url, i) => (
            <img
              key={`row2-${i}`}
              src={url}
              alt={`Gallery item row2-${i}`}
              loading="lazy"
              className="w-[420px] h-[270px] rounded-2xl object-cover shrink-0 select-none pointer-events-none"
            />
          ))}
        </div>
      </div>
    </section>
  );
};

// 3. About Section
const AboutSection = () => {
  return (
    <section
      id="about"
      className="relative min-h-screen w-full flex flex-col items-center justify-center bg-[#0C0C0C] px-5 sm:px-8 md:px-10 py-20 overflow-hidden"
    >
      {/* Corner Corner Image Graphics */}
      {/* Top Left: Moon */}
      <FadeIn
        delay={0.1}
        x={-80}
        y={0}
        duration={0.9}
        className="absolute top-[4%] left-[1%] sm:left-[2%] md:left-[4%] z-10 pointer-events-none select-none"
      >
        <img
          src="https://shrug-person-78902957.figma.site/_components/v2/ebb2b8f25d8e24d5f0a5ca8af4c950de81aa2fd7/moon_icon.11395d36.png"
          alt="Moon icon"
          className="w-[120px] sm:w-[160px] md:w-[210px] h-auto object-contain"
        />
      </FadeIn>

      {/* Bottom Left: 3D Object */}
      <FadeIn
        delay={0.25}
        x={-80}
        y={0}
        duration={0.9}
        className="absolute bottom-[8%] left-[3%] sm:left-[6%] md:left-[10%] z-10 pointer-events-none select-none"
      >
        <img
          src="https://shrug-person-78902957.figma.site/_components/v2/ebb2b8f25d8e24d5f0a5ca8af4c950de81aa2fd7/p59_1.4659672e.png"
          alt="Abstract 3D object"
          className="w-[100px] sm:w-[140px] md:w-[180px] h-auto object-contain"
        />
      </FadeIn>

      {/* Top Right: Lego */}
      <FadeIn
        delay={0.15}
        x={80}
        y={0}
        duration={0.9}
        className="absolute top-[4%] right-[1%] sm:right-[2%] md:right-[4%] z-10 pointer-events-none select-none"
      >
        <img
          src="https://shrug-person-78902957.figma.site/_components/v2/ebb2b8f25d8e24d5f0a5ca8af4c950de81aa2fd7/lego_icon-1.703bb594.png"
          alt="Lego icon"
          className="w-[120px] sm:w-[160px] md:w-[210px] h-auto object-contain"
        />
      </FadeIn>

      {/* Bottom Right: 3D Group */}
      <FadeIn
        delay={0.3}
        x={80}
        y={0}
        duration={0.9}
        className="absolute bottom-[8%] right-[3%] sm:right-[6%] md:right-[10%] z-10 pointer-events-none select-none"
      >
        <img
          src="https://shrug-person-78902957.figma.site/_components/v2/ebb2b8f25d8e24d5f0a5ca8af4c950de81aa2fd7/Group_134-1.2e04f3ce.png"
          alt="3D objects group"
          className="w-[130px] sm:w-[170px] md:w-[220px] h-auto object-contain"
        />
      </FadeIn>

      {/* Heading */}
      <FadeIn delay={0} y={40} className="z-10 text-center select-none">
        <h2 className="hero-heading font-black uppercase leading-none tracking-tight" style={{ fontSize: 'clamp(3rem, 12vw, 160px)' }}>
          About me
        </h2>
      </FadeIn>

      {/* Text block and button container */}
      <div className="z-10 flex flex-col items-center mt-10 sm:mt-14 md:mt-16 gap-16 sm:gap-20 md:gap-24">
        <div className="max-w-[560px] text-center px-4">
          <AnimatedText
            text="With more than five years of experience in design, i focus on branding, web design, and user experience, i truly enjoy working with businesses that aim to stand out and present their best image. Let's build something incredible together!"
            className="text-[#D7E2EA] font-medium leading-relaxed"
            style={{ fontSize: 'clamp(1rem, 2vw, 1.35rem)' }}
          />
        </div>

        <FadeIn delay={0.4} y={30}>
          <ContactButton />
        </FadeIn>
      </div>
    </section>
  );
};

// 4. Services Section
const servicesData = [
  {
    number: '01',
    name: '3D Modeling',
    description: 'Creation of detailed objects, characters, or environments tailored to specific client needs, ideal for games, products, and visualizations.',
  },
  {
    number: '02',
    name: 'Rendering',
    description: 'High-quality, photorealistic renders that showcase designs with custom lighting, textures, and materials to bring concepts to life.',
  },
  {
    number: '03',
    name: 'Motion Design',
    description: 'Dynamic animations and motion graphics that add energy and storytelling to brands, products, and digital experiences.',
  },
  {
    number: '04',
    name: 'Branding',
    description: 'Crafting cohesive visual identities -- from logos to full brand systems -- that communicate a clear and memorable presence.',
  },
  {
    number: '05',
    name: 'Web Design',
    description: 'Designing clean, modern, and conversion-focused websites with attention to layout, typography, and user experience.',
  },
];

const ServicesSection = () => {
  return (
    <section className="bg-white rounded-t-[40px] sm:rounded-t-[50px] md:rounded-t-[60px] px-5 sm:px-8 md:px-10 py-20 sm:py-24 md:py-32 text-[#0C0C0C] relative z-10 w-full">
      <div className="max-w-5xl mx-auto">
        <h2
          className="font-black uppercase text-center mb-16 sm:mb-20 md:mb-28 text-[#0C0C0C] select-none"
          style={{ fontSize: 'clamp(3rem, 12vw, 160px)' }}
        >
          Services
        </h2>

        <div className="flex flex-col border-t border-[rgba(12,12,12,0.15)]">
          {servicesData.map((service, i) => (
            <FadeIn
              key={service.number}
              delay={i * 0.1}
              y={30}
              className="flex items-start gap-6 sm:gap-10 md:gap-16 py-8 sm:py-10 md:py-12 border-b border-[rgba(12,12,12,0.15)]"
            >
              {/* Left Side: Number */}
              <div
                className="font-black text-[#0C0C0C] shrink-0 min-w-[70px] sm:min-w-[120px] md:min-w-[150px]"
                style={{ fontSize: 'clamp(3rem, 10vw, 140px)', lineHeight: 0.8 }}
              >
                {service.number}
              </div>

              {/* Right Side: Name & Description */}
              <div className="flex flex-col items-start gap-2">
                <h3
                  className="font-medium uppercase text-[#0C0C0C]"
                  style={{ fontSize: 'clamp(1rem, 2.2vw, 2.1rem)' }}
                >
                  {service.name}
                </h3>
                <p
                  className="font-light leading-relaxed text-[#0C0C0C] opacity-60 max-w-2xl"
                  style={{ fontSize: 'clamp(0.85rem, 1.6vw, 1.25rem)' }}
                >
                  {service.description}
                </p>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
};

// 5. Projects Section
interface Project {
  number: string;
  category: string;
  name: string;
  col1_img1: string;
  col1_img2: string;
  col2_img: string;
}

const projectsData: Project[] = [
  {
    number: '01',
    category: 'Client',
    name: 'Nextlevel Studio',
    col1_img1: 'https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260412_055344_5eff02e0-87a5-41ce-b64f-eb08da8f33db.png&w=1280&q=85',
    col1_img2: 'https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260412_055431_11d841fd-8b41-46a5-82e4-b04f2407a7d8.png&w=1280&q=85',
    col2_img: 'https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260412_055451_e317bf2d-28d4-48cc-86b0-6f72f25b6327.png&w=1280&q=85',
  },
  {
    number: '02',
    category: 'Personal',
    name: 'Aura Brand Identity',
    col1_img1: 'https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260412_055654_911201c5-36d9-4bc6-bac7-331adfce159f.png&w=1280&q=85',
    col1_img2: 'https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260412_055723_5ceda0b8-d9c2-4665-b2e3-83ba19ba76d1.png&w=1280&q=85',
    col2_img: 'https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260412_055753_adc5dcbd-a8e6-49c0-b43a-9b030d835cea.png&w=1280&q=85',
  },
  {
    number: '03',
    category: 'Client',
    name: 'Solaris Digital',
    col1_img1: 'https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260412_055759_963cfb0b-4bd1-4b0f-9d0a-09bd6cf95b2f.png&w=1280&q=85',
    col1_img2: 'https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260412_060108_438f781a-9846-4dcc-89ab-c4e6cb830f5b.png&w=1280&q=85',
    col2_img: 'https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260412_055818_9d062121-ad7e-46b9-999a-1a6a692ef1ee.png&w=1280&q=85',
  },
];

interface ProjectCardProps {
  project: Project;
  index: number;
  progress: MotionValue<number>;
  scaleRange: [number, number];
  targetScale: number;
}

const ProjectCard: React.FC<ProjectCardProps> = ({ project, index, progress, scaleRange, targetScale }) => {
  const scale = useTransform(progress, scaleRange, [1, targetScale]);

  return (
    <div className="h-[85vh] flex items-center justify-center sticky top-24 md:top-32 w-full">
      <motion.div
        style={{
          scale,
          top: `${index * 28}px`,
        }}
        className="relative w-full rounded-[40px] sm:rounded-[50px] md:rounded-[60px] border-2 border-[#D7E2EA] bg-[#0C0C0C] pt-10 px-6 pb-6 sm:pt-14 sm:px-10 sm:pb-8 md:pt-16 md:px-12 md:pb-10 flex flex-col gap-6"
      >
        {/* Top Row */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-4 sm:gap-6">
            {/* Huge Number */}
            <div
              className="font-black text-[#D7E2EA] select-none"
              style={{ fontSize: 'clamp(2rem, 6vw, 5rem)', lineHeight: 0.8 }}
            >
              {project.number}
            </div>
            {/* Category / Name */}
            <div className="flex flex-col">
              <span className="text-xs uppercase tracking-widest text-[#D7E2EA]/60 font-light">
                {project.category}
              </span>
              <h3 className="text-lg sm:text-xl md:text-2xl font-bold uppercase text-[#D7E2EA] tracking-wide">
                {project.name}
              </h3>
            </div>
          </div>

          <LiveProjectButton />
        </div>

        {/* Bottom Row - Two Column Grid */}
        <div className="grid grid-cols-1 md:grid-cols-10 gap-4 sm:gap-6 flex-1 min-h-0">
          {/* Left Column (40%) */}
          <div className="md:col-span-4 flex flex-col gap-4 sm:gap-6 justify-between h-full">
            <img
              src={project.col1_img1}
              alt={`${project.name} graphic top`}
              className="w-full object-cover rounded-[40px] sm:rounded-[50px] md:rounded-[60px] border border-[#D7E2EA]/20"
              style={{ height: 'clamp(130px, 16vw, 230px)' }}
            />
            <img
              src={project.col1_img2}
              alt={`${project.name} graphic bottom`}
              className="w-full object-cover rounded-[40px] sm:rounded-[50px] md:rounded-[60px] border border-[#D7E2EA]/20 flex-1"
              style={{ height: 'clamp(160px, 22vw, 340px)' }}
            />
          </div>

          {/* Right Column (60%) */}
          <div className="md:col-span-6 h-full">
            <img
              src={project.col2_img}
              alt={`${project.name} graphic featured`}
              className="w-full h-full object-cover rounded-[40px] sm:rounded-[50px] md:rounded-[60px] border border-[#D7E2EA]/20 min-h-[250px] md:min-h-full"
            />
          </div>
        </div>
      </motion.div>
    </div>
  );
};

const ProjectsSection = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  });

  return (
    <section
      id="projects"
      className="bg-[#0C0C0C] pt-20 pb-32 relative z-10 w-full px-5 sm:px-8 md:px-10"
    >
      <div className="max-w-5xl mx-auto">
        {/* Heading */}
        <div className="text-center mb-16 select-none">
          <h2 className="hero-heading font-black uppercase leading-none tracking-tight" style={{ fontSize: 'clamp(3rem, 12vw, 160px)' }}>
            Project
          </h2>
        </div>

        {/* Stacking list container */}
        <div ref={containerRef} className="relative flex flex-col gap-10">
          {projectsData.map((project, i) => {
            const targetScale = 1 - (projectsData.length - 1 - i) * 0.03;
            const scaleStart = i / projectsData.length;
            const scaleEnd = 1;

            return (
              <ProjectCard
                key={project.number}
                project={project}
                index={i}
                progress={scrollYProgress}
                scaleRange={[scaleStart, scaleEnd]}
                targetScale={targetScale}
              />
            );
          })}
        </div>
      </div>
    </section>
  );
};

// ==========================================
// CREATIVE LAB (VISUALIZATIONS) SECTION
// ==========================================

interface LabProject {
  id: string;
  title: string;
  artist: string;
  trackFile: string;
  description: string;
  bgGlow: string;
}

const labProjectsData: LabProject[] = [
  {
    id: 'loop',
    title: 'Loop',
    artist: 'Antigravity',
    trackFile: 'EMDCR.mp3',
    description: 'Generative 3D visualizer showcasing complex mathematical audio-reactive grid systems and camera loops.',
    bgGlow: 'hover:shadow-[0_0_30px_rgba(6,182,212,0.15)] hover:border-cyan-500/30',
  },
  {
    id: 'bbng',
    title: 'BBNG',
    artist: 'BADBADNOTGOOD',
    trackFile: 'BBNG_Confessions_edit.mp3',
    description: 'WebGL audio visualizer. Dynamic geometry reacting to low-frequency beats.',
    bgGlow: 'hover:shadow-[0_0_30px_rgba(236,72,153,0.15)] hover:border-pink-500/30',
  },
  {
    id: 'nero',
    title: 'Nero',
    artist: 'Nero',
    trackFile: 'Nero_In_The_Way.mp3',
    description: 'Realtime shader-based particles synced to heavy electronic bass rhythms.',
    bgGlow: 'hover:shadow-[0_0_30px_rgba(168,85,247,0.15)] hover:border-purple-500/30',
  },
  {
    id: 'pareidolia',
    title: 'Pareidolia',
    artist: 'Hecq',
    trackFile: 'Szerencsetlen_edit03.mp3',
    description: 'Dense point clouds and WebGL particle fields morphing to electronic waves.',
    bgGlow: 'hover:shadow-[0_0_30px_rgba(234,179,8,0.15)] hover:border-yellow-500/30',
  },
  {
    id: 'splice',
    title: 'Splice',
    artist: 'Amon Tobin',
    trackFile: 'scream.mp3',
    description: 'Organic glitch geometry and mechanical structures synchronized to audio waves.',
    bgGlow: 'hover:shadow-[0_0_30px_rgba(239,68,68,0.15)] hover:border-red-500/30',
  },
  {
    id: 'word-problems',
    title: 'Word Problems',
    artist: 'deadmau5',
    trackFile: 'Word_Problems_Edit.mp3',
    description: 'Dynamic typographical and vector visualization reacting to complex electronic patterns.',
    bgGlow: 'hover:shadow-[0_0_30px_rgba(34,197,94,0.15)] hover:border-green-500/30',
  },
];

const featuredLabProject = {
  id: 'lantern',
  title: 'ÜberViz (Lantern)',
  artist: 'Sbtrkt',
  trackFile: 'Lantern.mp3',
  description: 'Our flagship generative music visualizer. Features Web Audio API processing, presets panel, automatic beat progression, custom shader filters, load-your-own MP3 files, and microphone-reactive inputs.',
  bgGlow: 'hover:shadow-[0_0_40px_rgba(6,182,212,0.25)] hover:border-cyan-400/40',
};

const LabSection = () => {
  return (
    <section
      id="lab"
      className="bg-[#0C0C0C] rounded-t-[40px] sm:rounded-t-[50px] md:rounded-t-[60px] -mt-10 sm:-mt-12 md:-mt-14 pt-20 pb-20 relative z-10 w-full px-5 sm:px-8 md:px-10"
    >
      <div className="max-w-5xl mx-auto">
        {/* Heading */}
        <div className="text-center mb-6 select-none">
          <h2
            className="hero-heading font-black uppercase leading-none tracking-tight"
            style={{ fontSize: 'clamp(3rem, 12vw, 160px)' }}
          >
            Creative Lab
          </h2>
        </div>

        <div className="text-center mb-16 max-w-2xl mx-auto">
          <p className="text-[#D7E2EA]/60 font-mono text-xs sm:text-sm tracking-widest uppercase">
            [ Interactive WebGL Audio Visualizers ]
          </p>
        </div>

        {/* Featured Card */}
        <FadeIn delay={0.1} y={30} className="mb-8">
          <a
            href={`/viz/${featuredLabProject.id}`}
            target="_blank"
            rel="noopener noreferrer"
            className={`block bg-[#121212] border border-[#D7E2EA]/10 rounded-[30px] p-6 sm:p-8 md:p-10 transition-all duration-300 ${featuredLabProject.bgGlow} group hover:scale-[1.01]`}
          >
            <div className="flex flex-col md:flex-row justify-between gap-6 md:gap-12">
              <div className="flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-3 mb-4">
                    <span className="bg-cyan-500/10 text-cyan-400 font-mono text-[10px] tracking-widest uppercase px-2.5 py-1 rounded-full border border-cyan-500/20">
                      Featured Experience
                    </span>
                    <span className="text-xs uppercase tracking-widest text-[#D7E2EA]/40 font-mono">
                      Realtime 3D
                    </span>
                  </div>
                  <h3 className="text-2xl sm:text-3xl font-black uppercase text-[#D7E2EA] tracking-wide mb-4 group-hover:text-cyan-400 transition-colors">
                    {featuredLabProject.title}
                  </h3>
                  <p className="text-[#D7E2EA]/70 font-light leading-relaxed mb-6 text-sm sm:text-base max-w-3xl">
                    {featuredLabProject.description}
                  </p>
                </div>
                <div className="mt-4 font-mono text-[11px] sm:text-xs text-[#D7E2EA]/50 space-y-1 border-t border-[#D7E2EA]/10 pt-4">
                  <div><span className="text-cyan-400/80">MUSIC:</span> {featuredLabProject.artist} — {featuredLabProject.trackFile}</div>
                  <div><span className="text-cyan-400/80">TECH:</span> Three.js / WebGL / Web Audio API</div>
                </div>
              </div>
              <div className="flex items-center justify-center shrink-0">
                <div className="w-14 h-14 rounded-full border border-[#D7E2EA]/20 flex items-center justify-center group-hover:bg-[#D7E2EA] group-hover:border-[#D7E2EA] transition-all duration-300">
                  <svg
                    className="w-5 h-5 text-[#D7E2EA] group-hover:text-[#0C0C0C] transition-colors transform group-hover:translate-x-0.5"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                  </svg>
                </div>
              </div>
            </div>
          </a>
        </FadeIn>

        {/* 6 Grid Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {labProjectsData.map((lab, i) => (
            <FadeIn key={lab.id} delay={i * 0.05 + 0.2} y={30}>
              <a
                href={`/viz/${lab.id}`}
                target="_blank"
                rel="noopener noreferrer"
                className={`flex flex-col justify-between h-full bg-[#121212] border border-[#D7E2EA]/10 rounded-[24px] p-6 sm:p-7 transition-all duration-300 ${lab.bgGlow} group hover:scale-[1.02]`}
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-[10px] uppercase tracking-widest text-[#D7E2EA]/40 font-mono">
                      WebGL Lab
                    </span>
                    <span className="text-[9px] uppercase tracking-widest bg-[#D7E2EA]/5 text-[#D7E2EA]/60 font-mono px-2 py-0.5 rounded border border-[#D7E2EA]/10">
                      0{i+1}
                    </span>
                  </div>
                  <h4 className="text-lg sm:text-xl font-bold uppercase text-[#D7E2EA] tracking-wide mb-3 group-hover:text-white transition-colors">
                    {lab.title}
                  </h4>
                  <p className="text-[#D7E2EA]/60 font-light text-xs sm:text-sm leading-relaxed mb-6">
                    {lab.description}
                  </p>
                </div>
                <div>
                  <div className="font-mono text-[10px] text-[#D7E2EA]/40 border-t border-[#D7E2EA]/5 pt-4 mb-4">
                    <div className="truncate"><span className="text-[#D7E2EA]/60">TRACK:</span> {lab.trackFile}</div>
                    <div className="mt-0.5"><span className="text-[#D7E2EA]/60">BY:</span> {lab.artist}</div>
                  </div>
                  <div className="flex items-center gap-2 text-xs font-mono text-[#D7E2EA]/50 group-hover:text-[#D7E2EA] transition-colors">
                    <span>LAUNCH LAB</span>
                    <svg className="w-3.5 h-3.5 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                    </svg>
                  </div>
                </div>
              </a>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
};

// ==========================================
// MAIN PAGE EXPORT
// ==========================================
export default function Home() {
  return (
    <main className="relative bg-[#0C0C0C] text-[#D7E2EA] overflow-x-clip min-h-screen w-full font-kanit">
      <HeroSection />
      <MarqueeSection />
      <AboutSection />
      <ServicesSection />
      <LabSection />
      <ProjectsSection />
    </main>
  );
}
