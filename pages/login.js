import Image from "next/image";
import { useSession, signIn } from "next-auth/react";
import { useRouter } from "next/router";
import Loading from "@/components/Loading";

export default function Login() {
  const { data: session, status } = useSession();
  const router = useRouter();

  // Redirect user to the homepage if already logged in
  if (session) {
    router.push("/");
    return null;
  }

  // Display loading state
  if (status === "loading") {
    return (
      <div className="loadingdata flex flex-col flex-center wh_100">
        <Loading />
        <h1 className="mt-4 text-lg font-semibold">Loading...</h1>
      </div>
    );
  }

  // Login with Google
  async function handleLogin() {
    await signIn("google");
  }

  return (
    <div className="loginfront flex flex-center flex-col full-w mt-25">
      <Image
        src="/img/logo.png"
        alt="Shoepedi Logo"
        width={250}
        height={250}
        priority
      />
      <h1>Welcome to Shoepedi</h1>
      <p>
        Visit our main website{" "}
        <a
          href="https://blog.shoepedi.com"
          target="_blank"
          rel="noopener noreferrer"
        >
          Shoepedi Blog
        </a>
      </p>
      <button
        onClick={handleLogin}
        className="mt-2"
      >
        Login with Google
      </button>
    </div>
  );
}
