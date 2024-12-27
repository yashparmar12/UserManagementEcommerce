import React, { useEffect, useState } from 'react';

const AllUsers = () => {
  const [userInfo, setUserInfo] = useState([]); 

  const getDetails = async () => {
    try {
      const response = await fetch("http://localhost:8000/api/user/allUsers", {
      // const response = await fetch("https://usertasks-mj4d.onrender.com/api/user/allUsers", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      });

      if (!response.ok) {
        console.log("Failed to fetch data");
        return;
      }

      const responseData = await response.json();

      if (responseData.success) {
        setUserInfo(responseData.user); 
      } else {
        console.log("Unable to fetch user data");
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getDetails();
  }, []);

  return (
    <div className="container mx-auto px-4 sm:px-8">
      <div className="py-8">
        <div className="mb-4">
          <h2 className="text-2xl font-semibold leading-tight">User Information</h2>
        </div>
        <div className="shadow overflow-hidden rounded-lg border-b border-gray-200">
          <table className="min-w-full bg-white">
            <thead className="bg-gray-800 text-white">
              <tr>
                <th className="text-left py-3 px-4 uppercase font-semibold text-sm">Full Name</th>
                <th className="text-left py-3 px-4 uppercase font-semibold text-sm">Email</th>
                <th className="text-left py-3 px-4 uppercase font-semibold text-sm">Phone No</th>
                <th className="text-left py-3 px-4 uppercase font-semibold text-sm">City</th>
                <th className="text-left py-3 px-4 uppercase font-semibold text-sm">Country</th>
                <th className="text-left py-3 px-4 uppercase font-semibold text-sm">Role</th>
              </tr>
            </thead>
            <tbody className="text-gray-700">
              {userInfo.length > 0 ? (
                userInfo.map((user, index) => (
                  <tr key={index} className={index % 2 === 0 ? 'bg-gray-100' : 'bg-white'}>
                    <td className="text-left py-3 px-4">{user.fullname || 'N/A'}</td>
                    <td className="text-left py-3 px-4">{user.email || 'N/A'}</td>
                    <td className="text-left py-3 px-4">{user.phoneNumber || 'N/A'}</td>
                    <td className="text-left py-3 px-4">{user.city || 'N/A'}</td>
                    <td className="text-left py-3 px-4">{user.country || 'N/A'}</td>
                    <td className="text-left py-3 px-4">{user.role || 'N/A'}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="text-center py-3 px-4">No users found</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AllUsers;
