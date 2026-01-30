import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { fetchProfile, deleteAccount } from "../api/profile";
import { clearAuth } from "../utils/auth";
import Spinner from "../components/Spinner";
import ConfirmDialog from "../components/ConfirmDialog";
import { useToast } from "../components/ToastProvider";

export default function Profile() {
  const navigate = useNavigate();
  const { addToast } = useToast();
  const [showConfirm, setShowConfirm] = useState(false);
  const { data, isLoading } = useQuery({
    queryKey: ["profile"],
    queryFn: fetchProfile
  });

  const handleLogout = () => {
    clearAuth();
    navigate("/login");
  };

  const handleDelete = async () => {
    setShowConfirm(false);
    try {
      await deleteAccount();
      clearAuth();
      addToast("Account deleted", "success");
      navigate("/register");
    } catch (err) {
      addToast(err.response?.data?.message || "Delete failed", "error");
    }
  };

  return (
    <div className="mx-auto max-w-2xl">
      <div className="rounded-3xl bg-white p-8 shadow-card">
        <h1 className="text-2xl font-semibold text-vault-ink">Your profile</h1>
        {isLoading && (
          <div className="mt-6 flex items-center gap-3 text-sm text-slate-500">
            <Spinner size={20} />
            Loading profile...
          </div>
        )}
        {!isLoading && (
          <div className="mt-6 space-y-3 text-sm text-slate-500">
            <div>
              <span className="text-slate-400">Name:</span> {data?.userName}
            </div>
            <div>
              <span className="text-slate-400">Email:</span> {data?.userEmail}
            </div>
            <div>
              <span className="text-slate-400">Partner:</span> {data?.partnerName || "Not linked yet"}
            </div>
            <div>
              <span className="text-slate-400">Partner email:</span> {data?.partnerEmail || "Pending invite"}
            </div>
          </div>
        )}

        <div className="mt-6 flex flex-wrap gap-3">
          <button
            onClick={handleLogout}
            className="rounded-full border border-vault-navy px-5 py-2 text-sm font-semibold text-vault-navy"
          >
            Logout
          </button>
          <button
            onClick={() => setShowConfirm(true)}
            className="rounded-full bg-rose-500 px-5 py-2 text-sm font-semibold text-white"
          >
            Delete account
          </button>
        </div>
      </div>

      <ConfirmDialog
        open={showConfirm}
        title="Delete your account?"
        message="Your partner will remain, but your account will be removed permanently."
        confirmText="Delete"
        onConfirm={handleDelete}
        onCancel={() => setShowConfirm(false)}
      />
    </div>
  );
}
