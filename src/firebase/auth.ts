import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  RecaptchaVerifier,
  signInWithPhoneNumber,
} from "firebase/auth";
import type { User, ConfirmationResult } from "firebase/auth";
import { app } from "./config";

// Initialize Firebase Auth
export const auth = getAuth(app);

// Sign up with email and password
export const signUp = async (email: string, password: string) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    return userCredential.user;
  } catch (error) {
    throw error;
  }
};

// Sign in with email and password
export const signIn = async (email: string, password: string) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return userCredential.user;
  } catch (error) {
    throw error;
  }
};

// Sign out
export const logOut = async () => {
  try {
    await signOut(auth);
  } catch (error) {
    throw error;
  }
};

// Auth state observer
export const onAuthStateChange = (callback: (user: User | null) => void) => {
  return onAuthStateChanged(auth, callback);
};

// Phone Authentication
export const setupRecaptcha = (elementId: string) => {
  // Clear any existing verifier first
  if (window.recaptchaVerifier) {
    window.recaptchaVerifier.clear();
    window.recaptchaVerifier = undefined;
  }
  
  // Ensure the element exists
  const element = document.getElementById(elementId);
  if (!element) {
    console.error(`Element with id ${elementId} not found`);
    return null;
  }
  
  try {
    window.recaptchaVerifier = new RecaptchaVerifier(auth, elementId, {
      size: "invisible",
      callback: () => {
        console.log("reCAPTCHA solved");
      },
      'expired-callback': () => {
        console.log("reCAPTCHA expired");
      }
    });
    
    return window.recaptchaVerifier;
  } catch (error) {
    console.error("Error setting up reCAPTCHA:", error);
    return null;
  }
};

export const cleanupRecaptcha = () => {
  if (window.recaptchaVerifier) {
    window.recaptchaVerifier.clear();
    window.recaptchaVerifier = undefined;
  }
};

export const sendOtp = async (phoneNumber: string, verifier: RecaptchaVerifier | null): Promise<ConfirmationResult> => {
  if (!verifier) {
    throw new Error("reCAPTCHA verifier not initialized");
  }
  
  try {
    const confirmationResult = await signInWithPhoneNumber(auth, phoneNumber, verifier);
    return confirmationResult;
  } catch (error) {
    console.error("Error sending OTP:", error);
    throw error;
  }
};

export const verifyOtp = async (confirmationResult: ConfirmationResult, otp: string) => {
  try {
    const result = await confirmationResult.confirm(otp);
    return result.user;
  } catch (error) {
    console.error("Error verifying OTP:", error);
    throw error;
  }
};