import React from "react";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "./RoleSelection.css";

const RoleSelection: React.FC = () => {
  const navigate = useNavigate();

  const handleRoleSelection = (role: string) => {
    if (role === "user") {
      navigate("/profile-edit-user/personal-info");
    } else if (role === "recruiter") {
      navigate("/profile-edit-recruiter/personal-info");
    }
  };

  return (
    <div className="role-selection-container">
      <h2>Select Your Role</h2>
      <div className="d-flex justify-content-center">
        <button
          className="btn btn-primary mx-2"
          onClick={() => handleRoleSelection("user")}
        >
          User
        </button>
        <button
          className="btn btn-success mx-2"
          onClick={() => handleRoleSelection("recruiter")}
        >
          Recruiter
        </button>
      </div>
    </div>
  );
};

export default RoleSelection;
