import { userAdminModel } from "../models/userAdmin.js";
import { productsModel } from "../models/productModel.js";
import { razorpayModel } from "../models/razorpayModel.js";
import SECRET_KEY from "../jwtKey.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { dummy } from "./dummy.js";
import { v2 as cloudinary } from "cloudinary";
import PDFDocument from "pdfkit";
import { parse } from "json2csv";
import mongoose from "mongoose";

export const register = async (req, res) => {
  const {
    fullname,
    email,
    address,
    phoneNumber,
    city,
    country,
    password,
    confirmPassword,
    role,
  } = req.body;
  try {
    if (
      !fullname ||
      !email ||
      !address ||
      !phoneNumber ||
      !city ||
      !country ||
      !password ||
      !confirmPassword
    ) {
      return res.status(400).json({
        message: "Something is missing",
        success: false,
      });
    }

    const user = await userAdminModel.findOne({ email });
    if (user) {
      return res.status(400).json({
        message: "User already exist with this email",
        success: false,
      });
    }

    const newPassword = password === confirmPassword;
    if (!newPassword) {
      return res.status(400).json({
        message: "Password is not matching",
        success: false,
      });
    }

    const hashPassword = await bcrypt.hash(password, 10);

    const userCreate = new userAdminModel({
      fullname,
      email,
      address,
      phoneNumber,
      city,
      country,
      password: hashPassword,
      role,
    });

    userCreate.save();

    res.status(201).json({
      message: "Account created successfully",
      success: true,
      user: userCreate,
    });
  } catch (error) {
    console.log(error);
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;
  console.log(email);
  try {
    if (!email || !password) {
      return res.status(400).json({
        message: "Something is missing",
        success: false,
      });
    }

    let user = await userAdminModel.findOne({ email });

    if (!user) {
      return res.status(400).json({
        message: "Incorrect email",
        success: false,
      });
    }

    const isPasswordMatch = await bcrypt.compare(password, user.password);

    if (!isPasswordMatch) {
      return res.status(400).json({
        message: "Incorrect password",
        success: false,
      });
    }

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      SECRET_KEY,
      { expiresIn: "1d" }
    );

    if (user.products && user.products.length > 0) {
      const prod = await productsModel.find({ _id: { $in: user.products } }); //in se sari id ek sath find kr sakte h without in ke ek ek krke krna padegi forloop se
      return res
        .status(200)
        .json({
          message: "Login successfully",
          user,
          prod,
          success: true,
          token,
        });
    }

    return res
      .status(200)
      .json({ message: "Login successfully", user, success: true, token });
  } catch (error) {
    console.log(error);
  }
};

export const userData = async (req, res) => {
  try {
    const userId = req.id;
    let userData = await userAdminModel.findById(userId);

    if (!userData) {
      return res.status(400).json({
        message: "User not found",
        success: false,
      });
    }

    if (userData.role === "admin") {
      let allUsers = await userAdminModel.find().limit(20);
      let allUsersLen = await userAdminModel.find();

      let allUsersWithOrder = [];
      console.log(allUsersLen[0])
      for (let i = 0; i < allUsersLen.length; i++) {
        if (allUsersLen[i].orders.length > 0) {
          let specificUsersWithOrder = {
            user: allUsersLen[i], 
            products: [], 
          };

          let orderIds = allUsersLen[i].orders;

          for (let item of orderIds) {
            const productId = item.product._id;
            const orders = await productsModel.findById(productId); // Fetch product manually
            console.log(orders);
            if (orders) {
              specificUsersWithOrder.products.push({
                modelName: orders.modelName || "N/A",
                ram: orders.ram || "N/A",
                memory: orders.memory || "N/A",
                displaySize: orders.displaySize || "N/A",
                price: orders.price || 0,
                quantity: item.quantity || 0, // Add quantity from the order
              });
            }
          }
          

          allUsersWithOrder.push(specificUsersWithOrder);
        }
      }
      console.log(allUsersWithOrder);

      return res.status(200).json({
        message: "All Users data fetched successfully",
        user: allUsers,
        adminuser: userData,
        userLen: allUsersLen,
        userAndOrder: allUsersWithOrder,
        success: true,
      });
    }
    let products = await productsModel.find();
    let cartItems = [];
    for (let item of userData.cart) {
      const product = await productsModel.findById(item.product._id); 
      if (product) {
        cartItems.push({
          product,
          quantity: item.quantity,
        });
      }
    }
    return res.status(200).json({
      message: "User data fetched successfully",
      user: userData,
      userProducts: products,
      cartItem: cartItems,
      success: true,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Internal server error",
      success: false,
    });
  }
};

