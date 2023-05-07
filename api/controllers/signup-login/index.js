require('../../../configs/env.config');
const jwt = require('jsonwebtoken');
const { authenticateJWT } = require("../auth");
// This token_key is same to auth file token_key
const accessTokenSecret = process.env.ACCESS_TOKEN_SECRET;
const bcrypt = require("bcrypt");
const fs = require('fs');
const User = require("../../models/User/User");
const UserRole = require("../../models/User/UserRole");
const uploadFile = require('../all_global_controllers/upload');
const development_mode = process.env.NODE_ENV === 'development';
console.log({ development_mode });
const nodemailer = require("nodemailer");
const smtpTransport = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.VERIFIED_EMAIL,
        pass: process.env.VERIFIED_PASSWORD,
    }
});

// User login for getting token
exports.login_user = async (req, res) => {
    const { email, password, user_id, user_role } = req?.body;
    console.log({ email, user_id, password, user_role });

    if ((!user_id && !email) || !password) {
        return res.status(406).json({
            status: false,
            message: "User Id or email or password are missing",
        })
    }
    const searchObj = user_id ? { user_id } : { email };
    console.log({ searchObj });
    try {
        const pipeline = [
            {
                $match: searchObj,
            },
            {
                $lookup: {
                    from: UserRole.collection.name,
                    localField: "role_id",
                    foreignField: "role_id",
                    as: "role"
                }
            },
            {
                $project: {
                    _id: 1,
                    email: 1,
                    user_name: 1,
                    password: 1,
                    phone: 1,
                    avatar: 1,
                    role_id: 1,
                    user_id: 1,
                    voting_status: 1,
                    user_role: 1,
                    group_id: 1,
                    isVerified: 1,
                    address: 1,
                    gender: 1,
                    role: { $arrayElemAt: ["$role.name", 0] },
                }
            }
        ];

        const user_ag_res = await User.aggregate(pipeline);
        // const user_ag_res = await User.find(searchObj).populate('role_id');
        const user = user_ag_res[0];
        console.log({ user: user });

        if (!user) {
            return res.status(404).json({ status: false, message: "User not found!" });
        }
        if ((user_role === "admin" || user?.user_role === 'admin') && user?.user_role !== user_role) {
            return res.status(200).json({
                status: false, message: "User role is not matched! you are not allowed to login as admin"
            });
        }
        if (!user?.isVerified) {
            const mailOptions = {
                from: process.env.VERIFIED_EMAIL,
                to: email,
                subject: "Admin Verification",
                html: `<div>
                            <h3>Dear, ${user?.user_name || "Brother/Sister"}</h3>
                            <h4>Please click to verify</h4>
                            
                            <a href="http://localhost:8000/api/user/verify-email?email=${email}">Click</a>
                                
                        </div>`,
            };

            smtpTransport.sendMail(mailOptions, function (error, info) {
                if (error) {
                    console.log(error);
                    return res.status(503).json({
                        status: false,
                        message: "Something wrong to send email",
                    })
                } else {
                    console.log('Email sent: ' + info.response);
                    return res.status(200).json({
                        status: false,
                        message: "You are not verified. Please wait for verification or contact with admin and check your email"
                    })
                }
            });
        } else {
            const validPassword = password === user?.password;
            // const validPassword = await bcrypt.compare(password, user?.password);
            if (!validPassword) {
                return res.status(400).json({ status: false, message: "Wrong password" });
            }
            const tokenObject = { email: user?.email, name: user?.user_name, group_id: user?.group_id, election_id: user?.election_id, user_role: user?.user_role, avatar: user?.avatar };
            const accessToken = jwt.sign(tokenObject, accessTokenSecret);
            delete user.password;
            const dataObj = {
                remember_token: accessToken,
            };
            await User.updateOne(searchObj, dataObj);
            return res.status(200).json({
                status: true,
                message: "User is logged in successfully!!!",
                data: {
                    user: {
                        email: user?.email,
                        name: user?.user_name,
                        user_id: user?.user_id,
                        group_id: user?.group_id,
                        election_id: user?.election_id,
                        voting_status: user?.voting_status,
                        user_role: user?.user_role,
                        avatar: user?.avatar
                    },
                    accessToken
                }
            })
        }

    } catch (error) {
        console.log(error);
        res.status(500).json({
            status: false,
            message: error?.message || "Server error"
        })
    }

};

