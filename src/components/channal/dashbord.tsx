import React from "react";
import Navbar2 from "./navbar";
import Sidbar2 from "./sidbar";
import ChannelContent from "./apploadVideo";
import { MyProvider } from "@/context/vidoContext/VideoContext";
function Dashbord() {
  return (
    <div>
        <Navbar2 />
        <Sidbar2 />
        <ChannelContent />
    </div>
  );
}

export default Dashbord;
