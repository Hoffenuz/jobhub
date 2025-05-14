"use client"

import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { JobCategories } from "@/components/job-categories"
import { JobListings } from "@/components/job-listings"
import { FilterPanel } from "@/components/filter-panel"
import { BottomNavigation } from "@/components/bottom-navigation"
import { Button } from "@/components/ui/button"
import { AuthProvider } from "@/lib/auth-context"
import { DataProvider } from "@/lib/data-context"
import Link from "next/link"
import { useState } from "react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Input } from "@/components/ui/input"

export default function Home() {
  const [serverStatus, setServerStatus] = useState<{ message: string; isError: boolean } | null>(null);
  const [signupTestResult, setSignupTestResult] = useState<any>(null);
  const [userTestInput, setUserTestInput] = useState({
    username: "",
    email: "",
    password: "test123"
  });

  const testServerConnection = async () => {
    try {
      setServerStatus({ message: "Server javobini kutmoqdamiz...", isError: false });
      const response = await fetch("https://serverjobhub2.onrender.com/");
      const text = await response.text();
      setServerStatus({ message: text, isError: false });
    } catch (error) {
      setServerStatus({ message: "Server bilan bogʻlanishda xatolik: " + error, isError: true });
    }
  };

  const testSignupEndpoint = async () => {
    try {
      // Generate random credentials for testing
      const randomUsername = userTestInput.username || `test_user_${Math.floor(Math.random() * 100000)}`;
      const randomEmail = userTestInput.email || `test_${Math.floor(Math.random() * 100000)}@example.com`;
      
      setSignupTestResult({
        status: "loading",
        message: "Server javobini kutmoqdamiz..."
      });
      
      const response = await fetch('https://serverjobhub2.onrender.com/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          username: randomUsername,
          email: randomEmail,
          password: userTestInput.password,
          mode: "test"
        }),
      });
      
      let data;
      try {
        data = await response.json();
      } catch (parseError) {
        const text = await response.text();
        data = { 
          parseError: true,
          rawText: text,
          errorMessage: "JSON formatida emas: " + parseError
        };
      }
      
      setSignupTestResult({
        status: response.status,
        statusText: response.statusText,
        success: response.ok,
        data: data,
        headers: Object.fromEntries([...response.headers]),
        testCredentials: { username: randomUsername, email: randomEmail, password: userTestInput.password }
      });
    } catch (error) {
      setSignupTestResult({
        success: false,
        error: `${error}`,
        errorDetails: (error as any)?.message || "",
        errorStack: (error as any)?.stack || ""
      });
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUserTestInput(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <AuthProvider>
      <DataProvider>
        <main className="min-h-screen flex flex-col">
          <Header />
          <div className="container mx-auto px-4 py-6 flex-grow pb-20">
            {/* Hero section */}
            <div className="bg-gradient-to-r from-primary to-blue-600 text-white rounded-lg p-8 mb-8">
              <div className="max-w-3xl">
                <h1 className="text-3xl md:text-4xl font-bold mb-4">Ish izlash va ishchi topish platformasi</h1>
                <p className="text-lg mb-6">
                  JobHub - bu ish izlovchilar va ish beruvchilarni bir joyda bog'lovchi platforma. O'zingizga mos ishni
                  toping yoki malakali xodimlarni jalb qiling.
                </p>
                <div className="flex flex-wrap gap-4">
                  <Button size="lg" variant="secondary" asChild>
                    <Link href="/resume">Rezyume joylash</Link>
                  </Button>
                  <Button
                    size="lg"
                    variant="outline"
                    className="bg-transparent text-white border-white hover:bg-white/10"
                    asChild
                  >
                    <Link href="/vacancy">Vakansiya joylash</Link>
                  </Button>
                </div>
              </div>
            </div>

            <FilterPanel />
            <JobCategories />

            <div className="my-8">
              <div className="flex items-center gap-4 mb-6">
                <div className="h-0.5 bg-gray-300 flex-grow"></div>
                <h2 className="text-2xl font-bold text-primary">JobHub</h2>
                <div className="h-0.5 bg-gray-300 flex-grow"></div>
              </div>
            </div>

            <JobListings />

            {/* Stats section */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 my-12">
              <div className="bg-blue-50 p-6 rounded-lg text-center">
                <div className="text-3xl font-bold text-primary mb-2">1,200+</div>
                <div className="text-gray-600">Faol vakansiyalar</div>
              </div>
              <div className="bg-green-50 p-6 rounded-lg text-center">
                <div className="text-3xl font-bold text-green-600 mb-2">3,500+</div>
                <div className="text-gray-600">Ro'yxatdan o'tgan foydalanuvchilar</div>
              </div>
              <div className="bg-purple-50 p-6 rounded-lg text-center">
                <div className="text-3xl font-bold text-purple-600 mb-2">850+</div>
                <div className="text-gray-600">Kompaniyalar</div>
              </div>
              <div className="bg-orange-50 p-6 rounded-lg text-center">
                <div className="text-3xl font-bold text-orange-600 mb-2">5,000+</div>
                <div className="text-gray-600">Muvaffaqiyatli ishga joylashishlar</div>
              </div>
            </div>

            {serverStatus && (
              <Alert variant={serverStatus.isError ? "destructive" : "default"} className="my-4">
                <AlertDescription>{serverStatus.message}</AlertDescription>
              </Alert>
            )}
            
            {signupTestResult && (
              <Alert variant={signupTestResult.success ? "default" : "destructive"} className="my-4 overflow-auto max-h-44">
                <AlertDescription>
                  <div className="font-bold mb-2">
                    Signup Test: {signupTestResult.success ? "Muvaffaqiyatli" : "Muvaffaqiyatsiz"}
                  </div>
                  <pre className="text-xs whitespace-pre-wrap">
                    {JSON.stringify(signupTestResult, null, 2)}
                  </pre>
                </AlertDescription>
              </Alert>
            )}
            
            <div className="grid gap-4 mt-4">
              <div className="flex gap-4">
                <Button onClick={testServerConnection}>
                  Server holatini tekshirish
                </Button>
                <Button onClick={testSignupEndpoint} variant="outline">
                  Ro'yxatdan o'tish API-ni tekshirish
                </Button>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-4 border rounded-lg">
                <Input 
                  placeholder="Foydalanuvchi nomi" 
                  name="username" 
                  value={userTestInput.username} 
                  onChange={handleInputChange}
                />
                <Input 
                  placeholder="Test email" 
                  name="email" 
                  value={userTestInput.email} 
                  onChange={handleInputChange}
                />
                <Input 
                  placeholder="Test parol" 
                  name="password" 
                  value={userTestInput.password} 
                  onChange={handleInputChange}
                />
              </div>
            </div>
          </div>
          <Footer />
          <BottomNavigation />
        </main>
      </DataProvider>
    </AuthProvider>
  )
}
