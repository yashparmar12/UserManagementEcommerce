import React, { useEffect, useState } from "react";
import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { Flex, Spin } from "antd";

const ShowAllTask = () => {
  const [taskContent, setTaskContent] = useState([]);
  const [loading, setLoading] = useState(false);

  const GetTasks = async () => {
    try {
      // const response = await fetch("https://usermanagementecommerce-1.onrender.com/api/user/showTask", {
      const response = await fetch("http://localhost:8000/api/user/showTask", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const result = await response.json();
      console.log(result.savedTask);
      if (result.success) {
        setTaskContent(result.savedTask);
      } else {
        console.log("Unable to fetch task");
      }
      setLoading(false);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    setLoading(true);
    GetTasks();
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
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 flex flex-col items-center pt-10">
          <div className="w-full  px-4 flex items-center mb-8">
            <div
              className="bg-blue-500 w-10 h-10 shadow-md rounded-lg flex items-center justify-center mr-4 "
              style={{ marginLeft: "50px" }}
            >
              <Link to="/userHome">
                <ArrowLeft className="h-6 w-6 text-white" />
              </Link>
            </div>

            <h2
              className="text-2xl font-bold text-white bg-blue-500 border-2 shadow-lg px-4 py-2 rounded-md"
              style={{ marginLeft: "35%", border: "none" }}
            >
              All User Tasks
            </h2>
          </div>

          <div className="w-full max-w-5xl px-4">
            <div className="overflow-x-auto bg-white shadow-md rounded-lg">
              <table className="min-w-full table-auto">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Full Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Tasks
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {taskContent?.map((user, index) => (
                    <tr
                      key={index}
                      className={index % 2 === 0 ? "bg-gray-50" : "bg-white"}
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {user?.fullname}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <ul className="list-disc list-inside space-y-1">
                          {user?.content?.map((task, taskIndex) => (
                            <li
                              key={taskIndex}
                              className="text-sm text-gray-600"
                            >
                              {task?.taskName}
                            </li>
                          ))}
                        </ul>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ShowAllTask;
