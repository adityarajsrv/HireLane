/* eslint-disable react-hooks/set-state-in-effect */
import { useState, useEffect } from "react";
import api from "../lib/axios.js";

const useProfile = () => {
  const [profile,  setProfile ] = useState(null);
  const [loading,  setLoading ] = useState(true);
  const [error,    setError   ] = useState(null);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await api.get("/api/profile");
      setProfile(res.data.profile);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load profile");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []); 

  const updateProfile = async (data) => {
    const res = await api.put("/api/profile", data);
    setProfile(res.data.profile);
    return res.data;
  };

  const uploadResume = async (file) => {
    const formData = new FormData();
    formData.append("resume", file); 

    const res = await api.post("/api/profile/resume", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    setProfile(res.data.profile);
    return res.data;
  };

  return {
    profile,
    loading,
    error,
    refetch:       fetchProfile,
    updateProfile,
    uploadResume,
  };
};

export default useProfile;