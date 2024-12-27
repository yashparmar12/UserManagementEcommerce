// import React, { useEffect, useState } from 'react'
// import Login from '../Login/Login';

// const Logout = () => {

    // const [Authenticated, setAuthenticated] = useState(null);


    // const logoutPerform = async () => {
    //     try {
    //         const response = await fetch("http://localhost:8000/api/user/logout", {
    //             method: "GET",
    //             headers: {
    //                 "Content-Type": "application/json",
    //             }, credentials: "include", // Send cookies along with the request
    //         });


    //         const responseData = await response.json();
    //         console.log(responseData);

    //         if (responseData.success) {
    //             setAuthenticated(true);
    //         } else {
    //             setAuthenticated(false);
    //         }
    //     } catch (error) {
    //         console.log(error);
    //     };
    // }
    // useEffect(() => {
    //     logoutPerform();
    // }, []); 

//     return (
//         <div>
//             {/* {Authenticated ? <Login/>: <h1>Sorry not logout</h1>} */}
//         </div>
//     )
// }

// export default Logout;