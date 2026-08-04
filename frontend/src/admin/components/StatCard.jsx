import "../styles/statcard.css";

function StatCard({

    title,

    value,

    color

}){

    return(

        <div
            className="stat-card"
            style={{
                borderTop:`5px solid ${color}`
            }}
        >

            <h4>{title}</h4>

            <h1>{value}</h1>

        </div>

    )

}

export default StatCard;