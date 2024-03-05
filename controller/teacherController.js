const Teacher = require("../models/Teacher");
const Student = require("../models/Student");
const Marks = require("../models/Marks");
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
    if (!user) {
      res.status(401).json({
        success: false,
        message: "Please Login Again",
      });

      return;
    }

    res.status(200).json({
      success: true,
      message: `Welcome ${user.name}`,
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
const createStudent = async (req, res) => {
  try {
    const { name, rollNo, regNo, branch, sem, password } = req.body;

    if (!name || !rollNo || !regNo || !branch || !sem || !password) {
      res.status(400).json({
        success: false,
        message: "Please Provide all details",
      });
      return;
    }

    const existStudent = await Student.findOne({ regNo });
    if (existStudent) {
      res.status(400).json({
        success: false,
        message: "Student is already exists",
      });
      return;
    }

    const student = await Student.create({
      name,
      rollNo,
      regNo,
      branch,
      sem,
      password,
    });

    if (!student) {
      res.status(400).json({
        success: false,
        message: "Student not created",
      });
      return;
    }

    res.status(201).json({
      success: true,
      message: "Student created successful",
      student,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error,
    });
  }
};

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

    const student = await Student.findById({ _id: id }).populate("result");
    if (!student) {
      res.status(400).json({
        success: false,
        message: "Please provide valid Id",
      });
      return;
    }

    res.status(200).json({
      success: true,
      student,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error,
    });
  }
};

//search student
const searchStudent = async (req, res) => {
  try {
    const student = await Student.find({
      $or: [
        { name: { $regex: req.params.key, $options: "i" } },
        { regNo: { $regex: req.params.key, $options: "i" } },
        { rollNo: { $regex: req.params.key, $options: "i" } },
        { sem: { $regex: req.params.key, $options: "i" } },
        { branch: { $regex: req.params.key, $options: "i" } },
      ],
    });
    if (!student) {
      return res.status(400).json({
        success: false,
        message: "NO students found",
      });
    }

    res.status(200).json({
      success: true,
      student,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

//add marks
const addMarks = async (req, res) => {
  try {
    const user = req.user;
    const { number, testNo, subject } = req.body;
    const { id } = req.params;

    const student = await Student.findById({ _id: id });
    if (!student) {
      res.status(400).json({
        success: false,
        message: "Please provide valid Id",
      });
      return;
    }

    const mark = await Marks.create({
      number,
      testNo,
      subject,
      teacher: user,
    });

    if (!mark) {
      res.status(400).json({
        success: false,
        message: "Something error",
      });
      return;
    }

    student.result.push(mark._id);

    await student.save();
    res.status(200).json({
      success: true,
      mark,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error,
    });
  }
};

//find all students
const findAllStudents = async (req, res) => {
  try {
    const student = await Student.find();

    if (!student) {
      res.status(200).json({
        success: true,
        message: "No student found",
      });

      return;
    }

    res.status(200).json({
      success: true,
      student,
      totalStudent: student.length,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error,
    });
  }
};
module.exports = {
  registerTeacher,
  loginTeacher,
  myProfile,
  findStudent,
  createStudent,
  searchStudent,
  addMarks,
  findAllStudents,
};
