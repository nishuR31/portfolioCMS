import bcrypt from "bcrypt";
import UserRepository from "../repositories/userRepository.js";
import { UnauthorizedError } from "../utils/errors/error.js";
import { sendDeleteAllEmail } from "../utils/helpers/email.js";
import { PHRASE } from "../config/envConfig.js";

const userRepo = new UserRepository();

let storedOtp: string | null = null;
let storedPassword: string | null = null;

function generateOtp(): string {
  return Math.floor(
    100000000 + Math.random() * 900000000
  ).toString();
}

async function generatePassword(): Promise<string> {
  return (await bcrypt.hash(PHRASE as string, 10)).slice(0, 12);
}

export async function storeDeleteAllTokens(): Promise<{
  otp: string;
  password: string;
}> {
  storedOtp = generateOtp();
  storedPassword = await generatePassword();

  return {
    otp: storedOtp,
    password: storedPassword,
  };
}

export function getStoredDeleteAllTokens() {
  if (!storedOtp || !storedPassword) {
    return null;
  }

  return {
    otp: storedOtp,
    password: storedPassword,
  };
}

export function clearDeleteAllTokens(): void {
  storedOtp = null;
  storedPassword = null;
}

export async function sendDeleteAll() {
  const { otp, password } = await storeDeleteAllTokens();

  await sendDeleteAllEmail(otp, password);

  return true;
}

export async function confirmDelete(
  otp: string,
  password: string,
): Promise<string> {
  const stored = getStoredDeleteAllTokens();

  if (!stored) {
    throw new UnauthorizedError(
      "Tokens are not set or expired."
    );
  }

  if (stored.otp !== otp) {
    throw new UnauthorizedError(
      `Invalid OTP`
    );
  }

  if (stored.password !== password) {
    throw new UnauthorizedError(
      `Invalid Password`
    );
  }


  await userRepo.deleteAll();
  clearDeleteAllTokens();

  return "All data wiped.";
}