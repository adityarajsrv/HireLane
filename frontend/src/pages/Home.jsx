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
    <div id="home">
      <Navbar />
      <Hero />
      <section id="how-it-works" className="scroll-mt-24">
        <Working />
      </section>
      <section id="features" className="scroll-mt-24">
        <Features />
      </section>
      <Tracker />
      <AI />
      <section id="pricing" className="scroll-mt-24">
        <Pricing />
      </section>
      <section id="contact" className="scroll-mt-24">
        <CTA />
      </section>
      <Footer />
    </div>
  );
};

export default Home;