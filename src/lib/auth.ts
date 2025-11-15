import { prisma } from "@/lib/prisma"
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
import { cookies } from "next/headers"

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key-change-in-production"
const JWT_EXPIRES_IN = "7d"

export interface UserPayload {
    id: string
    username: string
    role: string
    name?: string | null
}

// 生成 JWT token
export function generateToken(payload: UserPayload): string {
    return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN })
}

// 验证 JWT token
export function verifyToken(token: string): UserPayload | null {
    try {
        return jwt.verify(token, JWT_SECRET) as UserPayload
    } catch {
        return null
    }
}

// 获取当前用户（从 cookie 中）
export async function getCurrentUser(): Promise<UserPayload | null> {
    try {
        const cookieStore = await cookies()
        const token = cookieStore.get("auth_token")?.value

        if (!token) {
            return null
        }

        const payload = verifyToken(token)
        if (!payload) {
            return null
        }

        // 验证用户是否仍然存在且激活
        const user = await prisma.user.findUnique({
            where: { id: payload.id },
            select: { id: true, username: true, role: true, name: true, is_active: true },
        })

        if (!user || !user.is_active) {
            return null
        }

        return {
            id: user.id,
            username: user.username,
            role: user.role,
            name: user.name,
        }
    } catch (error) {
        console.error("获取当前用户失败:", error)
        return null
    }
}

// 检查是否为管理员
export async function isAdmin(): Promise<boolean> {
    const user = await getCurrentUser()
    return user?.role === "admin"
}

// 验证用户密码
export async function verifyPassword(username: string, password: string) {
    const user = await prisma.user.findUnique({
        where: { username },
    })

    if (!user || !user.is_active) {
        return null
    }

    const isValid = await bcrypt.compare(password, user.password)
    if (!isValid) {
        return null
    }

    // 更新最后登录时间
    await prisma.user.update({
        where: { id: user.id },
        data: { last_login: new Date() },
    })

    return {
        id: user.id,
        username: user.username,
        role: user.role,
        name: user.name,
    }
}

// 创建用户
export async function createUser(
    username: string,
    password: string,
    role: "user" | "admin" = "user",
    email?: string,
    name?: string
) {
    const hashedPassword = await bcrypt.hash(password, 10)

    return await prisma.user.create({
        data: {
            username,
            password: hashedPassword,
            role,
            email,
            name,
        },
    })
}

