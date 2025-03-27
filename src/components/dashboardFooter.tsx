export default function DashboardFooter() {
  return (
    <footer className="border-t bg-background bottom-0 sticky w-full">
      <div className="container py-4 text-center">
        <p className="text-sm text-muted-foreground">
          © {new Date().getFullYear()} Notification Netlify Dashboard. All
          rights reserved.
        </p>
      </div>
    </footer>
  );
}
