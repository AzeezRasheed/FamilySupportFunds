const express = require('express');
const connectDB = require('../config/db');
const router = express.Router();
const auth = require('../middleware/auth');
const {body, param} = require('express-validator');


router.route('/status/:id',
    param("id").isInt(),
    body('status').isString({min: 3}).trim().escape()
)

.patch(auth, async(req, res) => {
    const id = req.params.id;
    const status = req.body.status;
 
    try{
        const results = await connectDB.request()
        .input("id", id)
        .input("status", status)
        .execute("updateCompanyStatus")
        if(err){
            return res.status(404).json({success: false, msg: 'Can not update status'});
        }
        else{
            return res.status(200).json({success: true, msg: 'Updated successfully', result: results.recordset})
        }
    }
    catch(err){

    }
});
module.exports = router;