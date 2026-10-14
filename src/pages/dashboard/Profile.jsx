import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { login } from "../../features/auth/authSlice";
import { Button } from "../../components/ui/button";
import { Section } from "../../components/ui/section";
import { Input } from "../../components/ui";

export function Profile() {
  const user = useSelector((state) => state.auth.user);
  const dispatch = useDispatch();

  const [name, setName] = useState(user?.fullname ?? "");
  const [email, setEmail] = useState(user?.email ?? "");

  if (!user) {
    return <p>Please sign in to view your profile.</p>;
  }

  function handleSubmit(event) {
    event.preventDefault();

    const updatedUser = {
      ...user,
      fullname: name,
      email,
    };

    dispatch(login(updatedUser));
    localStorage.setItem("currentUser", JSON.stringify(updatedUser));
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="text-lg font-semibold">{user.fullname}</h2>
        <p className="text-sm text-(--d-muted)">{user.email}</p>
      </div>

      <Section title="Edit profile">
        <form onSubmit={handleSubmit} className="flex max-w-md flex-col gap-4">
          <div className="flex flex-col gap-1">
            <label htmlFor="name">Full name</label>
            <Input
              id="name"
              value={name}
              onChange={(event) => setName(event.target.value)}
              className="rounded-md border p-2"
              required
            />
          </div>

          <div className="flex flex-col gap-1">
            <label htmlFor="email">Email</label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className="rounded-md border p-2"
              required
            />
          </div>

          <Button type="submit" size="sm">
            Save changes
          </Button>
        </form>
      </Section>
    </div>
  );
}
