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

export default function Draft() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (status === "loading") return; // Don't redirect while loading
    if (!session) {
      router.push("/login");
    }
  }, [session, status, router]);

  // If session is loading or component hasn't mounted yet, render loading state
  if (!mounted || status === "loading") {
    return (
      <div className="loadingdata flex flex-col flex-center wh_100">
        <Loading />
        <h1 className="mt-4 text-lg font-semibold">Loading...</h1>
      </div>
    );
  }

  const { alldata, loading, error } = useFetchData("/api/blogapi");

  if (error) {
    console.error("Error fetching draft blogs:", error.message);
    return (
      <div>
        <h2>Failed to load draft blogs</h2>
        <p>{error.message}</p>
      </div>
    );
  }

  const [currentPage, setCurrentPage] = useState(1);
  const perpage = 10;

  if (!alldata) return null; // Prevent errors when data is not loaded

  const draftBlogs = alldata.filter((blog) => blog.status === "draft");

  const indexOfLastBlog = currentPage * perpage;
  const indexOfFirstBlog = indexOfLastBlog - perpage;
  const currentBlogs = draftBlogs.slice(indexOfFirstBlog, indexOfLastBlog);

  const totalBlogs = draftBlogs.length;
  const pageNumbers = [];
  for (let i = 1; i <= Math.ceil(totalBlogs / perpage); i++) {
    pageNumbers.push(i);
  }

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <>
      <Head>
        <title>Draft Blogs</title>
      </Head>
      <div className="blogpage">
        <div className="titledashboard flex flex-sb">
          <div data-aos="fade-right">
            <h2>
              All draft <span>blogs</span>
            </h2>
            <h3>ADMIN PANEL</h3>
          </div>
          <div className="breadcrumb" data-aos="fade-left">
            <BiPodcast /> <span>/</span>
            <span>Blogs</span>
          </div>
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
                    No draft blogs
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
