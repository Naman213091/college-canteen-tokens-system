export default function App() {
  const [auth, setAuth] = useState(null);
  const [activeTab, setActiveTab] = useState("menu");

  const handleLogin = (user) => {
    setAuth(user);
    setActiveTab(user.role === "admin" ? "admin" : "menu");
  };

  if (!auth) {
    return (
      <>
        <LoginPage onLogin={handleLogin} />
      </>
    );
  }

  return (
    <>
      {/* Header */}
      <header>
        <h1>CampusEats</h1>

        <button onClick={handleLogout}>
          Logout
        </button>
      </header>

      {/* Main content */}
      <main>
        {activeTab === "menu" && <MenuModule />}
        {activeTab === "cart" && <CartModule />}
        {activeTab === "token" && <TokenModule />}
        {activeTab === "history" && <HistoryModule />}
        {activeTab === "billing" && <BillingModule />}
        {activeTab === "admin" && <AdminModule />}
      </main>
    </>
  );
}