import { FormEvent, useState } from "react";
import { User } from "../App";

interface RegisterProps {
  setUser: (user: User) => void;
  setLoggedIn: (loggedIn: boolean) => void;
  setStreak: (clicks: number) => void;
  setIsNewUser: (user: boolean) => void;
}

export default function Register({ setUser, setLoggedIn, setStreak, setIsNewUser }: RegisterProps) {
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [invalidUsername, setInvalidUsername] = useState(false);

  const handleRegister = (e: FormEvent) => {
    e.preventDefault();
    const expirationDate = new Date();
    expirationDate.setDate(expirationDate.getDate() + 7);

    fetch("http://localhost:3000/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, password }),
    })
      .then((res) => res.json())
      .then((user) => {
        console.log("registered user", user);
        if (user === "unable to create user") {
          setInvalidUsername(true);
          setUsername("");
          setPassword("");
          return;
        } else {
          document.cookie = `user = ${user}; expires=${expirationDate}`;
          document.cookie = `lastClickedTime = ${user.lastClickTime}; expires=${expirationDate}`;
          setInvalidUsername(false);
          setUser(user);
          setLoggedIn(true);
          setStreak(user.consecutiveClickDays);
        }
      });
  };

  return (
    <section className="mt-20">
      <h1>Register</h1>
      <form className="flex flex-col gap-3 mb-1" onSubmit={handleRegister}>
        {invalidUsername && <span>Sorry, that username is unavailable</span>}
        <input
          className="px-4 py-1 rounded-sm w-72 shadow-md"
          type="text"
          value={username}
          placeholder="username"
          onChange={(e) => setUsername(e.target.value)}
          required
        />
        <input
          className="px-4 py-1 rounded-sm w-72 shadow-md"
          type="password"
          value={password}
          placeholder="password"
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button
          className="w-full bg-purple-400 text-white rounded-xl px-8 py-1 shadow-md hover:brightness-90"
          type="submit"
        >
          Register
        </button>
      </form>
      <a
        className="underline mt-2 hover:brightness-90"
        href="#"
        onClick={() => setIsNewUser(false)}
      >
        Already registered? Login here
      </a>
    </section>
  );
}
