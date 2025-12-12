import { Bars3Icon, PlusIcon } from "@heroicons/react/24/outline";
import { useState, useCallback, useEffect } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { Toaster } from "react-hot-toast";
import AddDetails from "../components/AddDetails";
import { Outlet, useNavigate, useSearchParams } from "react-router-dom";
import { API_BASE_URL } from "../config";
import DarkmodeToggle from "../components/DarkmodeToggle";

const MainPage = () => {
  const [sidebarGroups, setSidebarGroups] = useState([]);
  const [emblaRef, emblaApi] = useEmblaCarousel({
    watchDrag: false,
    startIndex: 1,
  });
  const [refresh, setRefresh] = useState(new Date());
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const sidebarButton = useCallback(() => {
    if (emblaApi) {
      emblaApi.selectedScrollSnap() != 0
        ? emblaApi.scrollTo(0)
        : emblaApi.scrollTo(1);
    }
  }, [emblaApi]);

  const addOverviewButton = () => {
    if (emblaApi) {
      setSearchParams({
        groupId: searchParams.get("groupId"),
        type: "spending",
      });
      emblaApi.scrollTo(2);
    }
  };

  const closeSidebar = useCallback(() => {
    if (emblaApi && emblaApi.selectedScrollSnap() == 0) {
      emblaApi.scrollTo(1);
    }
  }, [emblaApi]);

  const deleteNonExistingGroups = async () => {
    const response = await fetch(
      `${API_BASE_URL}/groups?groupIds=${JSON.stringify(
        JSON.parse(localStorage.getItem("groupSubscription")).map(
          (group) => group.id
        )
      )}`,
      {
        method: "GET",
      }
    );
    const data = await response.json();
    const idsInDatabase = data.map((elmt) => ({
      id: elmt._id,
      name: elmt.groupName,
    }));
    localStorage.setItem("groupSubscription", JSON.stringify(idsInDatabase));
    setSidebarGroups(idsInDatabase);
  };

  useEffect(() => {
    const subscribedGroups = JSON.parse(
      localStorage.getItem("groupSubscription")
    );
    if (subscribedGroups) {
      setSidebarGroups(subscribedGroups);
      deleteNonExistingGroups();
    }
  }, []);

  return (
    <div className="min-w-[320px] h-dvh flex flex-col text-light-text dark:text-dark-text">
      <Toaster position="top-center"></Toaster>
      {/* Navbar */}
      <div className="flex justify-between items-center px-5 py-2 bg-light-bgheader dark:bg-dark-bgheader border-b border-light-border dark:border-dark-border">
        <div onClick={sidebarButton} className="cursor-pointer">
          <Bars3Icon className="size-8"></Bars3Icon>
        </div>
        <div
          onClick={() => {
            navigate("/"), emblaApi.scrollTo(1);
          }}
          className="flex items-center gap-2 cursor-pointer"
        >
          <img src="/logo_cropped.png" className="size-16"></img>
          <div className="text-2xl">TeilerAufKost</div>
        </div>
        <div
          onClick={addOverviewButton}
          className={`cursor-pointer ${
            !searchParams.get("groupId") && "invisible"
          }`}
        >
          <PlusIcon className="size-8"></PlusIcon>
        </div>
      </div>
      {/* Remaining Space */}
      <div className="flex-1 flex flex-col min-h-0 bg-light-bg dark:bg-dark-bg">
        {/* Outer Carousel */}
        <div className="flex-1 overflow-hidden relative" ref={emblaRef}>
          <div className="flex gap-5 h-full">
            {/* Sidebar */}
            <div className="flex-none w-64 min-w-0 border-r border-light-border dark:border-dark-border overflow-hidden">
              <div className="w-64 h-full flex flex-col justify-between">
                <div className="p-2 space-y-2">
                  <div className="flex justify-between">
                    <div className="text-xl">Gruppen</div>
                    <DarkmodeToggle></DarkmodeToggle>
                  </div>
                  <div className="flex flex-col gap-2">
                    {sidebarGroups.map((group) => (
                      <div
                        key={group.id}
                        onClick={() => {
                          navigate("/?groupId=" + group.id);
                          emblaApi.scrollTo(1);
                        }}
                        className="p-1 rounded-lg cursor-pointer truncate bg-light-card dark:bg-dark-card border border-light-border dark:border-dark-border"
                      >
                        {group.name}
                      </div>
                    ))}
                  </div>
                </div>
                <div className="px-2 pb-10">
                  <div
                    onClick={() => {
                      navigate("/newGroup");
                      emblaApi.scrollTo(1);
                    }}
                    className="p-2 rounded-lg cursor-pointer text-center bg-light-card dark:bg-dark-card border border-light-border dark:border-dark-border"
                  >
                    Neue Gruppe
                  </div>
                </div>
              </div>
            </div>
            {/* Overview -> Main Info Page */}
            <div
              className="flex-none w-full min-w-0 overflow-auto h-full"
              onClick={closeSidebar}
            >
              <div className="flex flex-col 2xl:w-[40%] xl:w-[50%] lg:w-[60%] md:w-[70%] sm:w-[90%] w-[96%] mx-auto">
                <Outlet
                  context={[setSidebarGroups, refresh, emblaApi, setRefresh]}
                ></Outlet>
              </div>
            </div>
            {/* Add Details -> Add Transaction/Spending */}
            <div className="flex-none w-full min-w-0 overflow-auto h-full">
              <div className="flex flex-col 2xl:w-[40%] xl:w-[50%] lg:w-[60%] md:w-[70%] sm:w-[90%] w-[96%] mx-auto">
                <AddDetails
                  emblaApi={emblaApi}
                  setRefresh={setRefresh}
                ></AddDetails>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MainPage;
