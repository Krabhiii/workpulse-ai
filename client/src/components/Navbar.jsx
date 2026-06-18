import React, { useEffect, useRef, useState } from "react";
import { Brain, LogOut, Sparkles, Bell } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import api from "../services/axios";
import { setUserData } from "../redux/userSlice";

function Navbar() {
  const { userData } = useSelector((state) => state.user);
  console.log("frnd user:",userData);
  console.log("frnd user:",userData?._id);

  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);

  const dropdownRef = useRef(null);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const fetchNotifications = async () => {
  try {
    console.log("FETCHING NOTIFICATIONS...");

    const res = await api.get("/api/notification");

    console.log("RAW NOTIFICATION RESPONSE:", res);
    console.log("NOTIFICATION DATA:", res.data);

    const data = Array.isArray(res.data)
      ? res.data
      : res.data.notifications || [];

    console.log("FINAL NOTIFICATIONS:", data);

    setNotifications(data);
  } catch (error) {
    console.log(
      "NOTIFICATION ERROR:",
      error.response?.data || error.message
    );
  }
};
  const markAllRead = async () => {
    try {
      await api.patch("/api/notification/read-all");
      fetchNotifications();
    } catch (error) {
      console.log(error.response?.data || error.message);
    }
  };

  const logout = async () => {
    try {
      await api.get("/api/auth/logout");
      dispatch(setUserData(null));
      navigate("/login");
    } catch (error) {
      console.log(error.response?.data || error.message);
    }
  };

  useEffect(() => {
    if (userData) return
      fetchNotifications();
      const interval = setInterval(()=>{
        fetchNotifications();
      },10000);
      return ()=> clearInterval(interval);
    
  }, [userData]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target)
      ) {
        setShowNotifications(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const unreadCount = notifications.filter((item) => !item.isRead).length;

  return (
    <div className="h-20 border-b border-white/10 bg-[#020617]/80 backdrop-blur-xl flex items-center justify-between px-6 sticky top-0 z-40">
      {/* LOGO */}
      <div
        onClick={() => navigate("/app")}
        className="flex items-center gap-3 cursor-pointer"
      >
        <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center shadow-[0_0_35px_rgba(34,211,238,0.4)]">
          <Brain className="text-white" />
        </div>

        <div>
          <h1 className="font-black text-xl text-white">
            WorkPulse<span className="text-cyan-400">AI</span>
          </h1>
          <p className="text-xs text-slate-400">
            Work Intelligence Platform
          </p>
        </div>
      </div>

      {/* RIGHT */}
      <div className="flex items-center gap-4 relative">
        <div className="hidden md:flex items-center gap-2 px-4 py-2 rounded-full bg-cyan-500/10 border border-cyan-400/20 text-cyan-300 text-sm">
          <Sparkles size={15} />
          AI Powered
        </div>

        {/* NOTIFICATION */}
        {userData && (
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={async () => {
                await fetchNotifications();
                setShowNotifications((prev) => !prev);
              }}
              className="relative w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-slate-300 hover:text-white hover:bg-white/10 transition"
            >
              <Bell size={19} />

              {unreadCount > 0 && (
                <span className="absolute -top-2 -right-2 min-w-5 h-5 px-1 rounded-full bg-red-500 text-white text-xs flex items-center justify-center border border-[#020617]">
                  {unreadCount}
                </span>
              )}
            </button>

            {showNotifications && (
              <div className="absolute right-0 mt-4 w-[420px] max-h-[520px] overflow-y-auto bg-[#0f172a] border border-cyan-500/20 rounded-3xl shadow-2xl p-5 z-50">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-black text-lg">Notifications</h3>

                  {notifications.length > 0 && (
                    <button
                      onClick={markAllRead}
                      className="text-xs text-cyan-300 hover:text-cyan-200"
                    >
                      Mark all read
                    </button>
                  )}
                </div>

                {notifications.length === 0 ? (
                  <div className="text-center py-8">
                    <Bell className="mx-auto text-slate-500 mb-3" />
                  <p className="text-sm text-slate-200 leading-relaxed">
                      No notifications yet.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {notifications.map((item) => (
                      <NotificationItem
                        key={item._id}
                        item={item}
                        fetchNotifications={fetchNotifications}
                      />
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* USER */}
        {userData && (
          <>
            <div className="hidden sm:block text-right">
              <p className="font-bold text-sm text-white">
                {userData.name}
              </p>
              <p className="text-xs text-cyan-400 capitalize">
                {userData.role}
              </p>
            </div>

            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center font-black text-white">
              {userData.name?.[0]?.toUpperCase() || "U"}
            </div>

            <button
              onClick={logout}
              className="w-10 h-10 rounded-xl bg-red-500/10 border border-red-400/20 text-red-400 flex items-center justify-center hover:bg-red-500/20 transition"
            >
              <LogOut size={18} />
            </button>
          </>
        )}
      </div>
    </div>
  );
}

const NotificationItem = ({ item, fetchNotifications }) => {
  const markRead = async () => {
    try {
      if (!item.isRead) {
        await api.patch(`/api/notification/read/${item._id}`);
        fetchNotifications();
      }
    } catch (error) {
      console.log(error.response?.data || error.message);
    }
  };

  const typeColor =
    item.type === "task-assigned"
      ? "bg-blue-500/10 border-blue-400/20 text-blue-300"
      : item.type === "task-completed"
      ? "bg-emerald-500/10 border-emerald-400/20 text-emerald-300"
      : item.type === "risk-alert"
      ? "bg-red-500/10 border-red-400/20 text-red-300"
      : "bg-cyan-500/10 border-cyan-400/20 text-cyan-300";

 return (
  <button
    onClick={markRead}
    className={`w-full text-left p-4 rounded-2xl border transition-all duration-300 hover:scale-[1.02] hover:border-cyan-400/60 ${
      item.isRead
        ? "bg-slate-900 border-slate-700 shadow-lg"
        : "bg-gradient-to-r from-cyan-900/90 to-blue-900/90 border-cyan-400/40 shadow-[0_0_25px_rgba(34,211,238,0.2)]"
    }`}
  >
      <div className="flex justify-between gap-3 mb-2">
        <h4 className="font-bold text-lg text-cyan-200">{item.title}</h4>

        {!item.isRead && (
          <span className="w-2 h-2 rounded-full bg-cyan-400 mt-2"></span>
        )}
      </div>

      <p className="text-sm text-slate-400 leading-relaxed">
        {item.message}
      </p>

      <div className="flex items-center justify-between mt-3">
        <span className={`px-3 py-1 rounded-full border text-[11px] capitalize ${typeColor}`}>
          {item.type}
        </span>

        <span className="text-[11px] text-slate-500">
          {new Date(item.createdAt).toLocaleString()}
        </span>
      </div>
    </button>
  );
};

export default Navbar;