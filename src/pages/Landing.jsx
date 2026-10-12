import { useState } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
  Badge,
  Button,
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
  Container,
  FilterTabs,
  Input,
  Separator,
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
  useToast,
} from "../components/ui";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const AUDIENCES = [
  { value: "going", label: "Going" },
  { value: "hosting", label: "Hosting" },
];

const POINTS = {
  going: [
    {
      title: "One quiet list",
      body: "Talks, meetups and nights out, without a feed to scroll.",
    },
    {
      title: "A clear ask",
      body: "Price, place and capacity are on the event before you request a spot.",
    },
    {
      title: "Status you can see",
      body: "Confirmed, pending and cancelled stay together after you sign in.",
    },
  ],
  hosting: [
    {
      title: "A page, not a poster",
      body: "Publish the date, place and price once. People register from there.",
    },
    {
      title: "A cap you choose",
      body: "Set how many can come. Registration stops when the room is full.",
    },
    {
      title: "A list you trust",
      body: "See who is confirmed, who is waiting, and who cancelled.",
    },
  ],
};

const STEPS = [
  {
    value: "browse",
    label: "Browse",
    title: "Start from the catalogue",
    body: "Open an event for the date, place, price and how full it is.",
  },
  {
    value: "register",
    label: "Register",
    title: "One request per event",
    body: "Hold a spot from the listing. Paid events show the price first.",
  },
  {
    value: "track",
    label: "Track",
    title: "Status stays with the event",
    body: "Your dashboard keeps confirmed, pending and cancelled in one place.",
  },
];

const FAQS = [
  {
    value: "cost",
    question: "Does an account cost anything?",
    answer:
      "No. You pay only when an event has a price, and that price is shown before you register.",
  },
  {
    value: "where",
    question: "Are events online or in person?",
    answer: "Both, plus hybrid. Each listing says where it is, or that it is online.",
  },
  {
    value: "full",
    question: "What if an event is full?",
    answer: "Registration closes when capacity is reached.",
  },
  {
    value: "cancel",
    question: "Can I cancel?",
    answer:
      "Yes. Open the event from My events and cancel while the organiser still lists you.",
  },
];

const NAV = [
  { href: "#for", label: "For you" },
  { href: "#how", label: "How it works" },
  { href: "#faq", label: "FAQ" },
];

const cardClass =
  "!border-white/10 !bg-white/[0.03] !text-[var(--d-text)] !shadow-none backdrop-blur-sm";

