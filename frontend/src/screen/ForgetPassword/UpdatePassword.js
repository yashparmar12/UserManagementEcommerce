import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom';

const Login = () => {

    const navigate = useNavigate();

    const [data, setData] = useState({
        email: "",
        password: "",
        confirmPassword: ""
    })

    const [validation, setValidation] = useState({
        email: "",
        password: "",
        confirmPassword: ""
    })

    const handleChange = (e) => {
        setData((prev) => ({
            ...prev,
            [e.target.name]: e.target.value
        }));
    }

    const valid = () => {
        const newErrors = {};

        const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;

        if (!data.email) {
            newErrors.email = "Email is required";
        } else if (!emailPattern.test(data.email)) {
            newErrors.email = "Invalid email format";  
        }

        if (!data.password) {
            newErrors.password = "Password is required";
        }

        if (!data.confirmPassword) {
            newErrors.confirmPassword = "Confirm Password is required";
        } else if (data.password !== data.confirmPassword) {
            newErrors.confirmPassword = "Passwords do not match"; 
        }

        setValidation(newErrors);
        return Object.keys(newErrors).length === 0;
    }

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!valid()) {
            return;
        }

        // const response = await fetch("https://usermanagementecommerce-1.onrender.com/api/user/updatePassword", {
        const response = await fetch("http://localhost:8000/api/user/updatePassword", {
        // const response = await fetch("https://usertasks-mj4d.onrender.com/api/user/updatePassword", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
        });

        const responseData = await response.json();

        if (responseData.success) {
            navigate("/login");
            alert("Password Updated")
        } else {
            alert("Sorry, something went wrong. Try again.")
        }
    }

    return (
        <div>
            <div className="flex flex-col justify-center items-center font-[sans-serif] sm:h-screen p-4">
                <div className="max-w-md w-full mx-auto border border-gray-300 rounded-2xl p-8">
                    <form onSubmit={handleSubmit} className="flex flex-col items-center space-y-6">
                        <div className="w-full">
                            <label className="text-gray-800 text-sm mb-2 ml-10 block">Email Id</label>
                            <input
                                name="email"
                                type="email"
                                value={data.email}
                                onChange={handleChange}
                                className="text-gray-800 bg-white border border-gray-300 w-full text-sm px-4 py-3 rounded-md outline-blue-500 ml-10"
                                placeholder="Enter email"
                            />
                            {validation.email && <span className="text-red-500 ml-12" style={{ fontSize: '0.65rem' }}>{validation.email}</span>} {/* Error message here */}
                        </div>

                        <div className="w-full">
                            <label className="text-gray-800 text-sm mb-2 ml-10 block">Password</label>
                            <input
                                name="password"
                                type="password"
                                value={data.password}
                                onChange={handleChange}
                                className="text-gray-800 bg-white border border-gray-300 w-full text-sm px-4 py-3 rounded-md outline-blue-500 ml-10"
                                placeholder="Enter password"
                            />
                            {validation.password && <span className="text-red-500 ml-12" style={{ fontSize: '0.65rem' }}>{validation.password}</span>} {/* Error message here */}
                        </div>

                        <div className="w-full">
                            <label className="text-gray-800 text-sm mb-2 ml-10 block">Confirm Password</label>
                            <input
                                name="confirmPassword"
                                type="password"
                                value={data.confirmPassword}
                                onChange={handleChange}
                                className="text-gray-800 bg-white border border-gray-300 w-full text-sm px-4 py-3 rounded-md outline-blue-500 ml-10"
                                placeholder="Enter confirm password"
                            />
                            {validation.confirmPassword && <span className="text-red-500 ml-12" style={{ fontSize: '0.65rem' }}>{validation.confirmPassword}</span>} {/* Error message here */}
                        </div>

                        <div className="w-full !mt-6 ">
                            <button
                                type="submit"
                                className="w-full py-3 px-4 text-sm tracking-wider font-semibold rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none ml-10"
                            >
                                Change Password
                            </button>
                        </div>
                        <p className="text-gray-800 text-sm mt-6 text-center ml-11">
                            Already have an account?
                            <Link to="/login" className="text-blue-600 font-semibold hover:underline ml-1">
                                Login here
                            </Link>
                        </p>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default Login;
