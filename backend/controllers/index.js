const dbConnect = require("../database/config");
const nodemailer = require("nodemailer");
// const jwt = require("jsonwebtoken");

// user Sign Up controller
const SignUpController =  async (req, res) => {
  const firstname = req.body.firstname;
  const lastname = req.body.lastname;
  const contact = req.body.contact;
  const email = req.body.email;
  const password = req.body.password;
  const college = req.body.college;
  const role = req.body.role;
  if (firstname === "" && lastname === "" && contact === "" && password === "" && email === "" && college === "") {
    res.send({ message: "All fields are required", status: 0 });
  } else {
    const response = await dbConnect.getConnect();
    const data = await response.find({ email: email }).toArray();
    if (data.length > 0) {
      if (data[0].email === email) {
        res.send({ message: "Email already exists", status: 0 });
      }
    } else {
      const data = await response.insertOne({
        firstname: firstname,
        lastname: lastname,
        contact: contact,
        email: email,
        password: password,
        college: college,
        role: role
      });
      if (data.insertedId) {
        var transport = nodemailer.createTransport({
          host: "sandbox.smtp.mailtrap.io",
          port: 2525,
          auth: {
            user: "f4236f66f581f2",
            pass: "20e2c603e67c5a",
          },
        });

        // send mail with defined transport object
        let info = await transport.sendMail({
          from: "f4236f66f581f2", // sender address
          to: "durgesh@mailinator.com", // list of receivers
          subject: "Welcome Email ✔", // Subject line
          text: "Hello User?", // plain text body
          html: "<b>Hello User?</b>", // html body
        });

        if (info.messageId) {
          res.send({
            message: "User registered and welcome email sent successfully",
            status: 1,
            response: { data },
          });
        } else {
          res.send({
            message: "User registered but unable to send welcome email",
            status: 1,
            response: { data, token: token },
          });
        }
        console.log("first", response);
      } else {
        res.send({ message: "User registration failed", status: 0 });
      }
    }
  }
};

// user sign in controller
const SignInController = async (req, res) => {
  console.log("first", req);
  const email = req.body.email;
  const password = req.body.password;

  const response = await dbConnect.getConnect();
  const data = await response
    .find({ email: email, password: password })
    .toArray();
  if (data.length > 0) {
    if (data[0].email === email && data[0].password === password) {
      // const token = jwt.sign({ email: data[0].email}, process.env.secretkey, {expiresIn: "1m"})
      // console.log("token", token);
      res.send({
        message: "User signed in successfully",
        status: 1,
        response: data,
        email: email,
        // token: token
      });
    } else {
      res.send({ message: "User signed in failed", status: 0 });
    }
  } else {
    res.send({
      message: "User not found",
      status: 0,
    });
  }
};

// forgot password controller
const ForgotPasswordController = async (req, res) => {
  const email = req.body.email;
  const password = req.body.password;
  const confirm_password = req.body.confirm_password;
  const response = await dbConnect.getConnect();
  const data = await response.find({ email: email }).toArray();
  console.log("data", data);
  if (data[0].email) {
    const updatedData = await response.updateOne(
      { email: email },
      { $set: { password: password } }
    );
    console.log("updatedData", updatedData);
    if (updatedData) {
      if (password === confirm_password) {
        res.send({
          message: "Password reset successfully..!",
          email: email,
          password: password,
          confirm_password: confirm_password,
          status: 1,
        });
      } else {
        res.send({
          message: "Password reset failed..!",
          status: 0,
        });
      }
    }
  }
};

// user profile controller
const userProfileController = async (req, res) => {
  const response = await dbConnect.getConnect();
  const data = await response.find({ email: req.body.email }).toArray();
  console.log("data", data);
  if (data.length > 0) {
    res.send({
      message: "Data fetched successfully",
      status: 1,
      response: data,
    });
  } else {
    res.send({
      message: "Data not fetched",
      status: 0,
    });
  }
};

// user profile update controller
const userProfileUpdateController = async (req, res) => {
  const firstname = req.body.firstname;
  const email = req.body.email;
  const password = req.body.password;

  const response = await dbConnect.getConnect();
  const data = await response.find({ email: email }).toArray();
  console.log("data[0].email", data[0].email);
  if (data[0].email) {
    const updateProfile = await response.updateOne(
      { email: email },
      { $set: { firstname: firstname, password: password } }
    );
    console.log("update", updateProfile);
    // return
    if (updateProfile) {
      res.send({ message: "Profile updated successfully", status: 1 });
    } else {
      res.send({ message: "Profile not updated", status: 0 });
    }
  } else {
    res.send({ message: "Profile details not fetched", status: 0 });
  }
};

// user profile photo controller
const userProfilePhotoController = async (req, res) => {
  const email = "laddoo@gmail.com";
  console.log("req", req);
  console.log("req.body", req.body.avatar);
  // return;
  const response = await dbConnect.getConnect();
  const data = await response.find({ email: email }).toArray();
  console.log("data", data);
  const upload = response.updateOne(
    { email: email },
    { $set: { profile_pic: "avatar" } }
  );
  if (upload) {
    res.send({
      message: "Profile photo uploaded.",
      status: 1,
    });
  } else {
    res.send({
      message: "Profile photo not uploaded.",
      status: 0,
    });
  }
};

// get User Details by Email
const getUserDetailsbyEmailController = async (req, res) => {
  const email = req.body.userEmail;
  const response = await dbConnect.getConnect();
  const data = await response.find({ email: email }).toArray();
  // return
  if (data.length > 0) {
    res.send({
      message: "Data fetched successfully",
      status: 1,
      response: data,
    });
  } else {
    console.log(data);
    res.send({ message: "Data NOT found", status: 0, response: data });
  }
};

module.exports = {
  SignUpController,
  SignInController,
  ForgotPasswordController,
  userProfileController,
  userProfileUpdateController,
  userProfilePhotoController,
  getUserDetailsbyEmailController,
};
