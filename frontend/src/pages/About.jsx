import { FaUserTie, FaEnvelope, FaPhone, FaInfoCircle } from "react-icons/fa";

import PageHeader from "../components/PageHeader";
import "../styles/about.css";

function About() {
  return (
    <>
      <PageHeader title="About Fresh" />

      <div className="about-page">
        <div className="about-card">

          <div className="about-logo">
            🛒
          </div>

          <h1>Fresh Grocery</h1>

          <p className="about-tagline">
            Fresh groceries, delivered to your doorstep.
          </p>

          <div className="developer-section">

            <h2>
              <FaUserTie />
              Developer & Owner
            </h2>

            <h3>Sravani J</h3>

            <p>
              Designed and developed with ❤️ to provide
              a simple and convenient grocery shopping experience.
            </p>

          </div>

          <div className="about-info">

            <div className="about-info-row">
              <FaEnvelope />
              <span>sravanijalibili123@gmail.com</span>
            </div>

            <div className="about-info-row">
              <FaPhone />
              <span>+91 9121920722</span>
            </div>

            <div className="about-info-row">
              <FaInfoCircle />
              <span>App Version 1.0.0</span>
            </div>

          </div>

        </div>
      </div>
    </>
  );
}

export default About;