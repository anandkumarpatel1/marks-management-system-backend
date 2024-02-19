const Teacher = require("../models/Teacher");
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

const myProfile = async (req, res) =>{
  try {
    const user = req?.user;
    console.log(user)
    if(!user){
      res.status(401).json({
        success: false,
        message: 'Please Login Again'
      })

      return;
    }

    res.status(200).json({
      success: true,
      teacher: user,
    })
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error,
    });
  }
}
module.exports = { registerTeacher, loginTeacher, myProfile };
