import { useNavigate } from "react-router-dom";
import { Button, Container } from "../components/ui";

export const authCardClass =
  "w-full max-w-sm !rounded-xl !border-white/10 !bg-black !text-[var(--d-text)] !shadow-[inset_0_1px_0_rgba(255,255,255,0.08),0_24px_80px_-28px_rgba(99,102,241,0.45)]";

export const authFieldClass =
  "!border-[var(--d-line-strong)] !bg-black !text-[var(--d-text)] placeholder:!text-[var(--d-subtle)]";

export const authLabelClass = "!text-[var(--d-text)]";

export const authMutedClass = "!text-[var(--d-muted)]";

export const authErrorClass = "text-xs text-[var(--d-danger)]";

export const authDialogClass =
  "max-w-sm !border-[var(--d-line)] !bg-black !text-[var(--d-text)]";

export function AuthFrame({ children }) {
  const navigate = useNavigate();

  return (
    <div className="d-stage d-stage-auth flex min-h-svh flex-col">
      <header className="relative z-10 border-b border-(--d-line) bg-black">
        <Container className="flex h-12 items-center">
          <Button variant="ghost" size="sm" onClick={() => navigate(-1)}>
            ← Go back
          </Button>
        </Container>
      </header>
      <main className="flex flex-1 items-center justify-center px-4 py-10">
        <div className="w-full max-w-sm">
          <div className="mb-4 flex justify-center">
            <img src="/ems.png" alt="EMS logo" className="h-10 w-10" />
          </div>
          {children}
        </div>
      </main>
    </div>
  );
}
