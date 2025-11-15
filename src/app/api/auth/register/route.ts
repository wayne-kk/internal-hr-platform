import { NextResponse } from "next/server"
import { createUser, generateToken } from "@/lib/auth"
import { cookies } from "next/headers"
import { prisma } from "@/lib/prisma"

export async function POST(request: Request) {
    try {
        const body = await request.json()
        const { username, password, email, name } = body

        if (!username || !password) {
            return NextResponse.json(
                { error: "用户名和密码不能为空" },
                { status: 400 }
            )
        }

        if (password.length < 6) {
            return NextResponse.json(
                { error: "密码长度至少为6位" },
                { status: 400 }
            )
        }

        // 检查用户名是否已存在
        const existingUser = await prisma.user.findUnique({
            where: { username },
        })

        if (existingUser) {
            return NextResponse.json(
                { error: "用户名已存在" },
                { status: 400 }
            )
        }

        // 检查邮箱是否已存在（如果提供）
        if (email) {
            const existingEmail = await prisma.user.findUnique({
                where: { email },
            })

            if (existingEmail) {
                return NextResponse.json(
                    { error: "邮箱已被使用" },
                    { status: 400 }
                )
            }
        }

        // 创建用户（默认角色为 user）
        const user = await createUser(username, password, "user", email, name)

        const token = generateToken({
            id: user.id,
            username: user.username,
            role: user.role,
            name: user.name,
        })

        const cookieStore = await cookies()
        cookieStore.set("auth_token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            maxAge: 60 * 60 * 24 * 7, // 7 days
            path: "/",
        })

        return NextResponse.json({
            success: true,
            user: {
                id: user.id,
                username: user.username,
                role: user.role,
                name: user.name,
            },
        })
    } catch (error) {
        console.error("注册失败:", error)
        return NextResponse.json(
            { error: "注册失败，请稍后重试" },
            { status: 500 }
        )
    }
}

