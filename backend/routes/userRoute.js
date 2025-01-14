import express from 'express';
import Authenticated from '../middleware/Authenticate.js';

import {login, register, userData, forgetPassword, updateProfile, 
    allUserData, userDataById, deleteUser, dummyData, documentDownloadPdf, 
    documentDownloadCsv, task, showTask, taskDuration, uploadPhoto, searchData, 
    deleteDuplicateEmails, Pagination, addHeadphone, viewTask, getProductByCategory,addMobile, searchProduct, addToCart, checkOut,deleteSpecificProductInCart,ord} from '../controller/userController.js';

import multer from 'multer'
const upload = multer({ dest: 'upload/' })

const router = express.Router();

router.route("/register").post(register);
router.route("/login").post(login);
// router.route("/user-login").post(Authenticated,login);
// router.route("/logout").get(logout);
// router.route('/userData').get(Authenticated, userData);
router.route('/userData').get(Authenticated, (req,res) => {
    userData(req, res, req.app.io);
});

router.route('/userData/:userId').get(userDataById);
router.route("/allUsers").get(allUserData);
router.route("/updateProfile").post(Authenticated, upload.single('photo'), updateProfile);
router.route('/updatePassword').post(forgetPassword);
router.route('/delete').delete(deleteUser);
router.route('/searchData').post(searchData);
router.route('/dummyData').post(dummyData);
router.route('/pdfDownload').post(documentDownloadPdf);
router.route('/csvDownload').post(documentDownloadCsv);

router.route('/task').post(task);


// router.route('/task').post((req, res) => {
//     task(req, res, req.app.io);
// })

router.route('/showTask').get(showTask);
router.route('/taskDuration').post(taskDuration);
router.route('/deleteDuplicateEmails').delete(deleteDuplicateEmails);
// router.route('/nextPagination').get(nextPagination);
router.route('/Pagination').get(Pagination);

router.route('/addMobileProduct').post(upload.single('image'),addMobile);
router.route('/addHeadPhoneProduct').post(upload.single('image'),addHeadphone);

router.route('/products/:category').get(Authenticated,getProductByCategory);
// router.route('/productsss').get(Authenticated,getProductByCategory);

router.route('/searchProduct').post(searchProduct);
router.route('/addToCart/:id').post(Authenticated,addToCart);
router.route('/checkOut').post(Authenticated,checkOut);
router.route('/cart/:productId').delete(Authenticated,deleteSpecificProductInCart);
// router.route('/resetCount').get(viewTask);
router.route('/ord').delete(ord);





export default router;