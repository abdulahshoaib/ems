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

function Login() {
  const { toast } = useToast();
  const [form, setForm] = useState({
    email: "",
    password: "",
    remember: false,
  });
  const [errors, setErrors] = useState({});

  function update(field) {
    return (event) => {
      const value =
        field === "remember" ? event.target.checked : event.target.value;
      setForm((prev) => ({ ...prev, [field]: value }));
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    };
  }

  function handleSubmit(event) {
    event.preventDefault();
    const next = {};
    if (!EMAIL_RE.test(form.email)) next.email = "Enter a valid email address.";
    if (!form.password) next.password = "Password is required.";
    setErrors(next);
    if (Object.keys(next).length > 0) return;
    toast({
      title: "Signed in",
      description: "Welcome back!",
      variant: "success",
    });
  }

  return (
    <div className="flex flex-1 items-center justify-center px-4 py-10">
      <Card className="w-full max-w-sm text-left">
        <CardHeader>
          <CardTitle>Sign in</CardTitle>
          <CardDescription>
            Enter your email and password to continue.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-3" noValidate>
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
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Password</Label>
                <Link
                  to="#"
                  className="text-xs text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-50"
                >
                  Forgot password?
                </Link>
              </div>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                autoComplete="current-password"
                value={form.password}
                onChange={update("password")}
              />
              {errors.password ? (
                <p className="text-xs text-red-600 dark:text-red-400">
                  {errors.password}
                </p>
              ) : null}
            </div>
            <div className="flex items-center gap-2">
              <Checkbox
                id="remember"
                checked={form.remember}
                onChange={update("remember")}
              />
              <Label
                htmlFor="remember"
                className="font-normal text-zinc-600 dark:text-zinc-400"
              >
                Remember me
              </Label>
            </div>
            <Button type="submit" className="w-full">
              Sign in
            </Button>
          </form>
        </CardContent>
        <CardFooter className="justify-center">
          <p className="text-xs text-zinc-500 dark:text-zinc-400">
            Don&apos;t have an account?{" "}
            <Link
              to="/register"
              className="font-medium text-zinc-900 hover:underline dark:text-zinc-50"
            >
              Sign up
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}

export default Login;
