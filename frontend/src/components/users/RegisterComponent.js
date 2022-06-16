import { useEffect, useState } from "react";
import axiosInstance from "../../network/axios";
import Cookies from "js-cookie";
import { useNavigate, Link } from "react-router-dom";

function RegisterComponent() {
  const phoneRegExp = /^01[0125]\d{8}$/;
  const passwordRegExp = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[a-zA-Z\d@$.!%*#?&]/;
  const emailRegExp = /(.+)@(.+){2,}\.(.+){2,}/;
  const usernameRegExp =
    /^[a-zA-Z0-9]([._-](?![._-])|[a-zA-Z0-9]){1,18}[a-zA-Z0-9]$/;

  const navigate = useNavigate();

  let formData = {
    first_name: "",
    last_name: "",
    username: "",
    email: "",
    mobile_phone: "",
    profile_picture: "",
    password: "",
    repeatedPassword: "",
  };

  const [isReady, setIsReady] = useState(false);
  const [form, setForm] = useState(formData);
  const [errors, setErrors] = useState({});
  const [isValid, setIsValid] = useState(true);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleBlur = (e) => {
    switch (e.target.name) {
      case "username":
        setErrors({
          ...errors,
          username:
            e.target.value.length === 0
              ? "Required"
              : !e.target.value.match(usernameRegExp)
              ? "Invalid Username"
              : null,
        });
        break;

      case "first_name":
        setErrors({
          ...errors,
          first_name:
            e.target.value.length === 0
              ? "Required"
              : e.target.value.length < 5 || e.target.value > 20
              ? "Invalid First Name"
              : null,
        });
        break;

      case "last_name":
        setErrors({
          ...errors,
          last_name:
            e.target.value.length === 0
              ? "Required"
              : e.target.value.length < 5 || e.target.value > 20
              ? "Invalid Last Name"
              : null,
        });
        break;

      case "email":
        setErrors({
          ...errors,
          email:
            e.target.value.length === 0
              ? "Required"
              : !e.target.value.match(emailRegExp)
              ? "Invalid"
              : null,
        });
        break;

      case "password":
        setErrors({
          ...errors,
          password:
            e.target.value.length === 0
              ? "Required"
              : !e.target.value.match(passwordRegExp)
              ? "Weak Password"
              : null,
        });
        break;

      case "repeatedPassword":
        setErrors({
          ...errors,
          repeatedPassword:
            e.target.value.length === 0
              ? "Required"
              : e.target.value !== form.password
              ? "Password do not match"
              : null,
        });
        break;

      case "mobile_phone":
        setErrors({
          ...errors,
          mobile_phone:
            e.target.value.length === 0
              ? "Required"
              : !e.target.value.match(phoneRegExp)
              ? "Invalid Phone Number"
              : null,
        });
        break;

      default:
        break;
    }
  };

  const handleProfilePictureChange = (e) => {
    if (e.target.files) {
      setForm({ ...form, profile_picture: e.target.files[0] });
      setErrors({ ...errors, profile_picture: null });
    }
  };

  useEffect(() => {
    let errArr = [];
    Object.values(errors).forEach((err) => {
      if (err !== null) {
        errArr.push(err);
      }
    });
    errArr.length > 0 ? setIsValid(false) : setIsValid(true);
    Object.values(form).forEach((data) => {
      if (data === "") {
        setIsValid(false);
        setIsReady(false);
        return;
      } else {
        setIsReady(true);
      }
    });
  }, [errors, form]);

  const sendRequest = () => {
    let data = new FormData();
    data.append("username", form.username);
    data.append("first_name", form.first_name);
    data.append("last_name", form.last_name);
    data.append("email", form.email);
    data.append("password", form.password);
    data.append("mobile_phone", form.mobile_phone);
    data.append("profile_picture", form.profile_picture);

    axiosInstance
      .post(`users/register`, data, {
        headers: {
          Authorization: Cookies.get("jwt")
            ? `jwt=${Cookies.get("jwt")}`
            : null,
          "Content-Type": "multipart/form-data",
          accept: "application/json",
        },
      })
      .then((response) => {
        navigate("/login");
      })
      .catch((error) => {
        //
      });
  };

  const handleClick = (e) => {
    e.preventDefault();
    if (isValid) {
      sendRequest();
    } else {
      handleBlur(e);
    }
  };

  return (
    <div className="card w-50 mx-auto shadow p-5">
      <h4 className="card-title text-center">Create Account</h4>
      <p className="text-center">Get started with your free account</p>
      <form>
        <div className="form-group input-group mb-4">
          <div className="input-group-prepend">
            <span className="input-group-text">
              {" "}
              <i className="fa fa-user p-1"></i>{" "}
            </span>
          </div>
          <input
            onChange={handleChange}
            onBlur={handleBlur}
            name="first_name"
            className={`form-control ${
              errors.first_name ? "border-danger" : ""
            }`}
            placeholder="First Name"
            type="text"
          />

          <div className="input-group-prepend">
            <span className="input-group-text">
              {" "}
              <i className="fa fa-user p-1"></i>{" "}
            </span>
          </div>
          <input
            onChange={handleChange}
            onBlur={handleBlur}
            name="last_name"
            className={`form-control ${
              errors.last_name ? "border-danger" : ""
            }`}
            placeholder="Last Name"
            type="text"
          />
        </div>
        <div className="form-group input-group mb-4">
          <div className="input-group-prepend">
            <span className="input-group-text">
              {" "}
              <i className="fa fa-user p-1"></i>{" "}
            </span>
          </div>
          <input
            onChange={handleChange}
            onBlur={handleBlur}
            name="username"
            className={`form-control ${errors.username ? "border-danger" : ""}`}
            placeholder="Username"
            type="text"
          />
        </div>
        <div className="form-group input-group mb-4">
          <div className="input-group-prepend">
            <span className="input-group-text">
              {" "}
              <i className="fa fa-envelope p-1"></i>{" "}
            </span>
          </div>
          <input
            onChange={handleChange}
            onBlur={handleBlur}
            name="email"
            className={`form-control ${errors.email ? "border-danger" : ""}`}
            placeholder="Email Address"
            type="email"
          />
        </div>
        <div className="form-group input-group mb-4">
          <div className="input-group-prepend">
            <span className="input-group-text">
              {" "}
              <i className="fa fa-phone p-1"></i>{" "}
            </span>
          </div>
          <input
            onChange={handleChange}
            onBlur={handleBlur}
            name="mobile_phone"
            className={`form-control ${
              errors.mobile_phone ? "border-danger" : ""
            }`}
            placeholder="Phone Number"
            type="text"
          />
        </div>
        <div className="form-group input-group mb-4">
          <div className="input-group-prepend">
            <span className="input-group-text">
              {" "}
              <i className="fa fa-solid fa-camera p-1"></i>{" "}
            </span>
          </div>
          <input
            onChange={handleProfilePictureChange}
            onBlur={handleBlur}
            name="profile_picture"
            className={`form-control ${
              errors.profile_picture ? "border-danger" : ""
            }`}
            type="file"
          />
        </div>
        <div className="form-group input-group mb-4">
          <div className="input-group-prepend">
            <span className="input-group-text">
              {" "}
              <i className="fa fa-lock p-1"></i>{" "}
            </span>
          </div>
          <input
            onChange={handleChange}
            onBlur={handleBlur}
            name="password"
            className={`form-control ${errors.password ? "border-danger" : ""}`}
            placeholder="Password"
            type="password"
          />
        </div>
        <div className="form-group input-group mb-4">
          <div className="input-group-prepend">
            <span className="input-group-text">
              {" "}
              <i className="fa fa-lock p-1"></i>{" "}
            </span>
          </div>
          <input
            onChange={handleChange}
            onBlur={handleBlur}
            name="repeatedPassword"
            className={`form-control ${
              errors.repeatedPassword ? "border-danger" : ""
            }`}
            placeholder="Repeat Password"
            type="password"
          />
        </div>
        <div className="form-group text-center">
          <button
            type="submit"
            className="my-btn btn btn-dark w-100"
            onClick={handleClick}
            disabled={!isReady}
          >
            {" "}
            Register{" "}
          </button>
        </div>
        <p className="text-center mt-3 fs-5">
          Have an account? <Link to="/login">Log In</Link>{" "}
        </p>
      </form>
    </div>
  );
}

export default RegisterComponent;
