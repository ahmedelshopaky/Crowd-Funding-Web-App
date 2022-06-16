import { useEffect, useState, useContext } from "react";
import axiosInstance from "../../network/axios";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import DataContext from "../../context/data";

function LoginComponent() {
  const { setIsLoggedIn, previousPath } = useContext(DataContext);
  const navigate = useNavigate();

  const formData = {
    email: null,
    password: null,
  };

  const formError = {
    email: true,
    password: true,
  };

  const [form, setForm] = useState(formData);
  const [errors, setErrors] = useState(formError);
  const [isValid, setIsValid] = useState(true);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const validateEmail = (test) => {
    var re = /(.+)@(.+){2,}\.(.+){2,}/;
    if (re.test(test)) {
      return true;
    } else {
      return false;
    }
  };

  const validatePassword = (test) => {
    var re = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[a-zA-Z\d@$.!%*#?&]/;
    if (re.test(test)) {
      return true;
    } else {
      return false;
    }
  };

  const handleBlur = (e) => {
    switch (e.target.name) {
      case "email":
        setErrors({
          ...errors,
          email: validateEmail(e.target.value),
        });
        break;
      case "password":
        setErrors({
          ...errors,
          password: validatePassword(e.target.value),
        });
        break;
      default:
        break;
    }
  };

  useEffect(() => {
    if (errors.email && errors.password) {
      setIsValid(true);
    } else {
      setIsValid(false);
    }
  }, [errors, form]);

  const sendRequest = () => {
    axiosInstance
      .post(`users/login`, form)
      .then((response) => {
        Cookies.set("jwt", response.data.jwt);
        Cookies.set("username", response.data.username);
        axiosInstance.defaults.headers["Authorization"] =
          "jwt=" + response.data.jwt;
        setIsLoggedIn(true);
        if (/\/projects\/*/.test(previousPath)) {
          navigate(previousPath);
        } else {
          navigate("/");
        }
      })
      .catch((error) => {
        if (error.response) {
          errors.response = error.response.data.detail;
        }
        setIsValid(false);
      });
  };

  const handleLoginClick = (e) => {
    e.preventDefault();
    if (isValid) {
      sendRequest();
    }
  };

  const handleRegisterClick = () => {
    navigate("/register");
  };

  return (
    <div className="row d-flex justify-content-center">
      <div className="col-md-6 shadow p-0">
        <div className="card px-5 py-5">
          <h3 className="text-center mb-3">Login</h3>
          <form className="form-data">
            <div className="forms-inputs mb-4">
              {" "}
              <span>Email</span>
              <input
                onChange={handleChange}
                onBlur={handleBlur}
                name="email"
                className={
                  !errors.email
                    ? "border border-2 border-danger w-100 px-3"
                    : "w-100 px-3"
                }
                type="email"
              />
            </div>
            <div className="forms-inputs mb-4">
              {" "}
              <span>Password</span>
              <input
                onChange={handleChange}
                onBlur={handleBlur}
                name="password"
                className={
                  !errors.password
                    ? "border border-2 border-danger w-100 px-3"
                    : "w-100 px-3"
                }
                type="password"
              />
            </div>
            <div className="mb-3">
              {" "}
              <button
                type="submit"
                className="my-btn btn btn-dark w-100"
                onClick={handleLoginClick}
              >
                Login
              </button>
            </div>
            <div className="mx-auto text-center">
              {" "}
              <button
                className="my-btn btn btn-outline-dark w-100"
                onClick={handleRegisterClick}
              >
                Register
              </button>
            </div>
            <div className="text-danger text-center mt-3" hidden={isValid}>
              {errors.response ? errors.response : ""}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default LoginComponent;
