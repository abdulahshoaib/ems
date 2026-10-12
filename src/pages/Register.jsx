import { useState } from "react";
import { Link } from "react-router-dom";
import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
  Checkbox,
  Input,
  Label,
  useToast,
} from "../components/ui";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function Register() {
  const { toast } = useToast();
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    terms: false,
  });
  const [errors, setErrors] = useState({});

  function update(field) {
    return (event) => {
      const value =
        field === "terms" ? event.target.checked : event.target.value;
      setForm((prev) => ({ ...prev, [field]: value }));
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    };
  }

  function handleSubmit(event) {
    event.preventDefault();
    const next = {};
    if (!form.name.trim()) next.name = "Name is required.";
    if (!EMAIL_RE.test(form.email)) next.email = "Enter a valid email address.";
    if (form.password.length < 8)
      next.password = "Password must be at least 8 characters.";
    if (form.confirmPassword !== form.password)
      next.confirmPassword = "Passwords do not match.";
    if (!form.terms) next.terms = "You must accept the terms to continue.";
    setErrors(next);
    if (Object.keys(next).length > 0) return;
    toast({
      title: "Account created",
      description: "Your account has been registered successfully.",
      variant: "success",
    });
  }

  return (
    <div className="flex flex-1 items-center justify-center px-4 py-10">
      <Card className="w-full max-w-sm text-left">
        <CardHeader>
          <CardTitle>Create an account</CardTitle>
          <CardDescription>
            Fill in the details below to get started.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-3" noValidate>
            <div className="space-y-1.5">
              <Label htmlFor="name">Full name</Label>
              <Input
                id="name"
                type="text"
                placeholder="John Doe"
                autoComplete="name"
                value={form.name}
                onChange={update("name")}
              />
              {errors.name ? (
                <p className="text-xs text-red-600 dark:text-red-400">
                  {errors.name}
                </p>
              ) : null}
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                autoComplete="email"
                value={form.email}
                onChange={update("email")}
              />
              {errors.email ? (
                <p className="text-xs text-red-600 dark:text-red-400">
                  {errors.email}
                </p>
              ) : null}
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="At least 8 characters"
                autoComplete="new-password"
                value={form.password}
                onChange={update("password")}
              />
              {errors.password ? (
                <p className="text-xs text-red-600 dark:text-red-400">
                  {errors.password}
                </p>
              ) : null}
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="confirmPassword">Confirm password</Label>
              <Input
                id="confirmPassword"
                type="password"
                placeholder="••••••••"
                autoComplete="new-password"
                value={form.confirmPassword}
                onChange={update("confirmPassword")}
              />
              {errors.confirmPassword ? (
                <p className="text-xs text-red-600 dark:text-red-400">
                  {errors.confirmPassword}
                </p>
              ) : null}
            </div>
            <div className="space-y-1.5">
              <div className="flex items-center gap-2">
                <Checkbox
                  id="terms"
                  checked={form.terms}
                  onChange={update("terms")}
                />
                <Label
                  htmlFor="terms"
                  className="font-normal text-zinc-600 dark:text-zinc-400"
                >
                  I agree to the{" "}
                  <Link
                    to="#"
                    className="text-zinc-900 hover:underline dark:text-zinc-50"
                  >
                    terms of service
                  </Link>
                </Label>
              </div>
              {errors.terms ? (
                <p className="text-xs text-red-600 dark:text-red-400">
                  {errors.terms}
                </p>
              ) : null}
            </div>
            <Button type="submit" className="w-full">
              Create account
            </Button>
          </form>
        </CardContent>
        <CardFooter className="justify-center">
          <p className="text-xs text-zinc-500 dark:text-zinc-400">
            Already have an account?{" "}
            <Link
              to="/login"
              className="font-medium text-zinc-900 hover:underline dark:text-zinc-50"
            >
              Sign in
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}

export default Register;
