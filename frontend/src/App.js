import "./App.css";
import { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import Home from "./pages/Home";
import Project from "./pages/Project";
import NotFound from "./pages/NotFound";
import CategoryProjects from "./components/projects/CategoryProjects";
import ProjectsList from "./components/projects/ProjectList";
import UserProfile from "./pages/User";
import SearchResultComponent from "./components/projects/SearchResultComponent";
import LoginComponent from "./components/users/LoginComponent";
import RegisterComponent from "./components/users/RegisterComponent";
import DataContext from "./context/data";
import Cookies from "js-cookie";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(Cookies.get("jwt"));
  const [previousPath, setPreviousPath] = useState(null);
  const [authUser, setAuthUser] = useState(null);

  return (
    <DataContext.Provider
      value={{ isLoggedIn, setIsLoggedIn, previousPath, setPreviousPath, authUser, setAuthUser }}
    >
      <Router>
        <Header />
        <Routes>
          <Route index element={<Home />} />
          <Route path="projects/:id" element={<Project />} />
          {!isLoggedIn ? (
            <>
              <Route path="login" element={<LoginComponent />} />
              <Route path="register" element={<RegisterComponent />} />
            </>
          ) : (
            <></>
            )}
          <Route
            path="projects/category/:name"
            element={<CategoryProjects />}
          />
          {/* <Route path="profile" element={<UserProfile />} /> */}
          <Route path="projects" element={<ProjectsList url="projects/" />} />
          <Route
            path="projects/search/:keyword"
            element={<SearchResultComponent />}
          />
          <Route path="users/:id" element={<UserProfile />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
    </DataContext.Provider>
  );
}

export default App;
