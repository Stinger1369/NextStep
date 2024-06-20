import React, { useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import "./RegisterComponent.css";

const RegisterComponent: React.FC = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [userType, setUserType] = useState("jobSeeker");
  const [phone, setPhone] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [address, setAddress] = useState({
    street: "",
    city: "",
    state: "",
    zipCode: "",
    country: "",
  });
  const [images, setImages] = useState<FileList | null>(null);
  const { register } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("firstName", firstName);
    formData.append("lastName", lastName);
    formData.append("email", email);
    formData.append("password", password);
    formData.append("userType", userType);
    formData.append("phone", phone);
    formData.append("dateOfBirth", dateOfBirth);
    formData.append("address[street]", address.street);
    formData.append("address[city]", address.city);
    formData.append("address[state]", address.state);
    formData.append("address[zipCode]", address.zipCode);
    formData.append("address[country]", address.country);

    if (images) {
      for (let i = 0; i < images.length; i++) {
        formData.append("images", images[i]);
      }
    }

    try {
      await register(formData);
      navigate("/login");
    } catch (error) {
      setError("Error registering user. Please check the form and try again.");
    }
  };

  return (
    <div className="register-container">
      {error && <div className="error">{error}</div>}
      <form
        onSubmit={handleSubmit}
        className="register-form"
        encType="multipart/form-data"
      >
        <input
          type="text"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
          placeholder="First Name"
          className="register-input"
          required
        />
        <input
          type="text"
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
          placeholder="Last Name"
          className="register-input"
          required
        />
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          className="register-input"
          required
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          className="register-input"
          required
        />
        <select
          value={userType}
          onChange={(e) => setUserType(e.target.value)}
          className="register-input"
        >
          <option value="jobSeeker">Job Seeker</option>
          <option value="employer">Employer</option>
        </select>
        <input
          type="text"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          placeholder="Phone"
          className="register-input"
          required
        />
        <input
          type="date"
          value={dateOfBirth}
          onChange={(e) => setDateOfBirth(e.target.value)}
          className="register-input"
          required
        />
        <input
          type="text"
          value={address.street}
          onChange={(e) => setAddress({ ...address, street: e.target.value })}
          placeholder="Street"
          className="register-input"
          required
        />
        <input
          type="text"
          value={address.city}
          onChange={(e) => setAddress({ ...address, city: e.target.value })}
          placeholder="City"
          className="register-input"
          required
        />
        <input
          type="text"
          value={address.state}
          onChange={(e) => setAddress({ ...address, state: e.target.value })}
          placeholder="State"
          className="register-input"
          required
        />
        <input
          type="text"
          value={address.zipCode}
          onChange={(e) => setAddress({ ...address, zipCode: e.target.value })}
          placeholder="Zip Code"
          className="register-input"
          required
        />
        <input
          type="text"
          value={address.country}
          onChange={(e) => setAddress({ ...address, country: e.target.value })}
          placeholder="Country"
          className="register-input"
          required
        />
        <input
          type="file"
          multiple
          onChange={(e) => setImages(e.target.files)}
          className="register-input"
        />
        <button type="submit" className="register-button">
          Register
        </button>
      </form>
    </div>
  );
};

export default RegisterComponent;
