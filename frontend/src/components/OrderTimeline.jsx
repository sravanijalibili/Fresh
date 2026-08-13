import { FaCheck } from "react-icons/fa";

import "../styles/ordertimeline.css";

const steps = [
  "Pending",
  "Confirmed",
  "Packed",
  "Out for Delivery",
  "Delivered",
];

function OrderTimeline({ status }) {
  const currentIndex = steps.indexOf(status);

  if (status === "Cancelled") {
    return (
      <div className="cancelled-timeline">
        <div className="cancelled-icon">×</div>

        <div>
          <h4>Order Cancelled</h4>

          <p>This order has been cancelled.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="timeline">
      {steps.map((step, index) => {
        const completed = index < currentIndex;
        const current = index === currentIndex;

        return (
          <div className="timeline-step" key={step}>
            <div className="timeline-left">
              <div
                className={`timeline-circle ${
                  completed ? "completed" : ""
                } ${current ? "current" : ""}`}
              >
                {completed || current ? <FaCheck /> : ""}
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
              <p className={current ? "current-text" : ""}>{step}</p>

              {current && (
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