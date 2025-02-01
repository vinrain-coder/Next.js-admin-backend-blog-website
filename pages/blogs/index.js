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
  const { data: session, status } = useSession();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (status === "loading") return; // Don't redirect while loading
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  const { alldata, loading, error } = useFetchData("/api/blogapi");

  // Handle errors when data fails to load
  if (error) {
    console.error("Error fetching data:", error.message); // Log error to debug
    return (
      <div>
        <h2>Failed to load data</h2>
        <p>{error.message}</p>
      </div>
    );
  }

  // Render loading state if session or data is not yet available
  if (!mounted || status === "loading" || !alldata) {
    return (
      <div className="loadingdata flex flex-col flex-center wh_100">
        <Loading />
        <h1 className="mt-4 text-lg font-semibold">Loading...</h1>
      </div>
    );
  }

  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [perpage] = useState(10);

  const paginate = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const publishedBlogs = alldata?.filter((ab) => ab.status === "publish") || [];

  const filteredBlogs =
    searchQuery.trim() === ""
      ? publishedBlogs
      : publishedBlogs.filter((blog) =>
          blog.title.toLowerCase().includes(searchQuery.toLowerCase())
        );

  const indexOfLastBlog = currentPage * perpage;
  const indexOfFirstBlog = indexOfLastBlog - perpage;
  const currentBlogs = filteredBlogs.slice(indexOfFirstBlog, indexOfLastBlog);

  const totalBlogs = filteredBlogs.length;
  const pageNumbers = [];
  for (let i = 1; i <= Math.ceil(totalBlogs / perpage); i++) {
    pageNumbers.push(i);
  }

  // Reset page to 1 when search query changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery]);

  return (
    <>
      <Head>
        <title>Published blogs</title>
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

        <div className="search-box">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search blogs"
            className="search-input"
          />
        </div>

        <div className="blogstable">
          <table className="table teble-styling" data-aos="fade-up">
            <thead>
              <tr>
                <th>#</th>
                <th>Title</th>
                <th>Slug</th>
                <th>Edit / Delete</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
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
                    <td>
                      <h3>{blog.title}</h3>
                    </td>
                    <td>
                      <pre>{blog.slug}</pre>
                    </td>
                    <td>
                      <div className="flex gap-2 flex-center">
                        <Link href={`/blogs/edit/${blog._id}`}>
                          <button title="edit">
                            <FaEdit />
                          </button>
                        </Link>
                        <Link href={`/blogs/delete/${blog._id}`}>
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
              onClick={() => paginate(currentPage - 1)}
              disabled={currentPage === 1}
            >
              Previous
            </button>
            {pageNumbers.map((number) => (
              <button
                key={number}
                onClick={() => paginate(number)}
                className={currentPage === number ? "active" : ""}
              >
                {number}
              </button>
            ))}
            <button
              onClick={() => paginate(currentPage + 1)}
              disabled={currentPage >= pageNumbers.length}
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