// User registration
exports.sign_up_user = async (req, res) => {
    const { body, files } = req;
    console.log("====Body====", { body });
    // const now = new Timestamp(new Date());
    // console.log({now});
    const { password, confirm_password, email } = body;
    if (password !== confirm_password && body?.role_id === 1) {
        return res.status(406).json({
            status: false,
            message: password.length < 5 ? "Password length should be greater than 5 !!!" : "Your password and confirm password are not matched"
        })
    } else {
        try {
            const already_exist_user = await User.findOne({ email });
            if (already_exist_user) {
                return res.status(200).json({
                    status: false,
                    message: "This email is already exist for another user",
                });
            } else {
                // console.log({files});
                const user_body = body;
                let img_folder = user_body?.email;
                const img_name = "avatar";
                const root_url = development_mode ? process.env.DEV_URL : process.env.PROD_URL;
                if (files) {
                    // let img_folder = Number(new Date());
                    img_path = `${root_url}/api/static/${img_folder}/${img_name}.png`;
                    user_body.avatar = img_path;
                }
                // if (password) {
                //     const salt = await bcrypt.genSalt(10);
                //     const hashedPassword = await bcrypt.hash(password, salt);
                //     user_body.password = hashedPassword;
                // }
                // user_body.role_id = 2;
                if (!user_body?.user_role) {
                    user_body.user_role = "user";
                }
                delete user_body.confirm_password;
                const newUser = new User(user_body);

                const res_signup = await newUser.save();
                const user = res_signup?._doc;
                console.log({ user });
                const mailOptions = {
                    from: process.env.VERIFIED_EMAIL,
                    to: email,
                    subject: "Admin Verification",
                    html: `<div>
                                <h3>Dear, ${user?.user_name || "Brother/Sister"}</h3>
                                <h4>Please click to verify</h4>
                                
                                <a href="http://localhost:8000/api/user/verify-email?email=${email}">Click</a>
                                    
                            </div>`,
                };

                smtpTransport.sendMail(mailOptions, function (error, info) {
                    if (error) {
                        console.log(error);
                        return res.status(503).json({
                            status: false,
                            message: "Something wrong to send email",
                        })
                    } else {
                        console.log('Email sent: ' + info.response);
                        return res.status(200).json({
                            status: false,
                            message: "You are not verified. Please wait for verification or contact with admin and check your email"
                        })
                    }
                });
                if (user) {
                    if (files) {
                        console.log({ file: files?.avatar });
                        // if(!fs.existsSync(appRoot+"/uploads")){
                        //     fs.mkdirSync(appRoot+"/uploads");
                        // }
                        const img_file = files?.image || files?.img || files?.uploadedImg || files?.avatar;

                        let root_path = "/" + img_folder;
                        const img_url = await uploadFile(root_path, img_file, img_name);
                        console.log({ img_url });

                    }
                    const tokenObject = { email: user?.email, name: user?.user_name, user_role: user?.user_role, avatar: user?.avatar };
                    const accessToken = jwt.sign(tokenObject, accessTokenSecret);
                    const dataObj = {
                        remember_token: accessToken,
                    };
                    await User.updateOne({ email }, dataObj);
                    return res.status(200).json({
                        status: true,
                        message: "The user is successfully registered!!!",
                        data: { user: { email: user?.email, name: user?.user_name, user_role: user?.user_role, avatar: user?.avatar }, accessToken },
                    });
                }
                return res.status(500).json({
                    status: false,
                    message: "Server error"
                })
            }

        } catch (error) {
            res.status(500).json({
                status: false,
                message: error?.message || "Something wrong"
            })
        }
    }
};

// User logout for removing token from db
exports.logout_user = async (req, res, next) => {
    const {
        user,
        // token, 
        // remember_token
    } = req;
    try {
        // const filter_tokens = await remember_token?.filter(t => t != token);
        await User.updateOne({ email: user?.email }, { remember_token: "", is_active: false });
        return res.status(200).json({
            status: true,
            message: "User is logged out successfully!!!",
        })

    } catch (error) {
        return res.json({
            status: false,
            message: error?.message || "Server error",
        })
    }
};

