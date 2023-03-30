const express = require('express');
const router = express.Router();
const connectDB = require('../config/db');
const randomize = require('randomatic');
const auth = require('../middleware/auth');
const {body} = require('express-validator')


router.route('/',
body('salesforceCode').isString({min: 3}).trim().escape(),
    body('sysproCode').isString({min: 3}).trim().escape(),
    body('compName').isString({min: 3}).trim().escape(),
    body('type').isString({min: 3}).trim().escape(),
    body('country').isString({min: 3}).trim().escape(),
    body('email').isEmail(),
    body('district').isString({min: 3}).trim().escape(),
    body('region').isString({min: 3}).trim().escape(),
    body('state').isString({min: 3}).trim().escape(),
    body('address').isString({min: 3}).trim().escape(),
    body('Owner_Name').isString({min: 3}).trim().escape(),
    body('Owner_Phone').isNumeric().trim().escape,
    body('DD_Name').isString({min: 3}).trim().escape(),
    body('DD_Phone').isNumeric().trim().escape(),
    body('DD_Email').isEmail().trim().escape(),
    body('lat').isDecimal().trim().escape(),
    body('long').isDecimal().trim().escape(),
    )
    .post(auth, async(req, res)=>{
        const salesforceCode = req.body.salesforceCode;
        const sysproCode = req.body.sysproCode;
        const compName = req.body.compName; 
        const type = req.body.type;
        const country = req.body.country; 
        const email = req.body.email; 
        const district = req.body.district;
        const region = req.body.region;
        const state = req.body.state;
        const address = req.body.address; 
        const Owner_Name = req.body.Owner_Name; 
        const Owner_Phone = req.body.Owner_Phone; 
        const DD_Name = req.body.DD_Name; 
        const DD_Phone = req.body.DD_Phone; 
        const DD_Email = req.body.DD_Email; 
        const lat = req.body.lat; 
        const long = req.body.long; 
        const split_name = compName.slice(0, 3).toUpperCase();
        const split_type = type.charAt(0).toUpperCase();
        const random = randomize('0', 4);
        const date = new Date().getFullYear()+'-'+(new Date().getMonth()+parseInt("1"))+'-'+new Date().getDate();
        const code = `${split_type}${split_type}${split_name}${random}`;

       try{
            const results = await connectDB.request()
            .input("SYSCode", sysproCode)
            .execute("getCompanyBySYSCode")
                if(results.rowsAffected < 1){
                    const result = await connectDB.request()
                    .input("distributorCode", sysproCode)
                    .input("salesforceCode", salesforceCode)
                    .input("SYSCode", sysproCode)
                    .input("companyType", type)
                    .input("companyName", compName)
                    .input("country", country)
                    .input("email", email)
                    .input("district", district)
                    .input("state", state)
                    .input("region", region)
                    .input("address", address)
                    .input("Owner_Name", Owner_Name)
                    .input("Owner_Phone", Owner_Phone)
                    .input("DD_Name", DD_Name)
                    .input("DD_Phone", DD_Phone)
                    .input("DD_Email", DD_Email)
                    .input("lat", lat)
                    .input("long", long)
                    .excute("registerCompany")
                    if(result.recordset.length > 0){
                        res.status(200).json({success: true, msg: 'Successful registration!', result: result.recordset[0]})
                    }
                    else{
                        res.status(200).json({success: true, msg: 'Company registration not successful'});
                    }
                   
                }
                else{
                   return res.status(400).json({success: false, msg: 'Company already exists.'})
                }
       }
       catch(err){
        res.status(500).json({success: false, msg: `Server Error ${err}`});
       }
    })
module.exports = router;