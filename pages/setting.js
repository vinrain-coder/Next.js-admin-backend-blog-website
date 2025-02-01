import Loading from "@/components/Loading";
import { useSession, signOut } from "next-auth/react";
import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { IoSettingsOutline } from "react-icons/io5";
import { MdOutlineAccountCircle } from "react-icons/md";

export default function Setting() {
  const { data: session, loading } = useSession();

  const router = useRouter();

  useEffect(() => {
    if (!session) {
      router.push("/login");
    }
  }, [session, router]);

  if (loading) {
    return (
      <div className="loadingdata flex flex-col flex-center wh_100">
        <Loading />
        <h1 className="mt-4 text-lg font-semibold">Loading...</h1>
      </div>
    );
  }

  async function logout() {
    await signOut();
    await router.push("/login");
  }

  if (session) {
    return (
      <>
        <Head>
          <title>Settings</title>
        </Head>
        <div className="settingpage">
          <div className="titledashboard flex flex-sb">
            <div data-aos="fade-right">
              <h2>
                Admin <span>settings</span>
              </h2>
              <h3>ADMIN PANEL</h3>
            </div>
            <div className="breadcrumb" data-aos="fade-left">
              <IoSettingsOutline /> <span>/</span>
              <span>Settings</span>
            </div>
          </div>
          <div className="profilesettings">
            <div className="leftprofile_details flex" data-aos="fade-up">
              <img src="/img/logo.png" alt="Logo" />
              <div className="w-100">
                <div className="flex flex-sb flex-left mt-2">
                  <h2>My profile:</h2>
                  <h3>{session.user.name}</h3>
                </div>
                <div className="mt-2">
                  <h3>{session.user.email}</h3>
                </div>
              </div>
            </div>
            <div className="rightlogoutsec" data-aos="fade-left">
              <div className="topaccountbox">
                <h2 className="flex flex-sb">
                  My account
                  <MdOutlineAccountCircle />
                </h2>
                <hr />
                <div className="flex flex-sb mt-1">
                  <button onClick={logout} className="acceptButton">
                    Logout
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }
}
