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

// Declare the window.recaptchaVerifier property directly in this file
declare global {
  interface Window {
    recaptchaVerifier: import("firebase/auth").RecaptchaVerifier | undefined;
  }
}

const Auth: React.FC = () => {
  console.log("Auth.tsx: Rendering Auth component");

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
    console.log("Auth.tsx: Current user state:", user);
    if (user) {
      console.log("Auth.tsx: User authenticated, redirecting to /dashboard");
      setTimeout(() => {
        console.log("Auth.tsx: Executing navigation to /dashboard");
        navigate("/dashboard");
      }, 1000);
    }
  }, [user, navigate]);

  const handleEmailAuth = async () => {
    console.log("Auth.tsx: handleEmailAuth called with:", { email, password, displayName, isSignUp });
    if (!email || !password) {
      console.log("Auth.tsx: Validation failed: Email or password missing");
      toast({
        title: "Error",
        description: "Please enter both email and password.",
        variant: "destructive",
      });
      return;
    }
    if (isSignUp && !displayName) {
      console.log("Auth.tsx: Validation failed: Display name missing");
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
        console.log("Auth.tsx: Attempting to sign up with Firebase...");
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const firebaseUser = userCredential.user;
        console.log("Auth.tsx: Sign-up successful, user:", firebaseUser);

        // Set display name in Firebase Authentication
        try {
          await updateProfile(firebaseUser, { displayName });
          console.log("Auth.tsx: Display name set in Firebase Authentication:", displayName);
        } catch (error: any) {
          console.error("Auth.tsx: Failed to set display name in Firebase Authentication:", error.message);
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
          console.log("Auth.tsx: User profile saved to Firestore:", { displayName, email });
        } catch (error: any) {
          console.error("Auth.tsx: Failed to save user profile to Firestore:", error.message);
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
        console.log("Auth.tsx: Attempting to log in with Firebase...");
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        console.log("Auth.tsx: Login successful, user:", userCredential.user);
        toast({
          title: "Success",
          description: "Logged in successfully.",
        });
      }
      console.log("Auth.tsx: Navigating to /dashboard with delay");
      setTimeout(() => {
        console.log("Auth.tsx: Executing navigation to /dashboard");
        navigate("/dashboard");
      }, 1000);
    } catch (error: any) {
      console.error("Auth.tsx: Auth error:", error.code, error.message);
      toast({
        title: "Error",
        description: error.message || "An error occurred during authentication.",
        variant: "destructive",
      });
    } finally {
      console.log("Auth.tsx: Setting isLoading to false");
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    console.log("Auth.tsx: handleGoogleSignIn called");
    setIsLoading(true);
    try {
      const provider = new GoogleAuthProvider();
      console.log("Auth.tsx: Attempting Google Sign-In...");
      const userCredential = await signInWithPopup(auth, provider);
      const firebaseUser = userCredential.user;
      console.log("Auth.tsx: Google Sign-In successful, user:", firebaseUser);

      // Save user profile to Firestore if not already present
      try {
        await setDoc(doc(db, `users/${firebaseUser.uid}/profile`, "info"), {
          displayName: firebaseUser.displayName || "User",
          email: firebaseUser.email,
          createdAt: new Date().toISOString(),
        }, { merge: true });
        console.log("Auth.tsx: User profile saved to Firestore for Google sign-in:", { displayName: firebaseUser.displayName || "User", email: firebaseUser.email });
      } catch (error: any) {
        console.error("Auth.tsx: Failed to save user profile to Firestore for Google sign-in:", error.message);
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
      setTimeout(() => {
        console.log("Auth.tsx: Executing navigation to /dashboard after Google Sign-In");
        navigate("/dashboard");
      }, 1000);
    } catch (error: any) {
      console.error("Auth.tsx: Google Sign-In error:", error.code, error.message);
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
    console.log("Auth.tsx: handlePhoneAuth called with:", { phoneNumber });
    if (!phoneNumber) {
      console.log("Auth.tsx: Validation failed: Phone number missing");
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
      console.log("Auth.tsx: Phone auth confirmation sent:", confirmation);
      setConfirmationResult(confirmation);
      toast({
        title: "Success",
        description: "Verification code sent to your phone.",
      });
    } catch (error: any) {
      console.error("Auth.tsx: Phone Auth error:", error.code, error.message);
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
    console.log("Auth.tsx: handleVerifyCode called with:", { verificationCode });
    if (!verificationCode || !confirmationResult) {
      console.log("Auth.tsx: Validation failed: Verification code or confirmation result missing");
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
      console.log("Auth.tsx: Phone verification successful, user:", firebaseUser);

      // Save user profile to Firestore
      try {
        await setDoc(doc(db, `users/${firebaseUser.uid}/profile`, "info"), {
          displayName: "User",
          email: firebaseUser.email || phoneNumber,
          createdAt: new Date().toISOString(),
        }, { merge: true });
        console.log("Auth.tsx: User profile saved to Firestore for phone sign-in:", { displayName: "User", email: firebaseUser.email || phoneNumber });
      } catch (error: any) {
        console.error("Auth.tsx: Failed to save user profile to Firestore for phone sign-in:", error.message);
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
      setTimeout(() => {
        console.log("Auth.tsx: Executing navigation to /dashboard after phone verification");
        navigate("/dashboard");
      }, 1000);
    } catch (error: any) {
      console.error("Auth.tsx: Verification error:", error.code, error.message);
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
      console.log("Auth.tsx: Initializing reCAPTCHA verifier");
      window.recaptchaVerifier = new RecaptchaVerifier(auth, "recaptcha-container", {
        size: "invisible",
        callback: () => {
          console.log("Auth.tsx: reCAPTCHA verified");
        },
      });
    }
  }, [isPhoneAuth]);

  if (user === null) {
    console.log("Auth.tsx: User state is still loading, rendering loading spinner...");
    return <div>Loading...</div>;
  }

  console.log("Auth.tsx: Rendering state - isSignUp:", isSignUp, "isPhoneAuth:", isPhoneAuth, "isLoading:", isLoading);

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
