import { useState } from "react";
import { useNavigate } from "react-router-dom";

function SearchComponent(props) {
  // TODO Warning: A component is changing an uncontrolled input to be controlled. This is likely caused by the value changing from undefined to a defined value, which should not happen. Decide between using a controlled or uncontrolled input element for the lifetime of the component. More info: https://reactjs.org/link/controlled-components

  const navigate = useNavigate();
  const [keyword, setKeyword] = useState(props.value);
  const handleChange = (e) => {
    setKeyword(e.target.value);
  };
  const handleClick = (e) => {
    e.preventDefault();
    navigate(`/projects/search/${keyword}`, { state: { keyword } });
  };
  return (
    <div className="g-0">
      <form className="input-group mt-3">
        <input
          type="text"
          value={keyword}
          onChange={handleChange}
          className="form-control"
          placeholder="Search Projects"
        />
        <div className="input-group-append">
          <button
            type="submit"
            className="btn btn-outline-secondary"
            onClick={handleClick}
            disabled={!keyword}
          >
            Search
          </button>
        </div>
      </form>
    </div>
  );
}

export default SearchComponent;