export const userDataById = async (req, res) => {
  try {
    const paramsId = req.params.userId;

    let userData = await userAdminModel.findById(paramsId);

    if (!userData) {
      return res.status(400).json({
        message: "User not found",
        success: false,
      });
    }

    return res.status(200).json({
      message: "User data fetched successfully",
      user: userData,
      success: true,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Internal server error",
      success: false,
    });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const userId = req.id;
    const { fullname, address, city, country, phoneNumber } = req.body;
    let user = await userAdminModel.findById(userId);

    if (!user) {
      return res
        .status(400)
        .json({ message: "User not found", success: false });
    }

    if (req.file) {
      cloudinary.config({
        cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
        api_key: process.env.CLOUDINARY_API_KEY,
        api_secret: process.env.CLOUDINARY_SECRET_KEY,
      });

      const result = await cloudinary.uploader.upload(req.file.path);
      user.image = result.secure_url;
    }

    user.fullname = fullname || user.fullname;
    user.address = address || user.address;
    user.city = city || user.city;
    user.country = country || user.country;
    user.phoneNumber = phoneNumber || user.phoneNumber;

    await user.save();

    return res.status(200).json({
      message: "Profile updated successfully",
      success: true,
      user: {
        fullname: user.fullname,
        email: user.email,
        address: user.address,
        city: user.city,
        country: user.country,
        phoneNumber: user.phoneNumber,
        // photo: user.photo?.image,
        image: user.image,
      },
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Internal server error",
      success: false,
    });
  }
};

export const allUserData = async (req, res) => {
  try {
    let userData = await userAdminModel.find();

    if (!userData) {
      return res.status(400).json({
        message: "User not found",
        success: false,
      });
    }

    return res.status(200).json({
      message: "User data fetched successfully",
      user: userData,
      success: true,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Internal server error",
      success: false,
    });
  }
};

export const forgetPassword = async (req, res) => {
  const { email, password, confirmPassword } = req.body;
  try {
    let user = await userAdminModel.findOne({ email });
    if (!user) {
      return res.status(400).json({
        message: "Incorrect email",
        success: false,
      });
    }

    const newPassword = password === confirmPassword;
    if (!newPassword) {
      return res.status(400).json({
        message: "Password is not matching",
        success: false,
      });
    }

    user.password = await bcrypt.hash(password, 10);
    await user.save();

    res.status(200).json({
      message: "Password update successfully",
      success: true,
    });
  } catch (error) {
    console.log(error);
  }
};

export const uploadPhoto = async (req, res) => {
  const id = req.id;
  try {
    cloudinary.uploader.upload(req.file.path, function (error, result) {
      if (error) {
        console.log(error);
        return res.status(500).json({
          success: false,
          message: "Error",
        });
      }
      userAdminModel.findByIdAndUpdate(
        id,
        {
          photo: {
            image: result.secure_url,
            publicId: result.public_id,
          },
        },
        {
          new: true,
        }
      );

      res.status(200).json({
        success: true,
        message: "uploaded",
        // data: userPhoto,
      });
    });
  } catch (error) {
    console.log(error);
  }
};

export const deleteUser = async (req, res) => {
  const { ids } = req.body;
  try {
    const deleteUsers = await userAdminModel.deleteMany({
      _id: { $in: ids },
      role: { $ne: "admin" },
    });

    if (deleteUsers) {
      res.status(200).json({ message: "Users deleted successfully" });
    }
  } catch (error) {
    console.log(error);
  }
};

