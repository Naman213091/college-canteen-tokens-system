// ── Auth credentials ──────────────────────────────────────────────────────────
const ADMIN_CREDENTIALS = { username: "admin", password: "canteen123" };

// ══════════════════════════════════════════════════════════════════════════════
// ── LOGIN PAGE ────────────────────────────────────────────────────────────────
// ══════════════════════════════════════════════════════════════════════════════

function LoginPage({ onLogin }) {
  const [mode, setMode]       = useState(null);
  const [name, setName]       = useState("");
  const [rollNo, setRollNo]   = useState("");
  const [username, setUname]  = useState("");
  const [password, setPass]   = useState("");
  const [showPass, setShow]   = useState(false);
  const [error, setError]     = useState("");
  const [loading, setLoading] = useState(false);

  const handleCustomer = () => {
    setError("");

    if (!name.trim()) {
      setError("Please enter your name.");
      return;
    }

    if (!rollNo.trim()) {
      setError("Please enter your roll number.");
      return;
    }

    setLoading(true);

    setTimeout(() => {
      onLogin({
        role: "customer",
        name: name.trim(),
        rollNo: rollNo.trim(),
      });
    }, 800);
  };

  const handleAdmin = () => {
    setError("");

    if (
      username === ADMIN_CREDENTIALS.username &&
      password === ADMIN_CREDENTIALS.password
    ) {
      setLoading(true);

      setTimeout(() => {
        onLogin({
          role: "admin",
          name: "Admin",
          rollNo: "",
        });
      }, 800);
    } else {
      setError("Invalid username or password.");
    }
  };

  return (
    <div>
      {/* Login UI */}
    </div>
  );
}