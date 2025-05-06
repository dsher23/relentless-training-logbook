import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { auth, db } from "../firebase";
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, signInWithPopup, GoogleAuthProvider, signInWithPhoneNumber, RecaptchaVerifier, updateProfile } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAppContext } from "@/context/AppContext";
import { useToast } from "@/hooks/use-toast";
import "../types/window"; // Import the declaration file to extend Window

const Auth: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAppContext();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const [confirmationResult, setConfirmationResult] = useState<any>(null);
  const [isSignUp, setIsSignUp] = useState(false);
  const [isPhoneAuth, setIsPhoneAuth] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    console.log("Current user state:", user);
    if (user) {
      console.log("User authenticated, redirecting to /dashboard");
      setTimeout(() => navigate("/dashboard"), 1000);
    }
  }, [user, navigate]);

  const handleEmailAuth = async () => {
    console.log("handleEmailAuth called with:", { email, password, displayName, isSignUp });
    if (!email || !password) {
      console.log("Validation failed: Email or password missing");
      toast({
        title: "Error",
        description: "Please enter both email and password.",
        variant: "destructive",
      });
      return;
    }
    if (isSignUp && !displayName) {
      console.log("Validation failed: Display name missing");
      toast({
        title: "Error",
        description: "Please enter a display name.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      if (isSignUp) {
        console.log("Attempting to sign up with Firebase...");
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const firebaseUser = userCredential.user;
        console.log("Sign-up successful, user:", firebaseUser);

        // Set display name in Firebase Authentication
        try {
          await updateProfile(firebaseUser, { displayName });
          console.log("Display name set in Firebase Authentication:", displayName);
        } catch (error: any) {
          console.error("Failed to set display name in Firebase Authentication:", error.message);
          toast({
            title: "Warning",
            description: "Failed to set display name, proceeding with sign-up.",
            variant: "default",
          });
        }

        // Save user profile to Firestore
        try {
          await setDoc(doc(db, `users/${firebaseUser.uid}/profile`, "info"), {
            displayName,
            email,
            createdAt: new Date().toISOString(),
          });
          console.log("User profile saved to Firestore:", { displayName, email });
        } catch (error: any) {
          console.error("Failed to save user profile to Firestore:", error.message);
          toast({
            title: "Warning",
            description: "Failed to save profile to Firestore, proceeding with sign-up.",
            variant: "default",
          });
        }

        toast({
          title: "Success",
          description: "Account created successfully.",
        });
      } else {
        console.log("Attempting to log in with Firebase...");
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        console.log("Login successful, user:", userCredential.user);
        toast({
          title: "Success",
          description: "Logged in successfully.",
        });
      }
      console.log("Navigating to /dashboard with delay");
      setTimeout(() => navigate("/dashboard"), 1000);
    } catch (error: any) {
      console.error("Auth error:", error.code, error.message);
      toast({
        title: "Error",
        description: error.message || "An error occurred during authentication.",
        variant: "destructive",
      });
    } finally {
      console.log("Setting isLoading to false");
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    console.log("handleGoogleSignIn called");
    setIsLoading(true);
    try {
      const provider = new GoogleAuthProvider();
      console.log("Attempting Google Sign-In...");
      const userCredential = await signInWithPopup(auth, provider);
      const firebaseUser = userCredential.user;
      console.log("Google Sign-In successful, user:", firebaseUser);

      // Save user profile to Firestore if not already present
      try {
        await setDoc(doc(db, `users/${firebaseUser.uid}/profile`, "info"), {
          displayName: firebaseUser.displayName || "User",
          email: firebaseUser.email,
          createdAt: new Date().toISOString(),
        }, { merge: true });
        console.log("User profile saved to Firestore for Google sign-in:", { displayName: firebaseUser.displayName || "User", email: firebaseUser.email });
      } catch (error: any) {
        console.error("Failed to save user profile to Firestore for Google sign-in:", error.message);
        toast({
          title: "Warning",
          description: "Failed to save profile to Firestore, proceeding with login.",
          variant: "default",
        });
      }

      toast({
        title: "Success",
        description: "Logged in with Google successfully.",
      });
      setTimeout(() => navigate("/dashboard"), 1000);
    } catch (error: any) {
      console.error("Google Sign-In error:", error.code, error.message);
      toast({
        title: "Error",
        description: error.message || "An error occurred during Google Sign-In.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handlePhoneAuth = async () => {
    console.log("handlePhoneAuth called with:", { phoneNumber });
    if (!phoneNumber) {
      console.log("Validation failed: Phone number missing");
      toast({
        title: "Error",
        description: "Please enter a valid phone number.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      const confirmation = await signInWithPhoneNumber(auth, phoneNumber, window.recaptchaVerifier!);
      console.log("Phone auth confirmation sent:", confirmation);
      setConfirmationResult(confirmation);
      toast({
        title: "Success",
        description: "Verification code sent to your phone.",
      });
    } catch (error: any) {
      console.error("Phone Auth error:", error.code, error.message);
      toast({
        title: "Error",
        description: error.message || "An error occurred during phone authentication.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyCode = async () => {
    console.log("handleVerifyCode called with:", { verificationCode });
    if (!verificationCode || !confirmationResult) {
      console.log("Validation failed: Verification code or confirmation result missing");
      toast({
        title: "Error",
        description: "Please enter the verification code.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      const result = await confirmationResult.confirm(verificationCode);
      const firebaseUser = result.user;
      console.log("Phone verification successful, user:", firebaseUser);

      // Save user profile to Firestore
      try {
        await setDoc(doc(db, `users/${firebaseUser.uid}/profile`, "info"), {
          displayName: "User",
          email: firebaseUser.email || phoneNumber,
          createdAt: new Date().toISOString(),
        }, { merge: true });
        console.log("User profile saved to Firestore for phone sign-in:", { displayName: "User", email: firebaseUser.email || phoneNumber });
      } catch (error: any) {
        console.error("Failed to save user profile to Firestore for phone sign-in:", error.message);
        toast({
          title: "Warning",
          description: "Failed to save profile to Firestore, proceeding with login.",
          variant: "default",
        });
      }

      toast({
        title: "Success",
        description: "Logged in with phone number successfully.",
      });
      setTimeout(() => navigate("/dashboard"), 1000);
    } catch (error: any) {
      console.error("Verification error:", error.code, error.message);
      toast({
        title: "Error",
        description: error.message || "An error occurred during verification.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isPhoneAuth && !window.recaptchaVerifier) {
      console.log("Initializing reCAPTCHA verifier");
      window.recaptchaVerifier = new RecaptchaVerifier(auth, "recaptcha-container", {
        size: "invisible",
        callback: () => {
          console.log("reCAPTCHA verified");
        },
      });
    }
  }, [isPhoneAuth]);

  return (
    <div className="app-container animate-fade-in flex items-center justify-center h-screen px-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>{isPhoneAuth ? "Phone Sign-In" : isSignUp ? "Sign Up" : "Log In"}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {isPhoneAuth ? (
            <>
              <div>
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  type="tel"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  placeholder="Enter your phone number (e.g., +1234567890)"
                  disabled={isLoading}
                />
              </div>
              {confirmationResult && (
                <div>
                  <Label htmlFor="code">Verification Code</Label>
                  <Input
                    id="code"
                    type="text"
                    value={verificationCode}
                    onChange={(e) => setVerificationCode(e.target.value)}
                    placeholder="Enter the code sent to your phone"
                    disabled={isLoading}
                  />
                </div>
              )}
              <div id="recaptcha-container"></div>
              {confirmationResult ? (
                <Button 
                  onClick={handleVerifyCode} 
                  className="w-full"
                  disabled={isLoading || !verificationCode}
                >
                  {isLoading ? "Verifying..." : "Verify Code"}
                </Button>
              ) : (
                <Button 
                  onClick={handlePhoneAuth} 
                  className="w-full"
                  disabled={isLoading || !phoneNumber}
                >
                  {isLoading ? "Sending..." : "Send Verification Code"}
                </Button>
              )}
              <Button 
                variant="link"
                className="w-full"
                onClick={() => {
                  setIsPhoneAuth(false);
                  setPhoneNumber("");
                  setVerificationCode("");
                  setConfirmationResult(null);
                }}
                disabled={isLoading}
              >
                Use Email/Password Instead
              </Button>
            </>
          ) : (
            <>
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  disabled={isLoading}
                />
              </div>
              <div>
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  disabled={isLoading}
                />
              </div>
              {isSignUp && (
                <div>
                  <Label htmlFor="displayName">Display Name</Label>
                  <Input
                    id="displayName"
                    type="text"
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    placeholder="Enter your display name"
                    disabled={isLoading}
                  />
                </div>
              )}
              <Button 
                onClick={handleEmailAuth} 
                className="w-full"
                disabled={isLoading || !email || !password || (isSignUp && !displayName)}
              >
                {isLoading ? "Processing..." : isSignUp ? "Sign Up" : "Log In"}
              </Button>
              <Button 
                onClick={handleGoogleSignIn} 
                variant="outline"
                className="w-full"
                disabled={isLoading}
              >
                {isLoading ? "Processing..." : "Sign in with Google"}
              </Button>
              <Button 
                onClick={() => {
                  setIsPhoneAuth(true);
                  setEmail("");
                  setPassword("");
                  setDisplayName("");
                }}
                variant="outline"
                className="w-full"
                disabled={isLoading}
              >
                {isLoading ? "Processing..." : "Sign in with Phone"}
              </Button>
              <Button 
                variant="link"
                className="w-full"
                onClick={() => setIsSignUp(!isSignUp)}
                disabled={isLoading}
              >
                {isSignUp ? "Already have an account? Log In" : "Don't have an account? Sign Up"}
              </Button>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Auth;
