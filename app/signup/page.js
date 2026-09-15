import AuthForm from "../../components/AuthForm";
import AuthIntro from "../../components/AuthIntro";

export default function SignupPage() {
  return (
    <main className="login-page auth-signup-page">
      <div className="login-layout">
        <AuthIntro mode="signup" />
        <section className="login-form-column">
          <AuthForm mode="signup" />
          <p className="login-footer">Your drafts stay yours until you choose to share them</p>
        </section>
      </div>
    </main>
  );
}