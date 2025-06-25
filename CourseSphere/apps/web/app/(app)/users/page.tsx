import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Usuários",
};

export default function UsersPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background font-sans">
      <div className="bg-card p-10 rounded-2xl shadow-xl text-center">
        <h1 className="text-4xl font-bold text-primary mb-2">Hello, World!</h1>
        <p className="text-muted-foreground text-lg">
          Bem-vindo à página de usuarios.
        </p>
      </div>
    </div>
  );
}