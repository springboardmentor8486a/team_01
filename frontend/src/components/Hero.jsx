import React, { useEffect, useRef } from "react";
import "./Hero.css";
import Navbar from "./Navbar";
import { useNavigate } from "react-router-dom"; 
// Assuming you have this asset now, using it as a professional illustration
import cityIllustration from '../assets/hero_illustration.png'; 

function Hero() {
    const navigate = useNavigate();
    const contentRef = useRef(null);

    useEffect(() => {
        // Add a class after mount to trigger the CSS entrance animation
        if (contentRef.current) {
            contentRef.current.classList.add('animate-loaded');
        }
    }, []);

    return (
        <div className="hero-container-new">
            <Navbar />
            <div className="hero-content-wrapper" ref={contentRef}>
                {/* Left Side: Text and Main Action - Animated */}
                <div className="hero-text-area">
                    {/* Add hero-animated-item and delay classes for staggering */}
                    <h1 className="hero-animated-item delay-1">Your City, Solved.</h1>
                    <h2 className="hero-animated-item delay-2">Report Local Issues, Track Progress, Drive Change.</h2>
                    <p className="hero-animated-item delay-3">Clean Street connects residents directly with local authorities to tackle city issues—from potholes to broken streetlights—efficiently and transparently. Let's build a better neighborhood together.</p>
                    
                    <div className="hero-buttons-wrapper hero-animated-item delay-4">
                        <button 
                            className="hero-main-button" 
                            onClick={() => navigate('/register-complaint')}
                        >
                            Report an Issue Now
                        </button>
                        <button 
                            className="hero-secondary-button"
                            onClick={() => navigate('/issue-map')}
                        >
                            View Live Issues Map
                        </button>
                    </div>
                </div>

                {/* Right Side: Dynamic Element/Illustration - Animated */}
                <div className="hero-dynamic-area hero-animated-item delay-5">
                    <div className="hero-illustration-box">
                        <img src={cityIllustration} alt="City management illustration" className="hero-issue-img" />
                        <p className="illustration-caption">Empowering Community Action</p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Hero;
