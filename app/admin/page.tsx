import AdminActivationForm from "./AdminActivationForm";

export const metadata = {
  title: "Lincies House Admin",
};

export default function AdminPage() {
  return (
    <main className="admin-page">
      <AdminActivationForm />
    </main>
  );
}
