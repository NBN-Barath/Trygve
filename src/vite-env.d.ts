/// <reference types="vite/client" />

import { RecaptchaVerifier, ConfirmationResult } from "firebase/auth";

declare global {
  interface Window {
    recaptchaVerifier?: RecaptchaVerifier & {
      clear(): void;
    };
    signupConfirmationResult?: ConfirmationResult | null;
  }
}
