import React, { useState, useEffect } from "react";
import { API_BASE_URL } from "../config";
import { Link, useNavigate } from "react-router-dom";
import { TrashIcon } from "@heroicons/react/24/outline";
import AcceptModal from "../components/AcceptModal";

const Admin = () => {
  const [data, setData] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
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

  const deleteGroup = async (groupId) => {
    const response = await fetch(`${API_BASE_URL}/${groupId}/deleteGroup`, {
      method: "DELETE",
    });
    fetchData();
  };

  return (
    <div className="h-full overflow-auto">
      <div className="flex flex-col">
        <div className="overflow-auto">
          <table className="min-w-full">
            <thead>
              <tr className="text-left">
                <th>Name</th>
                <th>Mitglieder</th>
                <th>Löschen</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {data?.map((elmt) => (
                <tr
                  key={elmt._id}
                  onClick={() => navigate(`/?groupId=${elmt._id}`)}
                  className="p-2 hover:bg-slate-200 cursor-pointer"
                >
                  <td>{elmt.groupName}</td>
                  <td>{elmt.groupMember.length}</td>
                  <td className="flex justify-end items-center p-1">
                    <div
                      onClick={(e) => {
                        e.stopPropagation();
                        setIsOpen(true);
                      }}
                      className="hover:bg-red-500 hover:text-white rounded-full p-1"
                    >
                      <TrashIcon className="size-5"></TrashIcon>
                    </div>
                    <AcceptModal
                      isOpen={isOpen}
                      setIsOpen={setIsOpen}
                      modalData={{
                        title: "Gruppe löschen",
                        text1:
                          "Bist du sicher, dass du diese Gruppe löschen willst?",
                        text2:
                          "Du kannst diese Aktion nicht rückgängig machen.",
                        button: "Löschen",
                      }}
                      callback={deleteGroup(elmt._id)}
                    ></AcceptModal>
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
