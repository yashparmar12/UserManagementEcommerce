import React, { useEffect, useState, useRef } from "react";
import { Flex, Spin } from "antd";
import UserProduct from "./UserProduct";
import { Search } from "lucide-react";
import { useParams } from "react-router-dom";

const Mobile = () => {
  const [userinfo, setUserInfo] = useState([]);
  const [userProducts, setUserProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const timerRef = useRef(null);
  const [showAlert, setShowAlert] = useState(false);
  const [selectedDevice, setSelectedDevice] = useState("");

  const { category } = useParams();

  const [phone, setPhone] = useState({
    brandName: "",
    modelName: "",
    image: "",
    ram: "",
    memory: "",
    battery: "",
    frontCamera: "",
    backCamera: "",
    simType: "",
    displaySize: "",
    processor: "",
    windows: "",
    warranty: "",
    price: 0,
    productQuantity: 0,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPhone((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  const handleFileChange = (e) => {
    setPhone((prev) => ({
      ...prev,
      image: e.target.files[0],
    }));
  };

  const handleSubmit = async (e) => {
    setLoading(true);
    e.preventDefault();

    const formData = new FormData();
    if (selectedDevice === "mobile") {
      formData.append("category", "mobile");
      formData.append("brandName", phone.brandName);
      formData.append("modelName", phone.modelName);
      formData.append("ram", phone.ram);
      formData.append("memory", phone.memory);
      formData.append("battery", phone.battery);
      formData.append("frontCamera", phone.frontCamera);
      formData.append("backCamera", phone.backCamera);
      formData.append("simType", phone.simType);
      formData.append("displaySize", phone.displaySize);
      formData.append("price", phone.price);
      formData.append("productQuantity", phone.productQuantity);
      if (phone.image) {
        formData.append("image", phone.image);
      }
    } else if (selectedDevice === "laptop") {
      formData.append("category", "laptop");
      formData.append("brandName", phone.brandName);
      formData.append("modelName", phone.modelName);
      formData.append("battery", phone.battery);
      formData.append("processor", phone.processor);
      formData.append("windows", phone.windows);
      formData.append("warranty", phone.warranty);
      formData.append("price", phone.price);
      formData.append("productQuantity", phone.productQuantity);
      if (phone.image) {
        formData.append("image", phone.image);
      }
    }

    try {
      const response = await fetch(
        "https://usermanagementecommerce-1.onrender.com/api/user/addProducts",
        // "http://localhost:8000/api/user/addMobileProduct",
        {
          method: "POST",
          body: formData,
        }
      );

      const responseData = await response.json();

      // if (responseData.success) {
      if (responseData !== null && responseData !== void 0 && responseData.success) {
        console.log(responseData.products);
        setShowAlert(true);
        setTimeout(() => {
          setShowAlert(false);
        }, 3000);
      } else {
        console.log("Unable to fetch user data");
      }
      setPhone({
        brandName: "",
        modelName: "",
        image: "",
        windows: "",
        processor: "",
        warranty: "",
        price: 0,
        productQuantity: 0,
      });
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

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
      console.log(responseData);

      if (responseData?.success) {

        if (responseData?.userLen) {
          const admin = responseData?.userLen?.find(
            (res) => res.role === "admin"
          );

          console.log(admin);

          if (admin) {
            setUserInfo(admin);
            console.log("admin");
          }
        }
        else {
          console.log(responseData.userProducts);
          console.log(responseData.user);
          setUserInfo(responseData.user);
          setUserProducts(responseData.userProducts);
        }
      } else {
        console.log("Unable to fetch user data");
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const handleCheckboxChange = (e) => {
    setSelectedDevice(e.target.value);
    getProductByCategory(e.target.value)
  };

  const getProductByCategory = async (checkData) => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");

      // const response = await fetch(`http://localhost:8000/api/user/products/${checkData}`, {
      const response = await fetch(`https://usermanagementecommerce-1.onrender.com/api/user/products/${checkData}`, {

        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        credentials: "include",
      });

      const responseData = await response.json();
      console.log(responseData);

      if (responseData?.success) {

        if (responseData?.userProducts) {
          console.log(responseData.userProducts);
          console.log(responseData.user);
          setUserInfo(responseData.user);
          setUserProducts(responseData.userProducts);
        } else {
          const product = `{No ${checkData}products available}`;
        }
      } else {
        console.log("Unable to fetch user data");
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const searchData = async (value) => {
    try {
      const response = await fetch(
        "https://usermanagementecommerce-1.onrender.com/api/user/searchProduct",
        // "http://localhost:8000/api/user/searchProduct",
        {
          method: "POST",
          body: JSON.stringify({ searchInput: value }),
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const responseData = await response.json();

      if (responseData?.userProduct) {
        if (!responseData.userProduct) {
          console.log(responseData.userProduct);
        } else {
          setUserProducts(responseData.userProduct);
          console.log(responseData.userProduct);
        }
      } else {
        console.log("Unable to fetch user data");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleChangeSearch = (e) => {
    const value = e.target.value;
    setSearch(value);

    if (value) {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }

      timerRef.current = setTimeout(() => {
        searchData(value);
      }, 500);
    } else {
      setTimeout(() => {
        access();
      }, 500);
    }
  };



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
      ) : userinfo.role === "admin" ? (
        <div className="flex justify-center items-center min-h-screen">
          <div
              className="bg-gray-300 p-6 rounded-lg shadow-lg"
              style={{
                height: "150px",
                width: "120px",
                marginLeft: "-10%",
                marginRight: "6%",
                marginTop: "-20%",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <h3 className="text-lg font-bold text-gray-700 mb-4">Select</h3>
              <label className="flex items-center mb-2">
                <input
                  type="radio"
                  name="device"
                  value="mobile"
                  checked={selectedDevice === "mobile"}
                  onChange={handleCheckboxChange}
                  className="mr-2"
                />
                <span className="text-gray-600">Mobile</span>
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  name="device"
                  value="laptop"
                  checked={selectedDevice === "laptop"}
                  onChange={handleCheckboxChange}
                  className="mr-2"
                />
                <span className="text-gray-600">Laptop</span>
              </label>
            </div>
            
            {/* <div style={{marginLeft:"-100px", marginTop:"-100px"}}>
              {selectedDevice === "" && <div><h1 style={{marginLeft:"200px", marginTop:"-100px",fontSize:"30px"}}>Please Select Product</h1></div>}
            </div> */}

          {selectedDevice === "mobile" ? (
            <div>
              <form
                onSubmit={handleSubmit}
                className="w-full max-w-4xl bg-white p-8 rounded-lg shadow-lg"
                style={{ marginTop: "-30px" }}
              >
                <h2 className="text-2xl font-bold text-center mb-6">
                  <u>Add New Mobile</u>
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex flex-col">
                    <label
                      htmlFor="brandName"
                      className="text-sm font-medium mb-1"
                    >
                      Brand Name
                    </label>
                    <input
                      type="text"
                      id="brandName"
                      name="brandName"
                      value={phone.brandName}
                      onChange={handleChange}
                      className="mt-1 p-2 border rounded-md"
                      required
                    />
                  </div>
                  <div className="flex flex-col">
                    <label
                      htmlFor="modelName"
                      className="text-sm font-medium mb-1"
                    >
                      Model Name
                    </label>
                    <input
                      type="text"
                      id="modelName"
                      name="modelName"
                      value={phone.modelName}
                      onChange={handleChange}
                      className="mt-1 p-2 border rounded-md"
                      required
                    />
                  </div>
                  <div className="flex flex-col">
                    <label
                      htmlFor="fileInput"
                      className="text-sm font-medium mb-1"
                    >
                      Image
                    </label>
                    <input
                      type="file"
                      id="fileInput"
                      name="image"
                      onChange={handleFileChange}
                      accept="image/*"
                      className="mt-1 p-2 border rounded-md"
                      required
                    />
                  </div>
                  <div className="flex flex-col">
                    <label htmlFor="ram" className="text-sm font-medium mb-1">
                      RAM
                    </label>
                    <input
                      type="text"
                      id="ram"
                      name="ram"
                      value={phone.ram}
                      onChange={handleChange}
                      className="mt-1 p-2 border rounded-md"
                      required
                    />
                  </div>
                  <div className="flex flex-col">
                    <label
                      htmlFor="memory"
                      className="text-sm font-medium mb-1"
                    >
                      Memory
                    </label>
                    <input
                      type="text"
                      id="memory"
                      name="memory"
                      value={phone.memory}
                      onChange={handleChange}
                      className="mt-1 p-2 border rounded-md"
                      required
                    />
                  </div>
                  <div className="flex flex-col">
                    <label
                      htmlFor="battery"
                      className="text-sm font-medium mb-1"
                    >
                      Battery
                    </label>
                    <input
                      type="text"
                      id="battery"
                      name="battery"
                      value={phone.battery}
                      onChange={handleChange}
                      className="mt-1 p-2 border rounded-md"
                      required
                    />
                  </div>
                  <div className="flex flex-col">
                    <label
                      htmlFor="frontCamera"
                      className="text-sm font-medium mb-1"
                    >
                      Front Camera
                    </label>
                    <input
                      type="text"
                      id="frontCamera"
                      name="frontCamera"
                      value={phone.frontCamera}
                      onChange={handleChange}
                      className="mt-1 p-2 border rounded-md"
                      required
                    />
                  </div>
                  <div className="flex flex-col">
                    <label
                      htmlFor="backCamera"
                      className="text-sm font-medium mb-1"
                    >
                      Back Camera
                    </label>
                    <input
                      type="text"
                      id="backCamera"
                      name="backCamera"
                      value={phone.backCamera}
                      onChange={handleChange}
                      className="mt-1 p-2 border rounded-md"
                      required
                    />
                  </div>
                  <div className="flex flex-col">
                    <label
                      htmlFor="simType"
                      className="text-sm font-medium mb-1"
                    >
                      SIM Type
                    </label>
                    <input
                      type="text"
                      id="simType"
                      name="simType"
                      value={phone.simType}
                      onChange={handleChange}
                      className="mt-1 p-2 border rounded-md"
                      required
                    />
                  </div>
                  <div className="flex flex-col">
                    <label
                      htmlFor="displaySize"
                      className="text-sm font-medium mb-1"
                    >
                      Display Size
                    </label>
                    <input
                      type="text"
                      id="displaySize"
                      name="displaySize"
                      value={phone.displaySize}
                      onChange={handleChange}
                      className="mt-1 p-2 border rounded-md"
                      required
                    />
                  </div>
                  <div className="flex flex-col">
                    <label htmlFor="price" className="text-sm font-medium mb-1">
                      Price
                    </label>
                    <input
                      type="number"
                      id="price"
                      name="price"
                      value={phone.price}
                      onChange={handleChange}
                      className="mt-1 p-2 border rounded-md"
                      required
                    />
                  </div>
                  <div className="flex flex-col">
                    <label
                      htmlFor="productQuantity"
                      className="text-sm font-medium mb-1"
                    >
                      Quantity
                    </label>
                    <input
                      type="number"
                      id="productQuantity"
                      name="productQuantity"
                      value={phone.productQuantity}
                      onChange={handleChange}
                      className="mt-1 p-2 border rounded-md"
                      required
                    />
                  </div>
                </div>
                <button
                  type="submit"
                  className="mt-6 w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600"
                >
                  Add Phone
                </button>
              </form>
            </div>
          ) : selectedDevice === "laptop" ? (
            <form
              onSubmit={handleSubmit}
              className="w-full max-w-3xl bg-white p-8 rounded-lg shadow-lg"
              style={{ marginTop: "-30px" }}
            >
              <h2 className="text-2xl font-bold text-center mb-6">
                <u>Add New Laptop</u>
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex flex-col">
                  <label
                    htmlFor="brandName"
                    className="text-sm font-medium mb-1"
                  >
                    Brand Name
                  </label>
                  <input
                    type="text"
                    id="brandName"
                    name="brandName"
                    value={phone.brandName}
                    onChange={handleChange}
                    className="mt-1 p-2 border rounded-md"
                    required
                  />
                </div>
                <div className="flex flex-col">
                  <label
                    htmlFor="modelName"
                    className="text-sm font-medium mb-1"
                  >
                    Model Name
                  </label>
                  <input
                    type="text"
                    id="modelName"
                    name="modelName"
                    value={phone.modelName}
                    onChange={handleChange}
                    className="mt-1 p-2 border rounded-md"
                    required
                  />
                </div>
                <div className="flex flex-col">
                  <label
                    htmlFor="fileInput"
                    className="text-sm font-medium mb-1"
                  >
                    Image
                  </label>
                  <input
                    type="file"
                    id="fileInput"
                    name="image"
                    onChange={handleFileChange}
                    accept="image/*"
                    className="mt-1 p-2 border rounded-md"
                    required
                  />
                </div>
                <div className="flex flex-col">
                  <label
                    htmlFor="processor"
                    className="text-sm font-medium mb-1"
                  >
                    processor
                  </label>
                  <input
                    type="text"
                    id="processor"
                    name="processor"
                    value={phone.processor}
                    onChange={handleChange}
                    className="mt-1 p-2 border rounded-md"
                    required
                  />
                </div>
                <div className="flex flex-col">
                  <label htmlFor="windows" className="text-sm font-medium mb-1">
                    Windows
                  </label>
                  <input
                    type="text"
                    id="windows"
                    name="windows"
                    value={phone.windows}
                    onChange={handleChange}
                    className="mt-1 p-2 border rounded-md"
                    required
                  />
                </div>
                <div className="flex flex-col">
                  <label htmlFor="battery" className="text-sm font-medium mb-1">
                    Battery
                  </label>
                  <input
                    type="text"
                    id="battery"
                    name="battery"
                    value={phone.battery}
                    onChange={handleChange}
                    className="mt-1 p-2 border rounded-md"
                    required
                  />
                </div>

                <div className="flex flex-col">
                  <label
                    htmlFor="warranty"
                    className="text-sm font-medium mb-1"
                  >
                    Warranty
                  </label>
                  <input
                    type="text"
                    id="warranty"
                    name="warranty"
                    value={phone.warranty}
                    onChange={handleChange}
                    className="mt-1 p-2 border rounded-md"
                    required
                  />
                </div>

                <div className="flex flex-col">
                  <label htmlFor="price" className="text-sm font-medium mb-1">
                    Price
                  </label>
                  <input
                    type="number"
                    id="price"
                    name="price"
                    value={phone.price}
                    onChange={handleChange}
                    className="mt-1 p-2 border rounded-md"
                    required
                  />
                </div>
                <div className="flex flex-col">
                  <label
                    htmlFor="productQuantity"
                    className="text-sm font-medium mb-1"
                  >
                    Quantity
                  </label>
                  <input
                    type="number"
                    id="productQuantity"
                    name="productQuantity"
                    value={phone.productQuantity}
                    onChange={handleChange}
                    className="mt-1 p-2 border rounded-md"
                    required
                  />
                </div>
              </div>
              <button
                type="submit"
                className="mt-6 w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600"
              >
                Add Laptop
              </button>
            </form>
          ) : null}
        </div>
      ) : (
        <div className="min-h-screen bg-gradient-to-br from-blue-10 via-indigo-200 to-indigo-300">
          <div className="mb-8 flex justify-center">
            <div
              className={
                "relative w-full max-w-md transition-all duration-300 ease-in-out mt-8 "
              }
            >
              <input
                type="text"
                placeholder="Search niches..."
                value={search}
                onChange={handleChangeSearch}
                className="pl-10 pr-4 py-2 w-full rounded-full border-2 border-primary transition-all duration-300 ease-in-out"
              />
              <Search
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-primary"
                size={20}
              />
              <div
                className={
                  "absolute inset-0 -z-10 bg-primary opacity-10 blur-md rounded-full transition-all duration-300 ease-in-out"
                }
              ></div>
            </div>
          </div>
          <div
            className="flex flex-wrap justify-start"
            style={{ marginLeft: "150px", marginTop: "-5px" }}
          >
            <div
              className="bg-gray-300 p-6 rounded-lg shadow-lg"
              style={{
                height: "150px",
                width: "100px",
                marginLeft: "-100px",
                marginTop: "80px",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <h3 className="text-lg font-bold text-gray-700 mb-4">Select Device:</h3>
              <label className="flex items-center mb-2">
                <input
                  type="radio"
                  name="device"
                  value="mobile"
                  checked={selectedDevice === "mobile"}
                  onChange={handleCheckboxChange}
                  className="mr-2"
                />
                <span className="text-gray-600">Mobile</span>
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  name="device"
                  value="laptop"
                  checked={selectedDevice === "laptop"}
                  onChange={handleCheckboxChange}
                  className="mr-2"
                />
                <span className="text-gray-600">Laptop</span>
              </label>
            </div>

           
            {userProducts && userProducts.length > 0 ? (
              userProducts.map((product) => (
                <div key={product._id} style={{ padding: "5px" }}>
                  <UserProduct userProduct={product} checkBoxState={selectedDevice} />
                </div>
              ))
            ) : (
              <p>No products available</p>
            )}
          </div>
          <div>
              {selectedDevice === "" && <div><h1 style={{marginLeft:"650px", marginTop:"-50px",fontSize:"30px"}}>Please Select Product</h1></div>}
            </div>
        </div>
      )}
    </div>
  );
};

export default Mobile;
