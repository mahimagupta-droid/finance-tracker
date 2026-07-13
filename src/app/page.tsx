"use client";
import Background from "../../public/homepage-img.png"
import Image from "next/image"
import FAQs from "@/components/Accordion"
import { useAuth } from "@clerk/nextjs"
import Link from "next/link";
import { TestimonialsSection } from "../components/TestimonialCard";
export default function HomePage() {
  const user = useAuth();
  return (
    <>
      <div className="w-full pt-28 pb-16 lg:py-0 min-h-screen bg-background flex flex-col items-center justify-center px-6 lg:px-16 transition-colors duration-300 gap-8 lg:gap-16">
        <span className="text-xs sm:text-sm md:text-base font-semibold tracking-[0.2em] text-primary uppercase text-center px-4">
          Earn &rarr; Track &rarr; Analyze &rarr; Save &rarr; Grow
        </span>
        <div className="max-w-7xl w-full grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          <div className="flex justify-center order-2 lg:order-1">
            <Image
              src={Background}
              alt="Finance Illustration"
              className="w-[85%] sm:w-[70%] lg:w-[95%] max-w-md lg:max-w-lg object-contain"
              priority
            />
          </div>
          <div className="flex flex-col gap-6 text-center lg:text-left order-1 lg:order-2 px-2 sm:px-6 lg:px-0">
            <h1 className="text-3xl sm:text-5xl lg:text-5xl font-extrabold text-textColor leading-tight tracking-tight font-playfair">
              Understand your money. <br />
              <span className="text-primary">Control your future.</span>
            </h1>
            <p className="text-muted-textColor text-base sm:text-lg max-w-xl mx-auto lg:mx-0">
              Your intelligent companion for tracking expenses, setting smart goals, and achieving financial freedom. Take the guesswork out of your finances.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 mt-4 justify-center lg:justify-start">
              {user.isSignedIn ? (
                <Link href="/dashboard" className="px-8 py-3.5 bg-primary hover:bg-primary/85 text-primary-textColor font-semibold rounded-md transition-all duration-300 shadow-lg hover:shadow-primary/25 text-center">
                  Get Started
                </Link>
              ) : (
                <Link href="/signup" className="px-8 py-3.5 bg-primary hover:bg-primary/85 text-primary-textColor font-semibold rounded-md transition-all duration-300 shadow-lg hover:shadow-primary/25 text-center">
                  Sign Up
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>
      <div className="w-full py-16 px-4 sm:px-6 bg-[#060b1a] transition-colors duration-300">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl sm:text-4xl text-center font-bold mb-8 text-[#dce8fb] font-playfair">Our Testimonials</h2>
          <TestimonialsSection />
        </div>
      </div>
      <div className="flex flex-col items-center justify-center py-16 px-4 sm:px-6 w-full max-w-4xl mx-auto">
        <FAQs />
      </div>
    </>
  )
}