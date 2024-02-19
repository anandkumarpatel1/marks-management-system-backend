const express = require('express')
const {registerTeacher, loginTeacher, myProfile} = require('../controller/teacherController')
const {protect} = require('../middleware/Auth')

const router = express.Router()

router.route('/register').post(registerTeacher)
router.route('/login').post(loginTeacher)
router.route('/me').get(protect, myProfile)

module.exports = router