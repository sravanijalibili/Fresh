import { useNavigate } from "react-router-dom";
import "../styles/herobanner.css";

function HeroBanner() {
  const navigate = useNavigate();

  return (
    <div className="hero">
      <div className="hero-left">
        <span className="offer">⚡ Fresh Everyday</span>

        <h1>
          Farm Fresh
          <br />
          Vegetables
        </h1>

        <p>
          Fresh vegetables, leafy vegetables and eggs delivered to your
          doorstep.
        </p>

        <button onClick={() => navigate("/categories")}>
          Shop Now
        </button>
      </div>

      <div className="hero-right">
        <img
          src="https://images.unsplash.com/photo-1542838132-92c53300491e?w=800"
          alt="Fresh Vegetables"
        />
      </div>
    </div>
  );
}

export default HeroBanner;