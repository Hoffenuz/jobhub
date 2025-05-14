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

export default function RegisterPage() {
  const router = useRouter()
  const { register } = useAuth()
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [debugInfo, setDebugInfo] = useState<any>(null)
  const [requestPayload, setRequestPayload] = useState<any>(null)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setDebugInfo(null)
    setRequestPayload(null)

    if (formData.password !== formData.confirmPassword) {
      setError("Parollar mos kelmadi!")
      return
    }

    setLoading(true)

    try {
      // Create request payload
      const payload = {
        username: formData.username,
        email: formData.email,
        password: formData.password,
        mode: "direct" // Qo'shimcha parameter uchun
      };
      
      setRequestPayload(payload);

      // First, try direct server communication for better error handling
      const directResponse = await fetch('https://serverjobhub2.onrender.com/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(payload),
      });
      
      let responseData;
      try {
        responseData = await directResponse.json();
      } catch (parseError) {
        responseData = { 
          error: "JSON parsing error",
          text: await directResponse.text()
        };
      }
      
      setDebugInfo({
        status: directResponse.status,
        statusText: directResponse.statusText,
        headers: Object.fromEntries([...directResponse.headers]),
        data: responseData
      });
      
      if (!directResponse.ok) {
        let errorMessage = "Ro'yxatdan o'tishda xatolik yuz berdi";
        if (responseData && responseData.message) {
          errorMessage = responseData.message;
        }
        
        // Specific error messages for common issues
        if (directResponse.status === 400 && errorMessage.includes("mavjud")) {
          errorMessage = "Foydalanuvchi nomi yoki email allaqachon ishlatilmoqda";
        } else if (directResponse.status === 500) {
          errorMessage = "Serverda ichki xatolik yuz berdi. Ma'lumotlaringizni tekshiring va qayta urinib ko'ring";
        }
        
        setError(errorMessage);
        setLoading(false);
        return;
      }
      
      // If direct signup was successful, use auth context login
      const success = await register(
        {
          name: formData.username,
          email: formData.email,
          userType: "jobseeker", // Default userType
        },
        formData.password,
      )

      if (success) {
        router.push("/")
      } else {
        setError("Ro'yxatdan o'tishda muammo yuzaga keldi. Iltimos, tizimga kirish sahifasiga o'ting.")
      }
    } catch (err) {
      console.error("Registration error:", err);
      setError("Server bilan bog'lanishda xatolik yuz berdi. Iltimos, keyinroq qayta urinib ko'ring. Xato tafsiloti: " + err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/50 px-4 py-8">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">Ro'yxatdan o'tish</CardTitle>
          <CardDescription className="text-center">
            JobHub platformasidan foydalanish uchun ro'yxatdan o'ting
          </CardDescription>
        </CardHeader>
        <CardContent>
          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          
          {debugInfo && (
            <Alert className="mb-4 text-xs overflow-auto max-h-40">
              <AlertDescription>
                <details>
                  <summary className="cursor-pointer">Debug ma'lumotlari</summary>
                  <pre className="mt-2">{JSON.stringify(debugInfo, null, 2)}</pre>
                </details>
              </AlertDescription>
            </Alert>
          )}
          
          {requestPayload && (
            <Alert className="mb-4 text-xs overflow-auto">
              <AlertDescription>
                <details>
                  <summary className="cursor-pointer">So'rov ma'lumotlari</summary>
                  <pre className="mt-2">{JSON.stringify(requestPayload, null, 2)}</pre>
                </details>
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
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="email@example.com"
                required
                value={formData.email}
                onChange={handleChange}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Parol</Label>
              <Input
                id="password"
                name="password"
                type="password"
                required
                value={formData.password}
                onChange={handleChange}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Parolni tasdiqlang</Label>
              <Input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                required
                value={formData.confirmPassword}
                onChange={handleChange}
              />
            </div>

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Ro'yxatdan o'tish..." : "Ro'yxatdan o'tish"}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex flex-col">
          <div className="text-center text-sm mt-2">
            Hisobingiz bormi?{" "}
            <Link href="/login" className="text-primary hover:underline">
              Tizimga kirish
            </Link>
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}
