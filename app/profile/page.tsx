"use client"

import Link from "next/link"
import type React from "react"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { BottomNavigation } from "@/components/bottom-navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useAuth } from "@/lib/auth-context"
import { useData } from "@/lib/data-context"

export default function ProfilePage() {
  const router = useRouter()
  const { user, logout } = useAuth()
  const { getUserApplications, getUserProposals } = useData()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
  })

  useEffect(() => {
    if (!user) {
      router.push("/login")
      return
    }

    setFormData({
      name: user.name,
      email: user.email,
      phone: user.phone || "",
      address: user.location?.city || "",
    })
  }, [user, router])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setTimeout(() => {
      setLoading(false)
      alert("Profil muvaffaqiyatli yangilandi!")
    }, 1000)
  }

  const handleLogout = () => {
    logout()
    router.push("/login")
  }

  if (!user) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <div className="container mx-auto px-4 py-8 flex-grow pb-20 flex items-center justify-center">
          <p>Yuklanmoqda...</p>
        </div>
        <Footer />
        <BottomNavigation />
      </div>
    )
  }

  // Get user data
  const applications = getUserApplications()
  const proposals = getUserProposals()

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <div className="container mx-auto px-4 py-8 flex-grow pb-20">
        <div className="max-w-5xl mx-auto">
          <div className="flex flex-col md:flex-row gap-6 mb-8">
            {/* User profile card */}
            <div className="md:w-1/3">
              <Card>
                <CardContent className="p-6 flex flex-col items-center">
                  <Avatar className="w-24 h-24 mb-4">
                    <AvatarImage src={user.avatar || "/placeholder.svg"} alt={user.name} />
                    <AvatarFallback>{user.name.substring(0, 2)}</AvatarFallback>
                  </Avatar>
                  <h2 className="text-xl font-bold">{user.name}</h2>
                  <p className="text-muted-foreground mb-4">
                    {user.userType === "jobseeker" ? "Ish izlovchi" : 
                     user.userType === "employer" ? "Ish beruvchi" : "Frilanser"}
                  </p>
                  <Button variant="outline" className="w-full mb-2">
                    Rasmni o'zgartirish
                  </Button>
                  <Button variant="destructive" className="w-full" onClick={handleLogout}>
                    Chiqish
                  </Button>
                </CardContent>
              </Card>
            </div>
            
            {/* Tabs container */}
            <div className="md:w-2/3">
              <Tabs defaultValue="profile">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="profile">Profil</TabsTrigger>
                  <TabsTrigger value="resumes">Rezyumelar</TabsTrigger>
                  <TabsTrigger value="applications">Arizalar</TabsTrigger>
                </TabsList>
                
                {/* Profile tab */}
                <TabsContent value="profile">
                  <Card>
                    <CardHeader>
                      <CardTitle>Profil ma'lumotlari</CardTitle>
                      <CardDescription>Profil ma'lumotlaringizni yangilang</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="name">To'liq ism</Label>
                          <Input id="name" name="name" value={formData.name} onChange={handleChange} />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="email">Email</Label>
                          <Input id="email" name="email" type="email" value={formData.email} onChange={handleChange} />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="phone">Telefon raqam</Label>
                          <Input id="phone" name="phone" value={formData.phone} onChange={handleChange} />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="address">Manzil</Label>
                          <Input id="address" name="address" value={formData.address} onChange={handleChange} />
                        </div>
                        <Button type="submit" disabled={loading}>
                          {loading ? "Saqlanmoqda..." : "Saqlash"}
                        </Button>
                      </form>
                    </CardContent>
                  </Card>
                </TabsContent>
                
                {/* Other tabs would go here */}
              </Tabs>
            </div>
          </div>
        </div>
      </div>
      <Footer />
      <BottomNavigation />
    </div>
  )
}
