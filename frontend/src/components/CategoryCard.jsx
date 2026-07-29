import { FaArrowRight } from "react-icons/fa";
import "../styles/categorycard.css";

function CategoryCard({

    category,

    onClick,

    active

}) {

    return (

        <div

            className={`category-card ${active ? "active" : ""}`}

            onClick={onClick}

        >

            <img

                src={category.image}

                alt={category.name}

            />

            <h4>

                {category.name}

            </h4>

        </div>

    );

}

export default CategoryCard;