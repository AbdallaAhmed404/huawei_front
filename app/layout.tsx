// app/layout.tsx

import { ThemeProvider } from "next-themes";
import { AlertProvider } from "@/src/components/global/alert-provider";
import "./globals.css";
import { cn } from "@/lib/utils";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="antialiased bg-background text-foreground">
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
          <AlertProvider>
             {/* هنا الـ Next هيعرض إما layout الـ (main) أو layout الـ (admin) */}
            {children}
          </AlertProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}