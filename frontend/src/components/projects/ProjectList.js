import { useEffect, useState } from "react";
import axiosInstance from "../../network/axios";
import ProjectComponent from "./ProjectComponent";

function ProjectsList(props) {
  const [isLoading, setIsLoading] = useState(true);
  const [projects, setProjects] = useState([]);
  useEffect(() => {
    axiosInstance
      .get(props.url, { crossdomain: true })
      .then((response) => {
        setProjects(response.data);
        setIsLoading(false);
      })
      .catch((error) => {
        // console.log(error)
      });
  }, [props.url]);
  return isLoading ? (
    <div className="d-flex justify-content-center mt-5">
      <div className="spinner-border" role="status">
        <span className="visually-hidden">Loading...</span>
      </div>
    </div>
  ) : projects.length !== 0 ? (
    <div>
    <h1 className="text-center">Projects</h1>
    <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 w-100 px-5">
      {projects.map((project) => {
        return (
          <div className="my-home-component my-3 mx-auto" key={project.id}>
            <ProjectComponent project={project} />
          </div>
        );
      })}
    </div>
    </div>
  ) : (
    <div className="m-5 text-center">Nothing to display!</div>
  );
}

export default ProjectsList;
