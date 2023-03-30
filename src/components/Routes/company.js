const express = require('express');
const router = express.Router();
const connectDB = require('../config/db');
const auth = require('../middleware/auth');
const { body, param } = require('express-validator');
// Get all companies
router.route('/getall')
    .get(
        auth,
        async (req, res) => {
            try {
                await connectDB.query(`EXEC getAllCompanies`, (err, results) => {
                    if (err) {
                        return res.status(400).json({ success: false, msg: 'Unable to fetch companies' })
                    }
                    else {
                        return res.status(200).json({ success: true, result: results.recordset })
                    }
                })
            }
            catch (err) {
                res.status(500).json({ success: false, msg: 'Server error!' })
            }
        })


// Get company by Id
router.route('/:id',
    param('id').isInt()
)
    .get(
        auth,
        async (req, res) => {
            const id = req.params.id;

            try {
                const result = await connectDB.request()
                    .input("id", id)
                    .execute("getCompanyById");
                if (result.recordset && result.recordset.length > 0) {
                    return res.status(200).json({ success: true, result: result.recordset[0] })
                }
                else {
                    return res.status(404).json({ success: false, msg: 'Can not find company' });
                }
            }
            catch (err) {
                return res.status(500).json({ success: false, msg: 'Server error!' })
            }
        })




//  Get company by DMS Distributor's code
router.route('/code/:id',
    param('id').isString({ min: 3 }).trim().escape()
)
    .get(
        auth,
        async (req, res) => {
            const id = req.params.id;

            try {
                const result = await connectDB.request()
                    .input("distCode", id)
                    .execute("getCompanyByCode")
                if (result.recordset && result.recordset.length > 0) {

                    return res.status(200).json({ success: true, result: result.recordset[0] });
                }
                else {
                    return res.status(404).json({ success: false, msg: 'Can not find company' });
                }
            }
            catch (err) {
                res.status(500).json({ success: false, msg: 'Server error!', err })
            }
        });

// Get all company by status
router.route('/status/:status',
    param('status').isString({ min: 3 }).trim().escape()
)
    .get(auth, async (req, res) => {
        const status = req.params.status;

        try {
            const result = await connectDB.request()
                .input("status", status)
                .execute("getCompanyByStatus")
            if (result.recordset && result.recordset.length > 0) {
                return res.status(200).json({ success: true, result: result.recordset });
            }
            else {
                return res.status(404).json({ success: false, msg: 'Can not find companies' });
            }
        }
        catch (err) {
            res.status(500).json({ success: false, msg: 'Server error!' })
        }
    }),

    router.route('/salesforce/:code',
        param('code').isString({ min: 8 }).trim().escape()
    )
        .get(auth, async (req, res) => {
            const salesforceCode = req.params.code;

            try {
                const result = await connectDB.request()
                    .input("SFCode", salesforceCode)
                    .execute("getCompanyBySFCode")
                if (result.recordset && result.recordset.length > 0) {
                    return res.status(200).json({ success: true, result: result.recordset[0] });
                }
                else {
                    return res.status(404).json({ success: false, msg: 'Can not find company' });
                }
            }
            catch (err) {
                res.status(500).json({ success: false, msg: 'Server error!' })
            }
        });

router.route('/companies/:country',
    param('country').isString({ min: 3 }).trim().escape()
)
    .get(auth, async (req, res) => {
        const country = req.params.country;

        try {
            const result = await connectDB.request()
                .input("country", country)
                .execute("getCompanyByCountry")
            if (result.recordset && result.recordset.length > 0) {
                return res.status(200).json({ success: true, result: result.recordset });
            }
            else {
                return res.status(404).json({ success: false, msg: 'Can not find companies' });
            }
        }
        catch (err) {
            res.status(500).json({ success: false, msg: 'Server error!' })
        }
    });

router.route('/syspro/:code',
    param('code').isString({ min: 3 }).trim().escape())
    .get(auth, async (req, res) => {
        const sysprocode = req.params.code;

        try {
            const result = await connectDB.request()
                .input("SYSCode", sysprocode)
                .execute("getCompanyBySYSCode")
            if (result.recordset && result.recordset.length > 0) {
                return res.status(200).json({ success: true, result: result.recordset[0] });
            }
            else {
                return res.status(404).json({ success: false, msg: 'Can not find company' });
            }
        }
        catch (err) {
            res.status(500).json({ success: false, msg: 'Server error!' })
        }
    });

router.route('/rate-distributor/:id',
    param('id').isInt(),
    body('stars').isInt(),
    body('comment').isString({ min: 3, max: 255 }).trim().escape(),
    body('companyId').isString({ min: 3 }).trim().escape(),
    body('reviewerId').isString({ min: 3 }).trim().escape()
)
    .patch(auth, async (req, res) => {
        const id = req.params.id;
        const stars = req.body.stars;
        const comment = req.body.comment;
        const companyId = req.body.companyId;
        const reviewerId = req.body.reviewerId;

        try {
            if (stars > 0 && stars <= 5) {
                const results = await connectDB.request()
                    .input("id", id)
                    .execute("getCompanyById")
                if (results.recordset.length > 0) {
                    const record = results.recordset[0];
                    const raters = parseInt(record.raters + 1);
                    const ratings = parseInt(record.ratings + stars);
                    const currentRating = (parseFloat(ratings / raters)).toFixed(1);
                    const result = await connectDB.request()
                        .input("id", id)
                        .input("rate", ratings)
                        .input("raters", raters)
                        .input("stars", currentRating)
                        .execute("rateDistributors")
                    if (result.rowsAffected > 0) {
                        const final = await connectDB.request()
                            .input("companyId", companyId)
                            .input("reviewerId", reviewerId)
                            .input("comment", comment)
                            .input("rating", stars)
                            .input("date", date)
                            .execute("createReview")
                        if (final.rowsAffected > 0) {
                            return res.status(200).json({ success: true, msg: "Review added successfully", result: final.recordset[0] })
                        }
                        else {
                            res.status(400).json({ success: false, msg: 'Review not added' });
                        }

                    }
                    else {
                        return res.status(400).json({ success: false, msg: 'Rating failed' })
                    }
                }
                else {
                    return res.status(400).json({ success: false, msg: 'Distributor not found' })
                }
            }
            else {
                return res.status(400).json({ success: false, msg: 'Value must be within the range of 0 and 5' })
            }
        }
        catch (err) {
            res.status(500).json({ success: false, msg: 'Server error!' })
        }
    })

module.exports = router;