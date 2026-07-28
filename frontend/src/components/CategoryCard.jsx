import { useNavigate } from "react-router-dom";

function CategoryCard({ category }) {

    const navigate = useNavigate();

    return (

        <div
            className="card"
            onClick={() => navigate(`/products/${category.id}`)}
        >

          

            <img
    src={category.image}
    alt={category.name}
/>

            <div className="card-body">

                <h2>{category.name}</h2>

            </div>

        </div>

    );

}

export default CategoryCard;