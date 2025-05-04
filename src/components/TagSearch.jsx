import { useState } from "react";
import PropTypes from "prop-types";

function TagSearch({ onSearch }) {
  const [searchTerm, setSearchTerm] = useState("");

  const handleChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    onSearch(value);
  };

  return (
    <div className="mb-3">
      <input
        type="text"
        placeholder="Search tags..."
        value={searchTerm}
        onChange={handleChange}
        className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-100 text-gray-800"
      />
    </div>
  );
}

TagSearch.propTypes = {
  onSearch: PropTypes.func.isRequired
};

export default TagSearch;