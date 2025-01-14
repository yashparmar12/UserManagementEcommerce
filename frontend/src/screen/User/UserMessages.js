import React, { useEffect, useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { Flex, Spin } from "antd";
// import { io } from 'socket.io-client';
// const socket = io('http://localhost:8000');


const UserMessages = () => {
  const [userInfo, setUserInfo] = useState({ content: [] });
  const [userId, setUserId] = useState("");
  const [isDisabled, setIsDisabled] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [loading, setLoading] = useState(false);
  // const [unreadCount, setUnreadCount] = useState(0);


  const access = async (e) => {
    try {
      const token = localStorage.getItem("token");

      const response = await fetch("https://usermanagementecommerce-1.onrender.coms/api/user/userData", {
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
        // console.log(responseData.user)

        setLoading(false);
        setUserId(responseData.user._id);
        setUserInfo({ content: [...responseData.user.content] });
      } else {
        console.log("Unable to fetch user data");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleDateChange = async (date, index, key) => {
    const updatedTask = [...userInfo.content];

    updatedTask[index][key] = date;

    if (
      key !== "startTime" &&
      updatedTask[index].startTime > updatedTask[index].endTime
    ) {
      setShowAlert(true);

      updatedTask[index].endTime = null;

      setTimeout(() => {
        setShowAlert(false);
      }, 2000);
      return;
    }

    setUserInfo({ content: updatedTask });

    try {
      const allData = {
        taskId: updatedTask[index]._id,
        startTime: updatedTask[index].startTime,
        endTime: updatedTask[index].endTime,
      };

      // console.log(userId)

      // const response = await fetch("http://localhost:8000/api/user/taskDuration", {
      const response = await fetch("https://usermanagementecommerce-1.onrender.com/api/user/taskDuration", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ task: allData, userId: userId }),
        }
      );

      const responseData = await response.json();

      if (responseData.success) {
        access();
      } else {
        console.log("Not any response");
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
    <>
      {loading ? (
        <Flex
          align="center"
          gap="middle"
          style={{
            display: "flex",
            alignContent: "center",
            justifyContent: "center",
            marginTop: "250px",
          }}
        >
          <Spin size="large" />
        </Flex>
      ) : (
        <div className="bg-gradient-to-br from-blue-50 to-indigo-50">
          <div style={{ marginLeft: "20%", width: "60%" }}>
            <div style={{ overflow: "hidden" }}>
              <h3
                className="text-2xl font-bold text-white bg-blue-500 border-2 shadow-lg px-4 py-2 rounded-md mt-10"
                style={{ marginLeft: "40%", border: "none", width: "18%" }}
              >
                Your Tasks
              </h3>
            </div>
            {showAlert && (
              <div
                className="bg-red-500 text-white font-semibold tracking-wide flex items-center w-max max-w-sm p-4 rounded-md shadow-md shadow-blue-200"
                style={{
                  position: "fixed",
                  top: "30px",
                  left: "50%",
                  transform: "translateX(-50%)",
                  zIndex: 1000,
                }}
                role="alert"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="w-[18px] shrink-0 fill-white inline mr-3"
                  viewBox="0 0 512 512"
                >
                  <ellipse
                    cx="256"
                    cy="256"
                    fill="#fff"
                    data-original="#fff"
                    rx="256"
                    ry="255.832"
                  />
                  <path
                    class="fill-green-500"
                    d="m235.472 392.08-121.04-94.296 34.416-44.168 74.328 57.904 122.672-177.016 46.032 31.888z"
                    data-original="#ffffff"
                  />
                </svg>

                <span class="block sm:inline text-sm mr-3">
                  End time should be more than start time.
                </span>

                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="w-3 cursor-pointer shrink-0 fill-white ml-auto"
                  viewBox="0 0 320.591 320.591"
                  onClick={() => setShowAlert(false)}
                >
                  <path
                    d="M30.391 318.583a30.37 30.37 0 0 1-21.56-7.288c-11.774-11.844-11.774-30.973 0-42.817L266.643 10.665c12.246-11.459 31.462-10.822 42.921 1.424 10.362 11.074 10.966 28.095 1.414 39.875L51.647 311.295a30.366 30.366 0 0 1-21.256 7.288z"
                    data-original="#000000"
                  />
                  <path
                    d="M287.9 318.583a30.37 30.37 0 0 1-21.257-8.806L8.83 51.963C-2.078 39.225-.595 20.055 12.143 9.146c11.369-9.736 28.136-9.736 39.504 0l259.331 257.813c12.243 11.462 12.876 30.679 1.414 42.922-.456.487-.927.958-1.414 1.414a30.368 30.368 0 0 1-23.078 7.288z"
                    data-original="#000000"
                  />
                </svg>
              </div>
            )}

            <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
              <div style={{ marginLeft: "-25%", width: "150%" }}>
                <div
                  className="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg"
                  style={{ marginTop: "2%" }}
                >
                  <table className="w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          S No.
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Tasks
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Start Time
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          End Time
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Total Time
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {userInfo?.content?.length > 0 ? (
                        userInfo.content.map((item, index) => (
                          <tr
                            key={index}
                            className={
                              index % 2 === 0 ? "bg-gray-50" : "bg-white"
                            }
                          >
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                              {index + 1}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {item?.taskName || "No task name"}
                            </td>
                            <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-900">
                              <DatePicker
                                selected={
                                  item.startTime
                                    ? new Date(item.startTime)
                                    : null
                                }
                                onChange={(date) => {
                                  handleDateChange(date, index, "startTime");
                                  // handleSubmit();
                                }}
                                showTimeSelect
                                dateFormat="Pp"
                                disabled={isDisabled}
                                className="px-4 py-2 border rounded-md"
                              />
                            </td>
                            <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-900">
                              <DatePicker
                                selected={
                                  item.endTime ? new Date(item.endTime) : null
                                }
                                onChange={(date) => {
                                  handleDateChange(date, index, "endTime");
                                  // handleSubmit();
                                }}
                                showTimeSelect
                                dateFormat="Pp"
                                disabled={isDisabled}
                                className="px-4 py-2 border rounded-md"
                              />
                            </td>
                            <td className="px-12 py-4 whitespace-nowrap text-sm text-gray-900">
                              {item?.totalTime || "Not Available"}
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td
                            colSpan="5"
                            className="text-center text-gray-500 py-4"
                          >
                            No Content Found
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default UserMessages;
