import {
  FaUserTie,
  FaEnvelope,
  FaPhone,
  FaInfoCircle,
  FaCheckCircle,
} from "react-icons/fa";

import PageHeader from "../components/PageHeader";
import "../styles/about.css";

function About() {
  return (
    <>
      <PageHeader title="About Fresh" />

      <div className="about-page">
        <div className="about-card">
          {/* APP LOGO */}
          <div className="about-logo">🛒</div>

          <h1>Fresh Grocery</h1>

          <p className="about-tagline">
            Fresh groceries, delivered to your doorstep.
          </p>

          {/* DEVELOPER / OWNER */}
          <div className="developer-section">
            <h2>
              <FaUserTie />
              Developer & Owner
            </h2>

            <div className="owner-badge">
              <FaCheckCircle />
              Application Owner
            </div>

            <h3>Sravani J</h3>

            <p>
              Designed and developed with ❤️ to provide a simple,
              convenient, and reliable grocery shopping experience.
            </p>
          </div>

          {/* CONTACT INFORMATION */}
          <div className="about-info">
            <a
              href="mailto:sravanijalibili123@gmail.com"
              className="about-info-row"
            >
              <FaEnvelope />

              <div>
                <small>Email</small>
                <span>sravanijalibili123@gmail.com</span>
              </div>
            </a>

            <a
              href="tel:+919121920722"
              className="about-info-row"
            >
              <FaPhone />

              <div>
                <small>Phone</small>
                <span>+91 9121920722</span>
              </div>
            </a>

            <div className="about-info-row">
              <FaInfoCircle />

              <div>
                <small>Application Version</small>
                <span>Version 1.0.0</span>
              </div>
            </div>
          </div>

          {/* FOOTER */}
          <div className="about-footer">
            <p>Made with ❤️ by Sravani J</p>

            <small>
              © {new Date().getFullYear()} Fresh Grocery
            </small>
          </div>
        </div>
      </div>
    </>
  );
}

export default About;