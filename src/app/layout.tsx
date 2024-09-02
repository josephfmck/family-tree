import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "My Next.js App",
  description: "A blank Next.js project",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
