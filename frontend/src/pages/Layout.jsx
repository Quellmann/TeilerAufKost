import { useRef } from "react";
import useEmblaCarousel from "embla-carousel-react";
import MainPage from "./MainPage";

const Layout = () => {
  const refresh = useRef(null);
  const [emblaRef, emblaApi] = useEmblaCarousel({ watchDrag: false });
  return (
    <div className="">
      <MainPage></MainPage>
    </div>
  );
};

export default Layout;
