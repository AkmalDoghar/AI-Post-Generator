import AuthIntro from "../../components/AuthIntro";
import ForgotPasswordForm from "../../components/ForgotPasswordForm";

export default function ForgotPasswordPage() {
  return (
    <main className="login-page">
      <div className="login-layout">
        <AuthIntro />
        <section className="login-form-column">
          <ForgotPasswordForm />
          <p className="login-footer">Verification codes expire after 10 minutes</p>
        </section>
      </div>
    </main>
  );
}
