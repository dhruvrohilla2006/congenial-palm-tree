import { comparePassword, hashPassword } from "../libs/hash.js";
import { genToken } from "../libs/token.js";
import user from "../Model/user.model.js";

export const register = async (request, response) => {
  try {
    const { name, email, password } = request.body;

    if (!name || !email || !password) {
      return response.status(401).json({
        message: "Fill data properly",
        success: false,
      });
    }

    const hashPass = await hashPassword(password);

    const existingUser = await user.findOne({ email: email });
    if (existingUser) {
      return response.status(400).json({
        message:
          "User with this Email Already Exist , login from that or use another email",
        success: false,
      });
    }

    let newUser = new user();

    newUser.name = name;
    newUser.email = email;
    newUser.password = hashPass;

    await newUser.save();

     const token  = await genToken({
        userId:newUser._id,
        role:newUser.role
      })
    return response.status(201).json({
      message: "User Create Successfully",
      New_User: token,
    });
  } catch (error) {
    console.log(
      "Error at register api/register \ t Error Message: \t" + error.message,
    );
    return response.status(500).json({
      message: "Server Error",
    });
  }
};

export const login = async (request, response) => {
  try {
    const { email, password } = request.body;

    if (!email || !password) {
      return response.status(401).json({
        message: "Fill data properly",
        success: false,
      });
    }

    const loginUser = await user.findOne({ email: email });

    if (!(await comparePassword(password, loginUser.password))) {
      return response.status(400).json({
        message: "Invalid Credentials",
        success: false,
      });
    }
      const token  = await genToken({
        userId:loginUser._id,
        role:loginUser.role
      })
    return response.status(200).json({
      message: "u are loggedIn",
      success: true,
      logget_user: token,
    });
  } catch (error) {
    console.log(
      "Error at register api/login \t Error Message: \t" + error.message,
    );
    return response.status(500).json({
      message: "Server Error",
    });
  }
};

export const protectedController = async (request,response) => {
    try {
        const {role} = request.body

        if(!role){
         return response.status(400).json({
        "message":"U are not a registered Or Authorise User to procced",
        "success":false
      }) 
        }

        return  response.status(201).json({
        "message":"U are a registered Or Authorise User",
        "success":false
      })
    } catch (error) {
      console.log("Error at protected Controller :\t" + error.message);
      return response.status(500).json({
        "message":"Server error",
        "success":false
      })
    }
}