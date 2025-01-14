import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Flex, Spin } from 'antd';


const UserData = () => {
  const [userInfo, setUserInfo] = useState({});
  const [loading, setLoading] = useState(false);

  const access = async () => {
    const token = localStorage.getItem("token");

    try {
      // const response = await fetch("https://usermanagementecommerce-1.onrender.com/api/user/userData", {
      const response = await fetch("http://localhost:8000/api/user/userData", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        credentials: "include",
      });

      const responseData = await response.json();

      // console.log(responseData);

      if (responseData.success) {
        if (responseData.user.role === "user") {
          setUserInfo(responseData.user);
        } else {
          setUserInfo(responseData.adminuser);
        }
        setLoading(false);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    setLoading(true);
    access();
  }, []);

  return (
    <div>
      {loading ? <Flex align="center" gap="middle" style={{ display: "flex", alignContent: "center", justifyContent: "center", marginTop: "250px" }}>

        <Spin size="large" />
      </Flex> :
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-gray-100 flex items-center justify-center">
          <div className="flex flex-col md:flex-row w-full max-w-4xl bg-white rounded-lg shadow-lg overflow-hidden mb-12">
            <div className="md:w-1/3 flex flex-col items-center bg-white p-6 shadow-sm rounded-l-lg mt-12">
              <div className="relative mb-4">
                <img
                  src={userInfo.image || "https://via.placeholder.com/150"}
                  alt="Profile"
                  className="w-32 h-32 rounded-full border-4 border-gray-200 shadow-md"
                />
              </div>
              <h2 className="text-2xl font-semibold text-gray-800">
                {userInfo.fullname}
              </h2>
              <p className="mt-1 text-sm text-gray-600">{userInfo.role}</p>
            </div>

            <div className="md:w-2/3 p-6 bg-gray-50">
              <div className="flex justify-end mb-4">
                <Link
                  to="/updateProfile"
                  className="bg-gray-800 text-white px-4 py-2 rounded-lg shadow-sm hover:bg-gray-700 transition"
                >
                  Edit Profile
                </Link>
              </div>
              <div className="space-y-4">
                <div className="flex items-center bg-white p-3 rounded-md shadow-sm">
                  <span className="text-gray-600 font-medium w-1/3">Email:</span>
                  <span className="text-gray-800 w-2/3">{userInfo.email}</span>
                </div>
                <div className="flex items-center bg-white p-3 rounded-md shadow-sm">
                  <span className="text-gray-600 font-medium w-1/3">
                    Address:
                  </span>
                  <span className="text-gray-800 w-2/3">{userInfo.address}</span>
                </div>
                <div className="flex items-center bg-white p-3 rounded-md shadow-sm">
                  <span className="text-gray-600 font-medium w-1/3">City:</span>
                  <span className="text-gray-800 w-2/3">{userInfo.city}</span>
                </div>
                <div className="flex items-center bg-white p-3 rounded-md shadow-sm">
                  <span className="text-gray-600 font-medium w-1/3">
                    Country:
                  </span>
                  <span className="text-gray-800 w-2/3">{userInfo.country}</span>
                </div>
                <div className="flex items-center bg-white p-3 rounded-md shadow-sm">
                  <span className="text-gray-600 font-medium w-1/3">Phone:</span>
                  <span className="text-gray-800 w-2/3">
                    +91 {userInfo.phoneNumber}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      }
    </div>
  );
};

export default UserData;
