import { Suspense } from "react";
import AuthForm from "../../components/AuthForm";
import AuthIntro from "../../components/AuthIntro";

export default function SignupPage() {
  return (
    <main className="login-page auth-signup-page">
      <div className="login-layout">
        <AuthIntro mode="signup" />
        <section className="login-form-column">
          <Suspense fallback={<div className="auth-card w-full max-w-md" aria-hidden="true" />}>
            <AuthForm mode="signup" />
          </Suspense>
          <p className="login-footer">Your drafts stay yours until you choose to share them</p>
        </section>
      </div>
    </main>
  );
}