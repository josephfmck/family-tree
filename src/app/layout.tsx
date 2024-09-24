import './globals.css';
import { Providers } from '../components/Providers'



export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" 
      // dark mode
      // className="dark"
    >
      <body>
      <Providers>{children}</Providers>
      </body>
    </html>
  );
}
