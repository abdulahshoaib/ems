import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
  Alert,
  AlertDescription,
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
  AlertTitle,
  Avatar,
  Badge,
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
  Button,
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
  Checkbox,
  Container,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  Input,
  Label,
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
  Popover,
  PopoverContent,
  PopoverTrigger,
  Progress,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Separator,
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  Skeleton,
  Spinner,
  Switch,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
  Textarea,
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  useToast,
} from "../components/ui";

const triggerClass =
  "inline-flex h-8 items-center justify-center rounded-md border border-zinc-200 px-3 text-[13px] font-medium text-zinc-900 transition-colors hover:bg-zinc-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-400 dark:border-zinc-800 dark:text-zinc-50 dark:hover:bg-zinc-800";

function PlusIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-3.5 w-3.5"
      aria-hidden="true"
    >
      <path d="M12 5v14M5 12h14" />
    </svg>
  );
}

function Section({ title, children, className, contentClassName }) {
  return (
    <section className={className}>
      <h3 className="mb-2 text-[11px] font-semibold uppercase tracking-wider text-zinc-500">
        {title}
      </h3>
      <div
        className={
          contentClassName ??
          "flex flex-wrap items-center gap-2 rounded-lg border border-zinc-200 bg-zinc-50/60 p-3 dark:border-zinc-800 dark:bg-zinc-900/40"
        }
      >
        {children}
      </div>
    </section>
  );
}

