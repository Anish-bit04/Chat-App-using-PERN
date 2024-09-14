import { Request, Response } from "express";
import prisma from "../db/prisma.js";
import bcrypt from "bcryptjs";
import generateToken from "../utils/generateToken.js";

export const signup = async (req: Request, res: Response) => {
  try {
    const { fullName, username, password, confirmPassword, gender } = req.body;

    if (!fullName || !username || !password || !confirmPassword || !gender) {
      return res.status(400).json({ error: "please fill in all fields" });
    }

    if (password.trim() !== confirmPassword.trim()) {
      return res.status(400).json({ error: "Password don't match" });
    }

    const existUser = await prisma.user.findUnique({ where: { username } });

    if (existUser) {
      return res.status(400).json({ error: "Username already exist" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const boyProfilePic = `https://avatar.iran.liara.run/public/boy?username=${username}`;
    const girlProfilePic = `https://avatar.iran.liara.run/public/girl?username=${username}`;

    const newUser = await prisma.user.create({
      data: {
        fullName,
        username,
        password: hashedPassword,
        gender,
        profilePic: gender === "male" ? boyProfilePic : girlProfilePic,
      },
    });

    if (newUser) {
      generateToken(newUser.id, res);

      res.status(201).json({
        id: newUser.id,
        fullName: newUser.fullName,
        username: newUser.username,
        profilePic: newUser.profilePic,
      });
    } else {
      res.status(400).json({ error: "Invalid user data" });
    }
  } catch (error: any) {
    console.log(error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ error: "please fill in all fields" });
    }

    const existUser = await prisma.user.findUnique({
      where: {
        username: username,
      },
    });

    if (!existUser) {
      return res.status(400).json({ error: "User doesn't exist" });
    }

    const decodePassword = await bcrypt.compare(password, existUser.password);

    if (!decodePassword) {
      res.status(400).json({
        error: "Password doesn't match",
      });
    }

    if (existUser) {
      generateToken(existUser.id, res);

      res.status(201).json({
        id: existUser.id,
        fullName: existUser.fullName,
        username: existUser.username,
        profilePic: existUser.profilePic,
      });
    } else {
      res.status(400).json({ error: "Invalid user data" });
    }
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const logout = (req: Request, res: Response) => {
  try {
    res.clearCookie("jwt", {
      httpOnly: true,
      sameSite: "strict",
      secure: process.env.NODE_ENV !== "development",
    });
    res.status(200).json({ message: "Logout successful" });
  } catch (error: any) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const getMe = async(req: Request, res: Response) => {
  try {
    const user = await prisma.user.findUnique({where:{id:req.user.id}})
    if (!user) {
      return res.status(404).json({ error: "User not Found" });
    }
    res.status(200).json({
      id: user.id,
      fullName: user.fullName,
      username: user.username,
      profilePic: user.profilePic,
    });
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};
