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
  const { id } = router.query;

  const [productInfo, setProductInfo] = useState(null);
  const [loading, setLoading] = useState(true);

  // ✅ Redirect only if user is NOT logged in
  useEffect(() => {
    if (!session && status !== "loading") {
      router.push("/login");
    }
  }, [session, status, router]);

  useEffect(() => {
    if (!id) return;

    axios
      .get(`/api/blogapi?id=${id}`)
      .then((response) => {
        setProductInfo(response.data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [id]);

  function goback() {
    router.push("/blogs");
  }

  async function deleteOneblog() {
    if (!id) return;

    try {
      await axios.delete(`/api/blogapi?id=${id}`);
      goback();
    } catch (error) {
      console.error("Failed to delete blog:", error);
    }
  }

  if (status === "loading" || loading) {
    return (
      <div className="loadingdata flex flex-col items-center justify-center min-h-screen">
        <Loading />
        <h1 className="mt-4 text-lg font-semibold">Loading...</h1>
      </div>
    );
  }

  // ✅ Do not redirect immediately when session exists
  if (!session) return null;

  return (
    <>
      <Head>
        <title>Delete Blog</title>
      </Head>
      <div className="blogpage">
        <div className="titledashboard flex justify-between">
          <div>
            <h2>
              Delete <span>{productInfo?.title}</span>
            </h2>
            <h3>ADMIN PANEL</h3>
          </div>
          <div className="breadcrumb flex items-center gap-1">
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
