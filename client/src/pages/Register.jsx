import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useAuth } from "../hooks/useAuth";
import Button from "../components/ui/Button";
import Input from "../components/ui/Input";

export default function Register() {
  const { register, handleSubmit, watch, formState: { errors } } = useForm();
  const { register: registerUser } = useAuth();
  const navigate = useNavigate();
  const [serverError, setServerError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const onSubmit = async ({ username, email, password }) => {
    try {
      setSubmitting(true);
      setServerError("");
      await registerUser({ username, email, password });
      navigate("/chat");
    } catch (err) {
      setServerError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-105 bg-white rounded-2xl border border-scribe/15 p-8">
        <div className="flex flex-col items-center gap-2 mb-8">
          <div className="w-12 h-12 rounded-xl bg-gold text-gold-soft flex items-center justify-center font-display text-2xl">T</div>
          <h1 className="font-display text-2xl text-lapis">Créer un compte</h1>
          <p className="text-sm text-scribe">Rejoignez la conversation</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4" noValidate>
          <Input
            id="username" type="text" label="Nom d'utilisateur" placeholder="awa_diop"
            error={errors.username?.message}
            {...register("username", {
              required: "Le nom d'utilisateur est obligatoire",
              minLength: { value: 3, message: "3 caractères minimum" },
              maxLength: { value: 30, message: "30 caractères maximum" },
            })}
          />
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
          <Input
            id="confirmPassword" type="password" label="Confirmer le mot de passe" placeholder="••••••••"
            error={errors.confirmPassword?.message}
            {...register("confirmPassword", {
              required: "Veuillez confirmer le mot de passe",
              validate: (value) =>
                value === watch("password") || "Les mots de passe ne correspondent pas",
            })}
          />
          {serverError && (
            <p role="alert" className="text-sm text-danger bg-danger/5 rounded-lg px-3 py-2">{serverError}</p>
          )}
          <Button type="submit" disabled={submitting} className="mt-2">
            {submitting ? "Création du compte…" : "S'inscrire"}
          </Button>
        </form>

        <p className="text-sm text-scribe text-center mt-6">
          Déjà un compte ?{" "}
          <Link to="/login" className="text-gold font-medium hover:underline">Se connecter</Link>
        </p>
      </div>
    </main>
  );
}