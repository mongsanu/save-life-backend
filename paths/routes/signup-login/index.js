const express = require("express");
const router = express.Router();
const { login_user, sign_up_user, logout_user } = require("../../../api/controllers/signup-login");
const User = require("../../../api/models/User/User");

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



module.exports = router;