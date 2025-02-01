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

export default function Blogs() {
  const { data: session, status } = useSession();

  const router = useRouter();

  useEffect(() => {
    if (!session) {
      router.push("/login");
    }
  }, [session, router]);

  const { alldata, loading } = useFetchData("/api/blogapi");

  if (status === "loading") {
    return (
      <div className="loadingdata flex flex-col flex-center wh_100">
        <Loading />
        <h1 className="mt-4 text-lg font-semibold">Loading...</h1>
      </div>
    );
  }

  const [currentPage, setCurrentPage] = useState(1); // State for managing the current page
  const [searchQuery, setSearchQuery] = useState(""); // State for search input

  const [perpage] = useState(4); // Number of blogs to show per page

  const paginate = (pageNumber) => {
    setCurrentPage(pageNumber); // Update the current page number
  };

  // Filter published blogs
  const publishedBlogs = alldata?.filter((ab) => ab.status === "publish") || [];

  // Filter blogs based on the search query
  const filteredBlogs =
    searchQuery.trim() === ""
      ? publishedBlogs // If no search query, show all published blogs
      : publishedBlogs.filter(
          (blog) => blog.title.toLowerCase().includes(searchQuery.toLowerCase()) // Filter blogs that match the search query
        );

  // Pagination logic for filtered blogs
  const indexOfLastBlog = currentPage * perpage; // Index of the last blog on the current page
  const indexOfFirstBlog = indexOfLastBlog - perpage; // Index of the first blog on the current page
  const currentBlogs = filteredBlogs.slice(indexOfFirstBlog, indexOfLastBlog); // Blogs for the current page

  // Calculate the total number of pages for filtered blogs
  const totalBlogs = filteredBlogs.length; // Total number of filtered blogs
  const pageNumbers = [];
  for (let i = 1; i <= Math.ceil(totalBlogs / perpage); i++) {
    pageNumbers.push(i); // Populate page numbers array
  }

  // Reset to the first page when the search query changes
  useEffect(() => {
    setCurrentPage(1); // Reset to page 1 whenever the search query changes
  }, [searchQuery]);

  if (session) {
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

          <div className="blogstable">
            <div className="flex gap-2 mb-1" data-aos="fade-up">
              <h2>Search blogs</h2>
              <input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                type="text"
                placeholder="Search by title..."
              />
            </div>

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
                  <>
                    <tr>
                      <td colSpan={4}>
                        <Dataloading /> {/* Show loading state */}
                      </td>
                    </tr>
                  </>
                ) : (
                  <>
                    {currentBlogs.length === 0 ? (
                      <tr>
                        <td colSpan={4} className="text-center">
                          No published blogs
                        </td>
                      </tr>
                    ) : (
                      currentBlogs.map((blog, index) => (
                        <tr key={blog._id}>
                          <td>{indexOfFirstBlog + index + 1}</td>{" "}
                          {/* Correct numbering */}
                          <td>
                            <h3>{blog.title}</h3>
                          </td>
                          <td>
                            <pre>{blog.slug}</pre>
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
            {filteredBlogs.length === 0 ? (
              "" // No pagination if no filtered blogs
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
                      onClick={() => paginate(number)} // Navigate to the clicked page
                      className={`${currentPage === number ? "active" : ""}`} // Highlight the active page
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
