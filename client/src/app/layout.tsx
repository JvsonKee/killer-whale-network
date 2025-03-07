import NavBar from "./_components/NavBar/NavBar"
import './globals.css';

export const metadata = {
  title: 'SRKW',
  description: '',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <NavBar />
        {children}
      </body>
    </html>
  )
}
