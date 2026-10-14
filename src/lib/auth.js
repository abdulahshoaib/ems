import { users } from "./data";

export function auth(client_user) {
  const authenticatedUser = users.find(
    (user) =>
      user.email === client_user.email &&
      user.password === client_user.password,
  );

  return !!authenticatedUser;
}
