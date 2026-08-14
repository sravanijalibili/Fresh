import { useState } from "react";
import {
  FaHeadset,
  FaChevronDown,
  FaTruck,
  FaCreditCard,
  FaTag,
  FaTimesCircle,
  FaUndo,
  FaEnvelope,
} from "react-icons/fa";

import PageHeader from "../components/PageHeader";
import "../styles/helpsupport.css";

function HelpSupport() {
  const [openFaq, setOpenFaq] = useState(null);

  const faqs = [
    {
      question: "Where is my order?",
      answer:
        "You can track your order from the My Orders section. Open an order to view its current status.",
      icon: <FaTruck />,
    },
    {
      question: "How can I make a payment?",
      answer:
        "Fresh currently supports Cash on Delivery, UPI and Credit / Debit Card payment options.",
      icon: <FaCreditCard />,
    },
    {
      question: "How do I apply a coupon?",
      answer:
        "Available coupons can be selected during checkout. You can also enter a coupon code in the Offers & Coupons section.",
      icon: <FaTag />,
    },
    {
      question: "Can I cancel my order?",
      answer:
        "You can cancel an order from My Orders as long as it has not reached a stage where cancellation is no longer allowed.",
      icon: <FaTimesCircle />,
    },
    {
      question: "How can I get help with a refund?",
      answer:
        "For refund-related questions, please contact Fresh Support using the support options below.",
      icon: <FaUndo />,
    },
  ];

  const toggleFaq = (index) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  return (
    <>
      <PageHeader title="Help & Support" />

      <div className="help-support-page">

        {/* =====================================================
            SUPPORT HEADER
        ===================================================== */}

        <div className="support-header-card">
          <div className="support-icon">
            <FaHeadset />
          </div>

          <div>
            <h2>How can we help you?</h2>

            <p>
              Find answers to common questions or contact
              Fresh Support.
            </p>
          </div>
        </div>

        {/* =====================================================
            CONTACT SUPPORT
        ===================================================== */}

        <div className="support-card">

          <h3>Contact Support</h3>

          <div className="support-contact">

            <div className="support-contact-icon">
              <FaEnvelope />
            </div>

            <div>
              <h4>Email Support</h4>

              <p>
                For any assistance, contact our support team.
              </p>

              <a href="mailto:support@fresh.com">
                support@fresh.com
              </a>
            </div>

          </div>

        </div>

        {/* =====================================================
            FAQ
        ===================================================== */}

        <div className="support-card">

          <h3>Frequently Asked Questions</h3>

          <div className="faq-list">

            {faqs.map((faq, index) => (

              <div
                className={`faq-item ${
                  openFaq === index ? "faq-open" : ""
                }`}
                key={index}
              >

                <button
                  className="faq-question"
                  onClick={() => toggleFaq(index)}
                >

                  <div className="faq-question-left">

                    <span className="faq-icon">
                      {faq.icon}
                    </span>

                    <span>
                      {faq.question}
                    </span>

                  </div>

                  <FaChevronDown
                    className="faq-arrow"
                  />

                </button>

                {openFaq === index && (
                  <div className="faq-answer">
                    {faq.answer}
                  </div>
                )}

              </div>

            ))}

          </div>

        </div>

        {/* =====================================================
            FOOTER
        ===================================================== */}

        <div className="support-footer">

          <FaHeadset />

          <h3>Still need help?</h3>

          <p>
            Our support team is here to help you with your
            Fresh shopping experience.
          </p>

        </div>

      </div>
    </>
  );
}

export default HelpSupport;