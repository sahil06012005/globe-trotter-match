
import { CheckCircle } from "lucide-react";

const steps = [
  {
    number: 1,
    title: "Create Your Profile",
    description: "Sign up and build your travel profile with your interests, preferences, and travel style."
  },
  {
    number: 2,
    title: "Find or Post a Trip",
    description: "Browse upcoming trips or create your own to find compatible travel companions."
  },
  {
    number: 3,
    title: "Connect & Plan",
    description: "Message potential travel buddies, discuss details, and make travel arrangements together."
  },
  {
    number: 4,
    title: "Travel Together",
    description: "Meet up and enjoy your adventure with your new travel companions!"
  }
];

const HowItWorks = () => {
  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-triplink-navy mb-4">How TripLink Works</h2>
          <p className="max-w-2xl mx-auto text-lg text-gray-600">
            Finding the perfect travel companion is easy with our simple process
          </p>
        </div>
        
        <div className="grid md:grid-cols-4 gap-8">
          {steps.map((step) => (
            <div 
              key={step.number} 
              className="relative p-6 rounded-lg border border-gray-100 shadow-sm bg-white text-center hover:shadow-md transition-shadow"
            >
              <div className="w-12 h-12 flex items-center justify-center rounded-full bg-triplink-teal text-white font-bold text-xl mx-auto mb-4">
                {step.number}
              </div>
              <h3 className="font-semibold text-xl mb-2">{step.title}</h3>
              <p className="text-gray-600">{step.description}</p>
            </div>
          ))}
        </div>
        
        <div className="mt-16 bg-triplink-lightBlue rounded-lg p-8">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <h3 className="text-2xl font-bold mb-4 text-triplink-navy">Why Choose TripLink?</h3>
              <ul className="space-y-4">
                <li className="flex items-start">
                  <CheckCircle className="text-triplink-teal mr-2 h-5 w-5 mt-1" />
                  <span>Verified profiles and reviews for a safe and trustworthy community</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="text-triplink-teal mr-2 h-5 w-5 mt-1" />
                  <span>Smart matching algorithm to find truly compatible travel companions</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="text-triplink-teal mr-2 h-5 w-5 mt-1" />
                  <span>Group and solo travel options for every type of adventurer</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="text-triplink-teal mr-2 h-5 w-5 mt-1" />
                  <span>Flexible search options for destination, dates, budget, and interests</span>
                </li>
              </ul>
            </div>
            <div className="relative">
              <img 
                src="https://images.unsplash.com/photo-1522509585149-c9cd39d1ff08?auto=format&fit=crop&w=600&h=400&q=80" 
                alt="Friends traveling together" 
                className="rounded-lg shadow-lg"
              />
              <img 
                src="https://images.unsplash.com/photo-1511632765486-a01980e01a18?auto=format&fit=crop&w=300&h=200&q=80" 
                alt="Travel companions" 
                className="absolute -bottom-4 -right-4 rounded-lg shadow-lg border-4 border-white w-1/2 h-auto animate-float"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
