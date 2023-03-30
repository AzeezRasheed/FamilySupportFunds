const express = require('express');
const connectDB = require('../config/db');
const router = express.Router();
const csv = require('csvtojson');
const multer = require('multer')
const fs = require('fs');
const randomize = require('randomatic');
const auth = require('../middleware/auth');

global.__basedir = __dirname;

const parser = multer.diskStorage({
    destination: (req, file, cb)=>{
        cb(null, __basedir + '/uploads/')
    },
    filename: (req, file, cb) => {
        cb(null, file.fieldname + '-' + Date.now() + file.originalname)
    }
});

const filter = (req, file, cb)=>{
    if(file.mimetype.includes('csv')){
        cb(null, true);
        return
    }
    else{
        cb("Please upload only csv file.", false);
    }
};

const upload = multer({storage: parser, fileFilter: filter});


router.route('/upload')
    .post(auth, upload.single('file'), async(req, res) =>{
        res.setHeader('Content-Type', 'multipart/form-data');
        try{
            if(req.file == undefined){
                return res.status(400).json({success: false, msg: 'Please upload a CSV file'});
            }
          else {  let filePath = __basedir + '/uploads/' + req.file.filename;
            var nonExistingUser = 0;
           
            const date = new Date().getFullYear()+'-'+(new Date().getMonth()+parseInt("1"))+'-'+new Date().getDate();
            const dataArray = await csv().fromFile(filePath);
            for(let i = 0; i < dataArray.length; i++){
               const singleData = dataArray[i];
               console.log(singleData);
               const salesforceCode = singleData.SF_Code.toString();
               const type = singleData.company_type.toString(); 
               const compName = singleData.company_name.toString();
               const country = singleData.country.toString(); 
               const email = singleData.email.toString();
               const district = singleData.district.toString();
               const state = singleData.state.toString();
               const region = singleData.region.toString();
               const address = singleData.address.toString(); 
               const Owner_Name = singleData.Owner_Name.toString();
               const Owner_Phone = singleData.Owner_Phone.toString();
               const DD_Name = singleData.DD_Name.toString(); 
               const DD_Phone = singleData.DD_Email.toString();
               const lat = singleData.lat.toString(); 
               const long = singleData.long.toString();
               const sysproCode = singleData.SYS_Code.toString();
               const random = randomize('0', 4);
               const split_name = compName.slice(0, 3).toUpperCase();
               const split_type = type.charAt(0).toUpperCase();

               const code = `${split_type}${split_type}${split_name}${random}`;
                

                // await connectDB.query(`SELECT COUNT(SYS_Code) AS count FROM companies_tb WHERE SYS_Code = '${sysproCode}'`, async(err, result)=>{console.log(result);
                //     nonExistingUser += result.recordset[0].count ? 0 : 1
                //     if(!result.recordset[0]['']){
                //         await connectDB.query(
                //             `INSERT INTO companies_tb (DIST_Code, SF_code, SYS_Code,
                //             company_type, company_name, country, email, status, district, state, region, address, Owner_Name, Owner_Phone, DD_Name, DD_Phone, lat, long, registeredOn)
                //             VALUES('${code}', '${salesforceCode}', '${sysproCode}', '${type}', '${compName}', '${country}',
                //             '${email}','Active', '${district}', '${state}', '${region}', '${address}', '${Owner_Name}', 
                //             '${Owner_Phone}', '${DD_Name}', '${DD_Phone}', '${lat}', '${long}', '${date}' )`, (err, result) =>{
                //                 if(err){
                //                    return res.status(400).json({success: false, msg: 'Can not register companies', err});
                //                 }
                //                 else{
                //                     if(i == dataArray.length -1){
                //                         fs.unlink(filePath,()=>{
                //                             res.status(200).json({success: true, msg: `${nonExistingUser} ${ nonExistingUser > 1 ? 'companies' : 'company'}  registration successful. ${dataArray.length - nonExistingUser} were already registered`});
                //                         },err =>{
                //                             res.status(500).json({success: false, msg: `Uploaded but file no delete ooo!!! ${err}`});
                //                         }
                //                         )
                                     
                //                        }
                           
                //                 }
                //             }
            
                //             )
                //     }else{
                //         if(i == dataArray.length - 1){
                //             fs.unlink(filePath, ()=>{
                //                 res.status(200).json({success: true, msg: `${nonExistingUser} ${ nonExistingUser > 1 ? 'companies' : 'company'}  registration successful. ${dataArray.length - nonExistingUser} were already registered`});
                             
                //             },err =>{
                //                 res.status(500).json({success: false, msg: `Uploaded but file no delete ooo!!! ${err}`});
                //             }
                //             )
                         
                //            }
                //     }
                    
               
                
                // })
           
           }}
            
        }
        catch(err){
            res.status(500).json({success: false, msg: 'Server error', err})
        }
    })

module.exports = router;  