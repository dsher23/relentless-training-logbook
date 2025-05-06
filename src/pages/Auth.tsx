
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { auth } from "../firebase";
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, signInWithPopup, GoogleAuthProvider, signInWithPhoneNumber, RecaptchaVerifier } from "firebase/auth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAppContext } from "@/context/AppContext";
import { useToast } from "@/hooks/use-toast";

// Add RecaptchaVerifier to the window object
declare global {
  interface Window {
    recaptchaVerifier: any;
  }
}

const Auth: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAppContext();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const [confirmationResult, setConfirmationResult] = useState<any>(null);
  const [isSignUp, setIsSignUp] = useState(false);
  const [isPhoneAuth, setIsPhoneAuth] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (user) {
      navigate("/dashboard");
    }
  }, [user, navigate]);

  useEffect(() => {
    // Initialize reCAPTCHA verifier for phone auth
    if (isPhoneAuth && !window.recaptchaVerifier) {
      window.recaptchaVerifier = new RecaptchaVerifier(auth, "recaptcha-container", {
        size: "invisible",
        callback: () => {
          console.log("reCAPTCHA verified");
        },
      });
    }
  }, [isPhoneAuth]);

  const handleEmailAuth = async () => {
    setIsLoading(true);
    try {
      if (isSignUp) {
        await createUserWithEmailAndPassword(auth, email, password);
        toast({
          title: "Success",
          description: "Account created successfully.",
        });
      } else {
        await signInWithEmailAndPassword(auth, email, password);
        toast({
          title: "Success",
          description: "Logged in successfully.",
        });
      }
      navigate("/dashboard");
    } catch (error: any) {
      console.error("Auth error:", error.message);
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
      toast({
        title: "Success",
        description: "Logged in with Google successfully.",
      });
      navigate("/dashboard");
    } catch (error: any) {
      console.error("Google Sign-In error:", error.message);
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handlePhoneAuth = async () => {
    if (!phoneNumber) {
      toast({
        title: "Error",
        description: "Please enter a valid phone number.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      const confirmation = await signInWithPhoneNumber(auth, phoneNumber, window.recaptchaVerifier);
      setConfirmationResult(confirmation);
      toast({
        title: "Success",
        description: "Verification code sent to your phone.",
      });
    } catch (error: any) {
      console.error("Phone Auth error:", error.message);
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyCode = async () => {
    if (!verificationCode || !confirmationResult) {
      toast({
        title: "Error",
        description: "Please enter the verification code.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      await confirmationResult.confirm(verificationCode);
      toast({
        title: "Success",
        description: "Logged in with phone number successfully.",
      });
      navigate("/dashboard");
    } catch (error: any) {
      console.error("Verification error:", error.message);
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="app-container animate-fade-in flex items-center justify-center h-screen px-4 bg-background">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-center text-2xl font-bold">
            {isPhoneAuth ? "Phone Sign-In" : isSignUp ? "Sign Up" : "Log In"}
          </CardTitle>
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
                  disabled={isLoading || confirmationResult !== null}
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
              <Button 
                onClick={handleEmailAuth} 
                className="w-full"
                disabled={isLoading || !email || !password}
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
