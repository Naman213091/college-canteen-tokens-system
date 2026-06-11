const handleLogout = () => {
  setAuth(null);
  setCart([]);
  setCurrentToken(null);
  setActiveTab("menu");
};
{/* Logout button */}
<button
  onClick={handleLogout}
  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-stone-700 text-stone-400 hover:text-red-400 hover:border-red-700 text-xs font-bold transition-all"
>
  <span>↩</span>
  <span className="hidden sm:inline">Logout</span>
</button>