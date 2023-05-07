const express = require("express");
const router = express.Router();
const { find_all_users, delete_user, find_user_by_email, find_user_details, make_admin, update_user, send_email } = require("../../../api/controllers/user");
const User = require("../../../api/models/User/User");
// const user_role_enum = require("../../enums/user_role_enum");

// User update only for user
router.patch('/user/update', update_user);

// Get all users only for admin
router.get('/users', find_all_users);

// find a user details by user email
router.get('/user/find-one', find_user_by_email);


// User details by accessToken
router.get('/user/details', find_user_details);

// Admin can make a user as an admin
router.post('/user-make/admin', make_admin);

// User delete only for admin
router.delete('/user/delete', delete_user);

// Send donor email
router.post('/donor/send-email', send_email);
router.post('/admin/send-email', send_email);

// verify user email
router.get('/user/verify-email', async (req, res) => {
    const { email } = req?.query;
    try {
        const update_user_res = await User.updateOne({ email: email }, { isVerified: true });
        console.log({ update_user_res });
        if (update_user_res?.modifiedCount) {
            return res.status(200).json({
                status: true,
                message: "Email verified successfully",
            });
        } else {
            return res.status(400).json({
                status: false,
                message: "Email not verified",
            });
        }

    } catch (error) {
        console.log({ error });
        res.status(500).json({
            status: false,
            message: error?.message || "Server error",
        });
    }
});

// Create user election

// User role create only for admin
// router.post('/user-role/create', async(req, res) => {
//     await authenticateJWT(req, res);
//     if(req?.auth){
//         if(req?.user?.user_role === "Admin" || req?.user?.user_role === "admin" || req?.user?.role_id === 30313){
//             try {
//                 const {role_id, name, slug} = req?.body;
//                 const already_exits_role = await UserRole.findOne({role_id});
//                 if(!already_exits_role?._doc?.role_id){
//                     // console.log("=====line:142:====", {already_exits_role});
//                     const user_role_body = {role_id, name};
//                     slug && (user_role_body.slug = slug);
//                     const newUserRole = new UserRole(user_role_body);
//                     const role_res = await newUserRole.save();
//                     // console.log({role_res});
//                     if(role_res){
//                         return res.status(200).json({
//                             status: true,
//                             message: "The user role is successfully created!!!",
//                             data: role_res?._doc,
//                         });
//                     }
//                     return res.status(403).json({
//                         status: false,
//                         message: "The user role isn't created!!!"
//                     })
//                 }
//                 return res.status(400).json({
//                     status: false,
//                     message: "The role is already exists by this role_id"
//                 })

//             } catch (error) {
//                 return res.status(404).json({
//                     status: false,
//                     message: error?.message || "Server error!!!"
//                 })
//             }
//         }
//         return res.status(400).json({
//             status: false,
//             message: "User isn't authorized to create user role!!!"
//         })
//     }
// });

// Get all user-roles only from frontend
// router.get('/user-role/admin/all', async(req, res) => {
//     await authenticateJWT(req, res);
//     if(req?.auth){
//         // const {email: auth_user_email} = req?.user;
//         if(req?.user?.user_role === "Admin" || req?.user?.user_role === "admin"){
//             try {
//                 const user_roles = await UserRole.find({})
//                                    .select("-_id role_id name slug");

//                 console.log("====246====",{user_role_length: user_roles?.length});
//                 if(user_roles?.length){
//                     return res.status(200).json({
//                         status: true,
//                         data: user_roles,
//                     })
//                 }
//                 return res.status(400).json({
//                     status: false,
//                     message: "There is no user role!!!"
//                 })

//             } catch (error) {
//                 return res.status(404).json({
//                     status: false,
//                     message: error?.message || "Server error!!!"
//                 })
//             }
//         }
//         return res.status(400).json({
//             status: false,
//             message: "User isn't authorized to to find user!!!"
//         })
//     }

// });

//  Get all user-roles only for admin
// router.get('/user-role/all', async(req, res) => {
//     try {
//         const user_roles = await UserRole.find({name: {$nin: ["Admin", "admin"]}})
//                            .select("-_id role_id name slug");

