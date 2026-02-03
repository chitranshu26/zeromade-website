import "./globals.css";
import Navbar from "../components/Navbar";

export const metadata = {
  title: "Zeromade",
  description: "Apna Time, Apna Design",
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  themeColor: "#0a0a0a",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="relative">
        {/* Main navigation */}
        <Navbar />

        {/* Page content */}
        {children}
      </body>
    </html>
  );
}
