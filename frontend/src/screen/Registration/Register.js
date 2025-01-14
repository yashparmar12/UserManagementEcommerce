// import axios from 'axios';
import React, { useState } from "react";
import "./Register.css";

import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";

const Register = () => {
  const navigate = useNavigate();
  const [isPassVisible, setIsPassVisible] = useState(false);
  const [isPassConfVisible, setIsPassConfVisible] = useState(false);

  const [data, setData] = useState({
    fullname: "",
    email: "",
    address: "",
    phoneNumber: "",
    city: "",
    country: "",
    password: "",
    confirmPassword: "",
  });
  const [validation, setValidation] = useState({
    fullname: "",
    email: "",
    address: "",
    phoneNumber: "",
    city: "",
    country: "",
    password: "",
    confirmPassword: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setData((prev) => ({
      ...prev,
      [name]: value,
    }));

    setValidation((prev) => ({
      ...prev,
      [name]: "",
    }));
  };

  const valid = () => {
    const newErrors = {};

    const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    const phonePattern = /^[0-9]{10}$/;

    if (!data.fullname) {
      newErrors.fullname = "Full name is required";
    }

    if (!data.email) {
      newErrors.email = "Email is required";
    } else if (!emailPattern.test(data.email)) {
      newErrors.email = "Invalid email format";
    }

    if (!data.address) {
      newErrors.address = "Address is required";
    }
    if (!data.city) {
      newErrors.city = "City is required";
    }
    if (!data.country) {
      newErrors.country = "Country is required";
    }

    if (!data.phoneNumber) {
      newErrors.phoneNumber = "PhoneNumber is required";
    } else if (!phonePattern.test(data.phoneNumber.toString())) {
      newErrors.phoneNumber = "Phone number must be 10 digits";
    }

    if (!data.password) {
      newErrors.password = "Password is required";
    }

    if (!data.confirmPassword) {
      newErrors.confirmPassword = "Confirm Password is required";
    } else if (data.password !== data.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    setValidation(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!valid()) {
      return;
    }

    if (data.password !== data.confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    // const response = await fetch("https://usermanagementecommerce-1.onrender.com/api/user/register", {
    const response = await fetch("http://localhost:8000/api/user/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    const responseData = await response.json();

    if (responseData.success) {
      navigate("/login");
      alert("Registered Successfully");
    } else {
      alert("Try again !");
    }
  };

  return (
    <div className="container">
      <div className="max-w-4xl mx-auto font-[sans-serif] p-6">
        <div className="text-center mb-16">
          <h4 className="text-gray-800 text-base font-semibold mt-6 mr-20">
            Registration
          </h4>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="grid sm:grid-cols-2 gap-8">
            <div>
              <label className="text-gray-800 text-sm mb-2 block">
                Full Name
              </label>
              <input
                name="fullname"
                type="text"
                value={data.fullname}
                onChange={handleChange}
                className="bg-gray-100 w-full text-gray-800 text-sm px-4 py-3.5 rounded-md focus:bg-transparent outline-blue-500 transition-all"
                placeholder="Enter full name"
              />
              {validation.fullname && (
                <span className="text-red-500" style={{ fontSize: "0.75rem" }}>
                  {validation.fullname}
                </span>
              )}
            </div>
            <div>
              <label className="text-gray-800 text-sm mb-2 block">
                Email Id
              </label>
              <input
                name="email"
                type="text"
                value={data.email}
                onChange={handleChange}
                className="bg-gray-100 w-full text-gray-800 text-sm px-4 py-3.5 rounded-md focus:bg-transparent outline-blue-500 transition-all"
                placeholder="Enter email"
              />
              {validation.email && (
                <span className="text-red-500" style={{ fontSize: "0.75rem" }}>
                  {validation.email}
                </span>
              )}
            </div>
            <div>
              <label className="text-gray-800 text-sm mb-2 block">
                Address
              </label>
              <input
                name="address"
                type="text"
                value={data.address}
                onChange={handleChange}
                className="bg-gray-100 w-full text-gray-800 text-sm px-4 py-3.5 rounded-md focus:bg-transparent outline-blue-500 transition-all"
                placeholder="Enter adress"
              />
              {validation.address && (
                <span className="text-red-500" style={{ fontSize: "0.75rem" }}>
                  {validation.address}
                </span>
              )}
            </div>
            <div>
              <label className="text-gray-800 text-sm mb-2 block">
                Mobile No.
              </label>
              <input
                name="phoneNumber"
                type="number"
                value={data.phoneNumber}
                onChange={handleChange}
                className="bg-gray-100 w-full text-gray-800 text-sm px-4 py-3.5 rounded-md focus:bg-transparent outline-blue-500 transition-all"
                placeholder="Enter mobile number"
              />
              {validation.phoneNumber && (
                <span className="text-red-500" style={{ fontSize: "0.75rem" }}>
                  {validation.phoneNumber}
                </span>
              )}
            </div>
            <div>
              <label className="text-gray-800 text-sm mb-2 block">City</label>
              <input
                name="city"
                type="text"
                value={data.city}
                onChange={handleChange}
                className="bg-gray-100 w-full text-gray-800 text-sm px-4 py-3.5 rounded-md focus:bg-transparent outline-blue-500 transition-all"
                placeholder="Enter mobile number"
              />
              {validation.phoneNumber && (
                <span className="text-red-500" style={{ fontSize: "0.75rem" }}>
                  {validation.city}
                </span>
              )}
            </div>
            <div>
              <label className="text-gray-800 text-sm mb-2 block">
                Country
              </label>
              <input
                name="country"
                type="text"
                value={data.country}
                onChange={handleChange}
                className="bg-gray-100 w-full text-gray-800 text-sm px-4 py-3.5 rounded-md focus:bg-transparent outline-blue-500 transition-all"
                placeholder="Enter mobile number"
              />
              {validation.country && (
                <span className="text-red-500" style={{ fontSize: "0.75rem" }}>
                  {validation.country}
                </span>
              )}
            </div>
            {/* <div>
              <label className="text-gray-800 text-sm mb-2 block">Password</label>
              <input name="password" type="password" value={data.password} onChange={handleChange} className="bg-gray-100 w-full text-gray-800 text-sm px-4 py-3.5 rounded-md focus:bg-transparent outline-blue-500 transition-all" placeholder="Enter password" 
              
              />
              
              {validation.password && <span className="text-red-500" style={{ fontSize: '0.75rem' }}>{validation.password}</span>}
              
            </div> */}
            <div className="relative">
              <label className="text-gray-800 text-sm mb-2 block">
                Password
              </label>
              <input
                name="password"
                type={isPassVisible ? "text" : "password"}
                value={data.password}
                onChange={handleChange}
                className="bg-gray-100 w-full text-gray-800 text-sm px-4 py-3.5 rounded-md focus:bg-transparent outline-blue-500 transition-all"
                placeholder="Enter password"
              />
              <div
                className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer"
                onClick={() => setIsPassVisible(!isPassVisible)}
              >
                {isPassVisible ? (
                  <EyeOff className="w-4 h-4 mt-8 text-gray-500" /> 
                ) : (
                  <Eye className="w-4 h-4 mt-8 text-gray-500" /> 
                )}
              </div>
              {validation.password && (
                <span className="text-red-500" style={{ fontSize: "0.75rem" }}>
                  {validation.password}
                </span>
              )}
            </div>

            
            <div className="relative">
              <label className="text-gray-800 text-sm mb-2 block">
              Confirm Password
              </label>
              <input
                name="confirmPassword"
                type={isPassConfVisible ? "text" : "password"}
                value={data.confirmPassword}
                onChange={handleChange}
                className="bg-gray-100 w-full text-gray-800 text-sm px-4 py-3.5 rounded-md focus:bg-transparent outline-blue-500 transition-all"
                placeholder="Enter password"
              />
              <div
                className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer"
                onClick={() => setIsPassConfVisible(!isPassConfVisible)}
              >
                {isPassConfVisible ? (
                  <EyeOff className="w-4 h-4 mt-8 text-gray-500" /> 
                ) : (
                  <Eye className="w-4 h-4 mt-8 text-gray-500" /> 
                )}
              </div>
              {validation.confirmPassword && (
                <span className="text-red-500" style={{ fontSize: "0.75rem" }}>
                  {validation.confirmPassword}
                </span>
              )}
            </div>

          </div>

          <div className="!mt-12">
            <button
              type="submit"
              className="py-3.5 px-7 text-sm font-semibold tracking-wider rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none"
            >
              Register
            </button>
          </div>
          <p className="text-gray-800 text-sm !mt-8 text-center">
            Do you have an account?{" "}
            <Link
              to="/login"
              className="text-blue-600 hover:underline ml-1 whitespace-nowrap font-semibold"
            >
              Login here
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Register;
