import React, { useState, useEffect } from "react";
import { Flex, Spin } from "antd";
import { ChevronDown, ChevronUp } from "lucide-react";

const Orders = () => {
  const [userInfo, setUserInfo] = useState([]);
  const [loading, setLoading] = useState(false);
  const [userOpen, setUserOpen] = useState([]);

  const access = async (e) => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");

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
        console.log(responseData.userAndOrder);
        setUserInfo(responseData.userAndOrder);
      } else {
        console.log("Unable to fetch user data");
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const toggleUser = (userId) => {
    setUserOpen((prev) =>
      prev.includes(userId)
        ? prev.filter((id) => id !== userId)
        : [...prev, userId]
    );
  };

  useEffect(() => {
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
      ) : (
        <div className="min-h-screen mt-12">
          <div className="container mx-auto p-4 shadow-[0_2px_12px_-3px_rgba(6,81,237,0.5)] ">
            {userInfo.length > 0 ? (
              <h1
                className="text-2xl font-bold mb-4"
                style={{ marginLeft: "30%" }}
              >
                User Orders Admin Panel
              </h1>
            ) : (
              <h1
                className="text-2xl font-bold mb-4"
                style={{ marginLeft: "30%" }}
              >
                No Orders Available
              </h1>
            )}
            {userInfo?.map((users, index) => (
              <div
                key={index}
                className="mb-4 border rounded-lg overflow-hidden"
              >
                <div
                  className="bg-gray-100 p-4 flex justify-between items-center cursor-pointer"
                  onClick={() => toggleUser(users.user._id)}
                >
                  <div>
                    <h2 className="text-lg font-semibold">
                      {users.user.fullname}
                    </h2>
                    <p className="text-sm text-gray-600">{users.user.email}</p>
                  </div>
                  {userOpen.includes(users.user.id) ? (
                    <ChevronUp className="h-5 w-5 text-gray-500" />
                  ) : (
                    <ChevronDown className="h-5 w-5 text-gray-500" />
                  )}
                </div>
                {userOpen.includes(users.user._id) && (
                  <div className="p-4">
                    <h3 className="text-md font-semibold mb-2">Orders:</h3>
                    <div className="mb-6 bg-white shadow-md rounded-lg overflow-hidden">
                      <div className="bg-gray-100 p-4 flex justify-between items-center">
                        <div style={{ marginLeft: "85%" }}>
                          <p className="font-semibold">
                            {" "}
                            Total: ₹
                            {users?.products.reduce(
                              (acc, item) => acc + item.price * item.quantity,
                              0
                            )}
                          </p>
                        </div>
                      </div>
                      <table className="w-full">
                        <thead>
                          <tr className="bg-gray-50">
                            <th className="p-2 text-left">Mobile Name</th>
                            <th className="p-2 text-left">RAM</th>
                            <th className="p-2 text-left">Memory</th>
                            <th className="p-2 text-left">Display Size</th>
                            <th className="p-2 text-left">Price</th>
                            <th className="p-2 text-left">Quantity</th>
                            <th className="p-2 text-left">Subtotal</th>
                          </tr>
                        </thead>

                        <tbody>
                          {users.products?.length > 0 ? (
                            users.products.map((order, itemIndex) => (
                              <tr key={itemIndex} className="border-b">
                                <td className="p-2">
                                  {order.modelName || "N/A"}
                                </td>
                                <td className="p-2">{order.ram || "N/A"}</td>
                                <td className="p-2">{order.memory || "N/A"}</td>
                                <td className="p-2">
                                  {order.displaySize || "N/A"}
                                </td>
                                <td className="p-2">₹{order.price || 0}</td>
                                <td className="p-2">{order.quantity || 0}</td>
                                <td className="p-2">
                                  ₹{(order.price || 0) * (order.quantity || 0)}
                                </td>
                              </tr>
                            ))
                          ) : (
                            <tr>
                              <td className="p-2" colSpan="7">
                                No orders available.
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Orders;
