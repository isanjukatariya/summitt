import { useState, useEffect, useRef } from "react";
import {
  ChevronDown, Anchor, Send, Menu, X, ArrowRight,
  MapPin, Mail, Phone, Instagram, Twitter, Linkedin, Facebook,
} from "lucide-react";

// ─── Hooks ────────────────────────────────────────────────────────────────────

function useInView(threshold = 0.15) {
  const ref = useRef<any>(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setInView(true); },
      { threshold }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [threshold]);
  return [ref, inView] as const;
}

function useCounter(target: number, inView: boolean, duration = 2000) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!inView) return;
    let current = 0;
    const step = target / (duration / 16);
    const timer = setInterval(() => {
      current += step;
      if (current >= target) { setCount(target); clearInterval(timer); }
      else setCount(Math.floor(current));
    }, 16);
    return () => clearInterval(timer);
  }, [inView, target, duration]);
  return count;
}

// ─── SVG Decorations ──────────────────────────────────────────────────────────

function CompassRose({ size = 100, className = "" }: { size?: number; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" fill="none" className={className}>
      <polygon points="50,4 53,44 50,50 47,44" fill="#C8A96A" opacity="0.9" />
      <polygon points="50,96 53,56 50,50 47,56" fill="#C8A96A" opacity="0.35" />
      <polygon points="4,50 44,47 50,50 44,53" fill="#C8A96A" opacity="0.35" />
      <polygon points="96,50 56,47 50,50 56,53" fill="#C8A96A" opacity="0.9" />
      <polygon points="15,15 45,45 50,50 44,46" fill="#C8A96A" opacity="0.25" />
      <polygon points="85,15 55,45 50,50 56,46" fill="#C8A96A" opacity="0.25" />
      <polygon points="15,85 45,55 50,50 44,54" fill="#C8A96A" opacity="0.25" />
      <polygon points="85,85 55,55 50,50 56,54" fill="#C8A96A" opacity="0.25" />
      <circle cx="50" cy="50" r="44" stroke="#C8A96A" strokeWidth="0.5" opacity="0.25" />
      <circle cx="50" cy="50" r="36" stroke="#C8A96A" strokeWidth="0.5" opacity="0.15" />
      <circle cx="50" cy="50" r="7" fill="#C8A96A" opacity="0.6" />
      <circle cx="50" cy="50" r="3.5" fill="#07111F" />
    </svg>
  );
}

function StarField({ count = 120 }: { count?: number }) {
  const stars = useRef(
    Array.from({ length: count }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 1.8 + 0.4,
      delay: Math.random() * 5,
      duration: Math.random() * 3 + 2.5,
      opacity: Math.random() * 0.6 + 0.2,
    }))
  ).current;

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {stars.map((s) => (
        <div
          key={s.id}
          className="absolute rounded-full bg-white"
          style={{
            left: `${s.x}%`,
            top: `${s.y}%`,
            width: `${s.size}px`,
            height: `${s.size}px`,
            opacity: s.opacity,
            animation: `estwinkle ${s.duration}s ${s.delay}s infinite`,
          }}
        />
      ))}
    </div>
  );
}

// ─── Nav ──────────────────────────────────────────────────────────────────────

function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", fn, { passive: true });
    return () => window.removeEventListener("scroll", fn);
  }, []);

  const links = ["About", "Events", "Speakers", "Sponsors", "Contact"];

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled ? "bg-[#07111F]/90 backdrop-blur-md border-b border-[#C8A96A]/15 shadow-xl shadow-black/40" : ""
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        <a href="#" className="flex items-center gap-2.5 group">
          <CompassRose size={34} className="group-hover:rotate-45 transition-transform duration-700" />
          <span className="font-['Playfair_Display'] text-lg text-[#C8A96A] tracking-[0.25em]">E·SUMMIT</span>
        </a>
        <div className="hidden md:flex items-center gap-7">
          {links.map((item) => (
            <a
              key={item}
              href={`#${item.toLowerCase()}`}
              className="text-white/55 hover:text-[#C8A96A] text-xs tracking-[0.2em] uppercase transition-colors duration-300 font-['Outfit']"
            >
              {item}
            </a>
          ))}
          <a
            href="#register"
            className="px-5 py-2.5 border border-[#C8A96A]/70 text-[#C8A96A] hover:bg-[#C8A96A] hover:text-[#07111F] text-xs tracking-[0.2em] uppercase transition-all duration-300 font-['Outfit'] font-medium rounded-sm"
          >
            Register
          </a>
        </div>
        <button className="md:hidden text-white/80 hover:text-white" onClick={() => setOpen(!open)}>
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>
      {open && (
        <div className="md:hidden bg-[#07111F]/98 backdrop-blur-lg border-t border-[#C8A96A]/15 px-6 py-8 flex flex-col gap-6">
          {links.map((item) => (
            <a
              key={item}
              href={`#${item.toLowerCase()}`}
              className="text-white/60 hover:text-[#C8A96A] text-xs tracking-[0.25em] uppercase font-['Outfit'] transition-colors"
              onClick={() => setOpen(false)}
            >
              {item}
            </a>
          ))}
          <a
            href="#register"
            className="px-5 py-3 border border-[#C8A96A]/70 text-[#C8A96A] text-xs tracking-[0.2em] uppercase text-center font-['Outfit'] font-medium"
            onClick={() => setOpen(false)}
          >
            Register Now
          </a>
        </div>
      )}
    </nav>
  );
}

// ─── Hero ─────────────────────────────────────────────────────────────────────

