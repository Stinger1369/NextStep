import { Request, Response } from "express";
import User from "../../models/User";
import crypto from "crypto";
import { hashPassword } from "../../utils/authUtils";
import { sendPasswordResetEmail } from "../../config/nodemailerConfig";

export const requestPasswordReset = async (req: Request, res: Response) => {
  const { emailOrPhone } = req.body;

  try {
    const user = await User.findOne({ emailOrPhone });
    if (!user) {
      console.log(
        `Password reset request failed: User not found with ${emailOrPhone}`
      );
      return res.status(404).json({ message: "User not found" });
    }

    const resetPasswordCode = crypto.randomBytes(4).toString("hex");
    user.resetPasswordCode = resetPasswordCode;
    user.resetPasswordExpiresAt = new Date(Date.now() + 20 * 60 * 1000); // 20 minutes from now
    await user.save();
    await sendPasswordResetEmail(emailOrPhone, resetPasswordCode);

    console.log(`Password reset code sent successfully to user: ${user._id}`);

    res.status(200).json({ message: "Password reset code sent successfully" });
  } catch (error) {
    console.error("Request password reset error:", error);
    res.status(500).json({ message: "Error requesting password reset", error });
  }
};

export const resetPassword = async (req: Request, res: Response) => {
  const { emailOrPhone, code, newPassword } = req.body;

  try {
    const user = await User.findOne({ emailOrPhone });

    if (!user || user.resetPasswordCode !== code) {
      console.log(
        `Password reset failed: Invalid reset code for user ${emailOrPhone}`
      );
      return res.status(400).json({ message: "Invalid reset code" });
    }

    if (
      user.resetPasswordExpiresAt &&
      user.resetPasswordExpiresAt < new Date()
    ) {
      console.log(
        `Password reset failed: Reset code expired for user ${emailOrPhone}`
      );
      return res.status(400).json({ message: "Reset code has expired" });
    }

    user.password = await hashPassword(newPassword);
    user.resetPasswordCode = undefined;
    user.resetPasswordExpiresAt = undefined;
    await user.save();

    console.log(`Password reset successfully for user: ${user._id}`);

    res.status(200).json({ message: "Password reset successfully" });
  } catch (error) {
    console.error("Password reset error:", error);
    res.status(500).json({ message: "Error resetting password", error });
  }
};
