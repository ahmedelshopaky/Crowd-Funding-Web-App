import React, { useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import Cookies from "js-cookie";
import axiosInstance from "../network/axios";
import DataContext from "../context/data";

export default function Header() {
  const { isLoggedIn, setIsLoggedIn, setAuthUser } = useContext(DataContext);
  const navigate = useNavigate();
  const username = Cookies.get("username");
  const handleProfileClick = () => {
    if (isLoggedIn) {
      axiosInstance
      .get(
        `users/profile`,
        {
          headers: { "X-CSRFToken": Cookies.get("csrftoken") },
          withCredentials: true,
        }
      )
      .then((response) => {
        setAuthUser(response.data);
        navigate(`users/${response.data.id}`);
        // TODO navigate(`profile`);
      })
      .catch((error) => {
        //
      });
    } else {
      navigate("login");
    }
  };

  const handleLogoutClick = async (e) => {
    await axiosInstance
      .post(
        `users/logout`,
        {},
        {
          headers: { "X-CSRFToken": Cookies.get("csrftoken") },
          withCredentials: true,
        }
      )
      .then((response) => {
        // console.log(response);
      })
      .catch((error) => {
        // console.log(error);
      });
    Cookies.remove("jwt");
    setIsLoggedIn(false);
    navigate("/");
  };
  return (
    <nav className="navbar fixed-top navbar-expand-sm navbar-light bg-light fs-4 px-5 shadow-sm">
      <div className="container-fluid">
        <Link className="navbar-brand fs-3" to="/">
          Crowd-Funding App
        </Link>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNavAltMarkup"
          aria-controls="navbarNavAltMarkup"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNavAltMarkup">
          <div className="navbar-nav fs-5 w-100 d-flex justify-content-between">
            <div className="d-flex flex-row">
              <Link
                className="nav-link active"
                aria-current="page"
                to="projects"
              >
                Projects
              </Link>
            </div>
            <div className="d-flex flex-row">
              {!isLoggedIn ? (
                <Link
                  className="nav-link active"
                  aria-current="page"
                  to="login"
                >
                  Login
                </Link>
              ) : (
                <div className="mx-3">
                  <div className="dropdown">
                    <span
                      className="nav-link active dropdown-toggle"
                      type="button"
                      id="dropdownMenu2"
                      data-bs-toggle="dropdown"
                      aria-haspopup="true"
                      aria-expanded="false"
                    >
                      {username}
                    </span>
                    <div
                      className="dropdown-menu"
                      aria-labelledby="dropdownMenu2"
                    >
                      <button className="dropdown-item" type="button" onClick={handleProfileClick}>
                        Profile
                      </button>
                      <button className="dropdown-item" type="button" onClick={handleLogoutClick}>
                        Logout
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