function Hero() {
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden bg-[#07111F]">
      <div className="absolute inset-0">
        <img
          src="https://images.unsplash.com/photo-1505118380757-91f5f5632de0?w=1920&h=1080&fit=crop&auto=format"
          alt="Dark ocean at night with cliffs"
          className="w-full h-full object-cover opacity-35"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#07111F] via-[#07111F]/75 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#07111F] via-transparent to-[#07111F]/40" />
      </div>

      <StarField count={130} />

      {/* Emerald light shimmer */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: "radial-gradient(ellipse 60% 60% at 72% 50%, rgba(14,122,97,0.09) 0%, transparent 70%)" }}
      />

      {/* Giant background compass */}
      <div className="absolute right-0 top-1/2 -translate-y-1/2 -translate-x-8 opacity-[0.07] hidden lg:block pointer-events-none">
        <CompassRose size={560} className="animate-[spin_90s_linear_infinite]" />
      </div>

      {/* Fog band */}
      <div
        className="absolute bottom-0 left-0 right-0 h-48 pointer-events-none"
        style={{ background: "linear-gradient(to top, rgba(14,122,97,0.06) 0%, transparent 100%)" }}
      />

      <div className="relative z-10 max-w-7xl mx-auto px-6 pt-24 pb-20">
        <div className="max-w-xl">
          <p className="text-[#C8A96A] text-[10px] tracking-[0.5em] uppercase font-['Outfit'] mb-6 flex items-center gap-3">
            <Anchor size={12} />
            IIT Bombay · 2025 Edition
          </p>
          <h1 className="font-['Playfair_Display'] font-bold text-white leading-[1.03] mb-7" style={{ fontSize: "clamp(3rem, 8vw, 5.5rem)" }}>
            Navigate<br />
            <span className="text-[#C8A96A] italic">The Future.</span>
          </h1>
          <p className="text-white/55 text-base md:text-lg font-['Outfit'] font-light mb-10 leading-relaxed max-w-md">
            Where innovators, founders and future leaders begin their journey.
          </p>
          <div className="flex flex-wrap gap-4">
            <a
              href="#events"
              className="px-8 py-4 bg-[#C8A96A] text-[#07111F] font-['Outfit'] text-xs tracking-[0.2em] uppercase font-semibold hover:bg-[#ddc07a] transition-all duration-300 rounded-sm shadow-2xl shadow-[#C8A96A]/25 hover:shadow-[#C8A96A]/40 hover:-translate-y-0.5"
            >
              Explore Events
            </a>
            <a
              href="#register"
              className="px-8 py-4 border border-white/25 text-white/80 font-['Outfit'] text-xs tracking-[0.2em] uppercase hover:border-[#C8A96A]/50 hover:text-[#C8A96A] transition-all duration-300 rounded-sm backdrop-blur-sm bg-white/5"
            >
              Register Now
            </a>
          </div>
        </div>
      </div>

      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-white/30 animate-bounce">
        <span className="text-[9px] tracking-[0.4em] uppercase font-['Outfit']">Scroll</span>
        <ChevronDown size={14} />
      </div>
    </section>
  );
}

// ─── About ────────────────────────────────────────────────────────────────────

