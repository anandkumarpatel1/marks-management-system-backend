const Teacher = require("../models/Teacher");
const Student = require("../models/Student");
const generateToken = require("../middleware/generateToken");

//register teacher
const registerTeacher = async (req, res) => {
  try {
    const { name, email, password, pic } = req.body;

    if (!name || !email || !password) {
      res.status(400).json({
        success: false,
        message: "Please proive all details",
      });

      return;
    }

    // checking existingUser
    const existingUser = await Teacher.findOne({ email });
    if (existingUser) {
      res.status(400).json({
        success: false,
        message: "User is already please enter a valid email",
      });
      return;
    }

    //creating user
    const teacher = await Teacher.create({
      name,
      email,
      password,
      pic,
    });

    if (teacher) {
      const token = generateToken(teacher._id);
      res.status(200).json({
        success: true,
        message: `Welcome ${teacher.name}`,
        token,
        teacher,
      });
    }
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error,
    });
  }
};

//login teacher
const loginTeacher = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400).json({
        success: false,
        message: "Please provide all details",
      });

      return;
    }

    //checking user is existing or not
    const teacher = await Teacher.findOne({ email });

    if (!teacher) {
      res.status(400).json({
        success: false,
        message: "User is not exists",
      });
      return;
    }

    //checking password
    if (password !== teacher?.password) {
      res.status(400).json({
        success: false,
        message: "User Credentials are invalid",
      });
      return;
    }

    const token = generateToken(teacher?._id);

    res.status(200).json({
      success: true,
      message: `Welcome ${teacher.name}`,
      token,
      teacher,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error,
    });
  }
};

//my profile
const myProfile = async (req, res) => {
  try {
    const user = req?.user;
    console.log(user);
    if (!user) {
      res.status(401).json({
        success: false,
        message: "Please Login Again",
      });

      return;
    }

    res.status(200).json({
      success: true,
      teacher: user,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error,
    });
  }
};

//create new student
const createStudent = async (req, res) =>{
  try {
    const {name, rollNo, regNo, branch, sem, password} = req.body;

    if(!name || !rollNo || !regNo || !branch || !sem || !password){
      res.status(400).json({
        success: false,
        message: 'Please Provide all details'
      })
      return;
    }

    const existStudent = await Student.findOne({regNo})
    if(existStudent){
      res.status(400).json({
        success: false,
        message: 'Student is already exists'
      })
      return;
    }

    const student = await Student.create({
      name,
      rollNo, 
      regNo,
      branch,
      sem,
      password
    })

    if(!student){
      res.status(400).json({
        success: false,
        message: 'Student not created'
      })
      return
    }

    res.status(201).json({
      success: true,
      message: 'Student created successful',
      student
    })
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error,
    });
  }
}

//finding student
const findStudent = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      res.status(400).json({
        success: false,
        message: "Please Provide Id",
      });
      return;
    }

    const student = await Student.findById({_id: id});
    if (!student) {
      res.status(400).json({
        success: false,
        message: "Please provide valid Id",
      });
      return;
    }

    res.status(200).json({
      success: true,
      student
    })
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error,
    });
  }
};
module.exports = { registerTeacher, loginTeacher, myProfile, findStudent, createStudent };
