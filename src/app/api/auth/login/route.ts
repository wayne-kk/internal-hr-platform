import { NextResponse } from "next/server"
import { verifyPassword, generateToken } from "@/lib/auth"
import { cookies } from "next/headers"

export async function POST(request: Request) {
    try {
        const body = await request.json()
        const { username, password } = body

        if (!username || !password) {
            return NextResponse.json(
                { error: "用户名和密码不能为空" },
                { status: 400 }
            )
        }

        const user = await verifyPassword(username, password)
        if (!user) {
            return NextResponse.json(
                { error: "用户名或密码错误" },
                { status: 401 }
            )
        }

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
        console.error("登录失败:", error)
        return NextResponse.json(
            { error: "登录失败，请稍后重试" },
            { status: 500 }
        )
    }
}

