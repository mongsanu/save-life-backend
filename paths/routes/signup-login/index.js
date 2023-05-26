const express = require("express");
const router = express.Router();
const { login_user, sign_up_user, logout_user, reset_password } = require("../../../api/controllers/signup-login");
const User = require("../../../api/models/User/User");
const nodemailer = require("nodemailer");
const smtpTransport = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.VERIFIED_EMAIL,
        pass: process.env.VERIFIED_PASSWORD,
    }
});
// User login 
router.post('/user/login', login_user);
router.post('/admin/login', login_user);

// User logout
router.post('/user/logout', logout_user);

// User sign_up
router.post('/user/signup', sign_up_user);
router.post('/user/register', sign_up_user);
router.post('/donor/register', sign_up_user);
router.post('/admin/signup', sign_up_user);

// Find donors and admins
router.get('/find/donors', (req, res) => {
    // pipeline only for role_id = 2
    const pipeline = [
        {
            $match: {
                role_id: 3
            }
        },
        {
            $project: {
                _id: 1,
                email: 1,
                user_name: 1,
                phone: 1,
                avatar: 1,
                age: 1,
                user_id: 1,
                isVerified: 1,
                division: 1,
                district: 1,
                upazilla: 1,
                union: 1,
                password: 1,
                address: 1,
                blood_group: 1,
                last_donation_date: 1,
                gender: 1,
                user_role: 1,
                facebook_url: 1,
            }
        }
    ];
    User.aggregate(pipeline).then((users) => {
        res.status(200).json({ status: true, data: users });
    }).catch((err) => {
        res.status(500).json({ status: false, message: err.message });
    })
});

router.get('/find/admins', (req, res) => {
    // pipeline only for role_id = 2
    const pipeline = [
        {
            $match: {
                role_id: 2
            }
        },
        {
            $project: {
                _id: 1,
                email: 1,
                user_name: 1,
                phone: 1,
                avatar: 1,
                user_id: 1,
                isVerified: 1,
                division: 1,
                district: 1,
                upazilla: 1,
                union: 1,
                address: 1,
                blood_group: 1,
                gender: 1,
                user_role: 1,
                facebook_url: 1,
            }
        }
    ];
    User.aggregate(pipeline).then((users) => {
        res.status(200).json({ status: true, data: users });
    }).catch((err) => {
        res.status(500).json({ status: false, message: err.message });
    })
});

// Reset password
router.get('/user/reset-password', reset_password);

// Change password
router.post('/user/change-password', (req, res) => {
    const { email, password, otp } = req?.body;
    console.log({ email, password, otp });
    if (!email || !password || !otp) {
        return res.status(400).json({ status: false, message: "Email, otp and password are required!!!" });
    }
    try {
        User.findOne({ email }).then((user) => {
            if (!user) {
                return res.status(404).json({ status: false, message: "User not found!!!" });
            }
            if (user?.otp !== otp) {
                return res.status(200).json({ status: false, message: "OTP not matched!!!" });
            }
            user.password = password;
            user.otp = ""
            user.save().then((user) => {
                // Send email notification to confirm the password of the user
                const mailOptions = {
                    from: process.env.EMAIL,
                    to: email,
                    subject: 'Changed Password',
                    html: ` <h1>Hello ${user?.user_name},</h1>
                            <p>Your new password is <span style="color: red;">${password}</span></p>
                        `
                };
                smtpTransport.sendMail(mailOptions, function (error, info) {
                    if (error) {
                        return res.status(200).json({ status: false, message: "Password changed successfully but something wrong to send a mail!!!" });
                    }
                    return res.status(200).json({ status: true, message: `Password changed successfully & check you mail ${email?.substring(0, 3) + "****" + email?.substring(email?.lastIndexOf("@") - 1)} for OTP and check also you spam!!!` });
                });

            }).catch((err) => {
                return res.status(500).json({ status: false, message: err.message });
            })
        }).catch((err) => {
            return res.status(500).json({ status: false, message: err.message });
        });
    } catch (err) {
        return res.status(500).json({ status: false, message: err.message });
    }
});




module.exports = router;