import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axiosInstance from "../../network/axios";

function Categories() {
  const [isLoading, setIsLoading] = useState(true);
  const [categories, setCategories] = useState([]);
  useEffect(() => {
    axiosInstance
      .get("projects/categories", { crossdomain: true })
      .then((response) => {
        setCategories(response.data);
        setIsLoading(false);
      })
      .catch((error) => {
        // console.log(error)
      });
  }, []);

  return (
    <>
      {isLoading ? (
        <div className="d-flex justify-content-center mt-5">
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      ) : (
        <div className="list-group mx-5">
          {categories.map((category) => {
            return (
              <Link
                to={`projects/category/${category.name}`}
                key={category.id}
                className="text-decoration-none text-dark fs-4 list-group-item list-group-item-action"
              >
                <span className="mx-5">{category.name}</span>
              </Link>
            );
          })}
        </div>
      )}
    </>
  );
}

export default Categories;
