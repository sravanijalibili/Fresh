function ProductCard({ product }) {

    return (

        <div className="card">

            <img
    src={product.image}
    alt={product.name}
/>

            <div className="card-body">

                <h2>{product.name}</h2>

                <p className="quantity">
                    Quantity : {product.quantity}
                </p>

                <p className="price">
                    ₹ {product.price}
                </p>

            </div>

        </div>

    );

}

export default ProductCard;