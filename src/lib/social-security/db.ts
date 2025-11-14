// 数据库操作相关函数
import { prisma } from "@/lib/prisma"
import type { CityConfig } from "./types"

// 从数据库读取城市配置
export async function getCityConfigFromDB(city: string): Promise<CityConfig | null> {
    try {
        const data = await prisma.socialSecurityConfig.findFirst({
            where: {
                city,
                is_active: true,
            },
        })

        if (!data) {
            return null
        }

        return {
            base_lower: Number(data.base_lower),
            base_upper: Number(data.base_upper),
            housing_fund_base_lower: Number(data.housing_fund_base_lower),
            housing_fund_base_upper: Number(data.housing_fund_base_upper),
            pension: {
                personal_rate: Number(data.pension_personal_rate),
                company_rate: Number(data.pension_company_rate),
            },
            medical: {
                personal_rate: Number(data.medical_personal_rate),
                company_rate: Number(data.medical_company_rate),
                personal_fixed: Number(data.medical_personal_fixed || 0),
            },
            unemployment: {
                personal_rate: Number(data.unemployment_personal_rate),
                company_rate: Number(data.unemployment_company_rate),
            },
            injury: {
                personal_rate: Number(data.injury_personal_rate),
                company_rate: Number(data.injury_company_rate),
            },
            maternity: {
                personal_rate: Number(data.maternity_personal_rate),
                company_rate: Number(data.maternity_company_rate),
            },
            housing_fund: {
                personal_rate: Number(data.housing_fund_personal_rate),
                company_rate: Number(data.housing_fund_company_rate),
            },
            housing_fund_protection_enabled: data.housing_fund_protection_enabled ?? false,
        }
    } catch (error) {
        console.error("从数据库读取配置失败:", error)
        return null
    }
}

// 获取所有城市列表
export async function getAllCitiesFromDB(): Promise<string[]> {
    try {
        const data = await prisma.socialSecurityConfig.findMany({
            where: {
                is_active: true,
            },
            select: {
                city: true,
            },
            orderBy: {
                city: "asc",
            },
        })

        return data.map((row: { city: string }) => row.city)
    } catch (error) {
        console.error("从数据库读取城市列表失败:", error)
        return []
    }
}

// 保存或更新城市配置
export async function saveCityConfigToDB(
    city: string,
    config: CityConfig,
    userId?: string
): Promise<{ success: boolean; error?: string }> {
    try {
        // 验证配置
        if (config.base_lower >= config.base_upper) {
            return { success: false, error: "社保缴费基数下限必须小于上限" }
        }
        if (config.housing_fund_base_lower >= config.housing_fund_base_upper) {
            return { success: false, error: "公积金缴费基数下限必须小于上限" }
        }

        // 使用 upsert 来创建或更新
        const existing = await prisma.socialSecurityConfig.findUnique({
            where: { city },
            select: { version: true },
        })

        const baseConfigData = {
            base_lower: config.base_lower,
            base_upper: config.base_upper,
            housing_fund_base_lower: config.housing_fund_base_lower,
            housing_fund_base_upper: config.housing_fund_base_upper,
            pension_personal_rate: config.pension.personal_rate,
            pension_company_rate: config.pension.company_rate,
            medical_personal_rate: config.medical.personal_rate,
            medical_company_rate: config.medical.company_rate,
            medical_personal_fixed: config.medical.personal_fixed || 0,
            medical_company_fixed: 0, // 公司部分不加固定金额
            unemployment_personal_rate: config.unemployment.personal_rate,
            unemployment_company_rate: config.unemployment.company_rate,
            injury_personal_rate: config.injury.personal_rate,
            injury_company_rate: config.injury.company_rate,
            maternity_personal_rate: config.maternity.personal_rate,
            maternity_company_rate: config.maternity.company_rate,
            housing_fund_personal_rate: config.housing_fund.personal_rate,
            housing_fund_company_rate: config.housing_fund.company_rate,
            housing_fund_protection_enabled: config.housing_fund_protection_enabled ?? false,
        }

        await prisma.socialSecurityConfig.upsert({
            where: { city },
            update: {
                ...baseConfigData,
                updated_by: userId || "system",
                version: (existing?.version || 0) + 1,
            },
            create: {
                city,
                ...baseConfigData,
                created_by: userId || "system",
            },
        })

        return { success: true }
    } catch (error) {
        console.error("保存配置到数据库失败:", error)
        return { success: false, error: "保存失败" }
    }
}

// 获取所有配置（用于管理页面）
export async function getAllConfigsFromDB(): Promise<
    Array<{
        id: string
        city: string
        config: CityConfig
        created_at: string
        updated_at: string
        version: number
    }>
> {
    try {
        const data = await prisma.socialSecurityConfig.findMany({
            where: {
                is_active: true,
            },
            orderBy: {
                city: "asc",
            },
        })

        return data.map((row: {
            id: string
            city: string
            base_lower: number
            base_upper: number
            housing_fund_base_lower: number
            housing_fund_base_upper: number
            pension_personal_rate: number
            pension_company_rate: number
            medical_personal_rate: number
            medical_company_rate: number
            medical_personal_fixed: number | null
            medical_company_fixed: number | null
            unemployment_personal_rate: number
            unemployment_company_rate: number
            injury_personal_rate: number
            injury_company_rate: number
            maternity_personal_rate: number
            maternity_company_rate: number
            housing_fund_personal_rate: number
            housing_fund_company_rate: number
            housing_fund_protection_enabled: boolean | null
            created_at: Date
            updated_at: Date
            version: number
        }) => ({
            id: row.id,
            city: row.city,
            config: {
                base_lower: Number(row.base_lower),
                base_upper: Number(row.base_upper),
                housing_fund_base_lower: Number(row.housing_fund_base_lower),
                housing_fund_base_upper: Number(row.housing_fund_base_upper),
                pension: {
                    personal_rate: Number(row.pension_personal_rate),
                    company_rate: Number(row.pension_company_rate),
                },
                medical: {
                    personal_rate: Number(row.medical_personal_rate),
                    company_rate: Number(row.medical_company_rate),
                    personal_fixed: Number(row.medical_personal_fixed || 0),
                },
                unemployment: {
                    personal_rate: Number(row.unemployment_personal_rate),
                    company_rate: Number(row.unemployment_company_rate),
                },
                injury: {
                    personal_rate: Number(row.injury_personal_rate),
                    company_rate: Number(row.injury_company_rate),
                },
                maternity: {
                    personal_rate: Number(row.maternity_personal_rate),
                    company_rate: Number(row.maternity_company_rate),
                },
                housing_fund: {
                    personal_rate: Number(row.housing_fund_personal_rate),
                    company_rate: Number(row.housing_fund_company_rate),
                },
                housing_fund_protection_enabled: row.housing_fund_protection_enabled ?? false,
            },
            created_at: row.created_at.toISOString(),
            updated_at: row.updated_at.toISOString(),
            version: row.version,
        }))
    } catch (error) {
        console.error("从数据库读取所有配置失败:", error)
        return []
    }
}

