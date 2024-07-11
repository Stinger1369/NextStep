import { Request, Response } from "express";
import User from "../../models/User";
import crypto from "crypto";
import { sendVerificationEmail } from "../../config/nodemailerConfig";

export const verifyEmail = async (req: Request, res: Response) => {
  const { email, code } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user || user.verificationCode !== code) {
      console.log(
        `Email verification failed: Invalid code for user ${email}`
      );
      return res.status(400).json({ message: "Invalid verification code" });
    }

    if (
      user.verificationCodeExpiresAt &&
      user.verificationCodeExpiresAt < new Date()
    ) {
      console.log(
        `Email verification failed: Code expired for user ${email}`
      );
      return res.status(400).json({ message: "Verification code has expired" });
    }

    user.isVerified = true;
    user.verificationCode = undefined;
    user.verificationCodeExpiresAt = undefined;
    await user.save();

    console.log(`Email verified successfully for user: ${user._id}`);

    res.status(200).json({ message: "Email verified successfully" });
  } catch (error) {
    console.error("Verification error:", error);
    res.status(500).json({ message: "Error verifying email", error });
  }
};

export const resendVerificationCode = async (req: Request, res: Response) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      console.log(
        `Resend verification code failed: User not found with ${email}`
      );
      return res.status(404).json({ message: "User not found" });
    }

    const verificationCode = crypto.randomBytes(4).toString("hex");
    user.verificationCode = verificationCode;
    user.verificationCodeExpiresAt = new Date(Date.now() + 20 * 60 * 1000); // 20 minutes from now
    await user.save();
    await sendVerificationEmail(email, verificationCode);

    console.log(`Verification code resent successfully to user: ${user._id}`);

    res.status(200).json({ message: "Verification code resent successfully" });
  } catch (error) {
    console.error("Resend verification code error:", error);
    res
      .status(500)
      .json({ message: "Error resending verification code", error });
  }
};
