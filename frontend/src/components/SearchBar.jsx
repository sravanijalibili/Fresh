import { FaSearch } from "react-icons/fa";
import "../styles/searchbar.css";

function SearchBar({ value = "", onChange = () => {}, onClear = () => {} }) {
  return (
    <div className="search-container">
      <div className="search-box">
        <FaSearch className="search-icon" />
        <input
          type="text"
          placeholder="Search vegetables, eggs..."
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
        {value && (
          <button type="button" onClick={onClear} className="search-clear">
            ×
          </button>
        )}
      </div>
    </div>
  );
}

export default SearchBar;