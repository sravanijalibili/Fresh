import { useEffect, useState } from "react";
import { FaCopy, FaTag } from "react-icons/fa";
import toast from "react-hot-toast";

import PageHeader from "../components/PageHeader";
import { getCoupons } from "../services/couponService";

import "../styles/coupons.css";

function Coupons() {
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCoupons();
  }, []);

  const loadCoupons = async () => {
    try {
      const data = await getCoupons();

      setCoupons(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error(error);
      toast.error("Unable to load offers");
    } finally {
      setLoading(false);
    }
  };

  const copyCoupon = async (code) => {
    try {
      await navigator.clipboard.writeText(code);
      toast.success("Coupon code copied");
    } catch (error) {
      console.error(error);
      toast.error("Unable to copy coupon");
    }
  };

  if (loading) {
    return (
      <>
        <PageHeader title="Offers & Coupons" />

        <div className="coupons-loading">
          Loading offers...
        </div>
      </>
    );
  }

  return (
    <>
      <PageHeader title="Offers & Coupons" />

      <div className="coupons-page">
        {coupons.length === 0 ? (
          <div className="empty-coupons">
            <div className="empty-coupons-icon">
              <FaTag />
            </div>

            <h2>No Offers Available</h2>

            <p>
              There are no active coupons available right now.
              Please check again later.
            </p>
          </div>
        ) : (
          <div className="coupons-grid">
            {coupons.map((coupon) => (
              <div className="coupon-card" key={coupon.id}>
                <div className="coupon-icon">
                  <FaTag />
                </div>

                <div className="coupon-content">
                  <h2>{coupon.code}</h2>

                  <p className="coupon-description">
                    {coupon.description ||
                      `Get ${
                        coupon.discount_type === "PERCENTAGE"
                          ? `${coupon.discount_value}%`
                          : `₹${coupon.discount_value}`
                      } off on your order`}
                  </p>

                  <p className="coupon-minimum">
                    Minimum order: ₹{coupon.minimum_order_amount}
                  </p>

                  {coupon.maximum_discount && (
                    <p className="coupon-maximum">
                      Maximum discount: ₹{coupon.maximum_discount}
                    </p>
                  )}

                  <button
                    className="copy-coupon-btn"
                    onClick={() => copyCoupon(coupon.code)}
                  >
                    <FaCopy />
                    Copy Code
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}

export default Coupons;