export const dummyData = async (req, res) => {
  try {
    const ans = await userAdminModel.insertMany(dummy);

    if (ans) {
      res.status(200).json({ message: "Data inserted successfully" });
    } else {
      res.status(500).json({ message: "not able to" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error inserting data" });
  }
};

export const searchData = async (req, res) => {
  try {
    const { searchInput } = req.body;
    if (!searchInput) {
      return res.status(400).json({
        message: "Search input is empty",
        success: false,
      });
    }

    const users = await userAdminModel.aggregate([
      {
        $match: {
          $or: [
            {
              fullname: {
                $regex: `^${searchInput}`,
                $options: "i",
              },
            },
            {
              city: {
                $regex: `^${searchInput}`,
                $options: "i",
              },
            },
            {
              country: {
                $regex: `^${searchInput}`,
                $options: "i",
              },
            },
          ],
        },
      },
    ]);

    if (!users) {
      return res.status(400).json({
        message: "Not able to fetch search data",
        success: false,
      });
    }
    if (users) {
      res.status(200).json({
        message: "Users fetched successfully",
        userData: users,
      });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Internal server error",
      success: false,
    });
  }
};

export const task = async (req, res) => {
  try {
    const { ids, content } = req.body;

    if (!content) {
      console.log("No Content Here");
    }

    if (ids && ids.length > 0) {
      await userAdminModel.updateMany(
        // { _id: { $in: ids } },
        { _id: ids },
        { $push: { content: { $each: content } } }
      );
    } else {
      await userAdminModel.updateMany(
        { role: "user" },
        { $push: { content: { $each: content } } }
      );
    }

    res.status(200).json({
      message: "Content shared with all users",
      success: true,
      // data: savedContent
    });
  } catch (error) {
    console.log(error);
  }
};

export const taskDuration = async (req, res) => {
  try {
    const { task, userId } = req.body;

    if (!task || !task.taskId || !userId) {
      return res.status(400).json({ message: "Invalid task or user data" });
    }

    if (!task.startTime || !task.endTime) {
      return res
        .status(400)
        .json({ message: "Start time or end time missing" });
    }

    const user = await userAdminModel.findOne({
      _id: userId,
      "content._id": task.taskId,
    });

    if (!user) {
      return res.status(404).json({ message: "User or task not found" });
    }

    const startTime = new Date(task.startTime);
    const endTime = new Date(task.endTime);
    const totalMilliseconds = endTime - startTime;

    if (totalMilliseconds <= 0) {
      return res.status(400).json({ message: "Invalid time range" });
    }

    const totalMinutes = Math.floor(totalMilliseconds / (1000 * 60));
    const days = Math.floor(totalMinutes / (60 * 24));
    const hours = Math.floor((totalMinutes % (60 * 24)) / 60);
    const minutes = totalMinutes % 60;

    const formattedTime = `${days}d ${hours}h ${minutes}m`;

    const updatedTask = await userAdminModel.findOneAndUpdate(
      { _id: userId, "content._id": task.taskId },
      {
        $set: {
          "content.$.startTime": task.startTime,
          "content.$.endTime": task.endTime,
          "content.$.totalTime": formattedTime,
        },
      },
      { new: true }
    );

    if (!updatedTask) {
      return res.status(500).json({ message: "Failed to update task" });
    }

    res.status(200).json({
      message: "Task duration updated successfully",
      success: true,
      data: formattedTime,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const showTask = async (req, res) => {
  try {
    const { content } = req.body;

    if (!content) {
      console.log("No Content Here");
    }

    const savedContent = await userAdminModel.find(
      { role: "user" },
      { _id: 0, content: 1, fullname: 1 }
    );

    res.status(200).json({
      message: "Content Retrive Successfully",
      success: true,
      savedTask: savedContent,
    });
  } catch (error) {
    console.log(error);
  }
};

export const documentDownloadPdf = async (req, res) => {
  const users = req.body.userInfo;

  try {
    const doc = new PDFDocument();

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", "attachment; filename=users.pdf");

    doc.pipe(res);

    doc.fontSize(18).text("User Details", { align: "center" }).moveDown(2);

    const startX = 50;
    const startY = 100;
    const columnWidths = [40, 120, 150, 80, 70, 70];
    const rowHeight = 30;
    const pageHeight = doc.page.height - 50;
    const headers = ["S.No", "Name", "Email", "City", "Country", "Role"];

    let y = startY;
    let x = startX;

    const drawTableHeader = () => {
      x = startX;
      headers.forEach((header, i) => {
        doc.rect(x, y, columnWidths[i], rowHeight).stroke();
        doc
          .font("Helvetica-Bold")
          .fontSize(10)
          .text(header, x, y + 8, {
            width: columnWidths[i] - 10,
            align: "center",
          });
        x += columnWidths[i];
      });
    };

    drawTableHeader();

    users.forEach((user, index) => {
      y += rowHeight;

      if (y + rowHeight > pageHeight) {
        doc.addPage();
        y = startY;
        drawTableHeader();
        y += rowHeight;
      }

      x = startX;

      const rowData = [
        index + 1, // S.No
        user.fullname,
        user.email,
        user.city,
        user.country,
        user.role,
      ];

      rowData.forEach((data, i) => {
        doc.rect(x, y, columnWidths[i], rowHeight).stroke();
        doc
          .font("Helvetica")
          .fontSize(10)
          .text(data.toString(), x, y + 8, {
            width: columnWidths[i] - 10,
            align: "center",
            continued: false,
          });
        x += columnWidths[i];
      });
    });

    doc.end();
  } catch (error) {
    console.log(error);
    res.status(500).send({ error: "Failed to generate PDF." });
  }
};

export const documentDownloadCsv = async (req, res) => {
  const users = req.body.userInfo;
  try {
    const excludeFields = ["password", "__v"];

    const filteredUsers = users.map((user) => {
      const newUser = {};
      for (let key in user) {
        if (!excludeFields.includes(key)) {
          newUser[key] = user[key];
        }
      }
      return newUser;
    });

    const csv = parse(filteredUsers);

    res.setHeader("Content-Type", "text/csv");
    res.setHeader("Content-Disposition", "attachment; filename=users.csv");

    res.send(csv);
  } catch (error) {
    console.log(error);
  }
};

export const deleteDuplicateEmails = async (req, res) => {
  try {
    const duplicateEmails = await userAdminModel.aggregate([
      {
        $group: {
          _id: "$email", //it stores email id and it groups of same emails
          // [
          //   { "_id": 1, "email": "test@example.com" },
          //   { "_id": 2, "email": "test@example.com" },
          //   { "_id": 3, "email": "hello@example.com" },
          //   { "_id": 4, "email": "hello@example.com" }
          // ]

          ids: { $push: "$_id" }, //it stores same email multiple id
          // [
          //   { "_id": "test@example.com", "ids": [1, 2] },
          //   { "_id": "hello@example.com", "ids": [3, 4] }
          // ]

          count: { $sum: 1 },
        },
      },
      {
        $match: { count: { $gt: 1 } },
      },
    ]);

    for (let doc of duplicateEmails) {
      doc.ids.shift();
      await userAdminModel.deleteMany({ _id: { $in: doc.ids } });
    }

    res.status(200).json({
      message: "Duplicate Emails Deleted Successfully",
      success: true,
    });
  } catch (error) {
    console.log(error);
  }
};

export const nextPagination = async (req, res) => {
  try {
    const page = parseInt(req.query.page);
    const limit = 20;
    // const skip = (page - 1) * limit;

    // const users = await userAdminModel.find().skip(skip).limit(limit);

    const firstIndex = (page - 1) * limit;
    const lastIndex = firstIndex + limit;

    const users = await userAdminModel.find().limit(lastIndex);
    const paginatedUsers = users.slice(firstIndex, lastIndex);

    return res.status(200).json({
      success: true,
      user: paginatedUsers,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

export const Pagination = async (req, res) => {
  try {
    const page = parseInt(req.query.page);
    const limit = 20;

    if (page <= 0) {
      return res.status(400).json({
        success: false,
        message: "Invalid",
      });
    }

    const firstIndex = (page - 1) * limit;
    const lastIndex = firstIndex + limit;

    // const users = await userAdminModel.find().limit(lastIndex);
    const users = await userAdminModel.find();
    const paginatedUsers = users.slice(firstIndex, lastIndex);

    return res.status(200).json({
      success: true,
      user: paginatedUsers,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

export const addProducts = async (req, res) => {
  try {
    const { brandName, modelName,ram,memory,battery,frontCamera,backCamera,simType,displaySize,price,productQuantity} = req.body;
    
    let imageUpdate;
    if (req.file) {
      cloudinary.config({
        cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
        api_key: process.env.CLOUDINARY_API_KEY,
        api_secret: process.env.CLOUDINARY_SECRET_KEY,
      });

      const result = await cloudinary.uploader.upload(req.file.path);
      imageUpdate = result.secure_url;
    }

    const productSave={
      brandName,
      modelName,
      ram,
      memory,
      battery,
      frontCamera,
      backCamera,
      simType,
      displaySize,
      price,
      productQuantity,
      image:imageUpdate
    };

    const insetIntoProductModel = await productsModel.insertMany([productSave]);
    const productsObjectId = insetIntoProductModel.map(
      (product) => product._id
    );

    const userproducts = await userAdminModel.updateMany(
      { role: "user" },
      { $push: { products: { $each: productsObjectId } } }
    );

    return res.status(200).json({
      message: "User products add successfully",
      products: userproducts,
      success: true,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Internal server error",
      success: false,
    });
  }
};

export const searchProduct = async (req, res) => {
  try {
    const { searchInput } = req.body;
    if (!searchInput) {
      return res.status(400).json({
        message: "Search input is empty",
        success: false,
      });
    }

    const users = await productsModel.aggregate([
      {
        $match: {
          $or: [
            {
              modelName: {
                $regex: `^${searchInput}`,
                $options: "i",
              },
            },
            {
              price: {
                $eq: Number(searchInput),
              },
            },
            {
              brandName: {
                $regex: `^${searchInput}`,
                $options: "i",
              },
            },
          ],
        },
      },
    ]);

    if (!users) {
      return res.status(400).json({
        message: "Not able to fetch search data",
        success: false,
      });
    }
    if (users) {
      res.status(200).json({
        message: "Users fetched successfully",
        userProduct: users,
      });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Internal server error",
      success: false,
    });
  }
};

export const addToCart = async (req, res) => {
  try {
    const userId = req.id;
    const productId = req.params.id;

    if (!productId) {
      return res.status(400).json({
        message: "ProductId not found",
        success: false,
      });
    }

    const product = await userAdminModel.updateOne(
      { _id: userId },
      { $push: { cart: {product: productId} } }
    );
   

    return res.status(200).json({
      message: "User products add successfully",
      productById: product,
      success: true,
    });
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      message: "Internal server error",
      success: false,
    });
  }
};

export const checkOut = async (req, res) => {
  try {
    const { updatedProduct } = req.body;
    const userId = req.id;

    console.log(updatedProduct);
    console.log(userId);

    let isUpdated = false;

    for (const item of updatedProduct) {
      
      const productId = item.productId;
      const result = await userAdminModel.updateOne(
        { _id: userId },
        { $push: { orders: { product: productId, quantity: item.quantity } } },
        // { $pull: { cart: { product: productId } } }

      );

      if (result.nModified > 0) {
        isUpdated = true;
      }
    }

    if (isUpdated) {
      return res.status(200).json({ success: true, message: "Cart updated successfully" });
    } else {
      return res.status(400).json({ success: false, message: "No matching data found" });
    }
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const deleteSpecificProductInCart = async (req, res) => {
  try {
    const { productId } = req.params;
    const userId = req.id;
    
    if (!userId) {
      return res.status(400).json({
        message: "ProductId not found",
        success: false,
      });
    }

    const updatedUserCart = await userAdminModel.findByIdAndUpdate(
      {_id:userId},
      {$pull:{cart:{product:productId}}},
      {new:true}
    );
    
    if (!updatedUserCart) {
      return res.status(400).json({
        message: "Product not found",
        success: false,
      });
    }

    return res.status(200).json({
      message: "User products delete successfully",
      updatedUser: updatedUserCart.cart,
      success: true,
    });
  }catch (error) {  
    console.log(error);
  }

}




// import Razorpay from 'razorpay';

// const razorpayInstance = new Razorpay({
//   key_id:"",
//   key_secret:"",
// });

// export const createOrder = async(req,res) => {
//   const {productId, amount} = req.body;
//   const userId = req.id;
//   try {
//     const options = {
//       amount:amount*100,
//       currency:"INR",
//       receipt:`receipt_${Date.now()}`,
//     }

//     const razorpayOrder = await razorpayInstance.orders.create(options);

//     const order = new razorpayModel({
//       orderId:razorpayOrder.id,
//       amount:amount,
//       user: userId,
//       product:productId,
//     })

//     await order.save();
//     res.status(201).json({ success: true, order });

//   } catch (error) {
//     console.log(error);
//     res.status(500).json({ success: false, message: error.message });
//   }
// }
export const ord = async (req, res) => {
  try {
    await userAdminModel.updateMany({}, { $set: { products: [] } });
    // await productsModel.updateMany({});
    return res.status(200).json({
      message: "User products add successfully",
      success: true,
    });
  } catch (error) {
    console.log(error);
  }
};

// $match ka kaam documents ko filter karna hai jo user ki query ke saath match karein.
// $or ka matlab hai ki name ya city dono mein se koi ek match karna chahiye.
// $regex ka use pattern-matching ke liye kiya ja raha hai, jo text-based search karta hai.
// $options: "i" ka matlab hai ki search case-insensitive hai, uppercase ya lowercase ka farak nahi padta.
