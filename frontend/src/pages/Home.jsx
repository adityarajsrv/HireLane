import AI from "../components/AI";
import CTA from "../components/CTA";
import Features from "../components/Features";
import Footer from "../components/Footer";
import Hero from "../components/Hero";
import Navbar from "../components/Navbar";
import Pricing from "../components/Pricing";
import Tracker from "../components/Tracker";
import Working from "../components/Working";

const Home = () => {
  return (
    <div>
      <Navbar />
      <Hero />
      <Working />
      <Features />
      <Tracker />
      <AI />
      <Pricing />
      <CTA />
      <Footer />
    </div>
  );
};

export default Home;
