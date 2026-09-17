import { useState } from "react";
import { Eye, EyeOff, LockKeyhole, Mail, UserPlus } from "lucide-react";
import { useAuth } from "../context/AuthContext";

function LoginPage() {
  const { login, register } = useAuth();
  const [mode, setMode] = useState("login");
  const [showPassword, setShowPassword] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", phone: "", password: "", remember: true });
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);

  const update = (event) => setForm((current) => ({ ...current, [event.target.name]: event.target.type === "checkbox" ? event.target.checked : event.target.value }));

  const submit = async (event) => {
    event.preventDefault();
    setBusy(true);
    setMessage("");
    try {
      const action = mode === "login" ? login : register;
      await action(form);
      window.history.pushState({}, "", "/admin");
      window.dispatchEvent(new PopStateEvent("popstate"));
    } catch (error) {
      setMessage(error.message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <section className="auth-page">
      <div className="auth-visual">
        <img src="/images/cover.png" alt="SIFI Foundation community work" />
        <div><span>Secure NGO Platform</span><h1>Welcome back to purpose-led operations.</h1><p>Manage programmes, donations, stories, settings and permissions from one protected workspace.</p></div>
      </div>
      <form className="auth-panel" onSubmit={submit}>
        <img src="/images/SIFI%20Foundation%20logo.png" alt="SIFI Foundation" />
        <h2>{mode === "login" ? "Login" : "Create donor account"}</h2>
        {mode === "register" && <label><span>Name</span><input name="name" value={form.name} onChange={update} required /></label>}
        <label><span>Email</span><div className="input-icon"><Mail size={17} /><input name="email" type="email" value={form.email} onChange={update} required /></div></label>
        {mode === "register" && <label><span>Phone</span><input name="phone" value={form.phone} onChange={update} /></label>}
        <label><span>Password</span><div className="input-icon"><LockKeyhole size={17} /><input name="password" type={showPassword ? "text" : "password"} value={form.password} onChange={update} required minLength={6} /><button type="button" onClick={() => setShowPassword((value) => !value)} aria-label="Toggle password visibility">{showPassword ? <EyeOff size={17} /> : <Eye size={17} />}</button></div></label>
        {mode === "login" && <div className="auth-row"><label className="remember"><input name="remember" type="checkbox" checked={form.remember} onChange={update} />Remember me</label><a href="/forgot-password">Forgot password?</a></div>}
        <button className="btn btn-primary auth-submit" type="submit" disabled={busy}>{busy ? "Please wait..." : mode === "login" ? "Login to Dashboard" : "Register"} </button>
        {message && <p className="form-message error">{message}</p>}
        <button className="auth-switch" type="button" onClick={() => setMode(mode === "login" ? "register" : "login")}><UserPlus size={16} />{mode === "login" ? "Need a donor account?" : "Already registered?"}</button>
      </form>
    </section>
  );
}

export default LoginPage;
