import { useState, useEffect } from "react";
import SkeletonAdminTable from "../components/Skeletons/SkeletonAdminTable";
import { API_BASE_URL } from "../config";
import { useNavigate } from "react-router-dom";
import { TrashIcon } from "@heroicons/react/24/outline";
import DeleteModal from "../components/DeleteModal";

const ADMIN_USERNAME = "admin";
const ADMIN_PASSWORD = "dampfnudel";
const AUTH_COOKIE_NAME = "adminAuth";

const getAuthCookie = () => {
  if (typeof document === "undefined") {
    return false;
  }
  return document.cookie
    .split("; ")
    .some((cookie) => cookie.startsWith(`${AUTH_COOKIE_NAME}=`));
};

const setAuthCookie = () => {
  const expires = new Date(Date.now() + 30 * 60 * 1000).toUTCString();
  document.cookie = `${AUTH_COOKIE_NAME}=true; expires=${expires}; path=/; samesite=lax`;
};

const clearAuthCookie = () => {
  if (typeof document === "undefined") {
    return;
  }
  document.cookie = `${AUTH_COOKIE_NAME}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/; samesite=lax`;
};

const Admin = () => {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [openGroupId, setOpenGroupId] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(() => getAuthCookie());
  const [loginError, setLoginError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      fetchData();
    }
    return;
  }, [isAuthenticated]);

  async function fetchData() {
    setIsLoading(true);
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
      setIsLoading(false);
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

  const handleLoginSubmit = (event) => {
    event.preventDefault();

    if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
      setIsAuthenticated(true);
      setAuthCookie();
      setLoginError("");
      setUsername("");
      setPassword("");
      return;
    }

    setLoginError("Benutzername oder Passwort ist falsch.");
  };

  return (
    <div className="h-full overflow-auto">
      {!isAuthenticated ? (
        <div className="max-w-md mx-auto p-6">
          <h1 className="text-2xl font-semibold mb-4">Admin Login</h1>
          {loginError && <p className="mb-4 text-red-500">{loginError}</p>}
          <form onSubmit={handleLoginSubmit} className="space-y-4">
            <div>
              <label
                className="block text-sm font-medium mb-1"
                htmlFor="username"
              >
                Benutzername
              </label>
              <input
                id="username"
                value={username}
                onChange={(event) => setUsername(event.target.value)}
                className="w-full rounded-lg px-3 py-2 focus:outline-none dark:divide-dark-border border border-light-border dark:border-dark-border bg-light-card dark:bg-dark-card"
                placeholder="admin"
                autoComplete="username"
              />
            </div>
            <div>
              <label
                className="block text-sm font-medium mb-1"
                htmlFor="password"
              >
                Passwort
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                className="w-full rounded-lg px-3 py-2 focus:outline-none dark:divide-dark-border border border-light-border dark:border-dark-border bg-light-card dark:bg-dark-card"
                placeholder="Passwort"
                autoComplete="current-password"
              />
            </div>
            <button
              type="submit"
              className="w-full rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
            >
              Anmelden
            </button>
          </form>
        </div>
      ) : (
        <div className="flex flex-col">
          <div className="flex justify-between items-center p-4">
            <h1 className="text-xl font-semibold">Admin Bereich</h1>
            <button
              onClick={() => {
                setIsAuthenticated(false);
                clearAuthCookie();
              }}
              className=" rounded-lg px-3 py-2 focus:outline-none dark:divide-dark-border border border-light-border dark:border-dark-border bg-light-card dark:bg-dark-card"
            >
              Abmelden
            </button>
          </div>
          <div className="overflow-auto p-4">
            {isLoading ? (
              <SkeletonAdminTable rows={6} />
            ) : (
              <table className="min-w-full">
                <thead>
                  <tr className="text-left">
                    <th>Name</th>
                    <th>Mitglieder</th>
                    <th>Löschen</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-light-border dark:divide-dark-border">
                  {data?.map((elmt) => (
                    <tr
                      key={elmt._id}
                      onClick={() => navigate(`/?groupId=${elmt._id}`)}
                      className="p-2 hover:bg-slate-200 dark:hover:bg-slate-700 cursor-pointer"
                    >
                      <td>{elmt.groupName}</td>
                      <td>{elmt.groupMember.length}</td>
                      <td className="flex justify-end items-center p-1">
                        <div
                          onClick={(e) => {
                            e.stopPropagation();
                            setIsOpen(true);
                            setOpenGroupId(elmt._id);
                          }}
                          className="hover:bg-red-500 hover:text-white rounded-full p-1"
                        >
                          <TrashIcon className="size-5"></TrashIcon>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
          <DeleteModal
            isOpen={isOpen}
            setIsOpen={setIsOpen}
            text={"Bitte bestätige, dass du diese Gruppe löschen willst?"}
            callback={() => {
              deleteGroup(openGroupId);
              setOpenGroupId(null);
            }}
          ></DeleteModal>
        </div>
      )}
    </div>
  );
};

export default Admin;
