export default function DashboardFooter() {
  return (
    <footer className="border-t bg-background bottom-0 fixed w-full">
      <div className="container py-4 text-center">
        <p className="text-sm text-muted-foreground">
          © {new Date().getFullYear()} Webhook Dashboard. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
