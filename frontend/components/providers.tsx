"use client"

import { Provider } from "react-redux"
import { store } from "@/src/store"
import AuthProvider from "./auth-provider"

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <Provider store={store}>
      <AuthProvider>{children}</AuthProvider>
    </Provider>
  )
}