function Landing() {
  const { toast } = useToast();
  const [audience, setAudience] = useState("going");
  const [email, setEmail] = useState("");

  function subscribe(event) {
    event.preventDefault();
    if (!EMAIL_RE.test(email)) {
      toast({
        title: "Check the email",
        description: "Enter a valid address to get updates.",
        variant: "destructive",
      });
      return;
    }
    toast({
      title: "You're on the list",
      description: "We'll send a note when ems has something new.",
      variant: "success",
    });
    setEmail("");
  }

  return (
    <div className="d-stage min-h-svh">
      <a href="#main" className="d-skip-link">
        Skip to content
      </a>

      <header className="d-topbar sticky top-0 z-40 border-b border-white/10 backdrop-blur-md">
        <Container className="flex h-12 items-center gap-4">
          <a href="#top" className="text-[13px] font-semibold tracking-tight">
            ems
          </a>
          <nav className="hidden items-center gap-4 sm:flex" aria-label="Page">
            {NAV.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="text-[13px] text-[var(--d-muted)] hover:text-[var(--d-text)]"
              >
                {item.label}
              </a>
            ))}
          </nav>
          <div className="ml-auto hidden items-center gap-1.5 sm:flex">
            <Button to="/login" variant="ghost" size="sm">
              Sign in
            </Button>
            <Button to="/register" size="sm">
              Get started
            </Button>
          </div>
          <Sheet>
            <SheetTrigger
              className="d-focus ml-auto inline-flex h-8 items-center rounded-md border border-[var(--d-line-strong)] px-2.5 text-[12.5px] font-medium sm:hidden"
              aria-label="Open menu"
            >
              Menu
            </SheetTrigger>
            <SheetContent
              side="right"
              className="!border-[var(--d-line)] !bg-[var(--d-bg)] !text-[var(--d-text)]"
            >
              <SheetHeader>
                <SheetTitle className="!text-[var(--d-text)]">ems</SheetTitle>
                <SheetDescription className="!text-[var(--d-muted)]">
                  Jump to a section or sign in.
                </SheetDescription>
              </SheetHeader>
              <nav className="flex flex-col gap-3 text-[13px]" aria-label="Page">
                {NAV.map((item) => (
                  <a key={item.href} href={item.href}>
                    {item.label}
                  </a>
                ))}
              </nav>
              <div className="mt-auto flex flex-col gap-2">
                <Button to="/login" variant="secondary">
                  Sign in
                </Button>
                <Button to="/register">Get started</Button>
              </div>
            </SheetContent>
          </Sheet>
        </Container>
      </header>

      <main id="main">
        <Container id="top" size="md" className="py-16 sm:py-24">
          <Badge variant="outline">Event management, quietly</Badge>
          <h1 className="mt-4 max-w-xl text-[1.75rem] font-semibold leading-tight tracking-tight sm:text-4xl">
            A calmer way to gather people.
          </h1>
          <p className="mt-3 max-w-md text-[14px] leading-relaxed text-[var(--d-muted)]">
            ems is a small place to publish an event, take registrations, and see
            who is actually coming.
          </p>
          <div className="mt-6 flex flex-wrap items-center gap-2">
            <Button to="/register" size="lg">
              Create an account
            </Button>
            <Button href="#for" variant="secondary" size="lg">
              See who it is for
            </Button>
          </div>
        </Container>

        <Container id="for" size="md" className="scroll-mt-16 pb-12">
          <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
            <div>
              <h2 className="d-label">For you</h2>
              <p className="mt-1 text-[13px] text-[var(--d-muted)]">
                The same product, two sides of the room.
              </p>
            </div>
            <FilterTabs
              label="Who you are"
              options={AUDIENCES}
              value={audience}
              onChange={setAudience}
            />
          </div>
          <div className="grid gap-3 sm:grid-cols-3">
            {POINTS[audience].map((point) => (
              <Card key={point.title} className={cardClass}>
                <CardHeader>
                  <CardTitle className="text-[14px]">{point.title}</CardTitle>
                  <CardDescription className="!text-[var(--d-muted)]">
                    {point.body}
                  </CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
        </Container>

        <Separator className="!bg-white/10" />

        <Container id="how" size="md" className="scroll-mt-16 py-10">
          <h2 className="d-label">How it works</h2>
          <Tabs defaultValue="browse" className="mt-3">
            <TabsList className="!bg-white/[0.06] !text-[var(--d-muted)]">
              {STEPS.map((step) => (
                <TabsTrigger
                  key={step.value}
                  value={step.value}
                  className="hover:!text-[var(--d-text)] data-[state=active]:!bg-white data-[state=active]:!text-[var(--d-invert)]"
                >
                  {step.label}
                </TabsTrigger>
              ))}
            </TabsList>
            {STEPS.map((step) => (
              <TabsContent key={step.value} value={step.value} className="mt-4">
                <p className="text-[14px] font-medium">{step.title}</p>
                <p className="mt-1 max-w-md text-[13px] leading-relaxed text-[var(--d-muted)]">
                  {step.body}
                </p>
              </TabsContent>
            ))}
          </Tabs>
        </Container>

        <Container id="faq" size="md" className="scroll-mt-16 pb-12">
          <h2 className="d-label">Questions</h2>
          <Accordion type="single" collapsible defaultValue="cost" className="mt-2">
            {FAQS.map((item) => (
              <AccordionItem
                key={item.value}
                value={item.value}
                className="!border-white/10"
              >
                <AccordionTrigger className="!text-[var(--d-text)] hover:!no-underline">
                  {item.question}
                </AccordionTrigger>
                <AccordionContent className="!text-[var(--d-muted)]">
                  {item.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </Container>

        <Separator className="!bg-white/10" />

        <Container size="md" className="py-10">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h2 className="text-[15px] font-semibold tracking-tight">
                Hear when ems changes
              </h2>
              <p className="mt-1 text-[13px] text-[var(--d-muted)]">
                A short note. No account required.
              </p>
            </div>
            <form
              onSubmit={subscribe}
              className="flex w-full gap-2 sm:max-w-sm"
              noValidate
            >
              <Input
                type="email"
                name="email"
                autoComplete="email"
                placeholder="you@example.com"
                aria-label="Email address"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                className="!border-white/15 !bg-black/40 !text-[var(--d-text)] placeholder:!text-[var(--d-subtle)]"
              />
              <Button type="submit">Notify me</Button>
            </form>
          </div>
        </Container>
      </main>

      <footer className="border-t border-white/10">
        <Container className="flex h-12 items-center justify-between text-[12px] text-[var(--d-subtle)]">
          <span>ems</span>
          <Button to="/components" variant="ghost" size="sm">
            Components
          </Button>
        </Container>
      </footer>
    </div>
  );
}

export default Landing;
