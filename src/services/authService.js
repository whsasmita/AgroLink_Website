/* eslint-disable no-useless-catch */
import { BASE_URL } from "../constants/api";

export async function login({ email, password }) {
  try {
    const response = await fetch(`${BASE_URL}/public/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Login failed");
    }
    return await response.json();
  } catch (error) {
    throw error;
  }
}

export async function register({ email, password, role, name, phone_number }) {
  try {
    const response = await fetch(`${BASE_URL}/public/auth/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password, role, name, phone_number }),
    });
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Register failed");
    }
    return await response.json();
  } catch (error) {
    throw error;
  }
}

export async function verifyOtp({ email, otp_code }) {
  try {
    const response = await fetch(`${BASE_URL}/public/auth/verify-otp`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, otp_code }),
    });
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Kode OTP tidak valid atau sudah kedaluwarsa");
    }
    return await response.json();
  } catch (error) {
    throw error;
  }
}

export async function resendOtp({ email }) {
  try {
    const response = await fetch(`${BASE_URL}/public/auth/resend-otp`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email }),
    });
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Gagal mengirim ulang kode OTP");
    }
    return await response.json();
  } catch (error) {
    throw error;
  }
}
