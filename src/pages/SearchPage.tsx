import { useSearchParams } from "react-router-dom";

const SearchPage = () => {
  const [params] = useSearchParams();
  const query = params.get("q");

  return (
    <div>
      <h1>Search Results for: {query}</h1>
    </div>
  );
};

export default SearchPage;