import Image from "next/image";
import { useSession, signIn } from "next-auth/react";
import { useRouter } from "next/router";
import Loading from "@/components/Loading";

export default function Login() {
  const { data: session, status } = useSession();

  const router = useRouter();

  if (status === "loading") {
    return (
      <div className="loadingdata flex flex-col flex-center wh_100">
        <Loading />
        <h1>Loading...</h1>
      </div>
    );
  }

  async function login() {
    await router.push("/");
    await signIn();
  }

  if (session) {
    router.push("/");
    return null;
  }

  return (
    <div className="loginfront flex flex-center flex-col full-w mt-25">
      <Image src="/img/logo.png" alt="Logo" width={250} height={250} />
      <h1>Welcome Admin of Shoepedi</h1>
      <p>
        Visit our main website{" "}
        <a href="https://blog.shoepedi.com">Shoepedi blog</a>
      </p>
      <button onClick={login} className="mt-2">
        Login with Google
      </button>
    </div>
  );
}