function Components() {
  const { toast } = useToast();

  return (
    <Container className="py-8 text-left">
      <header className="mb-6">
        <div className="text-2xl font-semibold text-zinc-900 dark:text-zinc-50">
          Components
        </div>
        <p className="mt-1 text-[13px] text-zinc-500 dark:text-zinc-400">
          Every reusable UI element in one place.
        </p>
      </header>

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
        <Section title="Button">
          <Button>Default</Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="outline">Outline</Button>
          <Button variant="ghost">Ghost</Button>
          <Button variant="destructive">Destructive</Button>
          <Button variant="link">Link</Button>
          <Button size="sm">Small</Button>
          <Button size="lg">Large</Button>
          <Button size="icon" variant="outline" aria-label="Add item">
            <PlusIcon />
          </Button>
          <Button disabled>Disabled</Button>
        </Section>

        <Section title="Inputs" contentClassName="grid gap-3 rounded-lg border border-zinc-200 bg-zinc-50/60 p-3 dark:border-zinc-800 dark:bg-zinc-900/40">
          <Input placeholder="Email address" type="email" />
          <Textarea placeholder="Tell us about your event…" />
          <div className="grid gap-1.5">
            <Label htmlFor="name">Name</Label>
            <Input id="name" placeholder="Ada Lovelace" />
          </div>
          <div className="flex items-center gap-4">
            <label className="flex items-center gap-2 text-[13px]">
              <Checkbox defaultChecked /> Remember me
            </label>
            <label className="flex items-center gap-2 text-[13px]">
              <Switch defaultChecked /> Notifications
            </label>
          </div>
        </Section>

        <Section title="Select">
          <Select defaultValue="react">
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Pick a framework" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="react">React</SelectItem>
              <SelectItem value="vue">Vue</SelectItem>
              <SelectItem value="svelte">Svelte</SelectItem>
            </SelectContent>
          </Select>
        </Section>

        <Section title="Badge">
          <Badge>Default</Badge>
          <Badge variant="secondary">Secondary</Badge>
          <Badge variant="outline">Outline</Badge>
          <Badge variant="success">Success</Badge>
          <Badge variant="warning">Warning</Badge>
          <Badge variant="destructive">Destructive</Badge>
        </Section>

        <Section title="Avatar">
          <Avatar name="Sofia Davis" src="https://github.com/shadcn.png" />
          <Avatar name="Alex Lee" />
          <Avatar name="Lena Gray" size="lg" />
        </Section>

        <Section
          title="Card"
          contentClassName="rounded-lg border border-zinc-200 bg-zinc-50/60 p-3 dark:border-zinc-800 dark:bg-zinc-900/40"
        >
          <Card className="w-full max-w-xs">
            <CardHeader>
              <CardTitle>Event ticket</CardTitle>
              <CardDescription>Front row seat, all access.</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-[13px] text-zinc-500 dark:text-zinc-400">
                Doors open at 7:00 PM.
              </p>
            </CardContent>
            <CardFooter className="gap-2">
              <Button size="sm">Buy</Button>
              <Button size="sm" variant="outline">
                Details
              </Button>
            </CardFooter>
          </Card>
        </Section>

        <Section
          title="Alert"
          className="lg:col-span-2"
          contentClassName="grid gap-2 rounded-lg border border-zinc-200 bg-zinc-50/60 p-3 dark:border-zinc-800 dark:bg-zinc-900/40 sm:grid-cols-2"
        >
          <Alert variant="info">
            <AlertTitle>Heads up</AlertTitle>
            <AlertDescription>A new version is available.</AlertDescription>
          </Alert>
          <Alert variant="success">
            <AlertTitle>Saved</AlertTitle>
            <AlertDescription>Your changes were saved.</AlertDescription>
          </Alert>
          <Alert variant="warning">
            <AlertTitle>Careful</AlertTitle>
            <AlertDescription>This action can’t be undone.</AlertDescription>
          </Alert>
          <Alert variant="destructive">
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>Something went wrong.</AlertDescription>
          </Alert>
        </Section>

        <Section title="Dialog">
          <Dialog>
            <DialogTrigger className={triggerClass}>Open dialog</DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Edit profile</DialogTitle>
                <DialogDescription>
                  Make changes and save when you’re done.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-1.5">
                <Label htmlFor="dialog-name">Name</Label>
                <Input id="dialog-name" defaultValue="Ada Lovelace" />
              </div>
              <DialogFooter>
                <Button variant="outline">Cancel</Button>
                <Button>Save</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          <AlertDialog>
            <AlertDialogTrigger className={triggerClass}>
              Delete item
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This permanently deletes the item.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction>Delete</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </Section>

        <Section title="Sheet">
          <Sheet>
            <SheetTrigger className={triggerClass}>Open sheet</SheetTrigger>
            <SheetContent side="right">
              <SheetHeader>
                <SheetTitle>Filters</SheetTitle>
                <SheetDescription>Narrow down your results.</SheetDescription>
              </SheetHeader>
              <div className="grid gap-1.5">
                <Label htmlFor="sheet-query">Search</Label>
                <Input id="sheet-query" placeholder="Search events" />
              </div>
            </SheetContent>
          </Sheet>
        </Section>

        <Section title="Dropdown menu">
          <DropdownMenu>
            <DropdownMenuTrigger className={triggerClass}>
              Open menu
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start">
              <DropdownMenuLabel>My account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Profile</DropdownMenuItem>
              <DropdownMenuItem>Billing</DropdownMenuItem>
              <DropdownMenuItem>Settings</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-red-600 dark:text-red-400">
                Sign out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <Popover>
            <PopoverTrigger className={triggerClass}>
              Open popover
            </PopoverTrigger>
            <PopoverContent align="start">
              <div className="grid gap-1.5">
                <p className="text-[13px] font-medium">Dimensions</p>
                <Input defaultValue="100%" />
              </div>
            </PopoverContent>
          </Popover>

          <Tooltip>
            <TooltipTrigger className={triggerClass}>Hover me</TooltipTrigger>
            <TooltipContent>Compact tooltip</TooltipContent>
          </Tooltip>
        </Section>

        <Section
          title="Tabs"
          contentClassName="rounded-lg border border-zinc-200 bg-zinc-50/60 p-3 dark:border-zinc-800 dark:bg-zinc-900/40"
        >
          <Tabs defaultValue="overview">
            <TabsList>
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="details">Details</TabsTrigger>
              <TabsTrigger value="settings">Settings</TabsTrigger>
            </TabsList>
            <TabsContent value="overview">
              <p className="text-[13px] text-zinc-500 dark:text-zinc-400">
                Overview panel content.
              </p>
            </TabsContent>
            <TabsContent value="details">
              <p className="text-[13px] text-zinc-500 dark:text-zinc-400">
                Details panel content.
              </p>
            </TabsContent>
            <TabsContent value="settings">
              <p className="text-[13px] text-zinc-500 dark:text-zinc-400">
                Settings panel content.
              </p>
            </TabsContent>
          </Tabs>
        </Section>

        <Section
          title="Accordion"
          contentClassName="rounded-lg border border-zinc-200 bg-zinc-50/60 px-3 dark:border-zinc-800 dark:bg-zinc-900/40"
        >
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="one">
              <AccordionTrigger>What is this?</AccordionTrigger>
              <AccordionContent>
                A compact set of reusable UI primitives.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="two" className="border-b-0">
              <AccordionTrigger>Can I theme it?</AccordionTrigger>
              <AccordionContent>
                Yes — everything is Tailwind utility classes.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </Section>

        <Section
          title="Breadcrumb"
          className="lg:col-span-2"
          contentClassName="rounded-lg border border-zinc-200 bg-zinc-50/60 p-3 dark:border-zinc-800 dark:bg-zinc-900/40"
        >
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href="#">Home</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink href="#">Events</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>Details</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </Section>

        <Section title="Pagination">
          <Pagination className="justify-start">
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious href="#" />
              </PaginationItem>
              <PaginationItem>
                <PaginationLink href="#">1</PaginationLink>
              </PaginationItem>
              <PaginationItem>
                <PaginationLink href="#" isActive>
                  2
                </PaginationLink>
              </PaginationItem>
              <PaginationItem>
                <PaginationLink href="#">3</PaginationLink>
              </PaginationItem>
              <PaginationItem>
                <PaginationNext href="#" />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </Section>

        <Section title="Skeleton & Spinner">
          <div className="grid w-full gap-2">
            <Skeleton className="h-3 w-48" />
            <Skeleton className="h-3 w-32" />
          </div>
          <div className="flex items-center gap-3">
            <Spinner size="sm" />
            <Spinner />
            <Spinner size="lg" />
          </div>
        </Section>

        <Section
          title="Progress & Separator"
          className="lg:col-span-2"
          contentClassName="rounded-lg border border-zinc-200 bg-zinc-50/60 p-3 dark:border-zinc-800 dark:bg-zinc-900/40"
        >
          <div className="w-full space-y-3">
            <Progress value={64} />
            <Separator />
            <div className="flex h-6 items-center gap-3 text-[13px] text-zinc-500">
              <span>Left</span>
              <Separator orientation="vertical" />
              <span>Center</span>
              <Separator orientation="vertical" />
              <span>Right</span>
            </div>
          </div>
        </Section>

        <Section title="Toast">
          <Button
            variant="outline"
            onClick={() =>
              toast({
                title: "Saved",
                description: "Your changes were saved.",
              })
            }
          >
            Default toast
          </Button>
          <Button
            variant="outline"
            onClick={() =>
              toast({
                variant: "success",
                title: "Success",
                description: "Event created successfully.",
              })
            }
          >
            Success toast
          </Button>
          <Button
            variant="outline"
            onClick={() =>
              toast({
                variant: "destructive",
                title: "Error",
                description: "Could not reach the server.",
              })
            }
          >
            Error toast
          </Button>
        </Section>
      </div>
    </Container>
  );
}

export default Components;
