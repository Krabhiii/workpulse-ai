import React from "react";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import Footer from "../components/Footer";

function DashboardLayout({ children }) {
  return (
    <div className="app-bg">
      <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-cyan-500/10 blur-[150px]" />
      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-violet-500/10 blur-[150px]" />

      <div className="relative z-10">
        <Navbar />

        <div className="flex">
          <Sidebar />

          <main className="flex-1 min-h-[calc(100vh-80px)] p-6 lg:p-8">
            {children}
            <Footer />
          </main>
        </div>
      </div>
    </div>
  );
}

export default DashboardLayout;