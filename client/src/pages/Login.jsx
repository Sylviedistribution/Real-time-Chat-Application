import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useAuth } from "../hooks/useAuth";
import Button from "../components/ui/Button";
import Input from "../components/ui/Input";

export default function Login() {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const { login } = useAuth();
  const navigate = useNavigate();
  const [serverError, setServerError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const onSubmit = async (data) => {
    try {
      setSubmitting(true);
      setServerError("");
      await login(data);
      navigate("/chat");
    } catch (err) {
      setServerError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-[420px] bg-white rounded-2xl border border-scribe/15 p-8">
        <div className="flex flex-col items-center gap-2 mb-8">
          <div className="w-12 h-12 rounded-xl bg-gold text-gold-soft flex items-center justify-center font-display text-2xl">T</div>
          <h1 className="font-display text-2xl text-lapis">ThotTalk</h1>
          <p className="text-sm text-scribe">La sagesse de la conversation</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4" noValidate>
          <Input
            id="email" type="email" label="Email" placeholder="awa@exemple.com"
            error={errors.email?.message}
            {...register("email", {
              required: "L'email est obligatoire",
              pattern: { value: /^\S+@\S+\.\S+$/, message: "Format d'email invalide" },
            })}
          />
          <Input
            id="password" type="password" label="Mot de passe" placeholder="••••••••"
            error={errors.password?.message}
            {...register("password", {
              required: "Le mot de passe est obligatoire",
              minLength: { value: 8, message: "8 caractères minimum" },
            })}
          />
          {serverError && (
            <p role="alert" className="text-sm text-red-500 bg-danger/5 rounded-lg px-3 py-2">{serverError}</p>
          )}
          <Button type="submit" disabled={submitting} className="mt-2">
            {submitting ? "Connexion…" : "Se connecter"}
          </Button>
        </form>

        <p className="text-sm text-scribe text-center mt-6">
          Pas encore de compte ?{" "}
          <Link to="/register" className="text-gold font-medium hover:underline">S'inscrire</Link>
        </p>
      </div>
    </main>
  );
}