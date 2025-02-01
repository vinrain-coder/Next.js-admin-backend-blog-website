import Dataloading from "@/components/Dataloading";
import Loading from "@/components/Loading";
import useFetchData from "@/hooks/useFetchData";
import { useSession } from "next-auth/react";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { BiPodcast } from "react-icons/bi";
import { FaEdit } from "react-icons/fa";
import { RiDeleteBin6Fill } from "react-icons/ri";

export default function draft() {
  const { data: session, status } = useSession();
  const router = useRouter();

  if (session) {
    router.push("/blogs");
    return null;
  }

  useEffect(() => {
    if (!session) {
      router.push("/login");
    }
  }, [session, router]);

  if (status === "loading") {
    return (
      <div className="loadingdata flex flex-col flex-center wh_100">
        <Loading />
        <h1 className="mt-4 text-lg font-semibold">Loading...</h1>
      </div>
    );
  }

  const [currentPage, setCurrentPage] = useState(1); // Initialize current page
  const [perpage] = useState(4); // Set the number of blogs per page

  const { alldata, loading } = useFetchData("/api/blogapi"); // Fetch all data using custom hook

  const paginate = (pageNumber) => {
    setCurrentPage(pageNumber); // Update the current page when a pagination button is clicked
  };

  // Filter draft blogs
  const draftBlogs = alldata.filter((ab) => ab.status === "draft");

  // Calculate pagination indexes
  const indexOfLastBlog = currentPage * perpage; // Index of the last blog on the current page
  const indexOfFirstBlog = indexOfLastBlog - perpage; // Index of the first blog on the current page
  const currentBlogs = draftBlogs.slice(indexOfFirstBlog, indexOfLastBlog); // Blogs for the current page

  // Total number of pages
  const totalDrafts = draftBlogs.length; // Total number of draft blogs
  const pageNumbers = []; // Array to store page numbers
  for (let i = 1; i <= Math.ceil(totalDrafts / perpage); i++) {
    pageNumbers.push(i);
  }

  if (session) {
    return (
      <>
        <Head>
          <title>Drafted blogs</title>
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
              <span>Draft blogs</span>
            </div>
          </div>

          <div className="blogstable" data-aos="fade-up">
            <table className="table teble-styling">
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
                  <>
                    <tr>
                      <td colSpan={4}>
                        <Dataloading /> {/* Display loading state for data */}
                      </td>
                    </tr>
                  </>
                ) : (
                  <>
                    {currentBlogs.length === 0 ? ( // Check if there are no blogs on the current page
                      <tr>
                        <td colSpan={4} className="text-center">
                          No draft blogs
                        </td>
                      </tr>
                    ) : (
                      currentBlogs.map((blog, index) => (
                        <tr key={blog._id}>
                          <td>
                            {indexOfFirstBlog + index + 1}{" "}
                            {/* Show correct numbering */}
                          </td>
                          <td>
                            <h3>{blog.title}</h3> {/* Display blog title */}
                          </td>
                          <td>
                            <pre>{blog.slug}</pre> {/* Display blog slug */}
                          </td>
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
                  </>
                )}
              </tbody>
            </table>
            {totalDrafts === 0 ? (
              ""
            ) : (
              <div className="blogpagination">
                <button
                  onClick={() => paginate(currentPage - 1)}
                  disabled={currentPage === 1} // Disable "Previous" button on the first page
                >
                  Previous
                </button>
                {pageNumbers
                  .slice(
                    Math.max(currentPage - 3, 0), // Show a range of page numbers
                    Math.min(currentPage + 2, pageNumbers.length)
                  )
                  .map((number) => (
                    <button
                      key={number}
                      onClick={() => paginate(number)} // Change page on button click
                      className={`${currentPage === number ? "active" : ""}`} // Highlight active page
                    >
                      {number}
                    </button>
                  ))}
                <button
                  onClick={() => paginate(currentPage + 1)}
                  disabled={currentPage >= pageNumbers.length} // Disable "Next" button on the last page
                >
                  Next
                </button>
              </div>
            )}
          </div>
        </div>
      </>
    );
  }
}
