import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";

const Login = () => {
  const navigate = useNavigate();
  const [isPassVisible, setIsPassVisible] = useState(false);

  const [data, setData] = useState({
    email: "",
    password: "",
  });

  const [validation, setValidation] = useState({
    email: "",
    password: "",
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
    const newErrors = {
      email: "",
      password: "",
    };
    const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;

    if (!data.email) {
      newErrors.email = "Email is required";
    } else if (!emailPattern.test(data.email)) {
      newErrors.email = "Email is invalid";
    }

    if (!data.password) {
      newErrors.password = "Password is required";
    }

    setValidation(newErrors);
    
    if(Object.keys(newErrors.email).length !== 0 || Object.keys(newErrors.password).length !== 0){
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!valid()) {
      return;
    }
    const response = await fetch("https://usermanagementecommerce-1.onrender.com/api/user/login", {
    // const response = await fetch("http://localhost:8000/api/user/login", {
      // const response = await fetch("https://usertasks-mj4d.onrender.com/api/user/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
      credentials: "include",
    });

    const responseData = await response.json();

    if (responseData.success) {
      const token = responseData.token;
      localStorage.setItem("token", token);
      navigate("/userHome");
    } else {
      console.log("Not able to fetch data");
      alert("Sorry");
    }
  };

  return (
    <div>
      <div className="bg-gray-50 font-[sans-serif]">
        <div className="min-h-screen flex flex-col items-center justify-center py-6 px-4">
          <div className="max-w-md w-full">
            <div className="p-8 rounded-2xl bg-white shadow">
              <h2 className="text-gray-800 text-center text-2xl font-bold">
                Log in
              </h2>
              <form className="mt-8 space-y-4">
                <div>
                  <label className="text-gray-800 text-sm mb-2 ml-12 block">
                    Email
                  </label>
                  <div className="relative flex items-center">
                    <input
                      name="email"
                      type="email"
                      required
                      className="w-full text-gray-800 text-sm border border-gray-300 px-4 py-3 rounded-md outline-blue-600 ml-12"
                      placeholder="Enter user name"
                      value={data.email}
                      onChange={handleChange}
                    />
                  </div>
                  {validation.email ? (
                    <span
                      className="text-red-500 ml-12"
                      style={{ fontSize: "0.75rem" }}
                    >
                      {validation.email}
                    </span>
                  ) : null}
                </div>

                <div>
                  <label className="text-gray-800 text-sm mb-2 ml-12 block">
                    Password
                  </label>

                  <div className="relative flex items-center">
                    <input
                      name="password"
                      type={isPassVisible ? "text" : "password"}
                      autoComplete="off" /* Disable autofill and browser's eye icon */
                      spellCheck="false"
                      required
                      className="w-full text-gray-800 text-sm border border-gray-300 px-4 py-3 rounded-md outline-blue-600 ml-12"
                      placeholder="Enter password"
                      value={data.password}
                      onChange={handleChange}
                    />
                    <div
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer"
                      onClick={() => setIsPassVisible(!isPassVisible)}
                    >
                      {isPassVisible ? (
                        <EyeOff className="w-4 h-4 text-gray-500" />
                      ) : (
                        <Eye className="w-4 h-4 text-gray-500" />
                      )}
                    </div>
                  </div>
                  {validation.password ? (
                    <span
                      className="text-red-500 ml-12"
                      style={{ fontSize: "0.75rem" }}
                    >
                      {validation.password}
                    </span>
                  ) : null}
                </div>

                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div className="text-sm">
                    <Link
                      to="/updatePassword"
                      className="text-blue-600 hover:underline font-semibold ml-12"
                    >
                      Forgot your password?
                    </Link>
                  </div>
                </div>

                <div className="!mt-8">
                  <button
                    type="button"
                    onClick={handleSubmit}
                    className="w-full py-3 px-4 text-sm tracking-wide rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none ml-8"
                  >
                    Log in
                  </button>
                </div>
                <p className="text-gray-800 text-sm !mt-8 text-center ml-8">
                  Don't have an account?{" "}
                  <Link
                    to="/register"
                    className="text-blue-600 hover:underline ml-1 whitespace-nowrap font-semibold"
                  >
                    Register here
                  </Link>
                </p>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
