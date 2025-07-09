import { useTagData } from "./useTagData";

function TagSearch() {
  const { searchTags, tagSearchTerm } = useTagData();

  const handleChange = (e) => {
    const value = e.target.value;
    searchTags(value);
  };

  return (
    <div className="mb-3">
      <input
        type="text"
        placeholder="Search tags..."
        value={tagSearchTerm}
        onChange={handleChange}
        className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-100 text-gray-800"
      />
    </div>
  );
}

export default TagSearch;