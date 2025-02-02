"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import Head from "next/head";
import Link from "next/link";
import { BiPodcast } from "react-icons/bi";
import { FaEdit } from "react-icons/fa";
import { RiDeleteBin6Fill } from "react-icons/ri";
import useFetchData from "@/hooks/useFetchData";
import Loading from "@/components/Loading";
import Dataloading from "@/components/Dataloading";

export default function Blogs() {
  const { data: session,  status } = useSession();
  const router = useRouter();
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const perpage = 10;

  useEffect(() => {
    if (!session ) {
      router.push("/login");
    }
  }, [session, router]);

  if (status==='loading') {
    return (
      <div className="loadingdata flex flex-col flex-center wh_100">
        <Loading />
        <h1 className="mt-4 text-lg font-semibold">Loading...</h1>
      </div>
    );
  }

  const { alldata } = useFetchData("/api/blogapi");

  // Filter for published blogs
  const publishedBlogs =
    alldata?.filter((blog) => blog.status === "publish") || [];

  // Search functionality
  const filteredBlogs =
    searchQuery.trim() === ""
      ? publishedBlogs
      : publishedBlogs.filter((blog) =>
          blog.title.toLowerCase().includes(searchQuery.toLowerCase())
        );

  const indexOfLastBlog = currentPage * perpage;
  const indexOfFirstBlog = indexOfLastBlog - perpage;
  const currentBlogs = filteredBlogs.slice(indexOfFirstBlog, indexOfLastBlog);

  const totalPages = Math.ceil(filteredBlogs.length / perpage);

  useEffect(() => {
    setCurrentPage(1); // Reset page number on search query change
  }, [searchQuery]);

  if (session) {
    return (
      <>
        <Head>
          <title>Published Blogs</title>
        </Head>
        <div className="blogpage">
          <div className="titledashboard flex flex-sb">
            <div data-aos="fade-right">
              <h2>
                All published <span>blogs</span>
              </h2>
              <h3>ADMIN PANEL</h3>
            </div>
            <div className="breadcrumb" data-aos="fade-left">
              <BiPodcast /> <span>/</span>
              <span>Blogs</span>
            </div>
          </div>

          <div className="blogstable">
            <div className="flex gap-2 mb-1" data-aos="fade-up">
              <h2>Search blogs</h2>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search blogs"
              />
            </div>

            <table className="table table-styling" data-aos="fade-up">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Title</th>
                  <th>Slug</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {status==='loading' ? (
                  <tr>
                    <td colSpan={4}>
                      <Dataloading />
                    </td>
                  </tr>
                ) : currentBlogs.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="text-center">
                      No published blogs
                    </td>
                  </tr>
                ) : (
                  currentBlogs.map((blog, index) => (
                    <tr key={blog._id}>
                      <td>{indexOfFirstBlog + index + 1}</td>
                      <td>{blog.title}</td>
                      <td>{blog.slug}</td>
                      <td>
                        <div className="flex gap-2 flex-center">
                          <Link href={"/blogs/edit/" + blog._id}>
                            <button title="edit">
                              <FaEdit />
                            </button>
                          </Link>
                          <Link href={"/blogs/delete/" + blog._id}>
                            <button title="delete">
                              <RiDeleteBin6Fill />
                            </button>
                          </Link>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>

            <div className="blogpagination">
              <button
                onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                disabled={currentPage === 1}
              >
                Previous
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                (num) => (
                  <button
                    key={num}
                    onClick={() => setCurrentPage(num)}
                    className={currentPage === num ? "active" : ""}
                  >
                    {num}
                  </button>
                )
              )}
              <button
                onClick={() =>
                  setCurrentPage((p) => Math.min(p + 1, totalPages))
                }
                disabled={currentPage >= totalPages}
              >
                Next
              </button>
            </div>
          </div>
        </div>
      </>
    );
  }
}
