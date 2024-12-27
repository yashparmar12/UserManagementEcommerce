import React, { useEffect, useState } from "react";
import { Flex, Spin } from "antd";
import { X } from "lucide-react";
import { set } from "mongoose";

const Cart = () => {
  const [userInfo, setUserInfo] = useState([]);
  const [showAlert, setShowAlert] = useState(false);
  const [showAlertMsg, setShowAlertMsg] = useState("");
  const [unavailProduct, setUnavailProduct] = useState({});
  const [loading, setLoading] = useState(false);

  const access = async (e) => {
    setLoading(true);
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
        // console.log(responseData.cartItem[0]._id);
        
        setUserInfo(responseData.cartItem);
        setLoading(false);
        console.log(responseData.cartItem);
      } else {
        setLoading(false);
        console.log("Unable to fetch user data");
      }
    } catch (error) {
      console.log(error);
    } finally {
    }
  };

  const handleIncreaseQuantity = (id) => {
    setUserInfo((prev) =>
      prev.map((item) => {
        if (item.product._id === id) {
          if (item.product.productQuantity > item.quantity) {
            setUnavailProduct((prev) => ({
              ...prev,
              [id]: false,
            }));
            return { ...item, quantity: item.quantity + 1 };
          } else {
            setUnavailProduct((prev) => ({
              ...prev,
              [id]: true,
            }));
          }
        }
        return item;
      })
    );
  };

  const handleDecreaseQuantity = (id) => {
    setUserInfo((prev) =>
      prev.map((item) => {
        if (item.product._id === id) {
          if (item.quantity > 1) {
            setUnavailProduct((prev) => ({
              ...prev,
              [id]: false,
            }));
            return { ...item, quantity: item.quantity - 1 };
          }
        }
        return item;
      })
    );
  };

  const CheckOut = async () => {
    const updatedProduct = userInfo.map((item) => ({
      productId: item.product._id,
      quantity: item.quantity,
    }));
    try {
      const token = localStorage.getItem("token");

      const response = await fetch("https://usermanagementecommerce-1.onrender.com/api/user/checkOut", {
      // const response = await fetch("http://localhost:8000/api/user/checkOut", {
        method: "POST",
        body: JSON.stringify({ updatedProduct }),
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        credentials: "include",
      });

      const responseData = await response.json();

      if (responseData.success) {
        setShowAlertMsg("Ordered Successfully");
        setShowAlert(true);
        setTimeout(() => {
          setShowAlert(false);
        }, 3000);
      } else {
        console.log("Unable to fetch user data");
      }
    } catch (error) {
      console.log(error);
    }
  };
  const isDiable = () => {
    for (let key in unavailProduct) {
      if (unavailProduct[key] === true) {
        return true;
      }
    }
    return false;
  };
  
  const deleteProduct = async(id) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`https://usermanagementecommerce-1.onrender.com/api/user/cart/${id}`, {
      // const response = await fetch(`http://localhost:8000/api/user/cart/${id}`, {
        method: "DELETE",
        // body: JSON.stringify({ updatedProduct }),
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        credentials: "include",
      });
      const responseData = await response.json();
      
      if(responseData.success){
        console.log("Product Deleted Successfully");
        setShowAlertMsg("Product Deleted Successfully");
        setShowAlert(true);
        setTimeout(() => {
          setShowAlert(false);
        }, 3000);
        access();
      }

    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    access();
  }, []);

  return (
    <div>
      {showAlert && (
        <div
          className="bg-green-500 text-white font-semibold tracking-wide flex items-center w-max max-w-sm p-4 rounded-md shadow-md shadow-blue-200"
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

          <span class="block sm:inline text-sm mr-3">{showAlertMsg}</span>

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
        <div>
        {userInfo.length===0 ? <h1 style={{textAlign:"center", marginTop:"10%"}}>No Product in Cart</h1> :  
        <div className="max-w-6xl mx-auto p-4 h-screen flex flex-col">
          <h1
            className="text-2xl font-extrabold font-bold text-gray-800 mb-14"
            style={{ marginLeft: "40%" }}
          >
            Your Cart
          </h1>
          <div className="flex flex-col lg:flex-row gap-4 flex-grow overflow-hidden">
            <div className="lg:w-2/3 overflow-y-auto pr-4">
              {userInfo?.map((item, index) => (
                <div
                  key={index}
                  className="bg-white p-4 rounded-md shadow-[0_2px_12px_-3px_rgba(6,81,237,0.3)] mb-4"
                >
                  <div>
                    <div onClick={()=> deleteProduct(item.product._id)} className="cursor-pointer p-5 text-gray-400 bg-white rounded-full "  style={{ marginLeft: "95%", marginTop:"-3%", border: "none"}}>
                      <X size={20} />
                  </div>
                  </div>
   

                  <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
                    <img
                      src={item?.product.image}
                      alt={`${item?.product.brandName} ${item?.product.modelName}`}
                      width={200}
                      height={200}
                      className="object-cover rounded-md"
                    />
                    <div className="flex-grow">
                      <h2 className="text-lg font-bold text-gray-800">
                        {/* {item?.product.brandName}  */}
                        {item?.product.modelName}
                      </h2>
                      <p className="text-gray-600">
                        Price: ₹{item?.product.price.toLocaleString()}
                      </p>
                      <div className="grid grid-cols-2 gap-2 mt-2">
                        <p className="text-sm text-gray-600">
                          RAM: {item?.product.ram}
                        </p>
                        <p className="text-sm text-gray-600">
                          Storage: {item?.product.memory}
                        </p>
                        <p className="text-sm text-gray-600">
                          Battery: {item?.product.battery}
                        </p>
                        <p className="text-sm text-gray-600">
                          Front Camera: {item?.product.frontCamera}
                        </p>
                        <p className="text-sm text-gray-600">
                          Back Camera: {item?.product.backCamera}
                        </p>
                        <p className="text-sm text-gray-600">
                          SIM: {item?.product.simType}
                        </p>
                        <p className="text-sm text-gray-600">
                          Display: {item?.product.displaySize}
                        </p>
                      </div>
                      <div className="flex items-center mt-4">
                        <button
                          onClick={() =>
                            handleDecreaseQuantity(item?.product._id)
                          }
                          className="bg-gray-300 text-gray-700 px-2 py-1 w-12"
                          style={{ borderRadius: "20px" }}
                        >
                          -
                        </button>
                        <span className="mx-4 mt-4">{item?.quantity}</span>
                        <button
                          onClick={() =>
                            handleIncreaseQuantity(item?.product._id)
                          }
                          className="bg-gray-300 text-gray-700 px-2 py-1 rounded-md w-12"
                          style={{ borderRadius: "20px" }}
                        >
                          +
                        </button>
                        {unavailProduct[item.product._id] && (
                          <p className="text-red-500 mt-5 ml-5">Out of Stock</p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="lg:w-1/3">
              <div className="bg-white p-4 rounded-md shadow-md sticky top-4">
                <h2 className="text-lg font-bold text-gray-800">
                  Order Summary
                </h2>
                <div className="mt-4">
                  {userInfo?.map((item, index) => (
                    <div>
                      <div className="flex justify-between text-gray-600">
                        <p>{item.product.modelName}</p>
                        <p>₹{item?.product.price * item?.quantity}</p>
                      </div>
                      <hr className="my-4" />
                    </div>
                  ))}
                  <div className="flex justify-between font-bold text-gray-800">
                    <p>Total</p>
                    <p>
                      ₹
                      {userInfo?.reduce(
                        (acc, item) => acc + item.product.price * item.quantity,
                        0
                      )}
                    </p>
                  </div>
                </div>

                <button
                  onClick={CheckOut}
                  disabled={isDiable()}
                  className={`w-full mt-4 py-2 px-4 rounded-md text-white 
                  ${
                    isDiable()
                      ? "bg-blue-400 cursor-not-allowed"
                      : "bg-blue-600 hover:bg-blue-700"
                  }`}
                >
                  Checkout
                </button>
              </div>
            </div>
          </div>
        </div>
        }
        </div>
      )}
    </div>
  );
};

export default Cart;
