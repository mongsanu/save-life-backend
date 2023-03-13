const express = require("express");
const { create_request, get_all_requests, update_request } = require("../../../api/controllers/request/request");
const router = express.Router();
// const user_role_enum = require("../../enums/user_role_enum");

// Blood Request Endpoints
router.post('/create/request', create_request);
router.get('/get/all/requests', get_all_requests);
router.patch('/update/request', update_request);



module.exports = router;

