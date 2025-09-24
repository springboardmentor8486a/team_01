import React from "react";
import reportImg from "../assets/report.png";
import volunteerImg from "../assets/volunteer.png";
import trackImg from "../assets/track.png";
import "./Cards.css";

function Cards() {
  return (
    <section className="cards">
      <img src={reportImg} alt="Report an issue" className="card-img" />
      <img src={volunteerImg} alt="Willing to volunteer?" className="card-img" />
      <img src={trackImg} alt="Track your Complaint" className="card-img" />
    </section>
  );
}

export default Cards;
