import { useState } from "react";
import { useLocation } from "wouter";
import { ArrowRight, LockKeyhole, ShieldCheck, UserRound } from "lucide-react";
import { Button } from "@/components/ui/button";
import { trpc } from "@/lib/trpc";

export default function Login() {
  const [, navigate] = useLocation();
  const utils = trpc.useUtils();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const login = trpc.auth.localLogin.useMutation({
    onSuccess: async () => {
      await utils.auth.me.invalidate();
      navigate("/");
    },
  });

  return (
    <main className="login-shell login-refined login-video-page">
      <video
        className="login-background-video"
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        poster="/brand/smartanalytics-intro-poster.jpg"
        aria-hidden="true"
        tabIndex={-1}
      >
        <source src="/brand/smartanalytics-intro.mp4" type="video/mp4" />
      </video>
      <div className="login-video-tint" aria-hidden="true" />

      <section className="login-art login-video-brand-pane">
        <div className="login-brand">
          <img className="login-zain-logo" src="/brand/zain-logo.svg" alt="Zain" />
          <span className="login-brand-divider" aria-hidden="true" />
          <div className="login-brand-copy">
            <strong>SmartAnalytics</strong>
          </div>
        </div>
      </section>

      <section className="login-card-wrap">
        <div className="login-card">
          <div className="login-card-head">
            <span className="section-kicker">SECURE WORKSPACE ACCESS</span>
            <h2>Welcome back</h2>
            <p>Enter your credentials to open the telecom command center.</p>
          </div>
          <form
            onSubmit={event => {
              event.preventDefault();
              if (username.trim() && password) login.mutate({ username, password });
            }}
          >
            <label>
              <span>Username</span>
              <div className="login-input">
                <UserRound size={17} />
                <input
                  autoComplete="username"
                  value={username}
                  onChange={event => setUsername(event.target.value)}
                  placeholder="Enter username"
                />
              </div>
            </label>
            <label>
              <span>Password</span>
              <div className="login-input">
                <LockKeyhole size={17} />
                <input
                  type="password"
                  autoComplete="current-password"
                  value={password}
                  onChange={event => setPassword(event.target.value)}
                  placeholder="Enter password"
                />
              </div>
            </label>
            {login.error && (
              <div className="login-error">
                Unable to sign in. Check your username and password.
              </div>
            )}
            <Button
              className="login-submit"
              type="submit"
              disabled={login.isPending || !username.trim() || !password}
            >
              {login.isPending ? (
                "Opening workspace…"
              ) : (
                <>
                  Enter command center <ArrowRight size={16} />
                </>
              )}
            </Button>
          </form>
          <div className="login-security">
            <ShieldCheck size={15} />
            <span>Protected local session · RBAC enforced</span>
          </div>
        </div>
      </section>
    </main>
  );
}
