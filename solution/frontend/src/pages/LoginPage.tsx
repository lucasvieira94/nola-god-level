import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "@/store/authStore";

export const LoginPage: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isRegistering, setIsRegistering] = useState(false);
  const [name, setName] = useState("");

  const { login, register, isLoading, error, isAuthenticated, clearError } =
    useAuthStore();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/dashboard");
    }
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    return () => clearError();
  }, [clearError]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (isRegistering) {
        await register(email, password, name);
      } else {
        await login(email, password);
      }
    } catch (error) {
      console.error("Authentication error:", error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-500 to-primary-700 dark:from-gray-900 dark:to-gray-800">
      <div
        className="card max-w-md w-full"
        role="main"
        aria-labelledby="login-title"
      >
        <h1
          id="login-title"
          className="text-32 font-bold text-center mb-2 text-gray-900 dark:text-white"
        >
          NOLA Platform
        </h1>
        <p className="text-gray-600 dark:text-gray-400 text-center mb-6">
          {isRegistering ? "Create your account" : "Sign in to your account"}
        </p>

        <form
          onSubmit={handleSubmit}
          className="space-y-4"
          aria-label={isRegistering ? "Registration form" : "Login form"}
        >
          {isRegistering && (
            <div>
              <label htmlFor="name" className="label">
                Name
              </label>
              <input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="input"
                required
                placeholder="Maria Silva"
                aria-required="true"
              />
            </div>
          )}

          <div>
            <label htmlFor="email" className="label">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="input"
              required
              placeholder="maria@restaurant.com"
              aria-required="true"
              autoComplete="email"
            />
          </div>

          <div>
            <label htmlFor="password" className="label">
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="input"
              required
              placeholder="••••••••"
              minLength={6}
              aria-required="true"
              aria-describedby={
                isRegistering ? "password-requirements" : undefined
              }
              autoComplete={isRegistering ? "new-password" : "current-password"}
            />
            {isRegistering && (
              <p
                id="password-requirements"
                className="text-12 text-gray-500 dark:text-gray-400 mt-1"
              >
                Minimum 6 characters
              </p>
            )}
          </div>

          {error && (
            <div
              className="bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 p-3 rounded-lg text-16"
              role="alert"
              aria-live="polite"
            >
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="btn-primary w-full"
            aria-busy={isLoading}
          >
            {isLoading
              ? "Loading..."
              : isRegistering
              ? "Create Account"
              : "Sign In"}
          </button>
        </form>

        <div className="mt-6 text-center">
          <button
            onClick={() => {
              setIsRegistering(!isRegistering);
              clearError();
            }}
            className="text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 text-16"
            aria-label={
              isRegistering ? "Switch to sign in" : "Switch to registration"
            }
          >
            {isRegistering
              ? "Already have an account? Sign in"
              : "Don't have an account? Register"}
          </button>
        </div>
      </div>
    </div>
  );
};
