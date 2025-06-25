import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t bg-[var(--background)] border-[var(--border)] py-8">
      <div className="container flex flex-col items-center justify-between gap-8 px-8 md:flex-row md:px-6">
        <p className="text-center text-sm text-[var(--foreground)] md:text-left">
          &copy; 2025 jvras58. Todos os direitos reservados.
        </p>
        <div className="flex items-center gap-8">
          <Link
            href="#"
            className="text-sm text-[var(--foreground)] hover:text-[var(--primary)]"
          >
            Termos
          </Link>
          <Link
            href="#"
            className="text-sm text-[var(--foreground)] hover:text-[var(--primary)]"
          >
            Privacidade
          </Link>
          <Link
            href="#"
            className="text-sm text-[var(--foreground)] hover:text-[var(--primary)]"
          >
            Contato
          </Link>
        </div>
      </div>
    </footer>
  );
}