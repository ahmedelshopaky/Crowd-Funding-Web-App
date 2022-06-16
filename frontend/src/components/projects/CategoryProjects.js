import ProjectsList from "./ProjectList";
import { useParams } from "react-router-dom";

function CategoryProjects() {
  const name = useParams().name;

  return (
    <div>
      <h2 className="m-5">{name}</h2>
      <ProjectsList url={`projects/${name}`} />
    </div>
  );
}

export default CategoryProjects;
