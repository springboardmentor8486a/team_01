import React from "react";

import Hero from "../components/Hero";
// import Cards from "../components/Cards"; // Removed old cards
import Features from "../components/Features"; // 🌟 Imported New Features component 🌟

import Footer from "../components/Footer";

function HomePage() {
  return (
    <div className="page-container">
      <Hero />
      <Features /> 
      
      <Footer />
    </div>
  );
}

export default HomePage;
