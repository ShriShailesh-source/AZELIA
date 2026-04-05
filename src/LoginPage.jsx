import { useState } from "react";

export default function LoginPage({ dark, onToggleTheme, onLogin, error }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(true);

  const submit = (event) => {
    event.preventDefault();
    onLogin(email.trim(), password, rememberMe);
  };

  return (
    <div className="az-login-wrap">
      <button className="az-icon-btn az-login-theme" onClick={onToggleTheme} title="Toggle theme">
        {dark ? "☀️" : "🌙"}
      </button>

      <form className="az-login-card" onSubmit={submit}>
        <div className="az-login-brand">
          <div className="az-login-icon">⚡</div>
          <div>
            <div className="az-login-title">Azelia</div>
            <div className="az-login-sub">Welcome back</div>
          </div>
        </div>

        <div className="az-fg">
          <label className="az-fl">Email</label>
          <input
            className="az-fi"
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            required
          />
        </div>

        <div className="az-fg">
          <label className="az-fl">Password</label>
          <input
            className="az-fi"
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            required
          />
        </div>

        <label className="az-login-remember">
          <input
            type="checkbox"
            checked={rememberMe}
            onChange={(event) => setRememberMe(event.target.checked)}
          />
          <span>Remember me</span>
        </label>

        {error && <div className="az-login-error">{error}</div>}

        <button type="submit" className="az-btn-save az-login-submit">
          Sign in
        </button>
      </form>
    </div>
  );
}
