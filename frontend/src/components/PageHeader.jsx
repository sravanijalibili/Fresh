import { FaArrowLeft } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import "../styles/pageheader.css";

function PageHeader({ title }) {
  const navigate = useNavigate();

  return (
    <div className="page-header">
      <button className="back-btn" onClick={() => navigate(-1)}>
        <FaArrowLeft />
      </button>

      <h2>{title}</h2>

      <div style={{ width: "35px" }}></div>
    </div>
  );
}

export default PageHeader;
