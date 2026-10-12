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
  Progress,
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

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const STEP_COUNT = 4;

function Register() {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
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
      const value = field === "terms" ? event.target.checked : event.target.value;
      setForm((prev) => ({ ...prev, [field]: value }));
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    };
  }

  function issuesFor(index) {
    const next = {};
    if (index === 0 && !form.name.trim()) next.name = "Name is required.";
    if (index === 1 && !EMAIL_RE.test(form.email))
      next.email = "Enter a valid email address.";
    if (index === 2) {
      if (form.password.length < 8)
        next.password = "Password must be at least 8 characters.";
      if (form.confirmPassword !== form.password)
        next.confirmPassword = "Passwords do not match.";
    }
    if (index === 3 && !form.terms) next.terms = "Accept the terms to continue.";
    return next;
  }

  function handleSubmit(event) {
    event.preventDefault();
    const next = issuesFor(step);
    setErrors(next);
    if (Object.keys(next).length > 0) return;
    if (step < STEP_COUNT - 1) {
      setStep((current) => current + 1);
      return;
    }
    toast({
      title: "Account created",
      description: `Welcome, ${form.name.trim()}.`,
      variant: "success",
    });
    navigate("/dashboard");
  }

  return (
    <AuthFrame>
      <Card className={authCardClass}>
        <CardHeader>
          <p className="text-[11px] font-medium tracking-wide text-[var(--d-subtle)]">
            Step {step + 1} of {STEP_COUNT}
          </p>
          <Progress
            className="mt-2 !bg-white/10 [&>div]:!bg-white"
            value={step + 1}
            max={STEP_COUNT}
            aria-label={`Step ${step + 1} of ${STEP_COUNT}`}
          />
          <CardTitle className="pt-3">
            {step === 0 && "What should we call you?"}
            {step === 1 && "Where should we reach you?"}
            {step === 2 && "Choose a password"}
            {step === 3 && "One last check"}
          </CardTitle>
          <CardDescription className={authMutedClass}>
            {step === 0 && "This is the name on your ems account."}
            {step === 1 && "Used to sign in. We will not show it on events."}
            {step === 2 && "At least 8 characters. You will type it twice."}
            {step === 3 && `Creating an account for ${form.name.trim()}.`}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-3" noValidate>
            {step === 0 && (
              <Field
                id="name"
                label="Full name"
                type="text"
                autoComplete="name"
                placeholder="Ada Lovelace"
                value={form.name}
                error={errors.name}
                onChange={update("name")}
              />
            )}
            {step === 1 && (
              <Field
                id="email"
                label="Email"
                type="email"
                autoComplete="email"
                placeholder="you@example.com"
                value={form.email}
                error={errors.email}
                onChange={update("email")}
              />
            )}
            {step === 2 && (
              <>
                <Field
                  id="password"
                  label="Password"
                  type="password"
                  autoComplete="new-password"
                  placeholder="At least 8 characters"
                  value={form.password}
                  error={errors.password}
                  onChange={update("password")}
                />
                <Field
                  id="confirmPassword"
                  label="Confirm password"
                  type="password"
                  autoComplete="new-password"
                  placeholder="Repeat the password"
                  value={form.confirmPassword}
                  error={errors.confirmPassword}
                  onChange={update("confirmPassword")}
                  autoFocus={false}
                />
              </>
            )}
            {step === 3 && (
              <div className="space-y-3">
                <p className="text-[13px] text-[var(--d-muted)]">
                  {form.email}
                </p>
                <div className="flex items-start gap-2">
                  <Checkbox
                    id="terms"
                    checked={form.terms}
                    onChange={update("terms")}
                    className="mt-0.5 !accent-white"
                  />
                  <p className="text-[13px] leading-5 text-[var(--d-muted)]">
                    <Label htmlFor="terms" className={`inline font-normal ${authMutedClass}`}>
                      I agree to the
                    </Label>{" "}
                    <Dialog>
                      <DialogTrigger className="font-medium text-[var(--d-text)] hover:underline">
                        terms of service
                      </DialogTrigger>
                      <DialogContent className={authDialogClass}>
                        <DialogHeader>
                          <DialogTitle className="!text-[var(--d-text)]">
                            Terms of service
                          </DialogTitle>
                          <DialogDescription className="!text-[var(--d-muted)]">
                            ems lists events and registrations. You are responsible
                            for the details you publish and for showing up to events
                            you join. Accounts are free. An event can still charge
                            its own price, shown before you register.
                          </DialogDescription>
                        </DialogHeader>
                      </DialogContent>
                    </Dialog>
                  </p>
                </div>
                {errors.terms ? <p className={authErrorClass}>{errors.terms}</p> : null}
              </div>
            )}
            <div className="flex gap-2 pt-1">
              {step > 0 && (
                <Button type="button" variant="secondary" onClick={() => setStep(step - 1)}>
                  Back
                </Button>
              )}
              <Button type="submit" className="flex-1">
                {step === STEP_COUNT - 1 ? "Create account" : "Continue"}
              </Button>
            </div>
          </form>
        </CardContent>
        <CardFooter className="justify-center">
          <p className="text-xs text-[var(--d-muted)]">
            Already have an account?{" "}
            <Link to="/login" className="font-medium text-[var(--d-text)] hover:underline">
              Sign in
            </Link>
          </p>
        </CardFooter>
      </Card>
    </AuthFrame>
  );
}

function Field({ id, label, error, ...inputProps }) {
  return (
    <div className="space-y-1.5">
      <Label htmlFor={id} className={authLabelClass}>
        {label}
      </Label>
      <Input
        id={id}
        aria-invalid={error ? true : undefined}
        autoFocus
        className={authFieldClass}
        {...inputProps}
      />
      {error ? <p className={authErrorClass}>{error}</p> : null}
    </div>
  );
}

export default Register;
