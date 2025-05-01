"use client"

import { Provider } from "react-redux"
import { store } from "@/src/store"
import AuthProvider from "./auth-provider"
import { ThemeProvider } from "./theme-provider"
import { Toaster } from "@/components/ui/toaster"

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <Provider store={store}>
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
        <AuthProvider>
          {children}
          <Toaster />
        </AuthProvider>
      </ThemeProvider>
    </Provider>
  )
}