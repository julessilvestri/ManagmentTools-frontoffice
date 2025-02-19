import '@/styles/globals.css';
import SocketProvider from "./providers/SocketProvider";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="fr">
      <body>
        <SocketProvider>
          {children}
        </SocketProvider>
      </body>
    </html>
  )
}