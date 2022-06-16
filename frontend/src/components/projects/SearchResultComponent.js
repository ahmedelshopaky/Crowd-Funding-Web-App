import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import axiosInstance from "../../network/axios";
import ProjectComponent from "./ProjectComponent";
import SearchComponent from "./SearchComponent";

function SearchResultComponent() {
  const location = useLocation();
  const [result, setResult] = useState([]);
  useEffect(() => {
    axiosInstance
      .get(`projects/search/${location.state.keyword}`, { crossdomain: true })
      .then((response) => {
        setResult(response.data);
      })
      .catch((error) => {
        // console.log(error)
      });
  }, [location.state.keyword]);

  return (
    <div>
      <div className="w-50 mx-auto">
        <SearchComponent value={location.state.keyword} />
      </div>
      {result.length > 0 ? (
        <div>
          <div className="w-50 text-muted fs-6 mx-auto mb-5">
            Total Results: {result.length} Project
          </div>
          <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3">
            {result.map((project) => {
              return (
                <div
                  className="my-home-component my-3 mx-auto"
                  key={project.id}
                >
                  <ProjectComponent project={project} />
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        <div className="text-center mt-5">Sorry, No results found!</div>
      )}
    </div>
  );
}

export default SearchResultComponent;