function About() {
  const [ref, inView] = useInView();

  return (
    <section id="about" className="bg-[#07111F] py-32 relative overflow-hidden">
      <div
        className="absolute inset-0 opacity-[0.04] pointer-events-none"
        style={{
          backgroundImage:
            "repeating-linear-gradient(0deg, rgba(200,169,106,0.5) 0px, transparent 1px, transparent 60px), repeating-linear-gradient(90deg, rgba(200,169,106,0.5) 0px, transparent 1px, transparent 60px)",
        }}
      />

      <div className="max-w-7xl mx-auto px-6">
        <div
          ref={ref}
          className={`grid md:grid-cols-2 gap-14 lg:gap-24 items-center transition-all duration-1000 ${
            inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"
          }`}
        >
          {/* Left image */}
          <div className="relative">
            <div className="relative rounded-[24px] overflow-hidden border border-[#C8A96A]/25 shadow-2xl shadow-black/60">
              <img
                src="https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=720&h=860&fit=crop&auto=format"
                alt="Antique compass and map"
                className="w-full h-[480px] lg:h-[560px] object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#07111F]/60 to-transparent" />
              <div className="absolute inset-0 bg-gradient-to-r from-[#07111F]/20 to-transparent" />
            </div>

            <div className="absolute -top-5 -right-5 opacity-45">
              <CompassRose size={90} />
            </div>

            {/* Wax seal */}
            <div className="absolute -bottom-5 -left-5 w-20 h-20 rounded-full border-2 border-[#C8A96A]/55 bg-[#07111F] flex flex-col items-center justify-center shadow-xl shadow-[#C8A96A]/10">
              <span className="text-[#C8A96A] text-[9px] tracking-[0.2em] text-center font-['Outfit'] leading-tight">
                EST<br />2012
              </span>
            </div>
          </div>

          {/* Right content */}
          <div>
            <p className="text-[#0E7A61] text-[10px] tracking-[0.5em] uppercase font-['Outfit'] mb-4">The Voyage Begins</p>
            <h2 className="font-['Playfair_Display'] text-4xl md:text-5xl text-white mb-6 leading-tight">
              About<br />
              <span className="text-[#C8A96A] italic">E-Summit</span>
            </h2>

            <div className="flex items-center gap-4 mb-8">
              <div className="h-px bg-[#C8A96A] w-16" />
              <Anchor size={14} className="text-[#C8A96A]" />
              <div className="h-px bg-[#C8A96A]/25 flex-1" />
            </div>

            <p className="text-white/65 text-base font-['Outfit'] font-light leading-relaxed mb-5">
              E-Summit is Asia's premier entrepreneurship summit — a convergence of visionaries, disruptors, and builders charting bold new courses in the global economy.
            </p>
            <p className="text-white/40 text-sm font-['Outfit'] font-light leading-relaxed mb-10">
              Like ancient navigators who mapped unknown territories, we bring together the boldest minds to explore uncharted frontiers of innovation, investment, and impact. For two extraordinary days, IIT Bombay transforms into the world's most ambitious entrepreneurial harbor.
            </p>

            <div className="grid grid-cols-2 gap-x-8 gap-y-6">
              {[
                ["Founded", "2012"],
                ["12th", "Edition"],
                ["2 Days", "Duration"],
                ["Mumbai", "Location"],
              ].map(([value, label]) => (
                <div key={label} className="border-l-2 border-[#C8A96A]/35 pl-4">
                  <div className="font-['Playfair_Display'] text-[#C8A96A] text-2xl font-bold">{value}</div>
                  <div className="text-white/35 text-[10px] tracking-[0.3em] uppercase font-['Outfit'] mt-0.5">{label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── Stats ────────────────────────────────────────────────────────────────────

function StatCard({ value, label, suffix = "+" }: { value: number; label: string; suffix?: string }) {
  const [ref, inView] = useInView();
  const count = useCounter(value, inView);

  return (
    <div
      ref={ref}
      className={`transition-all duration-700 ${inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
    >
      <div className="group relative rounded-[22px] p-7 bg-white/[0.04] backdrop-blur-md border border-[#C8A96A]/18 hover:border-[#C8A96A]/45 transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl hover:shadow-[#C8A96A]/10 text-center cursor-default">
        <div className="font-['Playfair_Display'] text-[#C8A96A] text-5xl font-bold mb-2">
          {count.toLocaleString()}{suffix}
        </div>
        <div className="text-white/40 text-[10px] tracking-[0.35em] uppercase font-['Outfit']">{label}</div>
        <div className="w-1.5 h-1.5 rounded-full bg-[#0E7A61] mx-auto mt-4 group-hover:shadow-[0_0_8px_#0E7A61] transition-all" />
      </div>
    </div>
  );
}

function Stats() {
  const [ref, inView] = useInView();

  return (
    <section className="py-24 bg-[#060E1A] relative overflow-hidden">
      <div
        className="absolute inset-0 opacity-[0.045] pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(rgba(200,169,106,0.6) 1px, transparent 1px), linear-gradient(90deg, rgba(200,169,106,0.6) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />

      <div className="max-w-7xl mx-auto px-6">
        <div
          ref={ref}
          className={`text-center mb-14 transition-all duration-1000 ${
            inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          <p className="text-[#0E7A61] text-[10px] tracking-[0.5em] uppercase font-['Outfit'] mb-3">By The Numbers</p>
          <h2 className="font-['Playfair_Display'] text-4xl text-white">The Voyage in Figures</h2>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          <StatCard value={5000} label="Participants" />
          <StatCard value={200} label="Startups" />
          <StatCard value={50} label="Speakers" />
          <StatCard value={30} label="Sponsors" />
          <StatCard value={100} label="Colleges" />
        </div>
      </div>
    </section>
  );
}

// ─── Events ───────────────────────────────────────────────────────────────────

const EVENTS = [
  { id: "01", name: "Startup Spotlight", tag: "Competition", color: "#0E7A61", description: "Pitch your vision to India's most discerning investors and win capital to fuel your next chapter." },
  { id: "02", name: "Case Clash", tag: "Strategy", color: "#C8A96A", description: "Battle-test your strategic thinking against elite teams from premier institutions nationwide." },
  { id: "03", name: "Influencers Lab", tag: "Workshop", color: "#0E7A61", description: "Master the art of digital storytelling. Build movements, shape narratives, lead conversations." },
  { id: "04", name: "Startup Auction", tag: "Investment", color: "#C8A96A", description: "The most thrilling marketplace — where ideas meet capital and fortunes are made in minutes." },
  { id: "05", name: "Business Quiz", tag: "Knowledge", color: "#0E7A61", description: "A high-stakes battle of commercial acuity. Test your knowledge of the global business landscape." },
];

function EventItem({ event, index }: { event: typeof EVENTS[0]; index: number }) {
  const [ref, inView] = useInView(0.1);
  const isLeft = index % 2 === 0;

  return (
    <div
      ref={ref}
      className={`flex items-center gap-6 md:gap-0 transition-all duration-700 ${
        inView ? "opacity-100 translate-x-0" : `opacity-0 ${isLeft ? "-translate-x-10" : "translate-x-10"}`
      }`}
      style={{ transitionDelay: `${index * 80}ms` }}
    >
      {!isLeft && <div className="hidden md:block flex-1" />}

      <div className={`w-full md:flex-1 md:max-w-[calc(50%-2.5rem)] ${!isLeft ? "md:text-right" : ""}`}>
        <div className="group rounded-[22px] p-7 bg-white/[0.04] border border-white/8 hover:border-[#C8A96A]/35 transition-all duration-500 hover:-translate-y-1 hover:shadow-2xl hover:shadow-black/40 cursor-pointer">
          <div className={`flex items-start justify-between mb-4 flex-wrap gap-2 ${!isLeft ? "md:flex-row-reverse" : ""}`}>
            <span className="text-[#C8A96A]/40 font-['DM_Mono'] text-xs tracking-widest">{event.id}</span>
            <span
              className="px-3 py-1 rounded-full text-[10px] tracking-[0.25em] uppercase font-['Outfit'] border"
              style={{ color: event.color, borderColor: event.color + "40", backgroundColor: event.color + "18" }}
            >
              {event.tag}
            </span>
          </div>
          <h3 className="font-['Playfair_Display'] text-2xl text-white mb-3">{event.name}</h3>
          <p className="text-white/45 font-['Outfit'] text-sm leading-relaxed">{event.description}</p>
          <div
            className={`mt-6 flex items-center gap-2 text-[#C8A96A] text-[10px] tracking-[0.2em] uppercase font-['Outfit'] group-hover:gap-4 transition-all ${
              !isLeft ? "md:justify-end" : ""
            }`}
          >
            <span>Learn More</span>
            <ArrowRight size={13} />
          </div>
        </div>
      </div>

      {/* Timeline center */}
      <div className="hidden md:flex shrink-0 w-20 flex-col items-center gap-1.5">
        <div className="w-px h-10 bg-gradient-to-b from-transparent to-[#C8A96A]/30" />
        <div className="w-3.5 h-3.5 rounded-full border-2 border-[#C8A96A] bg-[#07111F] shadow-[0_0_12px_rgba(200,169,106,0.4)]" />
        <div className="w-px h-10 bg-gradient-to-b from-[#C8A96A]/30 to-transparent" />
      </div>

      {isLeft && <div className="hidden md:block flex-1" />}
    </div>
  );
}

function Events() {
  const [ref, inView] = useInView();

  return (
    <section id="events" className="py-32 bg-[#07111F] relative">
      <div className="max-w-7xl mx-auto px-6">
        <div
          ref={ref}
          className={`text-center mb-20 transition-all duration-1000 ${
            inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          <p className="text-[#0E7A61] text-[10px] tracking-[0.5em] uppercase font-['Outfit'] mb-3">The Voyage Map</p>
          <h2 className="font-['Playfair_Display'] text-4xl md:text-5xl text-white mb-5">Events Journey</h2>
          <p className="text-white/35 font-['Outfit'] max-w-sm mx-auto text-sm leading-relaxed">
            Five islands of opportunity. One legendary expedition. Chart your course.
          </p>
        </div>

        <div className="flex flex-col gap-2">
          {EVENTS.map((ev, i) => (
            <EventItem key={ev.id} event={ev} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Speakers ─────────────────────────────────────────────────────────────────

const SPEAKERS = [
  { name: "Ananya Krishnan", role: "CEO", company: "FinVoyage Capital", img: "photo-1534528741775-53994a69daeb" },
  { name: "Rohan Mehta", role: "Founder", company: "TechCrest Labs", img: "photo-1507003211169-0a1dd7228f2d" },
  { name: "Priya Sharma", role: "Partner", company: "Sequoia India", img: "photo-1494790108377-be9c29b29330" },
  { name: "Vikram Nair", role: "CTO", company: "DeepSea AI", img: "photo-1500648767791-00dcc994a43e" },
  { name: "Meera Iyer", role: "Managing Director", company: "HarborVentures", img: "photo-1508214751196-bcfd4ca60f91" },
  { name: "Arjun Kapoor", role: "Co-Founder", company: "StarChart Inc.", img: "photo-1519085360753-af0119f7cbe7" },
];

function SpeakerCard({ speaker, delay = 0 }: { speaker: typeof SPEAKERS[0]; delay?: number }) {
  const [ref, inView] = useInView(0.08);

  return (
    <div
      ref={ref}
      className={`transition-all duration-700 ${inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      <div className="group relative rounded-[22px] overflow-hidden border border-[#C8A96A]/18 hover:border-[#C8A96A]/50 transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl hover:shadow-[#C8A96A]/12 bg-white/[0.03] cursor-pointer">
        {/* Corner engravings */}
        {["top-3 left-3 border-t border-l", "top-3 right-3 border-t border-r", "bottom-3 left-3 border-b border-l", "bottom-3 right-3 border-b border-r"].map((cls) => (
          <div key={cls} className={`absolute ${cls} w-5 h-5 border-[#C8A96A]/45 z-10`} />
        ))}

        <div className="aspect-[3/4] overflow-hidden bg-[#0A1828]">
          <img
            src={`https://images.unsplash.com/${speaker.img}?w=480&h=640&fit=crop&auto=format`}
            alt={speaker.name}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#060E1A] via-[#060E1A]/15 to-transparent" />
        </div>

        <div className="absolute bottom-0 left-0 right-0 p-5 z-10">
          <div className="w-8 h-px bg-[#C8A96A] mb-3" />
          <div className="font-['Playfair_Display'] text-white text-lg leading-snug">{speaker.name}</div>
          <div className="text-[#C8A96A] text-[10px] tracking-[0.25em] uppercase font-['Outfit'] mt-1">{speaker.role}</div>
          <div className="text-white/35 text-xs font-['Outfit'] mt-0.5">{speaker.company}</div>
        </div>
      </div>
    </div>
  );
}

function Speakers() {
  const [ref, inView] = useInView();

  return (
    <section id="speakers" className="py-32 bg-[#060E1A] relative overflow-hidden">
      <StarField count={70} />
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: "radial-gradient(ellipse 70% 50% at 50% 0%, rgba(14,122,97,0.07) 0%, transparent 65%)" }}
      />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div
          ref={ref}
          className={`text-center mb-14 transition-all duration-1000 ${
            inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          <p className="text-[#0E7A61] text-[10px] tracking-[0.5em] uppercase font-['Outfit'] mb-3">The Visionaries</p>
          <h2 className="font-['Playfair_Display'] text-4xl md:text-5xl text-white mb-4">Meet The Captains</h2>
          <p className="text-white/35 font-['Outfit'] max-w-sm mx-auto text-sm leading-relaxed">
            Luminaries who have navigated the seas of entrepreneurship to chart extraordinary courses.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 lg:gap-7">
          {SPEAKERS.map((sp, i) => (
            <SpeakerCard key={sp.name} speaker={sp} delay={i * 90} />
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Highlights ───────────────────────────────────────────────────────────────

const MILESTONES = [
  { time: "Day 1 · 9:00 AM", title: "Opening Ceremony", desc: "The harbor awakens. A cinematic opening that sets the tone for two extraordinary days of discovery." },
  { time: "Day 1 · 2:00 PM", title: "Startup Competitions", desc: "Founders take the stage. Investors sharpen their gaze. The most watched pitches in the country." },
  { time: "Day 1 · 6:30 PM", title: "Workshops & Labs", desc: "Hands-on sessions with industry pioneers. Build, learn, and reshape your understanding of possibility." },
  { time: "Day 2 · 11:00 AM", title: "Networking Voyage", desc: "The greatest connections happen at the intersections. A curated experience like no other." },
  { time: "Day 2 · 7:00 PM", title: "Awards & Closing", desc: "Champions crowned, legends made. An evening that echoes through the careers of all who attended." },
];

function MilestoneCard({ m, index }: { m: typeof MILESTONES[0]; index: number }) {
  const [ref, inView] = useInView(0.1);
  const isLeft = index % 2 === 0;

  return (
    <div
      ref={ref}
      className={`flex items-center gap-4 md:gap-0 transition-all duration-700 ${
        inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
      }`}
      style={{ transitionDelay: `${index * 120}ms` }}
    >
      {!isLeft && <div className="hidden md:block flex-1" />}

      <div className={`w-full md:flex-1 md:max-w-[calc(50%-2rem)] ${!isLeft ? "md:text-right" : ""}`}>
        <div className="rounded-[20px] p-6 bg-white/[0.04] border border-white/8 hover:border-[#C8A96A]/30 transition-all duration-300">
          <div className="text-[#C8A96A] text-[10px] tracking-[0.3em] uppercase font-['DM_Mono'] mb-2">{m.time}</div>
          <div className="font-['Playfair_Display'] text-white text-xl mb-2">{m.title}</div>
          <div className="text-white/45 text-sm font-['Outfit'] leading-relaxed">{m.desc}</div>
        </div>
      </div>

      <div className="hidden md:flex w-16 shrink-0 flex-col items-center gap-0">
        <div className="w-px h-8 bg-gradient-to-b from-transparent to-[#C8A96A]/35" />
        <div className="w-3 h-3 rounded-full bg-[#C8A96A] shadow-[0_0_10px_rgba(200,169,106,0.5)]" />
        <div className="w-px h-8 bg-gradient-to-b from-[#C8A96A]/35 to-transparent" />
      </div>

      {isLeft && <div className="hidden md:block flex-1" />}
    </div>
  );
}

function Highlights() {
  const [ref, inView] = useInView();

  return (
    <section className="py-32 bg-[#07111F] relative overflow-hidden">
      <div
        className="absolute inset-0 opacity-[0.025] pointer-events-none"
        style={{
          backgroundImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='500' height='500'%3E%3Ccircle cx='250' cy='250' r='230' fill='none' stroke='%23C8A96A' stroke-width='1'/%3E%3Ccircle cx='250' cy='250' r='160' fill='none' stroke='%23C8A96A' stroke-width='1'/%3E%3Ccircle cx='250' cy='250' r='90' fill='none' stroke='%23C8A96A' stroke-width='1'/%3E%3Cline x1='20' y1='250' x2='480' y2='250' stroke='%23C8A96A' stroke-width='0.5'/%3E%3Cline x1='250' y1='20' x2='250' y2='480' stroke='%23C8A96A' stroke-width='0.5'/%3E%3Cline x1='88' y1='88' x2='412' y2='412' stroke='%23C8A96A' stroke-width='0.5'/%3E%3Cline x1='412' y1='88' x2='88' y2='412' stroke='%23C8A96A' stroke-width='0.5'/%3E%3C/svg%3E\")",
          backgroundSize: "500px 500px",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      />

      <div className="max-w-5xl mx-auto px-6">
        <div
          ref={ref}
          className={`text-center mb-20 transition-all duration-1000 ${
            inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          <p className="text-[#0E7A61] text-[10px] tracking-[0.5em] uppercase font-['Outfit'] mb-3">Chronicles</p>
          <h2 className="font-['Playfair_Display'] text-4xl text-white">Last Year&apos;s Voyage</h2>
        </div>

        <div className="flex flex-col gap-4">
          {MILESTONES.map((m, i) => (
            <MilestoneCard key={m.title} m={m} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Gallery ──────────────────────────────────────────────────────────────────

const GALLERY = [
  { id: "photo-1540575467063-178a50c2df87", span: "md:row-span-2", label: "Opening Night" },
  { id: "photo-1475721027785-f74eccf877e2", span: "", label: "Keynote Stage" },
  { id: "photo-1515187029135-18ee286d815b", span: "", label: "Networking" },
  { id: "photo-1529070538774-1843cb3265df", span: "md:row-span-2", label: "Pitch Battle" },
  { id: "photo-1559136555-9303baea8ebd", span: "", label: "Workshop" },
  { id: "photo-1517048676732-d65bc937f952", span: "", label: "Panel Discussion" },
];

function GalleryItem({ photo, index }: { photo: typeof GALLERY[0]; index: number }) {
  const [ref, inView] = useInView(0.05);

  return (
    <div
      ref={ref}
      className={`${photo.span} relative rounded-[20px] overflow-hidden group cursor-pointer border border-[#C8A96A]/10 hover:border-[#C8A96A]/40 bg-[#0A1828] transition-all duration-500 ${
        inView ? "opacity-100 scale-100" : "opacity-0 scale-[0.96]"
      }`}
      style={{ minHeight: "200px", transitionDelay: `${index * 80}ms` }}
    >
      <img
        src={`https://images.unsplash.com/${photo.id}?w=640&h=460&fit=crop&auto=format`}
        alt={photo.label}
        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 absolute inset-0"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-[#07111F]/75 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      <div className="absolute bottom-4 left-5 text-white font-['Outfit'] text-sm tracking-widest opacity-0 group-hover:opacity-100 transition-all duration-500 translate-y-2 group-hover:translate-y-0">
        {photo.label}
      </div>
      <div className="absolute top-3 left-3 w-4 h-4 border-t border-l border-[#C8A96A]/40" />
      <div className="absolute top-3 right-3 w-4 h-4 border-t border-r border-[#C8A96A]/40" />
    </div>
  );
}

function Gallery() {
  const [ref, inView] = useInView();

  return (
    <section id="gallery" className="py-32 bg-[#060E1A] relative">
      <div className="max-w-7xl mx-auto px-6">
        <div
          ref={ref}
          className={`text-center mb-14 transition-all duration-1000 ${
            inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          <p className="text-[#0E7A61] text-[10px] tracking-[0.5em] uppercase font-['Outfit'] mb-3">Treasure Vault</p>
          <h2 className="font-['Playfair_Display'] text-4xl text-white">Glimpses of Glory</h2>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4" style={{ gridAutoRows: "220px" }}>
          {GALLERY.map((photo, i) => (
            <GalleryItem key={photo.id} photo={photo} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Sponsors ─────────────────────────────────────────────────────────────────

const SPONSORS = [
  ["Goldman Sachs", "McKinsey & Co.", "Y Combinator", "Sequoia Capital"],
  ["Google for Startups", "Microsoft Ventures", "Tata Sons", "Reliance Jio"],
  ["Zepto", "Razorpay", "CRED", "Groww"],
];

function Sponsors() {
  const [ref, inView] = useInView();

  return (
    <section id="sponsors" className="py-32 bg-[#07111F] relative overflow-hidden">
      <div className="absolute inset-0 opacity-10 pointer-events-none">
        <img
          src="https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1920&h=600&fit=crop&auto=format"
          alt=""
          className="w-full h-full object-cover object-bottom"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#07111F] via-[#07111F]/50 to-[#07111F]" />
      </div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div
          ref={ref}
          className={`text-center mb-16 transition-all duration-1000 ${
            inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          <p className="text-[#0E7A61] text-[10px] tracking-[0.5em] uppercase font-['Outfit'] mb-3">Partners in Voyage</p>
          <h2 className="font-['Playfair_Display'] text-4xl text-white mb-3">Alliances Across The Seas</h2>
          <p className="text-white/35 font-['Outfit'] text-sm max-w-xs mx-auto">
            The world&apos;s foremost institutions charting this course alongside us.
          </p>
        </div>

        <div className="flex flex-col gap-5">
          {SPONSORS.map((row, ri) => (
            <div
              key={ri}
              className={`grid grid-cols-2 md:grid-cols-4 gap-4 transition-all duration-700 ${
                inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
              }`}
              style={{ transitionDelay: `${ri * 150}ms` }}
            >
              {row.map((sponsor) => (
                <div
                  key={sponsor}
                  className="group rounded-[18px] p-6 bg-white/[0.04] backdrop-blur-sm border border-[#C8A96A]/12 hover:border-[#C8A96A]/40 transition-all duration-400 text-center hover:-translate-y-1 hover:shadow-xl hover:shadow-[#C8A96A]/8 cursor-pointer"
                >
                  <div className="text-white/50 group-hover:text-[#C8A96A] font-['Outfit'] text-sm tracking-wide transition-colors duration-300">
                    {sponsor}
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Testimonials ─────────────────────────────────────────────────────────────

const TESTIMONIALS = [
  {
    quote: "E-Summit was the turning point of my entrepreneurial journey. The connections I made here led directly to our Series A round six months later.",
    name: "Aarav Singh",
    role: "Founder, NovaSail",
    img: "photo-1506794778202-cad84cf45f1d",
  },
  {
    quote: "There is no other event in Asia that brings together this caliber of minds, ideas, and opportunities. E-Summit is in a league entirely its own.",
    name: "Kavya Menon",
    role: "Partner, Atlas Ventures",
    img: "photo-1438761681033-6461ffad8d80",
  },
  {
    quote: "I came as a student and left as a founder. The workshops, speakers, and energy — E-Summit fundamentally changed what I believed was possible.",
    name: "Dhruv Malhotra",
    role: "CEO, Meridian AI",
    img: "photo-1492562080023-ab3db95bfbce",
  },
];

function Testimonials() {
  const [active, setActive] = useState(0);
  const [ref, inView] = useInView();

  useEffect(() => {
    const t = setInterval(() => setActive((a) => (a + 1) % TESTIMONIALS.length), 5000);
    return () => clearInterval(t);
  }, []);

  const t = TESTIMONIALS[active];

  return (
    <section className="py-32 bg-[#060E1A] relative overflow-hidden">
      <StarField count={55} />
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: "radial-gradient(ellipse 60% 50% at 50% 100%, rgba(200,169,106,0.045) 0%, transparent 60%)" }}
      />

      <div className="max-w-3xl mx-auto px-6 relative z-10">
        <div
          ref={ref}
          className={`text-center mb-14 transition-all duration-1000 ${
            inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          <p className="text-[#0E7A61] text-[10px] tracking-[0.5em] uppercase font-['Outfit'] mb-3">Captain&apos;s Log</p>
          <h2 className="font-['Playfair_Display'] text-4xl text-white">Voices from the Voyage</h2>
        </div>

        <div className="relative rounded-[28px] px-10 py-12 md:px-16 md:py-14 bg-white/[0.04] backdrop-blur-md border border-[#C8A96A]/18 text-center">
          {/* Corner marks */}
          {["top-5 left-5 border-t-2 border-l-2", "top-5 right-5 border-t-2 border-r-2", "bottom-5 left-5 border-b-2 border-l-2", "bottom-5 right-5 border-b-2 border-r-2"].map((cls) => (
            <div key={cls} className={`absolute ${cls} w-6 h-6 border-[#C8A96A]/35`} />
          ))}

          <div className="font-['Playfair_Display'] text-[#C8A96A] text-7xl leading-none mb-4 opacity-30 select-none">&ldquo;</div>

          <p
            key={active}
            className="text-white/75 font-['Outfit'] text-base md:text-lg leading-relaxed mb-10 italic font-light"
            style={{ animation: "esfadein 0.6s ease" }}
          >
            {t.quote}
          </p>

          <div className="flex items-center justify-center gap-4">
            <img
              src={`https://images.unsplash.com/${t.img}?w=80&h=80&fit=crop&auto=format`}
              alt={t.name}
              className="w-12 h-12 rounded-full border border-[#C8A96A]/40 object-cover bg-[#0A1828]"
            />
            <div className="text-left">
              <div className="text-white font-['Playfair_Display'] text-base">{t.name}</div>
              <div className="text-white/35 font-['Outfit'] text-xs tracking-wide">{t.role}</div>
            </div>
          </div>

          <div className="flex items-center justify-center gap-2 mt-8">
            {TESTIMONIALS.map((_, i) => (
              <button
                key={i}
                onClick={() => setActive(i)}
                className={`h-1.5 rounded-full transition-all duration-400 ${
                  i === active ? "bg-[#C8A96A] w-6" : "bg-white/18 w-1.5 hover:bg-white/35"
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── Contact ──────────────────────────────────────────────────────────────────

function Contact() {
  const [ref, inView] = useInView();
  const [form, setForm] = useState({ name: "", email: "", message: "" });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
  };

  const set = (field: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm((f) => ({ ...f, [field]: e.target.value }));

  return (
    <section id="contact" className="py-32 bg-[#07111F] relative overflow-hidden">
      <div className="absolute inset-0">
        <img
          src="https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1920&h=1080&fit=crop&auto=format"
          alt=""
          className="w-full h-full object-cover opacity-15"
        />
        <div className="absolute inset-0 bg-[#07111F]/75" />
      </div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div
          ref={ref}
          className={`text-center mb-16 transition-all duration-1000 ${
            inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          <p className="text-[#0E7A61] text-[10px] tracking-[0.5em] uppercase font-['Outfit'] mb-3">Set Sail Together</p>
          <h2 className="font-['Playfair_Display'] text-4xl text-white">Connect With Us</h2>
        </div>

        <div className="grid md:grid-cols-2 gap-12 lg:gap-20 items-start">
          <div
            className={`transition-all duration-700 ${
              inView ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-8"
            }`}
          >
            <p className="text-white/55 font-['Outfit'] leading-relaxed mb-10 text-sm">
              Whether you are a founder seeking opportunity, an investor scouting the next breakthrough, or a brand aligning with India&apos;s brightest minds — your voyage begins here.
            </p>

            <div className="flex flex-col gap-7">
              {[
                { icon: <MapPin size={17} />, label: "Location", value: "IIT Bombay, Mumbai, India" },
                { icon: <Mail size={17} />, label: "Email", value: "hello@esummit.in" },
                { icon: <Phone size={17} />, label: "Phone", value: "+91 22 2576 7000" },
              ].map(({ icon, label, value }) => (
                <div key={label} className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full border border-[#C8A96A]/30 flex items-center justify-center text-[#C8A96A] shrink-0">
                    {icon}
                  </div>
                  <div>
                    <div className="text-white/35 text-[10px] tracking-[0.3em] uppercase font-['Outfit'] mb-0.5">{label}</div>
                    <div className="text-white/70 font-['Outfit'] text-sm">{value}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div
            className={`transition-all duration-700 ${
              inView ? "opacity-100 translate-x-0" : "opacity-0 translate-x-8"
            }`}
            style={{ transitionDelay: "200ms" }}
          >
            <form
              onSubmit={handleSubmit}
              className="rounded-[28px] p-8 bg-white/[0.04] backdrop-blur-md border border-[#C8A96A]/18"
            >
              <div className="flex flex-col gap-5">
                {[
                  { name: "name", label: "Your Name", type: "text", placeholder: "Captain Ahab" },
                  { name: "email", label: "Email Address", type: "email", placeholder: "captain@vessel.com" },
                ].map((field) => (
                  <div key={field.name}>
                    <label className="block text-white/40 text-[10px] tracking-[0.3em] uppercase font-['Outfit'] mb-2">
                      {field.label}
                    </label>
                    <input
                      type={field.type}
                      value={form[field.name as keyof typeof form]}
                      onChange={set(field.name)}
                      placeholder={field.placeholder}
                      className="w-full bg-white/[0.05] border border-white/10 focus:border-[#C8A96A]/45 rounded-[14px] px-4 py-3 text-white placeholder-white/18 outline-none transition-all duration-300 font-['Outfit'] text-sm"
                    />
                  </div>
                ))}
                <div>
                  <label className="block text-white/40 text-[10px] tracking-[0.3em] uppercase font-['Outfit'] mb-2">
                    Message
                  </label>
                  <textarea
                    value={form.message}
                    onChange={set("message")}
                    placeholder="Tell us about your voyage..."
                    rows={4}
                    className="w-full bg-white/[0.05] border border-white/10 focus:border-[#C8A96A]/45 rounded-[14px] px-4 py-3 text-white placeholder-white/18 outline-none transition-all duration-300 font-['Outfit'] text-sm resize-none"
                  />
                </div>
                <button
                  type="submit"
                  className="flex items-center justify-center gap-3 px-8 py-4 bg-[#C8A96A] text-[#07111F] font-['Outfit'] font-semibold text-xs tracking-[0.2em] uppercase hover:bg-[#ddc07a] transition-all duration-300 rounded-[14px] shadow-xl shadow-[#C8A96A]/20 group"
                >
                  <span>Send Message</span>
                  <Send size={15} className="group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── Footer ───────────────────────────────────────────────────────────────────

function Footer() {
  return (
    <footer className="bg-[#03080F] border-t border-[#C8A96A]/10 relative overflow-hidden">
      <div className="absolute inset-0 opacity-12 pointer-events-none">
        <img
          src="https://images.unsplash.com/photo-1505118380757-91f5f5632de0?w=1920&h=500&fit=crop&auto=format"
          alt=""
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#03080F] via-[#03080F]/60 to-[#03080F]" />
      </div>
      <StarField count={35} />

      <div className="relative z-10 max-w-7xl mx-auto px-6 py-20">
        {/* Ship silhouette */}
        <div className="text-center mb-10">
          <div className="inline-block text-[#C8A96A]/15 select-none" style={{ fontSize: "80px", lineHeight: 1 }}>
            ⛵
          </div>
        </div>

        <div className="flex flex-col items-center mb-12">
          <div className="flex items-center gap-3 mb-3">
            <CompassRose size={30} />
            <span className="font-['Playfair_Display'] text-xl text-[#C8A96A] tracking-[0.25em]">E·SUMMIT</span>
          </div>
          <p className="text-white/25 font-['Outfit'] text-xs text-center max-w-xs leading-relaxed">
            Navigate The Future. IIT Bombay&apos;s Premier Entrepreneurship Summit.
          </p>
        </div>

        <div className="flex flex-wrap justify-center gap-6 md:gap-10 mb-12">
          {["Home", "About", "Events", "Speakers", "Gallery", "Sponsors", "Contact"].map((link) => (
            <a
              key={link}
              href={`#${link.toLowerCase()}`}
              className="text-white/25 hover:text-[#C8A96A] text-[10px] tracking-[0.3em] uppercase font-['Outfit'] transition-colors duration-300"
            >
              {link}
            </a>
          ))}
        </div>

        <div className="flex justify-center gap-4 mb-12">
          {[Instagram, Twitter, Linkedin, Facebook].map((Icon, i) => (
            <a
              key={i}
              href="#"
              className="w-10 h-10 rounded-full border border-white/10 hover:border-[#C8A96A]/45 flex items-center justify-center text-white/25 hover:text-[#C8A96A] transition-all duration-300 hover:shadow-lg hover:shadow-[#C8A96A]/12"
            >
              <Icon size={15} />
            </a>
          ))}
        </div>

        <div className="flex items-center gap-4 mb-8">
          <div className="h-px bg-white/8 flex-1" />
          <Anchor size={13} className="text-[#C8A96A]/25" />
          <div className="h-px bg-white/8 flex-1" />
        </div>

        <p className="text-center text-white/18 font-['Outfit'] text-xs tracking-wider">
          © 2025 E-Summit, IIT Bombay. All rights reserved. Charting new horizons.
        </p>
      </div>
    </footer>
  );
}

// ─── App ──────────────────────────────────────────────────────────────────────

export default function App() {
  useEffect(() => {
    document.documentElement.style.scrollBehavior = "smooth";
  }, []);

  return (
    <div className="min-h-screen bg-[#07111F]">
      <style>{`
        @keyframes estwinkle {
          0%, 100% { opacity: 0.25; transform: scale(1); }
          50% { opacity: 0.9; transform: scale(1.5); }
        }
        @keyframes esfadein {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        ::-webkit-scrollbar { display: none; }
        * { scrollbar-width: none; }
      `}</style>
      <Nav />
      <Hero />
      <About />
      <Stats />
      <Events />
      <Speakers />
      <Highlights />
      <Gallery />
      <Sponsors />
      <Testimonials />
      <Contact />
      <Footer />
    </div>
  );
}
