import { useState } from "react";
function SearchBar({ onSearch }) {
  const [search, setSearch] = useState("");
  const handleChange = (e) => {
    setSearch(e.target.value);
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch(search);
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Search User..."
        value={search}
        onChange={handleChange}
      />
      <button type="submit">Search</button>
    </form>
  );
}
export default SearchBar;
