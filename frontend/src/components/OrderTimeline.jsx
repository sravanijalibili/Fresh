import "../styles/ordertimeline.css";

const steps = [
  "Pending",
  "Confirmed",
  "Packed",
  "Out for Delivery",
  "Delivered",
];

function OrderTimeline({ status }) {
  if (status === "Cancelled") {
    return (
      <div className="cancelled-timeline">
        <div className="cancelled-icon">✕</div>

        <div>
          <h4>Order Cancelled</h4>
          <p>This order has been cancelled.</p>
        </div>
      </div>
    );
  }

  const currentIndex = steps.indexOf(status);

  return (
    <div className="timeline">
      {steps.map((step, index) => {
        const isCompleted = index <= currentIndex;
        const isCurrent = index === currentIndex;

        return (
          <div className="timeline-step" key={step}>
            <div className="timeline-left">
              <div
                className={`timeline-circle ${
                  isCompleted ? "active" : ""
                } ${isCurrent ? "current" : ""}`}
              >
                {isCompleted ? "✓" : ""}
              </div>

              {index !== steps.length - 1 && (
                <div
                  className={`timeline-line ${
                    index < currentIndex ? "active" : ""
                  }`}
                />
              )}
            </div>

            <div className="timeline-content">
              <p className={isCompleted ? "completed-text" : ""}>
                {step}
              </p>

              {isCurrent && (
                <span className="current-status">
                  Current Status
                </span>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default OrderTimeline;