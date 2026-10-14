import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
  Checkbox,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  Input,
  Label,
  Spinner,
  useToast,
} from "../components/ui";
import {
  AuthFrame,
  authCardClass,
  authDialogClass,
  authErrorClass,
  authFieldClass,
  authLabelClass,
  authMutedClass,
} from "./AuthFrame.jsx";

import { useDispatch } from "react-redux";
import { login } from "../features/auth/authSlice.js";
import { auth } from "../lib/auth.js";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function ForgotPassword() {
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");

  function submit(event) {
    event.preventDefault();
    if (!EMAIL_RE.test(email)) {
      setError("Enter a valid email address.");
      return;
    }
    toast({
      title: "Reset link sent",
      description: `Check ${email} for a link to choose a new password.`,
      variant: "success",
    });
    setEmail("");
    setError("");
    setOpen(false);
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger className="text-xs text-(--d-muted) hover:text-(--d-text)">
        Forgot password?
      </DialogTrigger>
      <DialogContent className={authDialogClass}>
        <DialogHeader>
          <DialogTitle className="text-(--d-text)!">Reset password</DialogTitle>
          <DialogDescription className="text-(--d-muted)!">
            We will email you a link to choose a new password.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={submit} className="space-y-3" noValidate>
          <div className="space-y-1.5">
            <Label htmlFor="reset-email" className={authLabelClass}>
              Email
            </Label>
            <Input
              id="reset-email"
              type="email"
              autoComplete="email"
              placeholder="you@example.com"
              value={email}
              aria-invalid={error ? true : undefined}
              onChange={(event) => {
                setEmail(event.target.value);
                setError("");
              }}
              className={authFieldClass}
            />
            {error ? <p className={authErrorClass}>{error}</p> : null}
          </div>
          <Button type="submit" className="w-full">
            Send reset link
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}

function Login() {
  const { toast } = useToast();

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [form, setForm] = useState({
    email: "",
    password: "",
    remember: false,
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  function update(field) {
    return (event) => {
      const value =
        field === "remember" ? event.target.checked : event.target.value;
      setForm((prev) => ({ ...prev, [field]: value }));
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    };
  }

  async function handleSubmit(event) {
    event.preventDefault();

    const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

    const next = {};

    if (!EMAIL_RE.test(form.email)) {
      next.email = "Enter a valid email address.";
    }

    if (!form.password) {
      next.password = "Password is required.";
    }

    setErrors(next);

    if (Object.keys(next).length > 0) return;

    setLoading(true);

    try {
      await delay(1000);

      const user = {
        email: form.email,
        password: form.password,
      };

      if (auth(user)) {
        console.log("hellouserfound");
        dispatch(login(user));

        if (form.remember) {
          localStorage.setItem("currentUser", JSON.stringify(user));
        } else {
          localStorage.removeItem("currentUser");
        }

        toast({
          title: "Signed in",
          description: "Welcome back.",
          variant: "success",
        });

        navigate("/dashboard");
      } else {
        setErrors({
          password: "Invalid email or password.",
        });
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthFrame>
      <Card className={authCardClass}>
        <CardHeader>
          <CardTitle>Sign in</CardTitle>
          <CardDescription className={authMutedClass}>
            Use your email and password to open ems.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-3" noValidate>
            <div className="space-y-1.5">
              <Label htmlFor="email" className={authLabelClass}>
                Email
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                autoComplete="email"
                value={form.email}
                aria-invalid={errors.email ? true : undefined}
                onChange={update("email")}
                className={authFieldClass}
              />
              {errors.email ? (
                <p className={authErrorClass}>{errors.email}</p>
              ) : null}
            </div>
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <Label htmlFor="password" className={authLabelClass}>
                  Password
                </Label>
                <ForgotPassword />
              </div>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                autoComplete="current-password"
                value={form.password}
                aria-invalid={errors.password ? true : undefined}
                onChange={update("password")}
                className={authFieldClass}
              />
              {errors.password ? (
                <p className={authErrorClass}>{errors.password}</p>
              ) : null}
            </div>
            <div className="flex items-center gap-2">
              <Checkbox
                id="remember"
                checked={form.remember}
                onChange={update("remember")}
                className="accent-white!"
              />
              <Label
                htmlFor="remember"
                className={`font-normal ${authMutedClass}`}
              >
                Remember me
              </Label>
            </div>
            <Button disabled={loading} type="submit" className="w-full">
              {loading ? <Spinner size="md" /> : <span>Sign in</span>}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="justify-center">
          <p className="text-xs text-(--d-muted)">
            No account yet?{" "}
            <Link
              to="/register"
              className="font-medium text-(--d-text) hover:underline"
            >
              Create one
            </Link>
          </p>
        </CardFooter>
      </Card>
    </AuthFrame>
  );
}

export default Login;
