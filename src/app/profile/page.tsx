"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Shield, User, Mail, Calendar, LogOut } from "lucide-react"
import { toast } from "sonner"
import { SectionHeader } from "@/components/layout/section-header"

interface UserInfo {
    id: string
    username: string
    role: string
    name?: string | null
    email?: string | null
}

export default function ProfilePage() {
    const router = useRouter()
    const [user, setUser] = useState<UserInfo | null>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        fetchUser()
    }, [])

    const fetchUser = async () => {
        try {
            const response = await fetch("/api/auth/me")
            if (response.ok) {
                const data = await response.json()
                setUser(data.user)
            } else {
                router.push("/login")
            }
        } catch (error) {
            console.error("获取用户信息失败:", error)
            router.push("/login")
        } finally {
            setLoading(false)
        }
    }

    const handleLogout = async () => {
        try {
            const response = await fetch("/api/auth/logout", {
                method: "POST",
            })

            if (response.ok) {
                toast.success("已登出")
                router.push("/login")
                router.refresh()
            }
        } catch (error) {
            console.error("登出失败:", error)
            toast.error("登出失败")
        }
    }

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    className="h-8 w-8 border-2 border-blue-500/30 border-t-blue-500 rounded-full"
                />
            </div>
        )
    }

    if (!user) {
        return null
    }

    const initials = user.name
        ? user.name.substring(0, 2).toUpperCase()
        : user.username.substring(0, 2).toUpperCase()

    return (
        <div className="relative min-h-screen overflow-hidden">
            {/* 背景 */}
            <div className="fixed inset-0 -z-10">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-indigo-50/50 to-purple-50 dark:from-gray-950 dark:via-indigo-950/30 dark:to-purple-950" />
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(99,102,241,0.15),transparent_50%)]" />
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(139,92,246,0.15),transparent_50%)]" />
            </div>

            <div className="relative mx-auto flex w-full max-w-4xl flex-col gap-8 sm:gap-12 px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-16">
                <SectionHeader
                    title="个人资料"
                    description="查看和管理您的账户信息"
                />

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="w-full"
                >
                    <Card className="relative overflow-hidden border border-blue-200/50 dark:border-blue-800/50 bg-gradient-to-br from-white/90 via-white/80 to-blue-50/30 backdrop-blur-xl shadow-2xl">
                        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-indigo-500/5 to-purple-500/5" />
                        <div className="absolute top-0 right-0 h-40 w-40 rounded-full bg-blue-400/20 blur-3xl" />

                        <CardHeader className="relative pb-6 pt-6 sm:pt-8">
                            <div className="flex items-center gap-6">
                                <Avatar className="h-20 w-20 border-4 border-white dark:border-gray-800 shadow-lg">
                                    <AvatarFallback className="bg-gradient-to-br from-blue-500 to-indigo-600 text-white text-2xl">
                                        {initials}
                                    </AvatarFallback>
                                </Avatar>
                                <div className="flex-1">
                                    <CardTitle className="text-2xl font-bold mb-2">
                                        {user.name || user.username}
                                    </CardTitle>
                                    <CardDescription className="text-base">
                                        @{user.username}
                                    </CardDescription>
                                </div>
                                {user.role === "admin" && (
                                    <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-purple-100 dark:bg-purple-900/30 border border-purple-200 dark:border-purple-800">
                                        <Shield className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                                        <span className="font-semibold text-purple-600 dark:text-purple-400">
                                            超级管理员
                                        </span>
                                    </div>
                                )}
                            </div>
                        </CardHeader>

                        <CardContent className="relative pb-6 sm:pb-8 space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2 rounded-lg border border-gray-200 dark:border-gray-800 bg-white/50 dark:bg-gray-900/50 p-4">
                                    <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                                        <User className="h-4 w-4" />
                                        用户名
                                    </div>
                                    <div className="text-base font-semibold">{user.username}</div>
                                </div>

                                <div className="space-y-2 rounded-lg border border-gray-200 dark:border-gray-800 bg-white/50 dark:bg-gray-900/50 p-4">
                                    <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                                        <Shield className="h-4 w-4" />
                                        角色
                                    </div>
                                    <div className="text-base font-semibold">
                                        {user.role === "admin" ? "超级管理员" : "普通用户"}
                                    </div>
                                </div>

                                {user.name && (
                                    <div className="space-y-2 rounded-lg border border-gray-200 dark:border-gray-800 bg-white/50 dark:bg-gray-900/50 p-4">
                                        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                                            <User className="h-4 w-4" />
                                            姓名
                                        </div>
                                        <div className="text-base font-semibold">{user.name}</div>
                                    </div>
                                )}

                                {user.email && (
                                    <div className="space-y-2 rounded-lg border border-gray-200 dark:border-gray-800 bg-white/50 dark:bg-gray-900/50 p-4">
                                        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                                            <Mail className="h-4 w-4" />
                                            邮箱
                                        </div>
                                        <div className="text-base font-semibold">{user.email}</div>
                                    </div>
                                )}
                            </div>

                            <div className="pt-4 border-t border-gray-200 dark:border-gray-800">
                                <div className="flex flex-col sm:flex-row gap-3">
                                    <Button
                                        variant="outline"
                                        onClick={() => router.push("/")}
                                        className="flex-1"
                                    >
                                        返回首页
                                    </Button>
                                    {user.role === "admin" && (
                                        <Button
                                            variant="outline"
                                            onClick={() => router.push("/config")}
                                            className="flex-1"
                                        >
                                            <Shield className="h-4 w-4 mr-2" />
                                            配置管理
                                        </Button>
                                    )}
                                    <Button
                                        variant="destructive"
                                        onClick={handleLogout}
                                        className="flex-1"
                                    >
                                        <LogOut className="h-4 w-4 mr-2" />
                                        登出
                                    </Button>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>
            </div>
        </div>
    )
}

