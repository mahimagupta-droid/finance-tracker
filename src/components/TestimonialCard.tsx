import { testimonials } from "./database/testimonials";

export interface TestimonialCardProps {
  name: string;
  role: string;
  text?: string;
  quote?: string;
}

export function initials(name: string): string {
  return name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

export function TestimonialCard({ name, role, text, quote }: TestimonialCardProps) {
  const displayQuote = quote || text || "";

  return (
    <div
      className="group relative flex flex-col rounded-2xl p-6 sm:p-7 transition-all duration-300 hover:-translate-y-1 bg-card shadow-sm"
      onMouseEnter={(e) => {
        e.currentTarget.style.boxShadow =
          "0 12px 32px -8px rgba(30,80,180,0.35)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.boxShadow = "none";
      }}>
      <span
        aria-hidden="true"
        className="absolute top-2 left-4 select-none leading-none"
        style={{
          fontFamily: "Georgia, 'Playfair Display', serif",
          fontSize: "96px",
          color: "rgba(94,163,255,0.14)",
        }}>
        &ldquo;
      </span>
      <div className="relative flex items-center gap-3 mb-4 pt-6">
        <div
          className="flex items-center justify-center rounded-full flex-shrink-0"
          style={{
            width: 44,
            height: 44,
            background:
              "conic-gradient(from 180deg, #5da3ff, #7fd6ff, #5da3ff)",
            padding: 2,
          }}>
          <div
            className="flex items-center justify-center w-full h-full rounded-full"
            style={{ background: "#0a1730" }}>
            <span
              className="text-sm font-semibold"
              style={{ color: "#bcdcff" }}>
              {initials(name)}
            </span>
          </div>
        </div>
        <div>
          <p
            className="font-semibold leading-tight"
            style={{
              color: "#eaf1fb",
              fontFamily: "Georgia, 'Playfair Display', serif",
              fontSize: "17px",
            }}>
            {name}
          </p>
          <span
            className="inline-block mt-1 px-2 py-0.5 rounded-full text-xs font-medium tracking-wide"
            style={{
              background: "rgba(94,163,255,0.12)",
              color: "#8fbdf5",
            }}>
            {role}
          </span>
        </div>
      </div>
      <p
        className="relative text-sm sm:text-[15px] leading-relaxed"
        style={{ color: "#c2cde3" }}>
        {displayQuote}
      </p>
    </div>
  );
}

export function TestimonialsSection() {
  return (
    <section className="w-full px-4 sm:px-6 py-4 bg-[#060b1a]">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6">
        {testimonials.map((t) => (
          <TestimonialCard key={t.name} {...t} />
        ))}
      </div>
    </section>
  );
}
export default TestimonialCard;