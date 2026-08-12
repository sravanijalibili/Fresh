import { FaBars } from "react-icons/fa";

import "../styles/adminheader.css";

function AdminHeader({ onMenu }) {
  return (
    <header className="admin-header">
      <button className="menu-btn" onClick={onMenu}>
        <FaBars />
      </button>

      <h2>Fresh Admin</h2>
    </header>
  );
}

export default AdminHeader;
