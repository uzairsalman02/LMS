import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "CS Companion - Computer Science LMS (11th & 12th Standard)",
  description: "Web-first Computer Science learning platform for Class 11 and 12, Punjab Board.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full antialiased">
      <head>
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css"
        />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Noto+Nastaliq+Urdu:wght@400;700&display=swap"
        />
      </head>
      <body className="min-h-full flex flex-col bg-white text-slate-800 font-sans antialiased">
        {children}
      </body>
    </html>
  );
}
