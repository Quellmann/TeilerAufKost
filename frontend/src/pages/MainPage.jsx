import { Bars3Icon, PlusIcon } from "@heroicons/react/24/outline";
import { useState, useCallback, useRef, useEffect } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { Toaster } from "react-hot-toast";
import AddOverview from "../components/AddOverview";
import AddDetails from "../components/AddDetails";
import { Outlet, useNavigate, useSearchParams } from "react-router-dom";

const MainPage = () => {
  const [sidebarGroups, setSidebarGroups] = useState([]);
  const [emblaRef, emblaApi] = useEmblaCarousel({
    watchDrag: false,
    startIndex: 1,
  });
  const remainingSpaceDiv = useRef(null);
  const navbarDiv = useRef(null);
  const [refresh, setRefresh] = useState(new Date());
  const [divHeight, setDivHeight] = useState("0");
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const sidebarButton = useCallback(() => {
    if (emblaApi) {
      emblaApi.selectedScrollSnap() != 0
        ? emblaApi.scrollTo(0)
        : emblaApi.scrollTo(1);
    }
  }, [emblaApi]);

  const addOverviewButton = useCallback(() => {
    if (emblaApi) emblaApi.scrollTo(2);
  }, [emblaApi]);

  const closeSidebar = useCallback(() => {
    if (emblaApi && emblaApi.selectedScrollSnap() == 0) {
      emblaApi.scrollTo(1);
    }
  }, [emblaApi]);

  useEffect(() => {
    if (remainingSpaceDiv.current) {
      const height = remainingSpaceDiv.current.getBoundingClientRect().height;
      setDivHeight(`${height}px`);
    }
    const subscribedGroups = JSON.parse(
      localStorage.getItem("groupSubscription")
    );
    if (subscribedGroups) {
      setSidebarGroups(JSON.parse(localStorage.getItem("groupSubscription")));
    }
  }, []);

  return (
    <div className="min-w-[350px] h-dvh flex flex-col">
      <Toaster position="top-center"></Toaster>
      {/* Navbar */}
      <div
        className="flex justify-between items-center px-5 py-2 bg-slate-200"
        ref={navbarDiv}
      >
        <div onClick={sidebarButton} className="cursor-pointer">
          <Bars3Icon className="size-8"></Bars3Icon>
        </div>
        <div
          onClick={() => navigate("/")}
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
      <div className="flex flex-col grow" ref={remainingSpaceDiv}>
        {/* Outer Carousel */}
        <div className="overflow-hidden relative grow" ref={emblaRef}>
          <div className="flex gap-5 grow">
            {/* Sidebar */}
            <div className="flex-none w-64 min-w-0 grow">
              <div
                className="w-64 bg-slate-800 grow flex flex-col justify-between"
                style={{ height: `${divHeight}` }}
              >
                <div className="p-2 space-y-2">
                  <div className="text-slate-50 text-xl">Gruppen</div>
                  <div className="flex flex-col gap-2">
                    {sidebarGroups.map((group) => (
                      <div
                        key={group.id}
                        onClick={() => navigate("/?groupId=" + group.id)}
                        className="p-1 text-slate-50 border rounded-lg cursor-pointer truncate"
                      >
                        {group.name}
                      </div>
                    ))}
                  </div>
                </div>
                <div className="p-4">
                  <div
                    onClick={() => {
                      navigate("/newGroup");
                      emblaApi.scrollTo(1);
                    }}
                    className="p-2 rounded-lg border bg-slate-50 cursor-pointer text-center"
                  >
                    Neue Gruppe
                  </div>
                </div>
              </div>
            </div>
            {/* Overview */}
            <div
              className="flex-none w-full min-w-0 overflow-auto"
              onClick={closeSidebar}
              style={{ height: `${divHeight}` }}
            >
              <div className="flex flex-col 2xl:w-[40%] xl:w-[50%] lg:w-[60%] md:w-[70%] sm:w-[90%] w-[96%] mx-auto h-full">
                <Outlet
                  context={[setSidebarGroups, refresh, emblaApi]}
                ></Outlet>
              </div>
            </div>
            {/* Add Overview */}
            <div
              className="flex-none w-full min-w-0"
              style={{ height: `${divHeight}` }}
            >
              <div className="flex flex-col 2xl:w-[40%] xl:w-[50%] lg:w-[60%] md:w-[70%] sm:w-[90%] w-[96%] mx-auto h-full">
                <AddOverview emblaApi={emblaApi}></AddOverview>
              </div>
            </div>
            {/* Add Details */}
            <div
              className="flex-none w-full min-w-0"
              style={{ height: `${divHeight}` }}
            >
              <div className="flex flex-col 2xl:w-[40%] xl:w-[50%] lg:w-[60%] md:w-[70%] sm:w-[90%] w-[96%] mx-auto h-full">
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
