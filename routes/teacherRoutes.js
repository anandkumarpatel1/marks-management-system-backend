const express = require('express')
const {registerTeacher, loginTeacher, myProfile, findStudent, createStudent, searchStudent} = require('../controller/teacherController')
const {protect} = require('../middleware/Auth')

const router = express.Router()

router.route('/register').post(registerTeacher)
router.route('/login').post(loginTeacher)
router.route('/me').get(protect, myProfile)
router.route('/student/:id').get(protect, findStudent)
router.route('/new/student').post(protect, createStudent)
router.route('/search/:key').get(protect, searchStudent)

module.exports = router