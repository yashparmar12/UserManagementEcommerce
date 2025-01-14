import React, { useEffect, useRef, useState } from "react";
import {
  Filter,
  ChevronDown,
  ChevronUp,
  ArrowUpNarrowWide,
  ArrowDownNarrowWide,
  Search,
  FileText,
  FileDown,
  FileSpreadsheet,
  CornerDownLeft,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import Tasks from "../Task/Tasks";
import Modal from "react-modal";
import HorizontalScroll from "./HorizontalScroll";
import { Flex, Spin } from "antd";

Modal.setAppElement("#root");

const UserName = () => {
  const [userInfo, setUserInfo] = useState([]);
  const [checkUser, setcheckUser] = useState([]);
  const [selectAll, setSelectAll] = useState(false);
  const [modalIsOpen, setIsOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [importOpen, setimportOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [currentPage, setcurrentPage] = useState(1);
  const [currentLoginName, setcurrentLoginName] = useState("");
  const [total, setTotal] = useState(0);
  

  const access = async (e) => {
    try {
      const token = localStorage.getItem("token");

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

      if (responseData.success) {
        setUserInfo(responseData.user);
        setLoading(false);

        setTotal(responseData.userLen / 20);

        if (responseData.user.role === "user") {
          setcurrentLoginName(responseData.user.fullname);
          // console.log(responseData.user);
        } else {
          setcurrentLoginName(
            responseData.userLen.find((user) => user.role === "admin")?.fullname
          );
        }
      } else {
        console.log("Unable to fetch user data");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleSelectAll = () => {
    if (selectAll === false) {
      const allUserIds = userInfo.map((user) => user._id);
      setcheckUser(allUserIds);
      setSelectAll(true);
    } else {
      setcheckUser([]);
      setSelectAll(false);
    }
  };

  const selectUser = (userId) => {
    setcheckUser((prev) => {
      if (prev.includes(userId)) {
        return prev.filter((id) => id !== userId);
      } else {
        return [...prev, userId];
      }
    });
  };

  const handleDelete = async () => {
    try {
      // if (window.confirm("Are you sure want to delete") === true) {

      const token = localStorage.getItem("token");
      // await fetch("https://usermanagementecommerce-1.onrender.com/api/user/delete", {
      await fetch("http://localhost:8000/api/user/delete", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ ids: checkUser }),
      });

      let arr = userInfo.filter((user) => !checkUser.includes(user._id));
      setUserInfo(arr);

      setcheckUser([]);
      setSelectAll(false);
    } catch (error) {
      console.log(error);
    }
  };

  function closeModal() {
    setIsOpen(false);
  }
  function deletDataByModal() {
    setIsOpen(false);
    handleDelete();
  }

  const showModal = () => {
    if (checkUser.length === 1) {
      const user = userInfo.find((res) => res._id === checkUser[0]);
      setModalMessage(
        <span>
          Are you sure want to delete{" "}
          <span style={{ color: "dark-gray", fontWeight: "bold" }}>
            {user.fullname}
          </span>
          ?
        </span>
      );
    } else {
      setModalMessage("Are you sure want to delete");
    }
    setIsOpen(true);
  };

  const handleSort = (name, order) => {
    if (name === "fullname") {
      const sortedData = [...userInfo].sort((a, b) => {
        if (order === "asc") {
          return a.fullname.localeCompare(b.fullname);
        } else {
          return b.fullname.localeCompare(a.fullname);
        }
        // a-65 b-66 = -1 return
        // b-98 a-97 =  1 return
      });
      setUserInfo(sortedData);
    } else {
      const sortedData = [...userInfo].sort((a, b) => {
        if (order === "asc") {
          return a.city.localeCompare(b.city); // Ascending order
        } else {
          return b.city.localeCompare(a.city); // Descending order
        }
      });
      setUserInfo(sortedData);
    }
  };

  const [isData, setIsData] = useState(false);

  const searchData = async (value) => {
    try {
      const response = await fetch(
        // "https://usermanagementecommerce-1.onrender.com/api/user/searchData",
        "http://localhost:8000/api/user/searchData",
        {
          method: "POST",
          body: JSON.stringify({ searchInput: value }),
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const responseData = await response.json();
      // console.log(responseData.userData);

      if (responseData?.userData) {
        if (!responseData.userData) {
          setIsData(true);
          console.log(responseData.userData);
        } else {
          setUserInfo(responseData.userData);
          setIsData(false);
          console.log(responseData.userData);
        }
      } else {
        console.log("Unable to fetch user data");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const enterOrClickSearch = (e) => {
    if (e.key === "Enter" || e.type === "click") {
      searchData();
    }
  };

  const exportPDF = async (formate) => {
    try {
      const url =
        formate === "pdf"
          // ? "https://usermanagementecommerce-1.onrender.com/api/user/pdfDownload"
          ? "http://localhost:8000/api/user/pdfDownload"
          : // ? "https://usertasks-mj4d.onrender.com/api/user/pdfDownload"
          formate === "csv"
          // ? "https://usermanagementecommerce-1.onrender.com/api/user/csvDownload"
          ? "http://localhost:8000/api/user/csvDownload"
          : // ? "https://usertasks-mj4d.onrender.com/api/user/csvDownload"
          formate === "zip"
          ? "http://localhost:8000/api/user/zipDownload"
          : "";

      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userInfo }),
      });

      if (!response.ok) {
        throw new Error("Failed to download file");
      }

      const blob = await response.blob();

      const link = document.createElement("a");
      link.href = window.URL.createObjectURL(blob);
      link.download =
        formate === "pdf"
          ? "users.pdf"
          : formate === "csv"
          ? "users.csv"
          : formate === "zip"
          ? "users.zip"
          : "";
      link.click();

      console.log(`${formate.toUpperCase()} downloaded successfully!`);
    } catch (error) {
      console.error(error);
    }
  };

  // const handlePrev = () => {
  //   if (firstIndex !== 0) {
  //     setcurrentPage(currentPage - 1);
  //   }
  // };
  // const handleNext = () => {
  //   if (lastIndex < userInfo.length) {
  //     setcurrentPage(currentPage + 1);
  //   }
  // };

  const timerRef = useRef(null);

  const handleChange = (e) => {
    const value = e.target.value;

    if (value) {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }

      timerRef.current = setTimeout(() => {
        // setcurrentPage(1);
        searchData(value);
      }, 500);
    } else {
      setTimeout(() => {
        access();
      }, 500);

      // clearTimeout(accessTime);
    }
  };

  const pages = async (value) => {
    if (value === "next") {
      setLoading(true);

      if (currentPage >= total) {
        return;
      }

      try {
        const response = await fetch(
          // `https://usermanagementecommerce-1.onrender.com/api/user/Pagination?page=${currentPage + 1}`,
          `http://localhost:8000/api/user/Pagination?page=${currentPage + 1}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        const responseData = await response.json();

        if (responseData.success && responseData.user?.length > 0) {
          setUserInfo(responseData.user);

          setcurrentPage((prev) => prev + 1);
          setLoading(false);
        } else {
          console.log("Unable to fetch user data");
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
      }
    } else if (value === "prev") {
      setLoading(true);
      if (currentPage <= 1) {
        return;
      }

      try {
        const response = await fetch(
          // s`https://usermanagementecommerce-1.onrender.com/api/user/Pagination?page=${currentPage - 1}`,
          `http://localhost:8000/api/user/Pagination?page=${currentPage - 1}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        const responseData = await response.json();

        if (responseData.success) {
          if (responseData.user && responseData.user?.length > 0) {
            setUserInfo(responseData.user);
            setcurrentPage((prev) => prev - 1);
            setLoading(false);
          }
        } else {
          console.log("Unable to fetch user data");
        }
      } catch (error) {
        console.log(error);
      }
    }
  };

  

  useEffect(() => {
    setLoading(true);
    access();
  }, []);

  return (
    <div>
      {loading ? (
        <Flex
          align="center"
          gap="middle"
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            marginTop: "250px",
          }}
        >
          <Spin size="large" />
          <h3 style={{ marginTop: "10px" }}>Wait</h3>{" "}
        </Flex>
      ) : userInfo.role === "user" ? (
        <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
          <div style={{ marginBottom: "80px" }}>
            <h1 className="text-4xl font-bold text-blue-500">
              Namastey 🙏 {userInfo.fullname}
            </h1>

            {/* -----------Horizontal Auto Scrolling for User Page ------------- */}
            <HorizontalScroll dynamicName={currentLoginName} />
          </div>
        </div>
      ) : (
        <div
          className="container mx-auto px-4 sm:px-8"
          style={{ marginLeft: "16%" }}
        >
          {checkUser.length > 0 && (
            <button
              className="bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 w-20 "
              onClick={() => {
                showModal();
              }}
            >
              Delete
            </button>
          )}

          <div className="py-8">
            <div className="flex items-center mb-4">
              <Tasks userIds={checkUser} />
              <div className="py-2 px-4 md:px-6 lg:px-8 bg-gray-100 border border-gray-110 rounded-md shadow-sm">
                <div
                  className="flex items-center justify-between mb-4 mt-2"
                  style={{ gap: "150px" }}
                >
                  <h2 className="text-2xl font-semibold text-gray-800 leading-tight flex-1 text-left">
                    User Information
                  </h2>

                  <div className="flex justify-center" style={{ flexGrow: 1 }}>
                    <div className="relative" style={{ width: "300px" }}>
                      <input
                        type="text"
                        placeholder="Search..."
                        onChange={handleChange}
                        onKeyDown={enterOrClickSearch}
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-gray-400 focus:border-transparent transition duration-150 ease-in-out"
                      />
                      <Search
                        className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5"
                        style={{ cursor: "pointer" }}
                      />
                      <CornerDownLeft
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5 cursor-pointer"
                        onClick={enterOrClickSearch}
                        aria-label="Press enter to search"
                      />
                    </div>
                  </div>

                  <div className="flex-1 flex justify-end">
                    <div className="relative">
                      <button
                        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                        className="flex items-center justify-center space-x-2 px-4 py-2 bg-white border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-0 focus:ring-offset-2 focus:ring-gray-500 transition duration-150 ease-in-out"
                      >
                        <Filter className="h-5 w-5 text-gray-500" />
                        <span>Filter</span>
                        {isDropdownOpen ? (
                          <ChevronUp className="h-4 w-4 text-gray-500" />
                        ) : (
                          <ChevronDown className="h-4 w-4 text-gray-500" />
                        )}
                      </button>
                      {isDropdownOpen && (
                        <div className="absolute right-0 mt-2 w-64 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 divide-y divide-gray-100 focus:outline-none z-10 ">
                          <div className="p-2" role="none">
                            <div className="px-3 py-2 text-sm font-semibold text-gray-900">
                              Full Name
                            </div>
                            <div className="mt-1 space-y-1">
                              <button
                                onClick={() => handleSort("fullname", "asc")}
                                className="flex items-center space-x-2 w-full bg-white text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md transition duration-150 ease-in-out"
                              >
                                <ArrowUpNarrowWide className="h-4 w-4" />
                                <span>A to Z</span>
                              </button>
                              <button
                                onClick={() => handleSort("fullname", "desc")}
                                className="flex items-center space-x-2 w-full bg-white text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md transition duration-150 ease-in-out"
                              >
                                <ArrowDownNarrowWide className="h-4 w-4" />
                                <span>Z to A</span>
                              </button>
                            </div>
                          </div>
                          <div className="p-2" role="none">
                            <div className="px-3 py-2 text-sm font-semibold text-gray-900">
                              City
                            </div>
                            <div className="mt-1 space-y-1">
                              <button
                                onClick={() => handleSort("city", "asc")}
                                className="flex items-center space-x-2 w-full bg-white text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md transition duration-150 ease-in-out"
                              >
                                <ArrowUpNarrowWide className="h-4 w-4" />
                                <span>A to Z</span>
                              </button>
                              <button
                                onClick={() => handleSort("city", "desc")}
                                className="flex items-center space-x-2 w-full bg-white text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md transition duration-150 ease-in-out"
                              >
                                <ArrowDownNarrowWide className="h-4 w-4" />
                                <span>Z to A</span>
                              </button>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              <div className="relative inline-block text-left ml-8 mb-5">
                {/* ------------Export Files------------- */}
                <button
                  onClick={() => setimportOpen(!importOpen)}
                  className="inline-flex items-center px-4 py-2 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-150 ease-in-out"
                >
                  <FileDown className="w-5 h-5 mr-2" />
                  Export
                </button>

                {importOpen && (
                  <div
                    className="origin-top-right absolute right-0 mt-2 w-40 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none z-20 transition-all duration-300 ease-in-out"
                    style={{ marginRight: "-30px" }}
                  >
                    <div
                      className="py-1"
                      role="menu"
                      aria-orientation="vertical"
                      aria-labelledby="options-menu"
                    >
                      <button
                        onClick={() => exportPDF("pdf")}
                        className="flex items-center w-full px-4 py-2 bg-white text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 focus:outline-none transition duration-150 ease-in-out"
                        role="menuitem"
                      >
                        <FileText className="w-5 h-5 mr-2 text-red-500" />
                        <span>PDF</span>
                      </button>
                      <button
                        onClick={() => exportPDF("csv")}
                        className="flex items-center w-full px-4 py-2 bg-white text-sm text-gray-700 hover:bg-green-50 hover:text-green-600 focus:outline-none transition duration-150 ease-in-out"
                        role="menuitem"
                      >
                        <FileSpreadsheet className="w-5 h-5 mr-2 text-green-500" />
                        <span>CSV</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <Modal
              isOpen={modalIsOpen}
              onRequestClose={closeModal}
              style={{
                overlay: {
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  transition: "all 10s ease-in-out",
                },
                content: {
                  position: "relative",
                  width: "400px",
                  margin: "auto",
                  borderRadius: "10px",
                  padding: "20px",
                  border: "none",
                  backgroundColor: "#fff",
                  boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
                },
              }}
              contentLabel="Are you sure you want to delete?"
            >
              <div style={{ textAlign: "center", marginBottom: "20px" }}>
                <h3 style={{ margin: 0, color: "#333" }}>Delete</h3>
                <p style={{ fontSize: "14px", color: "#555" }}>
                  {modalMessage}
                </p>
              </div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  gap: "10px",
                }}
              >
                <button
                  style={{
                    padding: "10px 20px",
                    backgroundColor: "#f0f0f0",
                    border: "none",
                    borderRadius: "5px",
                    color: "#333",
                    cursor: "pointer",
                    fontWeight: "bold",
                  }}
                  onClick={closeModal}
                >
                  No
                </button>
                <button
                  style={{
                    padding: "10px 20px",
                    backgroundColor: "#ff4d4d",
                    border: "none",
                    borderRadius: "5px",
                    color: "#fff",
                    cursor: "pointer",
                    fontWeight: "bold",
                  }}
                  onClick={deletDataByModal}
                >
                  Yes
                </button>
              </div>
            </Modal>

            <div className="my-2 sm:-mx-6 lg:-mx-8">
              <div className="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
                {userInfo.length === 0 ? (
                  <h1
                    className="text-2xl font-semibold text-gray-500"
                    style={{ marginTop: "10%", marginLeft: "50%" }}
                  >
                    No User Found
                  </h1>
                ) : (
                  <>
                    <div className="shadow overflow-x-auto border-b border-gray-200 sm:rounded-lg">
                      <table
                        className="table-auto w-full divide-y divide-gray-200"
                        style={{ tableLayout: "auto" }}
                      >
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              <input
                                type="checkbox"
                                className="form-checkbox h-5 w-5 text-indigo-600"
                                checked={
                                  checkUser.length === userInfo.length ||
                                  selectAll
                                }
                                onChange={handleSelectAll}
                              />
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Full Name
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Email
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Phone No
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              City
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Country
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Role
                            </th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {userInfo.map(
                            (user, index) =>
                              user.role !== "admin" && (
                                <tr
                                  key={user._id}
                                  className={
                                    index % 2 === 0 ? "bg-gray-50" : "bg-white"
                                  }
                                >
                                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    <input
                                      type="checkbox"
                                      className="form-checkbox h-5 w-5 text-indigo-600"
                                      checked={checkUser.includes(user._id)}
                                      onChange={() => selectUser(user._id)}
                                    />
                                  </td>
                                  <td className="px-6 py-4 text-sm font-medium text-gray-900 whitespace-nowrap">
                                    {user.fullname}
                                  </td>
                                  <td className="px-6 py-4 text-sm text-gray-500 whitespace-nowrap min-w-[200px]">
                                    {user.email}
                                  </td>
                                  <td className="px-6 py-4 text-sm text-gray-500 whitespace-nowrap min-w-[130px]">
                                    {user.phoneNumber}
                                  </td>
                                  <td className="px-6 py-4 text-sm text-gray-500 whitespace-nowrap">
                                    {user.city}
                                  </td>
                                  <td className="px-6 py-4 text-sm text-gray-500 whitespace-nowrap">
                                    {user.country}
                                  </td>
                                  <td className="px-6 py-4 text-sm text-gray-500 whitespace-nowrap">
                                    {user.role}
                                  </td>
                                </tr>
                              )
                          )}
                        </tbody>
                      </table>
                    </div>

                    <div className="container mx-auto p-4">
                      <div className="relative">
                        <p
                          className="absolute mt-5 text-gray-600"
                          style={{ marginLeft: "-240px" }}
                        >
                          Users {userInfo.length}
                        </p>
                      </div>
                    </div>

                    <div className="flex justify-between items-center mt-8">
                      <div className="flex flex-col items-center">
                        <button
                          variant="outline"
                          size="icon"
                          onClick={() => pages("prev")}
                          disabled={currentPage === 1}
                          className={
                            currentPage === 1
                              ? "border shadow-md bg-gray-300 w-8 rounded-md"
                              : "border shadow-md bg-gray-400 w-8 rounded-md"
                          }
                        >
                          <ChevronLeft className="h-4 w-4" />
                        </button>
                        <span className="mt-2">Previous</span>
                      </div>

                      <div className="flex flex-col items-center">
                        <button
                          size="icon"
                          onClick={() => pages("next")}
                          disabled={userInfo.length < 20}
                          className={
                            userInfo.length < 20
                              ? "border shadow-md bg-gray-300 w-8 rounded-md"
                              : "border shadow-md bg-gray-400 w-8 rounded-md"
                          }
                        >
                          <ChevronRight className="h-4 w-4" />
                        </button>
                        <span className="mt-2">Next</span>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>

            <HorizontalScroll dynamicName={currentLoginName} />
          </div>
        </div>
      )}
    </div>
  );
};

export default UserName;
