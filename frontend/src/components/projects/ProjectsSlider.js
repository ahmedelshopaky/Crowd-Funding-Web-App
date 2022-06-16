import { useEffect, useState } from "react";
import axiosInstance from "../../network/axios";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import ProjectComponent from "./ProjectComponent";

function ProjectsSlider(props) {
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
  }, []);
  const responsive = {
    desktop: {
      breakpoint: { max: 3000, min: 1024 },
      items: 1,
    },
    tablet: {
      breakpoint: { max: 1024, min: 464 },
      items: 1,
    },
  };
  return (
    <>
      {isLoading ? (
        <div className="d-flex justify-content-center mt-5">
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      ) : (
        <div className="w-75 mx-auto">
          <Carousel responsive={responsive}>
            {projects.map((project) => {
              return (
                <div className="my-home-component" key={project.id}>
                  <ProjectComponent project={project} />
                </div>
              );
            })}
          </Carousel>
        </div>
      )}
    </>
  );
}

export default ProjectsSlider;
