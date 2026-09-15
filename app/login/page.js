import { Suspense } from "react";
import AuthForm from "../../components/AuthForm";
import AuthIntro from "../../components/AuthIntro";

export default function LoginPage() {
  return (
    <main className="login-page">
      <div className="login-layout">
        <AuthIntro />
        <section className="login-form-column">
          <Suspense fallback={<div className="auth-card w-full max-w-md" aria-hidden="true" />}>
            <AuthForm mode="login" variant="login" />
          </Suspense>
          <p className="login-footer">Private workspace · Review everything before you share</p>
        </section>
      </div>
    </main>
  );
}
