"use client";

import { useSession } from "next-auth/react";
import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { IoHome } from "react-icons/io5";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  LineController,
} from "chart.js";
import { Bar } from "react-chartjs-2";
import Loading from "@/components/Loading";

export default function Home() {
  const { data: session, loading } = useSession();
  const [blogsData, setBlogsData] = useState([]);

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

  ChartJS.register(
    CategoryScale,
    LineController,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
  );

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: true,
        text: "Blogs created Monthly by Year",
      },
    },
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("/api/blogapi");
        if (!response.ok) {
          throw new Error("Failed to fetch data");
        }
        const data = await response.json();
        setBlogsData(data); // Set blogs data
      } catch (error) {
        console.error("Error fetching data. Please try again", error);
      }
    };

    fetchData();
  }, []);

  const monthlydata = blogsData
    .filter((dat) => dat.status === "publish")
    .reduce((acc, blog) => {
      const year = new Date(blog.createdAt).getFullYear();
      const month = new Date(blog.createdAt).getMonth();
      acc[year] = acc[year] || Array(12).fill(0);

      acc[year][month]++;
      return acc;
    }, {});

  const currentYear = new Date().getFullYear();
  const years = Object.keys(monthlydata);
  const labels = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const datasets = years.map((year) => ({
    label: `${year}`,
    data: monthlydata[year] || Array(12).fill(0),
    backgroundColor: `rgba(${Math.floor(Math.random() * 256)},${Math.floor(
      Math.random() * 256
    )}, ${Math.floor(Math.random() * 256)},0.5)`,
  }));

  const data = {
    labels,
    datasets,
  };

  // Calculating total topics (unique blogcategories)
  const totalTopics = [
    ...new Set(blogsData.flatMap((blog) => blog.blogcategory)),
  ];

  // Calculating total tags (unique tags)
  const totalTags = [...new Set(blogsData.flatMap((blog) => blog.tags))];

  // Counting blogs in each category
  const categoryCounts = blogsData.reduce((acc, blog) => {
    blog.blogcategory.forEach((category) => {
      acc[category] = (acc[category] || 0) + 1;
    });
    return acc;
  }, {});

  if (session) {
    return (
      <>
        <Head>
          <title>Admin | Shoepedi Blog</title>
          <meta name="description" content="Admin dashboard of Shoepedi blog" />
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <link rel="icon" href="/favicon.ico" />
        </Head>

        <div className="dashboard">
          <div className="titledashboard flex flex-sb">
            <div data-aos="fade-right">
              <h2>
                Blogs <span>Dashboard</span>
              </h2>
              <h3>ADMIN PANEL</h3>
            </div>
            <div className="breadcrumb" data-aos="fade-left">
              <IoHome /> <span>/</span>
              <span>Dashboard</span>
            </div>
          </div>

          <div className="gap-1 flex flex-sb">
            <div className="four_card" data-aos="fade-right">
              <h2>Total blogs</h2>
              <span>
                {blogsData.filter((ab) => ab.status === "publish").length}
              </span>
            </div>
            <div className="four_card" data-aos="fade-right">
              <h2>Total topics</h2>
              <span>{totalTopics.length}</span>
            </div>
            <div className="four_card" data-aos="fade-left">
              <h2>Total tags</h2>
              <span>{totalTags.length}</span>
            </div>
            <div className="four_card" data-aos="fade-left">
              <h2>Total drafts</h2>
              <span>
                {blogsData.filter((ab) => ab.status === "draft").length}
              </span>
            </div>
          </div>

          <div className="year_overview flex flex-sb mt-3">
            <div className="leftyearoverview" data-aos="fade-up">
              <div className="flex flex-sb">
                <h3>Year overview</h3>
                <ul className="creative-dots">
                  <li className="big-dot"></li>
                  <li className="semi-big-dot"></li>
                  <li className="medium-dot"></li>
                  <li className="semi-medium-dot"></li>
                  <li className="semi-small-dot"></li>
                  <li className="small-dot"></li>
                </ul>
                <h3 className="text-center">
                  {blogsData.filter((ab) => ab.status === "publish").length} /
                  365 <br /> <span>Total published</span>
                </h3>
              </div>
              <Bar data={data} options={options} />
            </div>
            <div className="right_salescont" data-aos="fade-up">
              <div>
                <h3>Blogs by category</h3>
                <ul className="creative-dots">
                  <li className="big-dot"></li>
                  <li className="semi-big-dot"></li>
                  <li className="medium-dot"></li>
                  <li className="semi-medium-dot"></li>
                  <li className="semi-small-dot"></li>
                  <li className="small-dot"></li>
                </ul>
              </div>
              <div className="blogscategory flex flex-center">
                <table>
                  <thead>
                    <tr>
                      <td>Category</td>
                      <td>Blogs Count</td>
                    </tr>
                  </thead>
                  <tbody>
                    {Object.entries(categoryCounts).map(([category, count]) => (
                      <tr key={category}>
                        <td>{category}</td>
                        <td>{count}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }
}
