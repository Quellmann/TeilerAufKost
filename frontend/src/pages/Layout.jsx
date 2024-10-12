import { useRef } from "react";
import Header from "../components/Header";
import { Outlet } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import useEmblaCarousel from "embla-carousel-react";

const Layout = () => {
  const refresh = useRef(null);
  const [emblaRef, emblaApi] = useEmblaCarousel({ watchDrag: false });
  return (
    <div className="h-screen flex flex-col">
      <Header refresh={refresh} emblaApi={emblaApi}></Header>
      <Outlet context={[refresh, emblaRef, emblaApi]}></Outlet>
      <Toaster position="top-center"></Toaster>
    </div>
  );
};

export default Layout;
