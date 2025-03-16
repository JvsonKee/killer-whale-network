import NavBar from "./_components/NavBar/NavBar";
import Footer from "./_components/Footer/Footer";
import { Inter } from "next/font/google";
import "./globals.css";

export const metadata = {
  title: "Resident Connections",
  description:
    "Explore the world of the Southern Resident Killer Whales through interactive network graphs, in-depth pod histories, and conservation insights. Learn about J, K, and L pods, the threats they face, and how you can help protect these endangered killer whales.",
};

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={inter.className}>
      <body>
        <NavBar />
        {children}
        <Footer />
      </body>
    </html>
  );
}
