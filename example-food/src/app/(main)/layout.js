import { ToastProvider } from "@/providers/toast-provider";
import { Header } from "./_components/header";
import { Footer } from "./_components/footer";

export default function MainLayout({ children }) {
  return (
    <ToastProvider>
      <div className="flex min-h-screen flex-col bg-neutral-700">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </div>
    </ToastProvider>
  );
}
