import React, { useEffect, useState, useContext } from "react";
import { useLocation, useParams, Link, useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import StarRatings from "react-star-ratings";

import axiosInstance from "../network/axios";
import DataContext from "../context/data";
import ProjectComponent from "../components/projects/ProjectComponent";
import ProjectComments from "../components/projects/ProjectComments";

export default function Project() {
  const imageURL = "http://localhost:8000/static/projects/images/";
  const id = useParams().id;
  const [project, setProject] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const [donation, setDonation] = useState("");
  const [isValid, setIsValid] = useState(true);
  const [isDonated, setIsDonated] = useState(true);
  const { isLoggedIn, setPreviousPath } = useContext(DataContext);
  const location = useLocation();

  const [rate, setRate] = useState(0);
  const changeRating = (newRating) => {
    setRate(newRating);
    if (!isLoggedIn) {
      setPreviousPath(location.pathname);
      navigate("/login");
    }
  };

  useEffect(() => {
    if (rate > 0) {
      axiosInstance
        .post(
          `projects/${id}/rate`,
          { rate },
          {
            headers: { "X-CSRFToken": Cookies.get("csrftoken") },
            withCredentials: true,
          }
        )
        .then((response) => {
          //
        })
        .catch((error) => {
          //
        });
    }
  }, [rate]);

  /******* donation *******/

  const validateDonation = (donation) => {
    if (donation > 0 && !isNaN(donation)) {
      return true;
    } else {
      return false;
    }
  };

  useEffect(() => {
    if (validateDonation(donation)) {
      setIsValid(true);
    } else {
      setIsValid(false);
    }
  }, [donation]);

  const handleChange = (e) => {
    setDonation(e.target.value);
  };

  const handleDonateClick = () => {
    if (!isLoggedIn) {
      setPreviousPath(location.pathname);
      navigate("/login");
    }
  };

  const handleSubmitClick = () => {
    if (isValid) {
      axiosInstance
        .post(
          `projects/${id}/donate`,
          { donation },
          {
            headers: { "X-CSRFToken": Cookies.get("csrftoken") },
            withCredentials: true,
          }
        )
        .then((response) => {
          setIsDonated(true);
        })
        .catch((error) => {
          setIsDonated(false);
          if (error.response.data.detail === "Unauthenticated!") {
            navigate("/login");
          }
        });
      setDonation("");
    }
  };

  const handleCancelClick = () => {
    setDonation("");
  };

  /******* get project *******/

  useEffect(() => {
    getProject();
  }, [pathname]);

  const getProject = () => {
    axiosInstance
      .get(`projects/${id}`, {
        headers: { "X-CSRFToken": Cookies.get("csrftoken") },
        withCredentials: true,
      })
      .then((response) => {
        window.scrollTo(0, 0);
        setProject(response.data);
        setIsLoading(false);
        setRate(parseInt(response.data.auth_user_rate));
      })
      .catch((error) => {
        //
      });
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
        <div className="container">
          {/************* Project Details *************/}
          <div className="row">
            <div className="col-md-6 col-xl-7">
              <div className="card mx-auto">
                <div className="card-header">
                  <h3 className="card-title mb-0">Project Details</h3>
                </div>
                <img
                  src={imageURL + project.thumbnail.split("/").at(-1)}
                  className="img-fluid rounded-start my-project-img w-100"
                  alt={project.title}
                />
                <div className="row g-0 p-2">
                  <div className="card-body">
                    <p className="card-title mb-3 fs-2">{project.title}</p>
                    <p className="card-text mx-4 fs-5">{project.details}</p>
                    <div className="row">
                      <div className="col-10">
                        <button
                          disabled={!isLoggedIn}
                          onClick={handleDonateClick}
                          data-bs-toggle={isLoggedIn ? "modal" : ""}
                          data-bs-target="#donationModal"
                          className="btn btn-outline-dark w-100 my-2 fs-5"
                        >
                          Donate
                        </button>
                      </div>
                      <div className="col-2">
                        <button
                          disabled={!isLoggedIn}
                          // onClick={handleDonateClick}
                          // data-bs-toggle={isLoggedIn ? "modal" : ""}
                          // data-bs-target="#donationModal"
                          className="btn btn-danger w-100 my-2 fs-5"
                        >
                          Report
                        </button>
                      </div>
                    </div>
                    <table className="table fs-5">
                      <tbody>
                        <tr>
                          <td>
                            <b>Rate</b>
                          </td>
                          <td>
                            <StarRatings
                              starDimension="30px"
                              starSpacing="0px"
                              rating={rate}
                              starRatedColor="blue"
                              changeRating={changeRating}
                              numberOfStars={5}
                              name="rating"
                            />
                          </td>
                        </tr>
                        <tr>
                          <td>
                            <b>End Time</b>
                          </td>
                          <td>{project.end_time.substring(0, 10)}</td>
                        </tr>
                        <tr>
                          <td>
                            <b>Total Target</b>
                          </td>
                          <td>$ {project.total_target}</td>
                        </tr>

                        <tr>
                          <td>
                            <b>Donations</b>
                          </td>
                          <td>$ {project.donations}</td>
                        </tr>

                        <tr>
                          <td>
                            <b>User</b>
                          </td>
                          <td>
                            <Link
                              to={"/users/" + project.user.id}
                              className="text-decoration-none"
                            >
                              {project.user.name}
                            </Link>
                          </td>
                        </tr>
                        <tr>
                          <td>
                            <b>Tags</b>
                          </td>
                          <td>{project.tags.join(" | ")}</td>
                        </tr>
                        <tr>
                          <td>
                            <b>Category</b>
                          </td>
                          <td>{project.category}</td>
                        </tr>
                      </tbody>
                    </table>
                    <p className="card-text">
                      <small className="text-muted">
                        Created at: {[project.start_time.substring(0, 10), project.start_time.substring(11, 16)].join(' / ')}
                      </small>
                    </p>
                  </div>
                </div>
              </div>
            </div>
            {/************* Comments *************/}
            <div className="col-md-6 col-xl-5">
              <ProjectComments project_id={project.id} />
            </div>
          </div>

          <div>
            <h1 className="p-5 pb-0">Related Projects</h1>
            <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 px-5 my-5">
              {project.related.map((related) => {
                return (
                  <div
                    className="my-home-component my-3 mx-auto"
                    key={related.id}
                  >
                    <ProjectComponent project={related} />
                  </div>
                );
              })}
            </div>
          </div>

          <div
            className="modal fade"
            id="donationModal"
            tabIndex="-1"
            role="dialog"
            aria-labelledby="donationModalTitle"
            aria-hidden="true"
          >
            <div className="modal-dialog modal-dialog-centered" role="document">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title fs-4" id="exampleModalLongTitle">
                    {project.title}
                  </h5>
                </div>
                <div className="modal-body my-3">
                  <input
                    type="text"
                    value={donation}
                    onChange={handleChange}
                    className={`form-control py-2 ${
                      isValid ? "border border-dark" : "border border-danger"
                    }`}
                    placeholder="Donation"
                  />
                </div>
                <div className="modal-footer p-2">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    data-bs-dismiss="modal"
                    onClick={handleCancelClick}
                  >
                    Close
                  </button>
                  <button
                    type="button"
                    className="btn btn-primary"
                    data-bs-toggle={isValid ? "modal" : ""}
                    data-bs-target={isValid ? "#confirmationModal" : ""}
                    onClick={handleSubmitClick}
                  >
                    Donate
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div
            className="modal fade"
            id="confirmationModal"
            tabIndex="-1"
            role="dialog"
            aria-labelledby="confirmationModalTitle"
            aria-hidden="true"
          >
            <div className="modal-dialog modal-dialog-centered" role="document">
              <div className="modal-content">
                <div className="modal-body my-3 pt-5">
                  <p className="text-center fs-1">
                    {isDonated ? "Done!" : "Error!"}
                  </p>
                </div>
                <div className="modal-footer p-3 d-flex justify-content-center">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    data-bs-dismiss="modal"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
