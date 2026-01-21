import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "./provider/authProvider";
import ConditionalHeader from "./components/ConditionalHeader";
import { Toaster } from "react-hot-toast";

export const metadata: Metadata = {
  title: "My App",
  description: "Simple Next.js layout with login button",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          <Toaster
            position="top-right"
            reverseOrder={false}
            toastOptions={{
              duration: 4000,
              style: {
                padding: "16px",
                borderRadius: "12px",
                fontSize: "16px",
                fontWeight: "500",
              },
            }}
          />
          <ConditionalHeader />
          <main className="min-h-screen">{children}</main>
        </AuthProvider>
      </body>
    </html>
  );
}
