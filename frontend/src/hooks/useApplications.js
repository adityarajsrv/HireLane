import { useState, useEffect, useCallback } from "react";
import api from "../lib/axios.js";

const useApplications = (filters = {}) => {
  const [applications, setApplications] = useState([]);
  const [loading,      setLoading      ] = useState(true);
  const [error,        setError        ] = useState(null);
  const filtersKey = JSON.stringify(filters);

  const fetchApplications = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const params = new URLSearchParams(JSON.parse(filtersKey)).toString();
      const url    = `/api/applications${params ? `?${params}` : ""}`;
      const res    = await api.get(url);
      setApplications(res.data.applications);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load applications");
    } finally {
      setLoading(false);
    }
  }, [filtersKey]);

  useEffect(() => {
    fetchApplications();
  }, [fetchApplications]);

  const updateApplication = async (id, patchData) => {
    const previous = applications;

    setApplications((prev) =>
      prev.map((a) => (a._id === id ? { ...a, ...patchData } : a))
    );

    try {
      const res = await api.patch(`/api/applications/${id}`, patchData);
      setApplications((prev) =>
        prev.map((a) => (a._id === id ? res.data.application : a))
      );
      return res.data.application;
    } catch (err) {
      setApplications(previous); 
      throw err;
    }
  };

  const updateStatus = (id, newStatus) =>
    updateApplication(id, { status: newStatus });

  const createApplication = async (data) => {
    const res = await api.post("/api/applications", data);
    setApplications((prev) => [res.data.application, ...prev]);
    return res.data.application;
  };

  const deleteApplication = async (id) => {
    await api.delete(`/api/applications/${id}`);
    setApplications((prev) => prev.filter((a) => a._id !== id));
  };

  return {
    applications,
    loading,
    error,
    refetch: fetchApplications,
    updateStatus,
    updateApplication,
    createApplication,
    deleteApplication,
  };
};

export default useApplications;