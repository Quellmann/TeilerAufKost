import React, { useState, useEffect } from "react";
import { API_BASE_URL } from "../config";
import { Link } from "react-router-dom";

const Admin = () => {
  const [data, setData] = useState([]);
  useEffect(() => {
    fetchData();
    return;
  }, []);
  async function fetchData() {
    try {
      const groupResponse = await fetch(`${API_BASE_URL}/allGroups`);

      if (!groupResponse.ok) {
        const message = `An error has occurred: ${groupResponse.statusText}`;
        console.error(message);
        navigate("/not-found");
        throw new Error(message);
      }

      const data = await groupResponse.json();

      if (!data) {
        const message = "Data not found";
        console.warn(message);
        navigate("/not-found");
        throw new Error(message);
      }

      setData(data);
      return Promise.resolve();
    } catch (error) {
      console.error("Fetch data error:", error);
      throw error;
    }
  }

  return (
    <div className="h-full overflow-auto">
      <div className="flex flex-col 2xl:w-[40%] xl:w-[50%] lg:w-[60%] md:w-[70%] sm:w-[80%] w-[90%] mx-auto">
        <div className="border rounded-lg overflow-auto">
          <table className="min-w-full">
            <thead>
              <tr className="text-left">
                <th>Id</th>
                <th>Name</th>
                <th>Mitglieder</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {data?.map((elmt) => (
                <tr key={elmt._id} className="p-2">
                  <td>{elmt._id}</td>
                  <td>{elmt.groupName}</td>
                  <td>{elmt.groupMember.length}</td>
                  <td>
                    <Link to={`/${elmt._id}`}>Link</Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Admin;
