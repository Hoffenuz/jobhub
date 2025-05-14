"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { useAuth } from "@/lib/auth-context"
import { Alert, AlertDescription } from "@/components/ui/alert"

export default function LoginPage() {
  const router = useRouter()
  const { login } = useAuth()
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [debugInfo, setDebugInfo] = useState<any>(null)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")
    setDebugInfo(null)

    try {
      // Try direct server communication first
      const directResponse = await fetch('https://serverjobhub2.onrender.com/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: formData.username,
          password: formData.password
        }),
      });
      
      const responseData = await directResponse.json();
      setDebugInfo({
        status: directResponse.status,
        data: responseData
      });
      
      if (!directResponse.ok) {
        setError(responseData.message || "Tizimga kirishda xatolik yuz berdi");
        setLoading(false);
        return;
      }
      
      // If direct login was successful, use auth context
      const success = await login(formData.username, formData.password)
      if (success) {
        router.push("/")
      } else {
        setError("Tizimga kirishda muammo yuzaga keldi.")
      }
    } catch (err) {
      console.error("Login error:", err);
      setError("Server bilan bog'lanishda xatolik yuz berdi. Iltimos, keyinroq qayta urinib ko'ring.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/50 px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">Tizimga kirish</CardTitle>
          <CardDescription className="text-center">
            JobHub platformasiga kirish uchun ma'lumotlaringizni kiriting
          </CardDescription>
        </CardHeader>
        <CardContent>
          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          
          {debugInfo && (
            <Alert className="mb-4 text-xs overflow-auto max-h-32">
              <AlertDescription>
                <pre>{JSON.stringify(debugInfo, null, 2)}</pre>
              </AlertDescription>
            </Alert>
          )}
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username">Foydalanuvchi nomi</Label>
              <Input
                id="username"
                name="username"
                placeholder="foydalanuvchi_nomi"
                required
                value={formData.username}
                onChange={handleChange}
              />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Parol</Label>
                <Link href="/forgot-password" className="text-sm text-primary hover:underline">
                  Parolni unutdingizmi?
                </Link>
              </div>
              <Input
                id="password"
                name="password"
                type="password"
                required
                value={formData.password}
                onChange={handleChange}
              />
            </div>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Kirish..." : "Kirish"}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex flex-col">
          <div className="text-center text-sm mt-2">
            Hisobingiz yo'qmi?{" "}
            <Link href="/register" className="text-primary hover:underline">
              Ro'yxatdan o'tish
            </Link>
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}
