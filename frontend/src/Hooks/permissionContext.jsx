import React, { createContext, useState, useEffect } from "react";
import { ACCESS_TOKEN_KEY, USER_DETAILS } from "../constants";
import dashboardServices from "../services/dashboard";

export const UserContext = createContext();

const UserProvider = ({ children }) => {
  const [userDetails, setUserDetails] = useState(null);
  const [accessToken, setAccessToken] = useState(null);
  const [permissions, setPermissions] = useState([]);
  const [loading, setLoading] = useState(true);

  console.log('accessToken>>>',accessToken);
  

  const fetchUserDetails = async () => {
    try {
      // Replace with your API endpoint
      const response = await dashboardServices.getUserDetail();
      if (response?.status === 200) {
        localStorage.setItem(USER_DETAILS, JSON.stringify(response?.data));
        const permissionsObjects = response?.data?.permissions.reduce(
          (acc, permission) => {
            const variableName = `${permission.name.toLowerCase()}Permission`;
            acc[variableName] = permission;
            return acc;
          },
          {}
        );
        localStorage.setItem(USER_DETAILS, JSON.stringify(response?.data));
        localStorage.setItem('permissionsObjects', JSON.stringify(permissionsObjects));
        setUserDetails(response?.data);
        setPermissions(permissionsObjects);
      } else {
        console.error("Failed to fetch user details");
      }
    } catch (error) {
      console.error("Error fetching user details:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (accessToken || localStorage.getItem(ACCESS_TOKEN_KEY)) {
      fetchUserDetails(); // Initial fetch

      const interval = setInterval(() => {
        fetchUserDetails(); // Refresh every 10 seconds
      }, 10000);

      return () => clearInterval(interval); // Cleanup on unmount
    }
  }, [accessToken]);

  return (
    <UserContext.Provider value={{ userDetails, permissions, loading, setAccessToken }}>
      {children}
    </UserContext.Provider>
  );
};

export default UserProvider;
