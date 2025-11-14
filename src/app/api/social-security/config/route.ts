import { NextResponse } from "next/server"
import { getSupportedCities, getCityConfig } from "@/lib/social-security/config"
import { getAllCitiesFromDB, getCityConfigFromDB, saveCityConfigToDB, getAllConfigsFromDB } from "@/lib/social-security/db"
import type { CityConfig } from "@/lib/social-security/types"

// 获取所有支持的城市列表或单个城市配置
export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url)
        const city = searchParams.get("city")
        const all = searchParams.get("all") === "true"

        // 如果请求所有配置（用于管理页面）
        if (all) {
            const configs = await getAllConfigsFromDB()
            return NextResponse.json({
                configs,
                count: configs.length,
            })
        }

        // 如果指定了城市，返回该城市的配置
        if (city) {
            // 优先从数据库读取
            let config = await getCityConfigFromDB(city)
            // 如果数据库没有，则从文件读取
            if (!config) {
                config = getCityConfig(city)
            }

            if (!config) {
                return NextResponse.json(
                    {
                        error: "不支持的城市",
                    },
                    { status: 404 }
                )
            }
            return NextResponse.json({
                city,
                config,
            })
        }

        // 否则返回所有支持的城市列表（优先从数据库，然后合并文件中的城市）
        const dbCities = await getAllCitiesFromDB()
        const fileCities = getSupportedCities()
        // 合并并去重
        const allCities = Array.from(new Set([...dbCities, ...fileCities])).sort()

        return NextResponse.json({
            cities: allCities,
            count: allCities.length,
        })
    } catch (error) {
        console.error("获取配置时出错:", error)
        return NextResponse.json(
            {
                error: "服务器内部错误",
            },
            { status: 500 }
        )
    }
}

// 保存或更新城市配置
export async function POST(request: Request) {
    try {
        const body = (await request.json()) as {
            city: string
            config: CityConfig
            userId?: string
        }

        const { city, config, userId } = body

        if (!city || !config) {
            return NextResponse.json(
                {
                    error: "城市和配置不能为空",
                },
                { status: 400 }
            )
        }

        const result = await saveCityConfigToDB(city, config, userId)

        if (!result.success) {
            return NextResponse.json(
                {
                    error: result.error || "保存失败",
                },
                { status: 400 }
            )
        }

        return NextResponse.json({
            success: true,
            message: "配置保存成功",
        })
    } catch (error) {
        console.error("保存配置时出错:", error)
        return NextResponse.json(
            {
                error: "服务器内部错误",
            },
            { status: 500 }
        )
    }
}
