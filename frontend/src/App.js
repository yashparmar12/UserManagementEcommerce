import './App.css';
import Register from './screen/Registration/Register';
import Login from './screen/Login/Login';
import UpdatePassword from "./screen/ForgetPassword/UpdatePassword"

import { createBrowserRouter, RouterProvider} from "react-router-dom";
import UserData from './screen/User/UserData';
import UserName from './screen/User/UserName';
import Layout from './screen/NavItem/Layout';
import UpdateProfile from './screen/User/UpdateProfile';
import Tasks from './screen/Task/Tasks';
import ShowAllTask from './screen/Task/ShowAllTask';
import UserMessages from './screen/User/UserMessages';
import HomePage from './screen/Home/HomePage';
import Products from './screen/Products/Products';
import Orders from './screen/Products/Orders';
import Cart from './screen/Products/Cart';
import Mobile from './screen/Products/Mobile';
import HeadPhone from './screen/Products/HeadPhone';


const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />, 
    children: [
      
      {
        path: "userHome",
        element: <UserName />,
      },
      {
        path: "userData",
        element: <UserData />,
      },
      {
        path: "userMessages",
        element: <UserMessages />,
      },
      {
        path: "tasks",
        element: <Tasks />,
      },
      {
        path: "allTasks",
        element: <ShowAllTask />,
      },
      {
        path: "userData/:userId",
        element: <UserData />,
      },
      
      {
        path: "updateProfile",
        element: <UpdateProfile />,
      },
      // {
      //   path: "/Products",
      //   element: <Products />,
      // },
      {
        path: "Products",
        element: <Mobile />,
      },
      // {
      //   path: "/Products/Mobile",
      //   element: <Mobile />,
      // },
      // {
      //   path: "/Products/Headphone",
      //   element: <HeadPhone />,
      // },
      {
        path: "/Cart",
        element: <Cart />,
      },
      {
        path: "/Orders",
        element: <Orders />,
      },
      // {
      //   path: "/product",
      //   element: <Product />,
      // },
    ],
  },
  {
    path: "/home",
    element: <HomePage />,
  },
  
  {
    path: "/register",
    element: <Register />,
  },
  {
    path: "/login",
    element: <Login />,
  },
     
  {
    path: "/updatePassword",
    element: <UpdatePassword />,
  },    
],

{
  future: {
    v7_relativeSplatPath: true,
    v7_startTransition:true
  },
}

);

function App() {
  return (
    <RouterProvider router={router} />
  );
}

export default App;

