import { Link } from "react-router-dom";
import StarRatings from "react-star-ratings";

function ProjectComponent({ project }) {
  const imageURL = "http://localhost:8000/static/projects/images/";
  return (
    <div className="my-card pb-0 shadow">
      <div className="card border-0">
        <Link
          to={"/projects/" + project.id}
          className="text-decoration-none text-dark"
        >
          <div className="card-body text-center p-0 mb-5">
            <img
              className="card-img my-project-thumbnail"
              src={imageURL + project.thumbnail.split("/").at(-1)}
              alt={project.title}
            />
            <div className="my-4 pb-2">
              <h3 className="card-title">{project.title}</h3>
              <div className="mx-3">
                <StarRatings
                  rating={project.rate}
                  starDimension="25px"
                  starRatedColor="blue"
                  starSpacing="0px"
                />
              </div>
            </div>
          </div>
        </Link>
        <hr className="m-0 p-0" />
        <Link
          to={`/users/${project.user.id}`}
          className="text-decoration-none text-dark"
        >
          <p className="text-muted py-2 mb-0 my-card-footer px-3">
            By/ <span className="text-dark">{project.user.name}</span>
          </p>
        </Link>
      </div>
    </div>
  );
}

export default ProjectComponent;
