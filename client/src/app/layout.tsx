import NavBar from "./_components/NavBar/NavBar";
import { Inter } from 'next/font/google';
import './globals.css';

export const metadata = {
  title: 'SRKW',
  description: '',
}

const inter = Inter({
  subsets: ['latin'],
  display: 'swap'
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={inter.className}>
      <body>
        <NavBar />
        {children}
      </body>
    </html>
  )
}
