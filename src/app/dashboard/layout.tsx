import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { DashboardHeader } from "@/components/dashboardHeader";
import DashboardFooter from "@/components/dashboardFooter";

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login");
  }

  return (
    <div className="min-h-screen bg-muted/40">
      <DashboardHeader />
      {children}
      <DashboardFooter />
    </div>
  );
}
