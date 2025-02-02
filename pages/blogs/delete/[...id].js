"use client";

import Loading from "@/components/Loading";
import axios from "axios";
import { useSession } from "next-auth/react";
import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { RiDeleteBin6Fill } from "react-icons/ri";

export default function DeleteBlog() {
  const { data: session, status } = useSession();
  const router = useRouter();

  // ✅ Fix: Redirect only if user is NOT logged in
  useEffect(() => {
    if (!session) {
      router.push("/login");
    }
  }, [session, router]);

  if (status === "loading") {
    return (
      <div className="loadingdata flex flex-col items-center justify-center min-h-screen">
        <Loading />
        <h1 className="mt-4 text-lg font-semibold">Loading...</h1>
      </div>
    );
  }

  const { id } = router.query;

  const [productInfo, setProductInfo] = useState(null);

  useEffect(() => {
    if (!id) {
      return;
    } else {
      axios.get(`/api/blogapi?id=` + id).then((response) => {
        setProductInfo(response.data);
      });
    }
  }, [id]);

  function goback() {
    router.push("/");
  }

  async function deleteOneblog() {
    await axios.delete(`/api/blogapi?id=` + id);
    goback();
  }

  if (session) {
    return (
      <>
        <Head>
          <title>Delete Blog</title>
        </Head>
        <div className="blogpage">
          <div className="titledashboard flex flex-sb">
            <div data-aos="fade-right">
              <h2>
                Delete <span>{productInfo?.title}</span>
              </h2>
              <h3>ADMIN PANEL</h3>
            </div>
            <div className="breadcrumb" data-aos="fade-left">
              <RiDeleteBin6Fill /> <span>/</span>
              <span>Delete Blog</span>
            </div>
          </div>
          <div className="deletesec flex flex-center wh_100">
            <div className="deletecard">
              <svg viewBox="0 0 24 24" fill="red" height="6em" width="6em">
                <path d="M4 19V7h12v12c0 1.1-.9 2-2 2H6c-1.1 0-2-.9-2-2-2M6 9v10h8V9H6m7.5-5H17v2H3V4h3.5l1-1h5l1 1M19 17v-2h2v2h-2m0-4Vh2v6h-2z" />
              </svg>
              <p className="cookieHeading">Are you sure?</p>
              <p className="cookieDescription">
                This action is permanent and cannot be reversed.
              </p>
              <div className="buttonContainer">
                <button onClick={deleteOneblog} className="acceptButton">
                  Delete
                </button>
                <button onClick={goback} className="declineButton">
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }
}
