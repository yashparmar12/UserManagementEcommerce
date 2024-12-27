import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Flex, Spin } from "antd";

const UpdateProfile = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const [userInfo, setUserInfo] = useState({
    fullname: "",
    address: "",
    phoneNumber: "",
    city: "",
    country: "",
    image: null,
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      userInfo.fullname === "" ||
      userInfo.address === "" ||
      userInfo.phoneNumber === "" ||
      userInfo.city === "" ||
      userInfo.country === ""
    ) {
      navigate("/userData");
      return;
    }

    const formData = new FormData();
    formData.append("fullname", userInfo.fullname);
    formData.append("address", userInfo.address);
    formData.append("phoneNumber", userInfo.phoneNumber);
    formData.append("city", userInfo.city);
    formData.append("country", userInfo.country);
    if (userInfo.image) {
      formData.append("photo", userInfo.image);
    }

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        "http://localhost:8000/api/user/updateProfile",
        // const response = await fetch("https://usertasks-mj4d.onrender.com/api/user/updateProfile",
        {
          method: "POST",
          body: formData,
          headers: {
            Authorization: `Bearer ${token}`,
          },

          credentials: "include",
        }
      );

      const data = await response.json();


      if (data.success) {
        alert("Profile updated successfully!");
        navigate("/userHome");
      } else {
        alert("Profile update failed!");
      }
    } catch (error) {
      console.error(error);
      alert("An error occurred.");
    }
  };

  const handleChange = (e) => {
    setUserInfo((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleFileChange = (e) => {
    setUserInfo((prev) => ({
      ...prev,
      image: e.target.files[0],
    }));
  };

  const fetchUserData = async () => {
    const token = localStorage.getItem("token");
    try {
      const response = await fetch("http://localhost:8000/api/user/userData", {
        // const response = await fetch("https://usertasks-mj4d.onrender.com/api/user/userData", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        credentials: "include",
      });

      if (!response.ok) {
        console.error("Failed to fetch user data");
        return;
      }

      const responseData = await response.json();

      if (responseData.success) {
        if (responseData.user.role === "user") {
          setUserInfo(responseData.user);
        } else {
          setUserInfo(responseData.adminuser);
        }
        setLoading(false);
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  useEffect(() => {
    setLoading(true);
    fetchUserData();
  }, []);

  return (
    <div>
      {loading ? 
      <Flex align="center" gap="middle" style={{ display: "flex", alignContent: "center", justifyContent: "center", marginTop: "250px" }}>
        <Spin size="large" />
      </Flex> 
      :
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-3xl mb-12">
            <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
              Update Your Profile
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4 mb-12">
              <div className="flex flex-col sm:flex-row gap-6">
                <div className="flex-shrink-0 flex flex-col items-center space-y-2">
                  <div className="relative group">
                    {userInfo.image ? (
                      <img
                        src={userInfo.image}
                        alt="Profile"
                        className="w-24 h-24 rounded-full object-cover border-4 border-white shadow-lg"
                      />
                    ) : (
                      <div className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center border-4 border-white shadow-lg">
                        <svg
                          className="w-12 h-12 text-gray-400"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                          ></path>
                        </svg>
                      </div>
                    )}
                    <label
                      htmlFor="fileInput"
                      className="absolute inset-0 w-full h-full bg-black bg-opacity-50 rounded-full flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                    >
                      <span className="text-xs">Change Photo</span>
                    </label>
                    <input
                      id="fileInput"
                      type="file"
                      onChange={handleFileChange}
                      className="hidden"
                      accept="image/*"
                    />
                  </div>
                </div>
                <div className="flex-grow grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label
                      htmlFor="fullname"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Full Name
                    </label>
                    <input
                      type="text"
                      id="fullname"
                      name="fullname"
                      value={userInfo.fullname}
                      onChange={handleChange}
                      className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm text-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                      placeholder="John Doe"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="phoneNumber"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      id="phoneNumber"
                      name="phoneNumber"
                      value={userInfo.phoneNumber}
                      onChange={handleChange}
                      className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm text-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                      placeholder="+1 (555) 123-4567"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="address"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Address
                    </label>
                    <input
                      type="text"
                      id="address"
                      name="address"
                      value={userInfo.address}
                      onChange={handleChange}
                      className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm text-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                      placeholder="123 Main St"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="city"
                      className="block text-sm font-medium text-gray-700"
                    >
                      City
                    </label>
                    <input
                      type="text"
                      id="city"
                      name="city"
                      value={userInfo.city}
                      onChange={handleChange}
                      className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm text-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                      placeholder="New York"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label
                      htmlFor="country"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Country
                    </label>
                    <input
                      type="text"
                      id="country"
                      name="country"
                      value={userInfo.country}
                      onChange={handleChange}
                      className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm text-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                      placeholder="United States"
                    />
                  </div>
                </div>
              </div>
              <div>
                <button
                  type="submit"
                  className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Update Profile
                </button>
              </div>
            </form>
          </div>
        </div>
      }
    </div>
  );
};

export default UpdateProfile;
