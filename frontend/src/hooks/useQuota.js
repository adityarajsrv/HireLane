import { useState, useEffect } from "react";
import api from "../lib/axios.js";

const useQuota = () => {
  const [quota,   setQuota  ] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await api.get("/api/quota");
        setQuota(res.data);
      } catch {
        setQuota(null);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, []);

  return { quota, loading };
};

export default useQuota;