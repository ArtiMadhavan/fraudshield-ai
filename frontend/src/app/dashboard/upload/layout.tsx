import { redirect } from "next/navigation";

// For demo purposes, we simulate checking user role.
// In a real application, this would read from an auth token or session cookie.
const getUserRole = () => "Admin"; // "Admin", "Risk Manager", "Fraud Analyst"

export default function UploadLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const role = getUserRole();
  const allowedRoles = ["Admin", "Risk Manager", "Fraud Analyst"];
  
  if (!allowedRoles.includes(role)) {
    redirect("/dashboard");
  }

  return <>{children}</>;
}
