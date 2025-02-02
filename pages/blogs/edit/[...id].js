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
  // const { data: session, status } = useSession();
  const router = useRouter();

  const [loading, setLoading] = useState(true);

  // useEffect(() => {
  //   if (!session) {
  //     router.push("/login");
  //   }
  // }, [session, router]);

  // if (status === "loading") {
  //   return (
  //     <div className="loadingdata flex flex-col items-center justify-center min-h-screen">
  //       <Loading />
  //       <h1 className="mt-4 text-lg font-semibold">Loading...</h1>
  //     </div>
  //   );
  // }

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

  // if (session) {
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
  // }
}
