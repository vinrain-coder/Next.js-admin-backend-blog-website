"use client";

import axios from "axios";
import { useEffect, useState } from "react";

function useFetchData(apiEndPoint) {
  const [alldata, setAlldata] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Do nothing if there's no endpoint
    if (!apiEndPoint) return;

    const fetchAllData = async () => {
      setLoading(true); // Set loading to true when starting the fetch
      try {
        const res = await axios.get(apiEndPoint);
        const alldata = res.data;
        setAlldata(alldata);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false); // Set loading to false when done
      }
    };

    fetchAllData();
  }, [apiEndPoint]); // Dependency on apiEndPoint to refetch when it changes

  return { alldata, loading };
}

export default useFetchData;
