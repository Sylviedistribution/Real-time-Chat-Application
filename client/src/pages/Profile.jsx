import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import Avatar from "../components/ui/Avatar";
import Button from "../components/ui/Button";
import Input from "../components/ui/Input";

export default function Profile() {
  const { user, updateProfile } = useAuth();
  const { register, handleSubmit, formState: { errors, isDirty } } = useForm({
    defaultValues: { username: user.username, avatarUrl: user.avatarUrl },
  });

  const onSubmit = (data) => {
    updateProfile(data); // ⇄ deviendra PATCH /api/users/me en Phase 7
  };

  return (
    <main className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-105 bg-white rounded-2xl border border-scribe/15 p-8">
        <div className="flex flex-col items-center gap-3 mb-8">
          <Avatar username={user.username} status="online" size="md" />
          <h1 className="font-display text-xl text-lapis">Mon profil</h1>
          <p className="text-sm text-scribe">{user.email}</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4" noValidate>
          <Input
            id="username" type="text" label="Nom d'utilisateur"
            error={errors.username?.message}
            {...register("username", {
              required: "Le nom d'utilisateur est obligatoire",
              minLength: { value: 3, message: "3 caractères minimum" },
              maxLength: { value: 30, message: "30 caractères maximum" },
            })}
          />
          <Input
            id="avatarUrl" type="url" label="URL de l'avatar (optionnel)"
            placeholder="https://…" error={errors.avatarUrl?.message}
            {...register("avatarUrl")}
          />
          <Button type="submit" disabled={!isDirty} className="mt-2">
            Enregistrer
          </Button>
        </form>

        <p className="text-sm text-scribe text-center mt-6">
          <Link to="/chat" className="text-gold font-medium hover:underline">← Retour au chat</Link>
        </p>
      </div>
    </main>
  );
}