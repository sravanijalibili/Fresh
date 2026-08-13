import {
  FaClock,
  FaCheck,
  FaBox,
  FaTruck,
  FaHome,
} from "react-icons/fa";

import "../styles/ordertimeline.css";

const steps = [
  {
    label: "Pending",
    icon: FaClock,
  },
  {
    label: "Confirmed",
    icon: FaCheck,
  },
  {
    label: "Packed",
    icon: FaBox,
  },
  {
    label: "Out for Delivery",
    icon: FaTruck,
  },
  {
    label: "Delivered",
    icon: FaHome,
  },
];

function OrderTimeline({ status }) {
  const currentIndex = steps.findIndex(
    (step) => step.label === status
  );

  const isCancelled = status === "Cancelled";

  return (
    <div className="timeline">

      {isCancelled ? (

        <div className="cancelled-timeline">

          <div className="cancelled-icon">
            ✕
          </div>

          <div>
            <strong>Order Cancelled</strong>

            <p>
              This order has been cancelled.
            </p>
          </div>

        </div>

      ) : (

        steps.map((step, index) => {

          const Icon = step.icon;

          const completed =
            index < currentIndex;

          const active =
            index === currentIndex;

          return (
            <div
              className="timeline-step"
              key={step.label}
            >

              <div className="timeline-indicator">

                <div
                  className={`
                    timeline-circle
                    ${completed ? "completed" : ""}
                    ${active ? "active" : ""}
                  `}
                >
                  <Icon />
                </div>

                {index !== steps.length - 1 && (
                  <div
                    className={`
                      timeline-line
                      ${
                        index < currentIndex
                          ? "completed"
                          : ""
                      }
                    `}
                  />
                )}

              </div>

              <div className="timeline-content">

                <strong
                  className={
                    active || completed
                      ? "timeline-label-active"
                      : ""
                  }
                >
                  {step.label}
                </strong>

                {active && (
                  <span className="current-status">
                    Current Status
                  </span>
                )}

              </div>

            </div>
          );
        })
      )}

    </div>
  );
}

export default OrderTimeline;