"use client";

import Blog from "@/components/Blog";
import axios from "axios";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { BiPodcast } from "react-icons/bi";
import Head from "next/head";
import Loading from "@/components/Loading";
import { useSession } from "next-auth/react";

export default function EditBlog() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { id } = router.query;

  const [productInfo, setProductInfo] = useState(null);
  const [loading, setLoading] = useState(true);

  // ✅ Fix: Redirect only if user is NOT logged in
  useEffect(() => {
    if (!session) {
      router.push("/login");
    }
  }, [session, router]);

  useEffect(() => {
    if (!id) return; // ✅ Fix: Ensure `id` is defined before making API request

    setLoading(true);
    axios
      .get(`/api/blogapi?id=${id}`)
      .then((response) => {
        setProductInfo(response.data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="loadingdata flex flex-col items-center justify-center min-h-screen">
        <Loading />
        <h1 className="mt-4 text-lg font-semibold">Loading...</h1>
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>Update blog</title>
      </Head>
      <div className="blogpage">
        <div className="titledashboard flex justify-between">
          <div>
            <h2>
              Edit <span>{productInfo?.title}</span>
            </h2>
            <h3>ADMIN PANEL</h3>
          </div>
          <div className="breadcrumb flex items-center gap-1">
            <BiPodcast /> <span>/</span>
            <span>Edit Blogs</span>
          </div>
        </div>
        <div className="mt-3">{productInfo && <Blog {...productInfo} />}</div>
      </div>
    </>
  );
}
