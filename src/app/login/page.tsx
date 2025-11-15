"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { toast } from "sonner"
import { LogIn, UserPlus, Lock, User } from "lucide-react"
import Link from "next/link"

export default function LoginPage() {
    const router = useRouter()
    const [loading, setLoading] = useState(false)
    const [loginForm, setLoginForm] = useState({ username: "", password: "" })
    const [registerForm, setRegisterForm] = useState({
        username: "",
        password: "",
        confirmPassword: "",
        email: "",
        name: "",
    })

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)

        try {
            const response = await fetch("/api/auth/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(loginForm),
            })

            const data = await response.json()

            if (!response.ok) {
                toast.error(data.error || "登录失败")
                return
            }

            toast.success("登录成功")
            router.push("/")
            router.refresh()
        } catch (error) {
            console.error("登录失败:", error)
            toast.error("登录失败，请稍后重试")
        } finally {
            setLoading(false)
        }
    }

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault()

        if (registerForm.password !== registerForm.confirmPassword) {
            toast.error("两次输入的密码不一致")
            return
        }

        if (registerForm.password.length < 6) {
            toast.error("密码长度至少为6位")
            return
        }

        setLoading(true)

        try {
            const response = await fetch("/api/auth/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    username: registerForm.username,
                    password: registerForm.password,
                    email: registerForm.email || undefined,
                    name: registerForm.name || undefined,
                }),
            })

            const data = await response.json()

            if (!response.ok) {
                toast.error(data.error || "注册失败")
                return
            }

            toast.success("注册成功")
            router.push("/")
            router.refresh()
        } catch (error) {
            console.error("注册失败:", error)
            toast.error("注册失败，请稍后重试")
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="relative min-h-screen flex items-center justify-center p-4">
            {/* 背景 */}
            <div className="fixed inset-0 -z-10">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-indigo-50/50 to-purple-50 dark:from-gray-950 dark:via-indigo-950/30 dark:to-purple-950" />
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(99,102,241,0.15),transparent_50%)]" />
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(139,92,246,0.15),transparent_50%)]" />
            </div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="w-full max-w-md"
            >
                <Card className="relative overflow-hidden border border-blue-200/50 dark:border-blue-800/50 bg-gradient-to-br from-white/90 via-white/80 to-blue-50/30 backdrop-blur-xl shadow-2xl">
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-indigo-500/5 to-purple-500/5" />
                    <div className="absolute top-0 right-0 h-40 w-40 rounded-full bg-blue-400/20 blur-3xl" />

                    <CardHeader className="relative pb-6 pt-6 sm:pt-8">
                        <div className="flex items-center justify-center gap-3 mb-2">
                            <div className="rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 p-2.5 shadow-lg">
                                <Lock className="h-6 w-6 text-white" />
                            </div>
                            <CardTitle className="text-2xl font-bold">用户登录</CardTitle>
                        </div>
                        <CardDescription className="text-center">
                            登录以使用五险一金计算工具
                        </CardDescription>
                    </CardHeader>

                    <CardContent className="relative pb-6 sm:pb-8">
                        <Tabs defaultValue="login" className="w-full">
                            <TabsList className="grid w-full grid-cols-2">
                                <TabsTrigger value="login">登录</TabsTrigger>
                                <TabsTrigger value="register">注册</TabsTrigger>
                            </TabsList>

                            <TabsContent value="login" className="space-y-4 mt-6">
                                <form onSubmit={handleLogin} className="space-y-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="login-username" className="flex items-center gap-2">
                                            <User className="h-4 w-4" />
                                            用户名
                                        </Label>
                                        <Input
                                            id="login-username"
                                            value={loginForm.username}
                                            onChange={(e) =>
                                                setLoginForm({ ...loginForm, username: e.target.value })
                                            }
                                            placeholder="请输入用户名"
                                            required
                                            className="h-11"
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="login-password" className="flex items-center gap-2">
                                            <Lock className="h-4 w-4" />
                                            密码
                                        </Label>
                                        <Input
                                            id="login-password"
                                            type="password"
                                            value={loginForm.password}
                                            onChange={(e) =>
                                                setLoginForm({ ...loginForm, password: e.target.value })
                                            }
                                            placeholder="请输入密码"
                                            required
                                            className="h-11"
                                        />
                                    </div>

                                    <Button
                                        type="submit"
                                        disabled={loading}
                                        className="w-full h-11 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-700 hover:via-indigo-700 hover:to-purple-700"
                                    >
                                        {loading ? (
                                            <span className="flex items-center gap-2">
                                                <motion.div
                                                    animate={{ rotate: 360 }}
                                                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                                                    className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full"
                                                />
                                                登录中...
                                            </span>
                                        ) : (
                                            <span className="flex items-center gap-2">
                                                <LogIn className="h-4 w-4" />
                                                登录
                                            </span>
                                        )}
                                    </Button>
                                </form>
                            </TabsContent>

                            <TabsContent value="register" className="space-y-4 mt-6">
                                <form onSubmit={handleRegister} className="space-y-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="register-username">用户名 *</Label>
                                        <Input
                                            id="register-username"
                                            value={registerForm.username}
                                            onChange={(e) =>
                                                setRegisterForm({ ...registerForm, username: e.target.value })
                                            }
                                            placeholder="请输入用户名"
                                            required
                                            className="h-11"
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="register-password">密码 *</Label>
                                        <Input
                                            id="register-password"
                                            type="password"
                                            value={registerForm.password}
                                            onChange={(e) =>
                                                setRegisterForm({ ...registerForm, password: e.target.value })
                                            }
                                            placeholder="至少6位字符"
                                            required
                                            minLength={6}
                                            className="h-11"
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="register-confirm-password">确认密码 *</Label>
                                        <Input
                                            id="register-confirm-password"
                                            type="password"
                                            value={registerForm.confirmPassword}
                                            onChange={(e) =>
                                                setRegisterForm({ ...registerForm, confirmPassword: e.target.value })
                                            }
                                            placeholder="请再次输入密码"
                                            required
                                            className="h-11"
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="register-email">邮箱（可选）</Label>
                                        <Input
                                            id="register-email"
                                            type="email"
                                            value={registerForm.email}
                                            onChange={(e) =>
                                                setRegisterForm({ ...registerForm, email: e.target.value })
                                            }
                                            placeholder="请输入邮箱"
                                            className="h-11"
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="register-name">姓名（可选）</Label>
                                        <Input
                                            id="register-name"
                                            value={registerForm.name}
                                            onChange={(e) =>
                                                setRegisterForm({ ...registerForm, name: e.target.value })
                                            }
                                            placeholder="请输入姓名"
                                            className="h-11"
                                        />
                                    </div>

                                    <Button
                                        type="submit"
                                        disabled={loading}
                                        className="w-full h-11 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-700 hover:via-indigo-700 hover:to-purple-700"
                                    >
                                        {loading ? (
                                            <span className="flex items-center gap-2">
                                                <motion.div
                                                    animate={{ rotate: 360 }}
                                                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                                                    className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full"
                                                />
                                                注册中...
                                            </span>
                                        ) : (
                                            <span className="flex items-center gap-2">
                                                <UserPlus className="h-4 w-4" />
                                                注册
                                            </span>
                                        )}
                                    </Button>
                                </form>
                            </TabsContent>
                        </Tabs>

                        <div className="mt-6 text-center">
                            <Link
                                href="/"
                                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                            >
                                ← 返回首页
                            </Link>
                        </div>
                    </CardContent>
                </Card>
            </motion.div>
        </div>
    )
}

