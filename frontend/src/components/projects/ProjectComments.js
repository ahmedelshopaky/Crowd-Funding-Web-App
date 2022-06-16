import { Link, useNavigate, useLocation } from "react-router-dom";
import { useEffect, useState, useContext } from "react";
import axiosInstance from "../../network/axios";
import Cookies from "js-cookie";
import DataContext from "../../context/data";

function ProjectComments({ project_id }) {
  const imageURL = "http://localhost:8000/static/users/images/";
  const [comments, setComments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const { isLoggedIn, setPreviousPath } = useContext(DataContext);
  const navigate = useNavigate();
  const location = useLocation();
  const [newComment, setNewComment] = useState("");
  const handleChange = (e) => {
    setNewComment(e.target.value);
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    sendComment();
  };
  const sendComment = () => {
    if (isLoggedIn) {
      if (newComment) {
        axiosInstance
          .post(
            `projects/${project_id}/comment`,
            { comment: newComment },
            {
              headers: { "X-CSRFToken": Cookies.get("csrftoken") },
              withCredentials: true,
            }
          )
          .then((response) => {
            setComments([...comments, response.data]);
            setNewComment("");
          })
          .catch((error) => {
            //
          });
      }
    } else {
      setPreviousPath(location.pathname);
      navigate("/login");
    }
  };

  const getComments = () => {
    axiosInstance
      .get(`projects/${project_id}/comments`)
      .then((response) => {
        setComments(response.data);
        setIsLoading(false);
      })
      .catch((error) => {
        //
      });
  };

  useEffect(() => {
    getComments();
  }, []);

  return (
    <>
      {isLoading ? (
        <div className="d-flex justify-content-center mt-5">
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      ) : (
        <div className="card">
          <div className="card-header">
            <h4 className="card-title mb-0">Comments</h4>
          </div>
          <div className="card-body h-100">
            {comments.map((comment) => {
              return (
                <div className="media" key={comment.id}>
                  <div className="media-body">
                    <img
                      src={
                        imageURL +
                        comment.user.profile_picture.split("/").at(-1)
                      }
                      width="35"
                      height="35"
                      className="rounded-circle m-1"
                      alt="..."
                    />
                    <Link to={`/users/${comment.user.id}`}>
                      <span className="fs-4 m-1">{comment.user.name}</span>
                    </Link>
                    <div className="mb-1">{comment.comment}</div>
                    <div className="d-flex justify-content-between">
                      <div>
                        <small className="text-muted">
                          {comment.created_at.substring(0, 10)} {comment.created_at.substring(11, 16)}
                        </small>
                      </div>
                      <div>
                        <button
                          className="btn btn-light text-danger"
                          disabled={!isLoggedIn}
                        >
                          Report
                        </button>
                      </div>
                    </div>
                  </div>
                  <hr />
                </div>
              );
            })}
            <form
              onSubmit={handleSubmit}
              className="input-group mt-3"
              hidden={!isLoggedIn}
            >
              <input
                type="text"
                value={newComment}
                onChange={handleChange}
                className="form-control"
                placeholder="Comment"
              />
            </form>
          </div>
        </div>
      )}
    </>
  );
}

export default ProjectComments;
