import ProjectsSlider from "../components/projects/ProjectsSlider";
import Categories from "../components/projects/Categories";
import ProjectList from "./../components/projects/ProjectList";
import SearchComponent from "./../components/projects/SearchComponent";
import "./Style.css";

function Home() {
  return (
    <div className="m-5">
      <div className="row my-welcome text-center">
        <div className="col-4">
          <h1>Crowd-Funding App</h1>
          <SearchComponent />
        </div>
        <div className="col-8 card border-0 my-welcome-img">
          <img
            className="card-img shadow"
            src="http://localhost:8000/static/projects/images/home.jpg"
            alt="home"
          />
        </div>
      </div>

      <div className="row row-cols-1 row-cols-md-1 row-cols-lg-2 w-100 mb-5">
        <div className="">
          <h2>Top-Five Projects</h2>
          <ProjectsSlider url="projects/top-five" />
        </div>

        <div className="">
          <h2>Latest Projects</h2>
          <ProjectsSlider url="projects/latest-five" />
        </div>
      </div>

      <div className="mb-5">
        <h2>Featured Projects</h2>
        <ProjectList url="projects/admin-selected" />
      </div>

      <div className="mb-5">
        <h2>Categories</h2>
        <Categories />
      </div>
    </div>
  );
}

export default Home;
