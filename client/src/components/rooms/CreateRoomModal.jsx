import { useState } from "react";
import { useForm } from "react-hook-form";
import { useChat } from "../../hooks/useChat";
import { useNavigate } from "react-router-dom";
import Button from "../ui/Button";
import Input from "../ui/Input";

export default function CreateRoomModal({ onClose }) {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const { createRoom } = useChat();
  const navigate = useNavigate();
  const [serverError, setServerError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const onSubmit = async (data) => {
    try {
      setSubmitting(true);
      setServerError("");
      const room = await createRoom(data);
      onClose();
      navigate(`/chat/${room._id}`);
    } catch (err) {
      setServerError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-20 bg-ink/40 flex items-center justify-center p-4" onClick={onClose}>
      <div className="w-full max-w-sm bg-white rounded-2xl p-6" onClick={(e) => e.stopPropagation()}>
        <h2 className="font-display text-lg text-lapis mb-4">Créer un salon</h2>
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4" noValidate>
          <Input
            id="name" label="Nom du salon" placeholder="projet-react"
            error={errors.name?.message}
            {...register("name", {
              required: "Le nom est obligatoire",
              minLength: { value: 3, message: "3 caractères minimum" },
              maxLength: { value: 50, message: "50 caractères maximum" },
            })}
          />
          <Input
            id="description" label="Description (optionnel)" placeholder="De quoi parle ce salon ?"
            error={errors.description?.message}
            {...register("description", { maxLength: { value: 200, message: "200 caractères maximum" } })}
          />
          {serverError && <p role="alert" className="text-sm text-danger bg-danger/5 rounded-lg px-3 py-2">{serverError}</p>}
          <div className="flex gap-2 justify-end mt-1">
            <Button type="button" variant="ghost" onClick={onClose}>Annuler</Button>
            <Button type="submit" disabled={submitting}>{submitting ? "Création…" : "Créer"}</Button>
          </div>
        </form>
      </div>
    </div>
  );
}