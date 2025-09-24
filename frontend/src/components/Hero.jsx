import React from "react";
import "./Hero.css";
import heroImage from "../assets/hero.png";
import Navbar from "./Navbar";

function Hero() {
  return (
    <div className="hero-container">
      {/* Navbar sits on top of hero */}
      <Navbar />
      <img src={heroImage} alt="Hero" className="hero-image" />
    </div>
  );
}

export default Hero;
