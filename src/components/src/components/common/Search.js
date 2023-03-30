import searchIcon from "../../assets/svg/Search.svg";

const Search = ({ setSearchTerm, width }) => {
  return (
    <div
      className="flex rounded mr-6"
      style={{ width: width, backgroundColor: "#F5F5F5" }}
    >
      <div className="flex w-10 items-center">
        <img src={searchIcon} alt="search" className="ml-4" />
      </div>

      <input
        className="mt-1 DEFAULT:border-default appearance-none focus:outline-none px-3 mx-2 text-black-400"
        placeholder="Search for a product"
        id="searchProduct"
        type="text"
        name="search"
        style={{ width: width, backgroundColor: "#F5F5F5" }}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
    </div>
  );
};

export default Search;
