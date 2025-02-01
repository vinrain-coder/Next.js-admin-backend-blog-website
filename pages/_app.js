import Aos from "@/components/Aos";
import Aside from "@/components/Aside";
import Header from "@/components/Header";
import Loading from "@/components/Loading";
import "@/styles/globals.css";
import { SessionProvider } from "next-auth/react";
import { useState } from "react";

export default function App({
  Component,
  pageProps: { session, ...pageProps },
}) {
  const [loading, setLoading] = useState(false);

  return (
    <>
      <SessionProvider session={session}>
        {loading ? (
          <div className="flex flex-col flex-center wh_100">
            <Loading />
            <h1>Loading...</h1>
          </div>
        ) : (
          <>
            <Header />
            <Aside />
            <main>
              <Aos>
                <Component {...pageProps} />;
              </Aos>
            </main>
          </>
        )}
      </SessionProvider>
    </>
  );
}
