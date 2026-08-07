import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/authStore";

export default function Logout() {
  const logout = useAuthStore((state) => state.logout);
  const navigate = useNavigate();

  useEffect(() => {
    const doLogout = async () => {
      await logout();
      navigate("/login", { replace: true });
    };

    doLogout();
  }, [logout, navigate]);

  return (
    <div className="page-container grid min-h-[65vh] place-items-center">
      <div className="text-center">
        <span className="mx-auto block h-9 w-9 animate-spin rounded-full border-2 border-white/10 border-t-violet-400" />
        <p className="mt-4 text-sm font-semibold text-zinc-400">Logging you out...</p>
      </div>
    </div>
  );
}
