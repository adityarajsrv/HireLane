import { useState, useEffect } from "react";
import api from "../lib/axios.js";

const useAnalytics = (days = 30) => {
  const [data,    setData   ] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error,   setError  ] = useState(null);

  useEffect(() => {
    const fetch = async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await api.get(`/api/analytics?days=${days}`);
        setData(res.data);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to load analytics");
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, [days]); 

  return { data, loading, error };
};

export default useAnalytics;