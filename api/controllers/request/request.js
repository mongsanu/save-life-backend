const Request = require("../../models/Request/Request");

module.exports = {
    create_request: async (req, res) => {
        const {body} = req;
        console.log({body});
        try {
            const new_request = new Request(body);
            const result = await new_request.save();

            return res.status(200).json({
                status: true,
                message: "Request created successfully",
                data: result,
            });
        } catch (error) {

            return res.json(500).json({
                status: false,
                message: error?.message || "Server error",
            });
        }
    },

    get_all_requests: async (req, res) => {
        try {
            const result = await Request.find();
            return res.status(200).json({
                status: true,
                message: "All requests",
                data: result,
            });
        } catch (error) {
            return res.status(500).json({
                status: false,
                message: error?.message || "Server error",
            });
        }
    },

    update_request: async (req, res) => {
        const {body} = req;
        const {request_id} = body;
        const searchObj = {request_id};
        try {
            const res = await Request.updateOne(searchObj, body);
            return res.status(200).json({
                status: true,
                message: "Request updated successfully",
                data: res,
            });
        } catch (error) {
            return res.status(500).json({
                status: false,
                message: error?.message || "Server error",
            });   
        }
    },
};

