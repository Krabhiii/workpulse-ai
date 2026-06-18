import React from "react";

function Footer() {
  return (
    <footer className="border-t border-white/10 py-5 text-center text-xs text-slate-500">
      © {new Date().getFullYear()} WorkPulse AI • Enterprise Work Intelligence
    </footer>
  );
}

export default Footer;