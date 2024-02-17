const express = require('express')
const {registerTeacher, loginTeacher} = require('../controller/teacherController')
const {protect} = require('../middleware/Auth')

const router = express.Router()

router.route('/register').post(registerTeacher)
router.route('/login').post(loginTeacher)

module.exports = router