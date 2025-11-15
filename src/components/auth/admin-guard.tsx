"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Shield, Lock } from "lucide-react"
import { motion } from "framer-motion"

interface AdminGuardProps {
    children: React.ReactNode
}

export function AdminGuard({ children }: AdminGuardProps) {
    const router = useRouter()
    const [loading, setLoading] = useState(true)
    const [isAdmin, setIsAdmin] = useState(false)

    useEffect(() => {
        checkAdmin()
    }, [])

    const checkAdmin = async () => {
        try {
            const response = await fetch("/api/auth/me")
            if (response.ok) {
                const data = await response.json()
                if (data.user?.role === "admin") {
                    setIsAdmin(true)
                }
            }
        } catch (error) {
            console.error("检查权限失败:", error)
        } finally {
            setLoading(false)
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

    if (!isAdmin) {
        return (
            <div className="flex items-center justify-center min-h-[400px] p-4">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3 }}
                    className="w-full max-w-md"
                >
                    <Card className="border-red-200 dark:border-red-800">
                        <CardHeader className="text-center">
                            <div className="mx-auto mb-4 h-16 w-16 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
                                <Lock className="h-8 w-8 text-red-600 dark:text-red-400" />
                            </div>
                            <CardTitle className="text-xl">访问被拒绝</CardTitle>
                            <CardDescription>
                                此页面仅限超级管理员访问
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="rounded-lg border border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-950/20 p-4">
                                <div className="flex items-start gap-3">
                                    <Shield className="h-5 w-5 text-red-600 dark:text-red-400 mt-0.5" />
                                    <div className="space-y-1">
                                        <p className="text-sm font-medium text-red-900 dark:text-red-100">
                                            权限不足
                                        </p>
                                        <p className="text-xs text-red-700 dark:text-red-300">
                                            您需要超级管理员权限才能访问配置管理页面。请联系系统管理员获取权限。
                                        </p>
                                    </div>
                                </div>
                            </div>
                            <div className="flex gap-2">
                                <Button variant="outline" className="flex-1" onClick={() => router.push("/")}>
                                    返回首页
                                </Button>
                                <Button className="flex-1" onClick={() => router.push("/login")}>
                                    重新登录
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>
            </div>
        )
    }

    return <>{children}</>
}

