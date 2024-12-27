import React, { useEffect, useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
// import { Flex, Spin } from 'antd';

const Navbar = () => {
  const navigate = useNavigate();
  const [userinfo, setUserInfo] = useState("");
  // const [loading, setLoading] = useState(false);

  const access = async (e) => {
    try {
      const token = localStorage.getItem("token");

      const response = await fetch("https://usermanagementecommerce-1.onrender.com/api/user/userData", {
      // const response = await fetch("http://localhost:8000/api/user/userData", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        credentials: "include",
      });

      const responseData = await response.json();

      if (responseData.success) {
        setUserInfo(responseData.user);
        // setLoading(false);
      } else {
        console.log("Unable to fetch user data");
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    // setLoading(true);
    access();
  }, []);
  return (
    <div>
      {userinfo.role === "user" ? <header className="flex shadow-md py-4 px-4 sm:px-10 bg-white font-[sans-serif] min-h-[70px] tracking-wide relative z-50">
        <div className="flex flex-wrap items-center justify-between gap-5 w-full">
          <div
            id="collapseMenu"
            className="max-lg:hidden lg:!block max-lg:before:fixed max-lg:before:bg-black max-lg:before:opacity-50 max-lg:before:inset-0 max-lg:before:z-50"
          >
            <ul className="lg:flex gap-x-5 max-lg:space-y-3 max-lg:fixed max-lg:bg-white max-lg:w-1/2 max-lg:min-w-[300px] max-lg:top-0 max-lg:left-0 max-lg:p-6 max-lg:h-full max-lg:shadow-md max-lg:overflow-auto z-50">
              <li className="max-lg:border-b border-gray-300 max-lg:py-3 px-3 mr-10">
                <NavLink
                  to="/userHome"
                  className={({ isActive }) =>
                    isActive
                      ? "text-blue-500 font-bold block text-[15px] border-b-2 border-[#5dade2]"
                      : "text-gray-500 hover:text-blue-500 block font-semibold text-[15px]"
                  }
                >
                  Home
                </NavLink>
              </li>
              <li className="max-lg:border-b border-gray-300 max-lg:py-3 px-3 mr-10">
                <NavLink
                  to="/userData"
                  className={({ isActive }) =>
                    isActive
                      ? "text-blue-500 font-bold block text-[15px] border-b-2 border-[#5dade2]"
                      : "text-gray-500 hover:text-blue-500 block font-semibold text-[15px]"
                  }
                >
                  Profile
                </NavLink>
              </li>
              <li className="max-lg:border-b border-gray-300 max-lg:py-3 px-3 mr-10">
                <NavLink
                  to="/userMessages"
                  className={({ isActive }) =>
                    isActive
                      ? "text-blue-500 font-bold flex items-center gap-2 text-[15px] border-b-2 border-[#5dade2]"
                      : "text-gray-500 hover:text-blue-500 flex items-center gap-2 font-semibold text-[15px]"
                  }
                >
                  <span>Message</span>

                  <div className="relative">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="w-5 h-5 cursor-pointer"
                      viewBox="0 0 512 512"
                    >
                      <path
                        d="M438.957 19.477H73.043C32.766 19.477 0 52.244 0 92.52v246.961c0 40.276 32.766 73.043 73.043 73.043h28.663l.561 64.483a15.648 15.648 0 0 0 15.649 15.517 15.64 15.64 0 0 0 9.565-3.262l99.425-76.738h212.051c40.277 0 73.043-32.767 73.043-73.043V92.52c0-40.276-32.766-73.043-73.043-73.043zm41.739 320.005c0 23.015-18.724 41.739-41.739 41.739H221.569c-3.46 0-6.823 1.147-9.563 3.261l-78.711 60.75-.422-48.495c-.074-8.591-7.06-15.516-15.651-15.516H73.043c-23.015 0-41.739-18.724-41.739-41.739V92.52c0-23.015 18.724-41.739 41.739-41.739h365.915c23.015 0 41.739 18.724 41.739 41.739v246.962z"
                        fill="currentColor"
                      />
                    </svg>

                    {/* {userinfo.content.length > 0 && (
                      <span className="bg-red-500 text-[10px] px-1.5 font-semibold min-w-[16px] h-4 flex items-center justify-center text-white rounded-full absolute -top-2 left-[60%]">
                        {userinfo.content.length}
                      </span>
                    )} */}
                  </div>
                </NavLink>
              </li>

              <li className="max-lg:border-b border-gray-300 max-lg:py-3 px-3 mr-10">
                <NavLink
                  to="/Products"
                  className={({ isActive }) =>
                    isActive
                      ? "text-blue-500 font-bold block text-[15px] border-b-2 border-[#5dade2]"
                      : "text-gray-500 hover:text-blue-500 block font-semibold text-[15px]"
                  }
                >
                  Products
                </NavLink>
              </li>
              <li className="max-lg:border-b border-gray-300 max-lg:py-3 px-3 mr-10">
                <NavLink
                  to="/Cart"
                  className={({ isActive }) =>
                    isActive
                      ? "text-blue-500 font-bold block text-[15px] border-b-2 border-[#5dade2]"
                      : "text-gray-500 hover:text-blue-500 block font-semibold text-[15px]"
                  }
                >
                  Cart
                </NavLink>
              </li>
            </ul>
          </div>

          <div className="flex max-lg:ml-auto space-x-3">
            <button
              onClick={() => {
                localStorage.removeItem("token");
                navigate("/login");
              }}
              className="px-4 py-2 text-sm rounded-full font-bold text-white border-2 border-[#5dade2] bg-blue-500 transition-all ease-in-out duration-300 hover:bg-transparent hover:text-[#5dade2]"
            >
              Logout
            </button>
          </div>
        </div>
      </header>:<header className="flex shadow-md py-4 px-4 sm:px-10 bg-white font-[sans-serif] min-h-[70px] tracking-wide relative z-50">
        <div className="flex flex-wrap items-center justify-between gap-5 w-full">
          <div
            id="collapseMenu"
            className="max-lg:hidden lg:!block max-lg:before:fixed max-lg:before:bg-black max-lg:before:opacity-50 max-lg:before:inset-0 max-lg:before:z-50"
          >
            <ul className="lg:flex gap-x-5 max-lg:space-y-3 max-lg:fixed max-lg:bg-white max-lg:w-1/2 max-lg:min-w-[300px] max-lg:top-0 max-lg:left-0 max-lg:p-6 max-lg:h-full max-lg:shadow-md max-lg:overflow-auto z-50">
              <li className="max-lg:border-b border-gray-300 max-lg:py-3 px-3 mr-10">
                <NavLink
                  to="/userHome"
                  className={({ isActive }) =>
                    isActive
                      ? "text-blue-500 font-bold block text-[15px] border-b-2 border-[#5dade2]"
                      : "text-gray-500 hover:text-blue-500 block font-semibold text-[15px]"
                  }
                >
                  Home
                </NavLink>
              </li>
              <li className="max-lg:border-b border-gray-300 max-lg:py-3 px-3 mr-10">
                <NavLink
                  to="/userData"
                  className={({ isActive }) =>
                    isActive
                      ? "text-blue-500 font-bold block text-[15px] border-b-2 border-[#5dade2]"
                      : "text-gray-500 hover:text-blue-500 block font-semibold text-[15px]"
                  }
                >
                  Profile
                </NavLink>
              </li>
             

              <li className="max-lg:border-b border-gray-300 max-lg:py-3 px-3 mr-10">
                <NavLink
                  to="/Products"
                  className={({ isActive }) =>
                    isActive
                      ? "text-blue-500 font-bold block text-[15px] border-b-2 border-[#5dade2]"
                      : "text-gray-500 hover:text-blue-500 block font-semibold text-[15px]"
                  }
                >
                  Add Products
                </NavLink>
              </li>
              <li className="max-lg:border-b border-gray-300 max-lg:py-3 px-3 mr-10">
                <NavLink
                  to="/Orders"
                  className={({ isActive }) =>
                    isActive
                      ? "text-blue-500 font-bold block text-[15px] border-b-2 border-[#5dade2]"
                      : "text-gray-500 hover:text-blue-500 block font-semibold text-[15px]"
                  }
                >
                  Orders
                </NavLink>
              </li>
            </ul>
          </div>

          <div className="flex max-lg:ml-auto space-x-3">
            <button
              onClick={() => {
                localStorage.removeItem("token");
                navigate("/login");
              }}
              className="px-4 py-2 text-sm rounded-full font-bold text-white border-2 border-[#5dade2] bg-blue-500 transition-all ease-in-out duration-300 hover:bg-transparent hover:text-[#5dade2]"
            >
              Logout
            </button>
          </div>
        </div>
      </header>}
    </div>
  );
};

export default Navbar;

// {userinfo.role === "user" && (

//   <li className="max-lg:border-b border-gray-300 max-lg:py-3 px-3 mr-10">
//     <NavLink
//       to="/userMessages"
//       className={({ isActive }) =>
//         isActive
//           ? "text-blue-500 font-bold flex items-center gap-2 text-[15px] border-b-2 border-[#5dade2]"
//           : "text-gray-500 hover:text-blue-500 flex items-center gap-2 font-semibold text-[15px]"
//       }
//     >
//       <span>Message</span>

//       <div className="relative">
//         <svg
//           xmlns="http://www.w3.org/2000/svg"
//           className="w-5 h-5 cursor-pointer"
//           viewBox="0 0 512 512"
//         >
//           <path
//             d="M438.957 19.477H73.043C32.766 19.477 0 52.244 0 92.52v246.961c0 40.276 32.766 73.043 73.043 73.043h28.663l.561 64.483a15.648 15.648 0 0 0 15.649 15.517 15.64 15.64 0 0 0 9.565-3.262l99.425-76.738h212.051c40.277 0 73.043-32.767 73.043-73.043V92.52c0-40.276-32.766-73.043-73.043-73.043zm41.739 320.005c0 23.015-18.724 41.739-41.739 41.739H221.569c-3.46 0-6.823 1.147-9.563 3.261l-78.711 60.75-.422-48.495c-.074-8.591-7.06-15.516-15.651-15.516H73.043c-23.015 0-41.739-18.724-41.739-41.739V92.52c0-23.015 18.724-41.739 41.739-41.739h365.915c23.015 0 41.739 18.724 41.739 41.739v246.962z"
//             fill="currentColor"
//           />
//         </svg>

//         {userinfo.content.length > 0 && (
//           <span className="bg-red-500 text-[10px] px-1.5 font-semibold min-w-[16px] h-4 flex items-center justify-center text-white rounded-full absolute -top-2 left-[60%]">
//             {userinfo.content.length}
//           </span>
//         )}
//       </div>
//     </NavLink>
//   </li>

// )}
