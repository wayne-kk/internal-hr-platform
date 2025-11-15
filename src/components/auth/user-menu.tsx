"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { LogOut, User, Shield, LogIn } from "lucide-react"
import { toast } from "sonner"

interface UserInfo {
    id: string
    username: string
    role: string
    name?: string | null
}

export function UserMenu() {
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
            }
        } catch (error) {
            console.error("获取用户信息失败:", error)
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
                setUser(null)
                router.push("/")
                router.refresh()
            }
        } catch (error) {
            console.error("登出失败:", error)
            toast.error("登出失败")
        }
    }

    if (loading) {
        return (
            <Button variant="ghost" size="sm" disabled>
                加载中...
            </Button>
        )
    }

    if (!user) {
        return (
            <Button variant="ghost" size="sm" asChild>
                <a href="/login">
                    <LogIn className="h-4 w-4 mr-2" />
                    登录
                </a>
            </Button>
        )
    }

    const initials = user.name
        ? user.name.substring(0, 2).toUpperCase()
        : user.username.substring(0, 2).toUpperCase()

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="flex items-center gap-2">
                    <Avatar className="h-8 w-8">
                        <AvatarFallback className="bg-gradient-to-br from-blue-500 to-indigo-600 text-white text-xs">
                            {initials}
                        </AvatarFallback>
                    </Avatar>
                    <span className="hidden sm:inline">{user.name || user.username}</span>
                    {user.role === "admin" && (
                        <Shield className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                    )}
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>
                    <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium">{user.name || user.username}</p>
                        <p className="text-xs text-muted-foreground">{user.username}</p>
                    </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => router.push("/profile")}>
                    <User className="mr-2 h-4 w-4" />
                    个人资料
                </DropdownMenuItem>
                {user.role === "admin" && (
                    <>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => router.push("/config")}>
                            <Shield className="mr-2 h-4 w-4" />
                            配置管理
                        </DropdownMenuItem>
                    </>
                )}
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout}>
                    <LogOut className="mr-2 h-4 w-4" />
                    登出
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}

