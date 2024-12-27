import React, { useState } from "react";
import {
  Star,
  Heart,
  Smartphone,
  MemoryStickIcon as Ram,
  HardDrive,
  Battery,
} from "lucide-react";

const UserProduct = ({ userProduct }) => {
  const {
    _id,
    brandName,
    modelName,
    image,
    ram,
    memory,
    battery,
    frontCamera,
    backCamera,
    simType,
    displaySize,
    price,
    quantity,
  } = userProduct;

  const [Quantity, setQuantity] = useState(1);
  const [openProduct, setOpenProduct] = useState(null);
  const [showAlert, setShowAlert] = useState(false);
  

  const originalPrice = price + 5000;

  const handleIncreaseQuantity = () => {
    setQuantity((qty) => qty + 1);
  };

  const handleDecreaseQuantity = () => {
    if (Quantity > 1) {
      setQuantity((qty) => qty - 1);
    }
  };

  const handleOpenModal = (product) => {
    setOpenProduct(product);
  };
  const handleCloseModal = () => {
    setOpenProduct(null);
  };

  const handleAddToCart = async (_id) => {
    try {
      const token = localStorage.getItem("token");

      const response = await fetch(
        `https://usermanagementecommerce-1.onrender.com/api/user/addToCart/${_id}`,
        // `http://localhost:8000/api/user/addToCart/${_id}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          credentials: "include",
        }
      );

      const responseData = await response.json();

      if (responseData.success) {
        console.log("Added successfully");
        setShowAlert(true);
        setTimeout(() => {
          setShowAlert(false);
        }, 3000);
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="flex flex-wrap" style={{ marginLeft: "10%" }}>
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

          <span class="block sm:inline text-sm mr-3">Added Successfully</span>

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
      {openProduct && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4">
          <div className="bg-white p-6 rounded-lg w-full sm:max-w-[800px] flex flex-col gap-6 shadow-lg">
            <div className="flex flex-col sm:flex-row gap-6">
              <div className="flex-shrink-0 w-full sm:w-1/2 mr-12">
                <img
                  src={image}
                  alt={`${brandName} ${modelName}`}
                  className="w-full h-auto rounded-lg object-cover"
                />
              </div>

              <div className="flex-grow w-full sm:w-1/2">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold text-gray-800">
                    {brandName} {modelName}
                  </h2>
                  <button
                    onClick={handleCloseModal}
                    className="bg-white text-gray-500 text-3xl hover:text-red-600 transition"
                    style={{ width: "40px", marginTop: "3px" }}
                  >
                    &times;
                  </button>
                </div>

                <div className="space-y-4">
                  <p className="text-lg font-medium text-gray-800">
                    <span className="font-semibold text-gray-700">Price:₹</span>{" "}
                    {price * Quantity}
                  </p>
                  <p className="text-lg text-gray-800">
                    <span className="font-semibold text-gray-700">RAM:</span>{" "}
                    {ram} GB
                  </p>
                  <p className="text-lg text-gray-800">
                    <span className="font-semibold text-gray-700">Memory:</span>{" "}
                    {memory} GB
                  </p>
                  <p className="text-lg text-gray-800">
                    <span className="font-semibold text-gray-700">
                      Battery:
                    </span>{" "}
                    {battery} mAh
                  </p>
                  <p className="text-lg text-gray-800">
                    <span className="font-semibold text-gray-700">
                      Front Camera:
                    </span>{" "}
                    {frontCamera} mp
                  </p>
                  <p className="text-lg text-gray-800">
                    <span className="font-semibold text-gray-700">
                      Back Camera:
                    </span>{" "}
                    {backCamera} mp
                  </p>
                  <p className="text-lg text-gray-800">
                    <span className="font-semibold text-gray-700">
                      SIM Type:
                    </span>{" "}
                    {simType}
                  </p>
                  <p className="text-lg text-gray-800">
                    <span className="font-semibold text-gray-700">
                      Display Size:
                    </span>{" "}
                    {displaySize} inch
                  </p>
                </div>
              </div>
            </div>

            <div className="flex justify-center mt-4">
              <button
                // onClick={() => alert("Button Clicked!")}
                className="bg-blue-600 text-white px-6 py-2 rounded-lg shadow-md hover:bg-primary-dark transition"
              >
                Add to Cart
              </button>
            </div>
          </div>
        </div>
      )}

      <div
        className="bg-gray-80 flex flex-col overflow-hidden cursor-pointer hover:shadow-md  transition-all mt-14"
        style={{ width: "250px" }}
      >
        <div className="w-full">
          <img
            src={image}
            alt="Mobile"
            onClick={() => handleOpenModal(userProduct)}
            className="w-full object-cover object-top aspect-[230/307]"
            style={{ height: "200px" }}
          />
        </div>
        <div className="p-2 flex-1 flex flex-col">
          <div className="flex-1">
            <h5 className="text-sm sm:text-base font-bold text-gray-800 truncate">
              {modelName}
            </h5>

            <div className="flex flex-wrap justify-between gap-2 mt-2">
              <div className="flex gap-2">
                <h6 className="text-sm sm:text-base font-bold text-gray-800">
                  ₹{price}
                </h6>
                <h6 className="text-sm sm:text-base text-gray-500">
                  <strike>₹{originalPrice}</strike>
                </h6>
              </div>
            </div>
            <div className="mt-2 flex flex-col gap-1">
              <div className="flex items-center gap-1">
                <Ram className="w-4 h-4 text-gray-500" />
                <span className="text-sm text-gray-600">{ram} GB RAM</span>
              </div>
              <div className="flex items-center gap-1">
                <HardDrive className="w-4 h-4 text-gray-500" />
                <span className="text-sm text-gray-600">
                  {memory} GB Storage
                </span>
              </div>
              <div className="flex items-center gap-1">
                <Battery className="w-4 h-4 text-gray-500" />
                <span className="text-sm text-gray-600">
                  {battery} mAh Battery
                </span>
              </div>
              <div
                className="flex items-center gap-1 bg-gray-100"
                style={{ width: "80px", borderRadius: "8px solid gray" }}
              >
                <button
                  type="button"
                  class="mt-1 flex items-center px-3 py-1.5 border border-gray-300 text-gray-800 text-xs outline-none bg-transparent rounded-md pb-2"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    class="w-3 fill-current p-auto"
                    viewBox="0 0 124 124"
                    onClick={handleDecreaseQuantity}
                  >
                    <path
                      d="M112 50H12C5.4 50 0 55.4 0 62s5.4 12 12 12h100c6.6 0 12-5.4 12-12s-5.4-12-12-12z"
                      data-original="#000000"
                      
                    ></path>
                  </svg>

                  <span class="mx-3 font-bold">{Quantity}</span>

                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    class="w-3 fill-current"
                    viewBox="0 0 42 42"
                    onClick={handleIncreaseQuantity}
                  >
                    <path
                      d="M37.059 16H26V4.941C26 2.224 23.718 0 21 0s-5 2.224-5 4.941V16H4.941C2.224 16 0 18.282 0 21s2.224 5 4.941 5H16v11.059C16 39.776 18.282 42 21 42s5-2.224 5-4.941V26h11.059C39.776 26 42 23.718 42 21s-2.224-5-4.941-5z"
                      data-original="#000000"
                      
                    ></path>
                  </svg>
                </button>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2 mt-0">
            {/* <div
              className="bg-pink-100 hover:bg-pink-200 w-12 h-9 flex items-center justify-center rounded cursor-pointer"
              title="Wishlist"
            >
              <Heart className="w-4 h-4 text-pink-600" />
            </div> */}
            <button
              onClick={() => {
                handleAddToCart(_id);
              }}
              type="button"
              className="text-sm px-2 min-h-[36px] w-full bg-blue-600 hover:bg-blue-700 text-white tracking-wide ml-auto outline-none border-none rounded"
            >
              Add to cart
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProduct;