//         console.log("====284====",{user_role_length: user_roles?.length});
//         if(user_roles?.length){
//             return res.status(200).json({
//                 status: true,
//                 data: user_roles,
//             })
//         }
//         return res.status(400).json({
//             status: false,
//             message: "There is no user role!!!"
//         })
//     } catch (error) {
//         return res.status(404).json({
//             status: false,
//             message: error?.message || "Server error!!!"
//         })
//     }
// });
// find user_role by user role_id for admin
// router.get('/user-role/find-one', async(req, res) => {
//     await authenticateJWT(req, res);
//     if(req?.auth){
//         if(req?.user?.user_role === "Admin" || req?.user?.user_role === "admin"){
//             try {
//                 let {role_id} = req?.query;
//                 const user_role = await UserRole.findOne({role_id})
//                                 .select("_id role_id name slug");

//                 if(user_role){
//                     return res.status(200).json({
//                         status: true,
//                         data: user_role,
//                     })
//                 }
//                 return res.status(400).json({
//                     status: false,
//                     message: "There is no user role by this role_id!!!"
//                 })

//             } catch (error) {
//                 return res.status(404).json({
//                     status: false,
//                     message: error?.message || "Server error!!!"
//                 })
//             }
//         }
//         return res.status(400).json({
//             status: false,
//             message: "User isn't authorized to to find user role!!!"
//         })
//     }
// });

// User role update only for admin
// router.post('/user-role/update', async(req, res) => {
//     await authenticateJWT(req, res);
//     if(req?.auth){
//         if(req?.user?.user_role === "Admin" || req?.user?.user_role === "admin"){
//         // if(user_role_res?.name === "Admin" || user_role_res?.name === "admin"){
//             try {
//                 const {role_id, name, slug} = req?.body;
//                 const already_exits_role = await UserRole.findOne({role_id});
//                 if(already_exits_role?._doc?.role_id){
//                     // console.log("=====line:142:====", {already_exits_role});
//                     const user_role_body = {role_id, name};
//                     slug && (user_role_body.slug = slug);
//                     const role_res = await UserRole.updateOne({role_id}, user_role_body);
//                     // console.log({role_res});
//                     if(role_res){
//                         return res.status(200).json({
//                             status: true,
//                             message: "The user role is successfully updated!!!",
//                             data: role_res?._doc,
//                         });
//                     }
//                     return res.status(403).json({
//                         status: false,
//                         message: "The user role isn't created!!!"
//                     })
//                 }
//                 return res.status(400).json({
//                     status: false,
//                     message: "The role isn't exists to update by this role_id"
//                 })

//             } catch (error) {
//                 return res.status(404).json({
//                     status: false,
//                     message: error?.message || "Server error!!!"
//                 })
//             }
//         }
//         return res.status(400).json({
//             status: false,
//             message: "User isn't authorized to update user role!!!"
//         })
//     }
// });

// User role update only for admin
// router.delete('/user-role/delete', async(req, res) => {
//     await authenticateJWT(req, res);
//     if(req?.auth){
//         if(req?.user?.user_role === "Admin" || req?.user?.user_role === "admin"){
//         // if(user_role_res?.name === "Admin" || user_role_res?.name === "admin"){
//             try {
//                 let {role_id} = req?.body;
//                 if(!role_id){
//                     role_id = req?.params?.role_id; 
//                 }
//                 if(!role_id){
//                     role_id = req?.query?.role_id;
//                 }
//                 const already_exits_role = await UserRole.findOne({role_id});
//                 if(already_exits_role?._doc?.role_id){
//                     const role_res = await UserRole.deleteOne({role_id});
//                     // console.log({role_res});
//                     if(role_res){
//                         return res.status(200).json({
//                             status: true,
//                             message: "The user role is successfully deleted!!!",
//                         });
//                     }
//                     return res.status(403).json({
//                         status: false,
//                         message: "The user role isn't deleted!!!"
//                     })
//                 }
//                 return res.status(400).json({
//                     status: false,
//                     message: "The user role isn't exists to delete by this role_id"
//                 })

//             } catch (error) {
//                 return res.status(404).json({
//                     status: false,
//                     message: error?.message || "Server error!!!"
//                 })
//             }
//         }
//         return res.status(400).json({
//             status: false,
//             message: "User isn't authorized to update user role!!!"
//         })
//     }
// });



module.exports = router;
