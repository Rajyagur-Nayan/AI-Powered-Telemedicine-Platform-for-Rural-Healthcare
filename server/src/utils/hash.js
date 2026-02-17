import bcrypt from "bcryptjs";
import crypto from "crypto";

// Password hashing and comparison
const hashPassword = async (password) => {
  const saltRounds = bcrypt.genSaltSync(10);
  const hashedPassword = await bcrypt.hash(password, saltRounds);
  return hashedPassword;
};
const comparePassword = async (password, hashedPassword) => {
  return await bcrypt.compare(password, hashedPassword);
};

export { hashPassword, comparePassword };
