
import Layout from "@/components/layout/Layout";
import HeroSection from "@/components/home/HeroSection";
import HowItWorks from "@/components/home/HowItWorks";
import FeaturedTrips from "@/components/home/FeaturedTrips";
import Testimonials from "@/components/home/Testimonials";
import CallToAction from "@/components/home/CallToAction";

const Index = () => {
  return (
    <Layout>
      <HeroSection />
      <HowItWorks />
      <FeaturedTrips />
      <Testimonials />
      <CallToAction />
    </Layout>
  );
};

export default Index;
