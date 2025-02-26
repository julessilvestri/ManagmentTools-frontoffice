import '@/styles/globals.css';
import SocketProvider from "./providers/SocketProvider";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="fr">
      <head>
        <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet" />
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body>
        <SocketProvider>
          {children}
        </SocketProvider>
      </body>
    </html>
  )
}
