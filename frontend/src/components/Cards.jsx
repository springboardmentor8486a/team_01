// ... (imports and hook initialization)
import "./Cards.css";
function Cards() {
    // ... (useAnimateOnScroll initialization)

    return (
        <section className="cards-section-wrapper">
            {/* ... (Taglines) ... */}

            <div className="cards-grid-new">
                {/* Card 1: Report an Issue */}
                <Link 
                    to="/register-complaint" 
                    ref={refReport} 
                    className={`card-link card-hover-effect ${isReportVisible ? 'fade-in-left' : 'hidden-left'}`}
                > 
                    <img src={reportImg} alt="Report an issue" className="card-img" />
                    
                    {/* 🌟 NEW CONTENT WRAPPER 🌟 */}
                    <div className="card-text-content">
                        <h3 className="card-title">Report an issue</h3>
                        <div className="card-step-indicator">1. Report</div>
                        <p className="card-description">Quickly file a complaint using your phone or desktop. Pin the location and upload photos.</p>
                    </div>
                </Link>
                
                {/* Card 2: Volunteer (Apply same wrapper and structure) */}
                <Link 
                    to="/volunteer" 
                    ref={refVolunteer} 
                    className={`card-link card-hover-effect ${isVolunteerVisible ? 'fade-in-up-slow' : 'hidden'}`}
                >
                    <img src={volunteerImg} alt="Willing to volunteer?" className="card-img" />
                    <div className="card-text-content">
                        <h3 className="card-title">willing to volunteer?</h3>
                        <div className="card-step-indicator">2. Volunteer</div>
                        <p className="card-description">Join local efforts! From clean-ups to tracking resolution times, your help makes a difference.</p>
                    </div>
                </Link>
                
                {/* Card 3: Track Complaint (Apply same wrapper and structure) */}
                <Link 
                    to="/track-complaint" 
                    ref={refTrack} 
                    className={`card-link card-hover-effect ${isTrackVisible ? 'fade-in-right' : 'hidden-right'}`}
                >
                    <img src={trackImg} alt="Track your Complaint" className="card-img" />
                    <div className="card-text-content">
                        <h3 className="card-title">Track your Complaint</h3>
                        <div className="card-step-indicator">3. Resolve</div>
                        <p className="card-description">Follow your complaint's journey from submission to resolution and provide your final feedback.</p>
                    </div>
                </Link>
            </div>
        </section>
    );
}
export default Cards;
// ... (export)