import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axiosInstance from "../network/axios";
import ProjectComponent from "../components/projects/ProjectComponent";

function User() {
  const id = useParams().id;

  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState({});
  
  useEffect(() => {
    axiosInstance
      .get(`/users/${id}`, { crossdomain: true })
      .then((response) => {
        setUser(response.data);
        setIsLoading(false);
      })
      .catch((error) => {
        // console.log(error)
      });
  }, [id]);
  const userImageURL = "http://localhost:8000/static/users/images/";
  // const projectImageURL = 'http://localhost:8000/static/projects/images/';
  return (
    <>
      {isLoading ? (
        <div className="d-flex justify-content-center mt-5">
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      ) : (
        <div className="container">
          <div className="row">
            <div className="col-md-4 col-xl-3">
              <div className="card mb-3">
                <div className="card-header">
                  <h3 className="card-title mb-0">Profile Details</h3>
                </div>
                <div className="card-body text-center">
                  <img
                    src={userImageURL + user.profile_picture.split("/").at(-1)}
                    alt={user.name}
                    className="img-fluid rounded-circle mb-2"
                    width="128"
                    height="128"
                  />
                  <h3 className="card-title mb-0 mt-2">{user.name}</h3>
                  <div className="text-muted mb-2"></div>
                </div>
                <hr className="my-0" />
                <div className="card-body">
                  <h4 className="h5 card-title">About</h4>
                  <ul className="list-unstyled mb-0">
                    {user.country ? (
                      <li className="mb-1">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="24"
                          height="24"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="feather feather-map-pin feather-sm mr-1"
                        >
                          <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                          <circle cx="12" cy="10" r="3"></circle>
                        </svg>{" "}
                        From: {user.country}
                      </li>
                    ) : (
                      <div></div>
                    )}
                    {user.birthday ? (
                      <li className="mb-1">
                        <svg
                          version="1.1"
                          xmlns="http://www.w3.org/2000/svg"
                          width="24"
                          height="24"
                          viewBox="0 0 470 470"
                          enableBackground="new 0 0 470 470"
                        >
                          <path d="m462.5,420h-35.876v-142.99c0-0.02 0-30.01 0-30.01 0-26.191-21.309-47.5-47.5-47.5h-116.624v-68.191c0-9.649-7.851-17.5-17.5-17.5h-2.5v-22.5c0-4.142-3.358-7.5-7.5-7.5s-7.5,3.358-7.5,7.5v22.5h-2.5c-9.649,0-17.5,7.851-17.5,17.5v68.191h-123.043c-26.191,0-47.5,21.309-47.5,47.5v173h-29.457c-4.142,0-7.5,3.358-7.5,7.5s3.358,7.5 7.5,7.5h4.343l4.325,15.137c3.182,11.138 14.748,19.863 26.332,19.863h385c11.584,0 23.15-8.725 26.332-19.862l4.325-15.138h4.343c4.142,0 7.5-3.358 7.5-7.5s-3.358-7.5-7.5-7.5zm-240-288.691c0-1.355 1.145-2.5 2.5-2.5h20c1.355,0 2.5,1.145 2.5,2.5v68.191h-25v-68.191zm-138.043,83.191h294.667c17.92,0 32.5,14.58 32.5,32.5v23c-13.563,1.819-21.473,8.441-28.555,14.402-7.553,6.357-13.519,11.378-26.396,11.378s-18.842-5.021-26.396-11.378c-8.299-6.985-17.706-14.903-36.055-14.903-18.347,0-27.752,7.917-36.051,14.903-7.552,6.357-13.517,11.378-26.391,11.378-12.875,0-18.839-5.021-26.392-11.378-8.299-6.985-17.705-14.903-36.052-14.903-18.347,0-27.752,7.917-36.051,14.903-4.436,3.734-8.626,7.262-14.052,9.321-2.912,1.105-4.838,3.896-4.838,7.012v51.285c0,4.136-3.364,7.5-7.5,7.5-4.135,0-7.5-3.364-7.5-7.5v-51.039c0.105-3.161-1.803-6.105-4.835-7.256-5.427-2.06-9.618-5.588-14.054-9.323-7.081-5.961-14.989-12.583-28.55-14.402v-23c0.001-17.92 14.58-32.5 32.501-32.5zm-32.5,70.688c8.032,1.574 12.983,5.717 18.89,10.69 3.871,3.258 8.145,6.856 13.55,9.688v46.454c0,12.407 10.093,22.5 22.5,22.5s22.5-10.093 22.5-22.5l.001-46.454c5.404-2.832 9.679-6.43 13.549-9.688 7.552-6.357 13.517-11.378 26.391-11.378 12.875,0 18.84,5.021 26.392,11.378 8.299,6.985 17.705,14.903 36.052,14.903s27.753-7.917 36.051-14.903c7.552-6.357 13.517-11.378 26.391-11.378 12.877,0 18.843,5.021 26.396,11.379 8.299,6.985 17.706,14.902 36.055,14.902s27.755-7.917 36.055-14.902c5.909-4.973 10.861-9.117 18.896-10.691v134.812h-359.669v-134.812zm387.452,160.829c-1.343,4.701-7.02,8.983-11.909,8.983h-385c-4.89,0-10.566-4.282-11.909-8.983l-3.148-11.017h415.114l-3.148,11.017z" />
                          <path d="m205.002,95.547c1.778,0 3.563-0.628 4.993-1.905 3.09-2.759 3.358-7.5 0.6-10.59-5.353-5.995-8.3-13.71-8.3-21.726 0-17.564 13.299-35.9 32.706-45.552 19.407,9.651 32.706,27.987 32.706,45.552 0,8.016-2.948,15.731-8.3,21.726-2.759,3.089-2.491,7.831 0.599,10.589 3.088,2.758 7.83,2.491 10.589-0.599 7.81-8.747 12.111-20.01 12.111-31.716 0-24.235-18.382-49.196-44.702-60.699-1.915-0.837-4.092-0.836-6.007,0-26.32,11.503-44.702,36.463-44.702,60.698 0,11.706 4.301,22.969 12.111,31.716 1.481,1.661 3.534,2.507 5.596,2.506z" />
                        </svg>{" "}
                        Birthday: {user.birthday}
                      </li>
                    ) : (
                      <div></div>
                    )}

                    <li className="mb-1">
                      <svg
                        className=""
                        version="1.1"
                        id="Capa_1"
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 75.294 75.294"
                      >
                        <path
                          d="M66.097,12.089h-56.9C4.126,12.089,0,16.215,0,21.286v32.722c0,5.071,4.126,9.197,9.197,9.197h56.9
                          c5.071,0,9.197-4.126,9.197-9.197V21.287C75.295,16.215,71.169,12.089,66.097,12.089z M61.603,18.089L37.647,33.523L13.691,18.089
                          H61.603z M66.097,57.206h-56.9C7.434,57.206,6,55.771,6,54.009V21.457l29.796,19.16c0.04,0.025,0.083,0.042,0.124,0.065
                          c0.043,0.024,0.087,0.047,0.131,0.069c0.231,0.119,0.469,0.215,0.712,0.278c0.025,0.007,0.05,0.01,0.075,0.016
                          c0.267,0.063,0.537,0.102,0.807,0.102c0.001,0,0.002,0,0.002,0c0.002,0,0.003,0,0.004,0c0.27,0,0.54-0.038,0.807-0.102
                          c0.025-0.006,0.05-0.009,0.075-0.016c0.243-0.063,0.48-0.159,0.712-0.278c0.044-0.022,0.088-0.045,0.131-0.069
                          c0.041-0.023,0.084-0.04,0.124-0.065l29.796-19.16v32.551C69.295,55.771,67.86,57.206,66.097,57.206z"
                        />
                      </svg>{" "}
                      {user.email}
                    </li>
                  </ul>
                </div>
                <hr className="my-0" />
                <div className="card-body">
                  <ul className="list-unstyled mb-0">
                    <li className="mb-1">
                      <svg
                        version="1.1"
                        id="Layer_1"
                        xmlns="http://www.w3.org/2000/svg"
                        width="26"
                        height="26"
                        viewBox="0 0 502 502"
                      >
                        <path
                          d="M103.656,466.086c0,19.803,15,35.914,33.438,35.914h227.813c18.438,0,33.438-16.111,33.438-35.914V35.914
                          c0-19.803-15-35.914-33.438-35.914H137.094c-18.438,0-33.438,16.111-33.438,35.914V466.086z M123.656,78.047h254.688v302.37
                          H123.656V78.047z M123.656,35.914c0-8.775,6.028-15.914,13.438-15.914h227.813c7.409,0,13.438,7.139,13.438,15.914v22.133H123.656
                          V35.914z M378.344,466.086c0,8.775-6.028,15.914-13.438,15.914H137.094c-7.41,0-13.438-7.139-13.438-15.914v-65.669h254.688
                          V466.086z"
                        />
                        <path
                          d="M251,468.83c15.517,0,28.14-12.623,28.14-28.14s-12.623-28.14-28.14-28.14c-15.516,0-28.14,12.623-28.14,28.14
                          S235.484,468.83,251,468.83z M251,432.551c4.488,0,8.14,3.651,8.14,8.14s-3.651,8.14-8.14,8.14s-8.14-3.651-8.14-8.14
                          S246.512,432.551,251,432.551z"
                        />
                        <path
                          d="M260.329,30.061h-18.658c-5.523,0-10,4.478-10,10s4.477,10,10,10h18.658c5.522,0,10-4.478,10-10
                          S265.852,30.061,260.329,30.061z"
                        />
                        <path
                          d="M152.527,165.85c-5.523,0-10,4.478-10,10v176.215c0,5.522,4.477,10,10,10s10-4.478,10-10V175.85
                          C162.527,170.327,158.05,165.85,152.527,165.85z"
                        />
                        <path
                          d="M152.527,98.473c-5.523,0-10,4.478-10,10v26.951c0,5.522,4.477,10,10,10s10-4.478,10-10v-26.951
                          C162.527,102.95,158.05,98.473,152.527,98.473z"
                        />
                      </svg>{" "}
                      {user.mobile_phone}
                    </li>

                    {user.fb_profile ? (
                      <li className="mb-1">
                        <svg
                          className="mx-1 svg-inline--fa fa-facebook fa-w-14 fa-fw"
                          aria-hidden="true"
                          data-prefix="fab"
                          data-icon="facebook"
                          role="img"
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 448 512"
                          data-fa-i2svg=""
                        >
                          <path
                            fill="currentColor"
                            d="M448 56.7v398.5c0 13.7-11.1 24.7-24.7 24.7H309.1V306.5h58.2l8.7-67.6h-67v-43.2c0-19.6 5.4-32.9 
                            33.5-32.9h35.8v-60.5c-6.2-.8-27.4-2.7-52.2-2.7-51.6 0-87 31.5-87 89.4v49.9h-58.4v67.6h58.4V480H24.7C11.1 
                            480 0 468.9 0 455.3V56.7C0 43.1 11.1 32 24.7 32h398.5c13.7 0 24.8 11.1 24.8 24.7z"
                          ></path>
                        </svg>
                        <Link to="#">{user.fb_profile}</Link>
                      </li>
                    ) : (
                      <div></div>
                    )}
                  </ul>
                </div>
              </div>
            </div>

            <div className="col-md-8 col-xl-9">
              <div className="card">
                <div className="card-header">
                  <h4 className="card-title mb-0">Projects</h4>
                </div>
                <div className="card-body h-100">
                  {user.projects.map((project) => {
                    return (
                      <div className="media" key={project.id}>
                        <div className="media-body">
                          {/* <ProjectComponent project={project} /> */}
                          {/* <img src={projectImageURL + project.thumbnail.split('/').at(-1)} width="40" height="40" className="rounded-circle mr-2 m-2" alt={project.title} /> */}
                          <Link to={`/projects/${project.id}`}>
                            <span className="fs-4">{project.title}</span>
                          </Link>
                          <br />
                          <small className="text-muted">{`Start Time: ${project.start_time.substring(0, 10)} - End Time: ${project.end_time.substring(0, 10)}`}</small>
                          <br />
                        </div>
                        <hr />
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default User;
