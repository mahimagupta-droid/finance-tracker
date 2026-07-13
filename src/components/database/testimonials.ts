export interface Testimonial {
  id: number;
  name: string;
  role: string;
  image: string;
  rating: number;
  text: string;
}

export const testimonials: Testimonial[] = [
  {
    id: 1,
    name: "Aarav Sharma",
    role: "College Student",
    image: "/users/user1.jpg",
    rating: 5,
    text: "This app completely changed how I manage my daily expenses. The UI is super clean and tracking feels effortless now."
  },
  {
    id: 2,
    name: "Priya Mehta",
    role: "Freelancer",
    image: "/users/user2.jpg",
    rating: 5,
    text: "I love how I can categorize my income and expenses so easily. It actually helped me understand where my money goes."
  },
  {
    id: 3,
    name: "Rohan Verma",
    role: "Software Engineer",
    image: "/users/user3.jpg",
    rating: 4,
    text: "The insights are really helpful. I didn’t realize how much I was overspending until I started using this."
  },
  {
    id: 4,
    name: "Neha Kapoor",
    role: "Content Creator",
    image: "/users/user4.jpg",
    rating: 5,
    text: "Simple, fast, and effective. Exactly what I needed to keep my finances in control without overcomplicating things."
  }
];