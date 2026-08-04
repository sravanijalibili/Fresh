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

  return (
    <div className="timeline">
      {steps.map((step, index) => (
        <div className="timeline-step" key={step}>
          <div
            className={
              index <= currentIndex
                ? "timeline-circle active"
                : "timeline-circle"
            }
          >
            ✓
          </div>

          <p>{step}</p>

          {index !== steps.length - 1 && (
            <div
              className={
                index < currentIndex
                  ? "timeline-line active"
                  : "timeline-line"
              }
            />
          )}
        </div>
      ))}
    </div>
  );
}

export default OrderTimeline;