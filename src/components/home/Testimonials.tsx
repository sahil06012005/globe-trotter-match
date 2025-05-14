
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Star } from "lucide-react";

const testimonials = [
  {
    id: 1,
    name: "Jessica M.",
    avatar: "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?auto=format&fit=crop&w=150&h=150",
    location: "United States",
    text: "I was nervous about traveling solo, but TripLink helped me find the perfect travel buddy for my trip to Thailand. We had so much in common and ended up having an amazing adventure!",
    trip: "Bangkok, Thailand"
  },
  {
    id: 2,
    name: "David K.",
    avatar: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=150&h=150",
    location: "Canada",
    text: "TripLink connected me with two other photographers for a trip to Iceland. We saved money by sharing costs, and having like-minded companions made the experience so much better.",
    trip: "Reykjavik, Iceland"
  },
  {
    id: 3,
    name: "Aisha N.",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&h=150",
    location: "United Kingdom",
    text: "I posted my hiking trip to Peru and found three great travel companions through TripLink. The matching algorithm really works - we all had similar interests and energy levels!",
    trip: "Cusco, Peru"
  },
  {
    id: 4,
    name: "Marco R.",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&h=150",
    location: "Italy",
    text: "As a digital nomad, I use TripLink whenever I move to a new city. It's helped me build a global network of friends and travel companions who share my lifestyle.",
    trip: "Bali, Indonesia"
  }
];

const Testimonials = () => {
  const [currentPage, setCurrentPage] = useState(0);
  const testimonialsPerPage = 2;
  const pageCount = Math.ceil(testimonials.length / testimonialsPerPage);
  
  const displayedTestimonials = testimonials.slice(
    currentPage * testimonialsPerPage,
    (currentPage + 1) * testimonialsPerPage
  );
  
  const nextPage = () => {
    setCurrentPage((prev) => (prev + 1) % pageCount);
  };
  
  const prevPage = () => {
    setCurrentPage((prev) => (prev - 1 + pageCount) % pageCount);
  };
  
  return (
    <section className="py-20 bg-triplink-navy text-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold mb-4">Success Stories</h2>
          <p className="max-w-2xl mx-auto text-lg text-gray-300">
            Real experiences from travelers who found their perfect match on TripLink
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 gap-8 mb-8">
          {displayedTestimonials.map((testimonial) => (
            <Card key={testimonial.id} className="bg-white/10 backdrop-blur-sm border-none text-white">
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  <img 
                    src={testimonial.avatar} 
                    alt={testimonial.name} 
                    className="w-16 h-16 rounded-full mr-4 object-cover border-2 border-triplink-teal"
                  />
                  <div>
                    <h4 className="font-medium text-lg">{testimonial.name}</h4>
                    <p className="text-gray-300">{testimonial.location}</p>
                    <div className="flex mt-1">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-current text-triplink-coral" />
                      ))}
                    </div>
                  </div>
                </div>
                <p className="italic mb-4">"{testimonial.text}"</p>
                <div className="text-sm text-triplink-coral">Trip: {testimonial.trip}</div>
              </CardContent>
            </Card>
          ))}
        </div>
        
        <div className="flex justify-center items-center space-x-4">
          <Button 
            variant="outline" 
            size="icon" 
            onClick={prevPage}
            className="rounded-full border-gray-500 text-white hover:bg-white/10 hover:text-white"
          >
            <ChevronLeft className="h-5 w-5" />
          </Button>
          
          <div className="flex space-x-2">
            {[...Array(pageCount)].map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentPage(i)}
                className={`w-2 h-2 rounded-full ${
                  currentPage === i ? "bg-triplink-coral" : "bg-gray-500"
                }`}
              />
            ))}
          </div>
          
          <Button 
            variant="outline" 
            size="icon" 
            onClick={nextPage}
            className="rounded-full border-gray-500 text-white hover:bg-white/10 hover:text-white"
          >
            <ChevronRight className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
