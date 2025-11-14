import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import { ThemeProvider } from "@/components/providers/theme-provider"
import { ThemeToggle } from "@/components/theme-toggle"
import { Toaster } from "@/components/ui/sonner"
import { Button } from "@/components/ui/button"
import "./globals.css"

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
})

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
})

export const metadata: Metadata = {
  title: "中国五险一金自动计算工具",
  description: "自动计算中国各地区五险一金缴纳金额，支持多城市配置",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="zh-CN" suppressHydrationWarning>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <ThemeProvider>
          <div className="relative flex min-h-screen flex-col bg-background text-foreground">
            <header className="sticky top-0 z-50 border-b border-gray-200/50 dark:border-gray-800/50 bg-white/80 dark:bg-gray-950/80 backdrop-blur-xl shadow-sm">
              <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-6 py-4">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg">
                    <span className="text-white font-bold text-lg">五</span>
                  </div>
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                      Social Security Calculator
                    </p>
                    <h1 className="text-lg font-bold bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400 bg-clip-text text-transparent">
                      中国五险一金计算工具
                    </h1>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Button variant="ghost" size="sm" asChild>
                    <a href="/">计算工具</a>
                  </Button>
                  <Button variant="ghost" size="sm" asChild>
                    <a href="/config">配置管理</a>
                  </Button>
                  <ThemeToggle />
                </div>
              </div>
            </header>
            <main className="flex-1">
              {children}
            </main>
            <footer className="border-t border-gray-200/50 dark:border-gray-800/50 bg-white/80 dark:bg-gray-950/80 backdrop-blur-xl">
              <div className="mx-auto flex w-full max-w-7xl flex-col gap-1 px-6 py-6 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
                <span>© {new Date().getFullYear()} 中国五险一金计算工具</span>
                <span className="text-xs">数据仅供参考，具体政策以当地社保部门为准</span>
              </div>
            </footer>
          </div>
          <Toaster closeButton richColors position="top-right" />
        </ThemeProvider>
      </body>
    </html>
  )
}
