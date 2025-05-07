import React, { useState } from "react";
import { useUser } from "@/hooks/useUser";
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/lib/firebase";

const Auth = () => {
  const user = useUser();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSignUp, setIsSignUp] = useState(false);
  const [error, setError] = useState("");

  // Show spinner only while user is undefined (loading auth state)
  if (user === undefined) {
    console.log("Auth.tsx: User state is still loading, rendering loading spinner...");
    return <div>Loading...</div>;
  }

  // User is logged in
  if (user) {
    console.log("Auth.tsx: User already authenticated, redirecting...");
    return <div>Redirecting...</div>; // You can add a useNavigate here to auto-redirect if you want
  }

  const handleSubmit = async () => {
    setError("");
    try {
      if (isSignUp) {
        await createUserWithEmailAndPassword(auth, email, password);
      } else {
        await signInWithEmailAndPassword(auth, email, password);
      }
    } catch (err: any) {
      console.error(err);
      setError(err.message);
    }
  };

  return (
    <div style={{ padding: 24, maxWidth: 400, margin: "0 auto" }}>
      <h2>{isSignUp ? "Sign Up" : "Login"}</h2>
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        style={{ display: "block", width: "100%", marginBottom: 12 }}
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        style={{ display: "block", width: "100%", marginBottom: 12 }}
      />
      <button onClick={handleSubmit} style={{ width: "100%", padding: 10 }}>
        {isSignUp ? "Create Account" : "Log In"}
      </button>
      <p style={{ marginTop: 12, cursor: "pointer", color: "#888" }} onClick={() => setIsSignUp(!isSignUp)}>
        {isSignUp ? "Already have an account? Log in" : "Don't have an account? Sign up"}
      </p>
      {error && <p style={{ color: "red", marginTop: 10 }}>{error}</p>}
    </div>
  );
};

export default Auth;
