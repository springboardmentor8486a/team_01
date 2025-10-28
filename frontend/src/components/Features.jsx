import React from 'react';
import { Link } from 'react-router-dom';
import useAnimateOnScroll from '../hooks/useAnimateOnScroll';
// NOTE: I am using simple characters as placeholders for icons. 
// You should replace these with actual icon components (e.g., Lucide or SVG)

const featuresData = [
    {
        icon: '✓', 
        title: "Total Transparency",
        description: "Track every complaint status from submission to final resolution, including officer assignments and completion photos.",
        linkText: "Track Your Issue",
        linkTo: "/track-complaint",
        animationClass: "fade-in-left"
    },
    {
        icon: '⚡',
        title: "Rapid Response & Efficiency",
        description: "Our platform ensures issues are routed to the correct department within minutes, drastically cutting down resolution times.",
        linkText: "Report Now",
        linkTo: "/register-complaint",
        animationClass: "fade-in-up"
    },
    {
        icon: '👥',
        title: "Community Empowerment",
        description: "Connect with local volunteers, rate service quality, and contribute feedback to directly shape public service priorities.",
        linkText: "Join Volunteer Team",
        linkTo: "/volunteer",
        animationClass: "fade-in-right"
    }
];

const Features = () => {
    // We use one hook and manage the stagger delay with CSS
    const [ref, isVisible] = useAnimateOnScroll(0.1); 

    return (
        <section className="features-section-wrapper" ref={ref}>
            <div className={`features-intro ${isVisible ? 'fade-in-up' : 'hidden'}`}>
                <h2 className="features-main-title">A New Standard for Civic Engagement</h2>
                <p className="features-subtitle">Clean Street is built on three pillars: Transparency, Speed, and Community Action.</p>
            </div>

            <div className="features-grid">
                {featuresData.map((feature, index) => (
                    <div 
                        key={index} 
                        className={`feature-card card-hover-effect ${isVisible ? feature.animationClass : 'hidden'}`}
                        // Apply staggered delay using inline style (works with the animation-fill-mode in CSS)
                        style={{ animationDelay: `${index * 0.2}s` }}
                    >
                        <div className="feature-icon-wrapper">
                            {/* Icon Placeholder */}
                            <div className={`feature-icon`}>
                                {feature.icon}
                            </div>
                        </div>
                        
                        <h3>{feature.title}</h3>
                        <p>{feature.description}</p>
                        
                        <Link to={feature.linkTo} className="feature-action-link">
                            {feature.linkText} &rarr;
                        </Link>
                    </div>
                ))}
            </div>
        </section>
    );
};

export default Features;
