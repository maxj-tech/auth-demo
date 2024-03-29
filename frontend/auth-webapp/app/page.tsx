import { useSession, signIn, signOut } from "next-auth/react";

export default function Home() {
  const { data: session } = useSession();

  if (session) {
    return (
      <>
        <h1>Secret Chamber</h1>
        <p>Welcome to the secret chamber, {session.user.email}!</p>
        <button onClick={() => signOut()}>Sign out</button>
      </>
    );
  }
  return (
    <>
      <h1>You must sign in to view the secret chamber</h1>
      <button onClick={() => signIn()}>Sign in</button>
    </>
  );
}