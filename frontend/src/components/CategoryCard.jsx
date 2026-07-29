import { FaArrowRight } from "react-icons/fa";
import "../styles/categorycard.css";

function CategoryCard({ category, onClick }) {

  return (

    <div className="category-card" onClick={onClick}>

      <img
        src={category.image}
        alt={category.name}
      />

      <div className="category-info">

        <h3>{category.name}</h3>

        <button>

          <FaArrowRight />

        </button>

      </div>

    </div>

  );

}

export default CategoryCard;