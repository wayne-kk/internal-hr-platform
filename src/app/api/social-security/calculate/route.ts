import { NextResponse } from "next/server"
import { calculateSocialSecurity } from "@/lib/social-security/calculator"
import type { CalculateRequest } from "@/lib/social-security/types"

export async function POST(request: Request) {
    try {
        const body = (await request.json()) as CalculateRequest

        const { salary, city, customConfig } = body

        // 验证输入
        if (!salary || typeof salary !== "number" || salary <= 0) {
            return NextResponse.json(
                {
                    error: "工资必须为正数",
                },
                { status: 400 }
            )
        }

        if (!city || typeof city !== "string") {
            return NextResponse.json(
                {
                    error: "城市不能为空",
                },
                { status: 400 }
            )
        }

        // 验证自定义配置（如果提供）
        if (customConfig) {
            if (customConfig.base_lower >= customConfig.base_upper) {
                return NextResponse.json(
                    {
                        error: "社保缴费基数下限必须小于上限",
                    },
                    { status: 400 }
                )
            }
            if (customConfig.housing_fund_base_lower >= customConfig.housing_fund_base_upper) {
                return NextResponse.json(
                    {
                        error: "公积金缴费基数下限必须小于上限",
                    },
                    { status: 400 }
                )
            }
            // 验证比例范围（0-1之间）
            const rates = [
                customConfig.pension,
                customConfig.medical,
                customConfig.unemployment,
                customConfig.injury,
                customConfig.maternity,
                customConfig.housing_fund,
            ]
            for (const rate of rates) {
                if (
                    rate.personal_rate < 0 ||
                    rate.personal_rate > 1 ||
                    rate.company_rate < 0 ||
                    rate.company_rate > 1
                ) {
                    return NextResponse.json(
                        {
                            error: "缴费比例必须在0-100%之间",
                        },
                        { status: 400 }
                    )
                }
            }
        }

        // 计算五险一金
        const result = await calculateSocialSecurity({ salary, city, customConfig })

        if (!result) {
            return NextResponse.json(
                {
                    error: "不支持的城市或计算失败",
                },
                { status: 400 }
            )
        }

        return NextResponse.json(result)
    } catch (error) {
        console.error("计算五险一金时出错:", error)
        return NextResponse.json(
            {
                error: "服务器内部错误",
            },
            { status: 500 }
        )
    }
}

