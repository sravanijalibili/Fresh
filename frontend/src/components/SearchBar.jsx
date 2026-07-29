import { FaSearch } from "react-icons/fa";
import "../styles/searchbar.css";

function SearchBar() {
  return (
    <div className="search-container">
      <div className="search-box">
        <FaSearch className="search-icon" />

        <input type="text" placeholder="Search vegetables, eggs..." />
      </div>
    </div>
  );
}

export default SearchBar;
