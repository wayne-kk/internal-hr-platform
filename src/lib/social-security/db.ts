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
            select: {
                id: true,
                city: true,
                base_lower: true,
                base_upper: true,
                housing_fund_base_lower: true,
                housing_fund_base_upper: true,
                pension_personal_rate: true,
                pension_company_rate: true,
                pension_base_lower: true,
                pension_base_upper: true,
                medical_personal_rate: true,
                medical_company_rate: true,
                medical_personal_fixed: true,
                medical_company_fixed: true,
                medical_base_lower: true,
                medical_base_upper: true,
                unemployment_personal_rate: true,
                unemployment_company_rate: true,
                unemployment_base_lower: true,
                unemployment_base_upper: true,
                injury_personal_rate: true,
                injury_company_rate: true,
                injury_base_lower: true,
                injury_base_upper: true,
                maternity_personal_rate: true,
                maternity_company_rate: true,
                maternity_base_lower: true,
                maternity_base_upper: true,
                housing_fund_personal_rate: true,
                housing_fund_company_rate: true,
                housing_fund_base_lower_new: true,
                housing_fund_base_upper_new: true,
                housing_fund_protection_enabled: true,
                version: true,
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
                base_lower: Number(data.pension_base_lower ?? data.base_lower),
                base_upper: Number(data.pension_base_upper ?? data.base_upper),
            },
            medical: {
                personal_rate: Number(data.medical_personal_rate),
                company_rate: Number(data.medical_company_rate),
                personal_fixed: Number(data.medical_personal_fixed || 0),
                company_fixed: Number(data.medical_company_fixed || 0),
                base_lower: Number(data.medical_base_lower ?? data.base_lower),
                base_upper: Number(data.medical_base_upper ?? data.base_upper),
            },
            unemployment: {
                personal_rate: Number(data.unemployment_personal_rate),
                company_rate: Number(data.unemployment_company_rate),
                base_lower: Number(data.unemployment_base_lower ?? data.base_lower),
                base_upper: Number(data.unemployment_base_upper ?? data.base_upper),
            },
            injury: {
                personal_rate: Number(data.injury_personal_rate),
                company_rate: Number(data.injury_company_rate),
                base_lower: Number(data.injury_base_lower ?? data.base_lower),
                base_upper: Number(data.injury_base_upper ?? data.base_upper),
            },
            maternity: {
                personal_rate: Number(data.maternity_personal_rate),
                company_rate: Number(data.maternity_company_rate),
                base_lower: Number(data.maternity_base_lower ?? data.base_lower),
                base_upper: Number(data.maternity_base_upper ?? data.base_upper),
            },
            housing_fund: {
                personal_rate: Number(data.housing_fund_personal_rate),
                company_rate: Number(data.housing_fund_company_rate),
                base_lower: Number(data.housing_fund_base_lower_new ?? data.housing_fund_base_lower),
                base_upper: Number(data.housing_fund_base_upper_new ?? data.housing_fund_base_upper),
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
        // 验证各险种的上下限
        if (config.pension.base_lower >= config.pension.base_upper) {
            return { success: false, error: "养老保险缴费基数下限必须小于上限" }
        }
        if (config.medical.base_lower >= config.medical.base_upper) {
            return { success: false, error: "医疗保险缴费基数下限必须小于上限" }
        }
        if (config.unemployment.base_lower >= config.unemployment.base_upper) {
            return { success: false, error: "失业保险缴费基数下限必须小于上限" }
        }
        if (config.injury.base_lower >= config.injury.base_upper) {
            return { success: false, error: "工伤保险缴费基数下限必须小于上限" }
        }
        if (config.maternity.base_lower >= config.maternity.base_upper) {
            return { success: false, error: "生育保险缴费基数下限必须小于上限" }
        }
        if (config.housing_fund.base_lower >= config.housing_fund.base_upper) {
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
            pension_base_lower: config.pension.base_lower,
            pension_base_upper: config.pension.base_upper,
            medical_personal_rate: config.medical.personal_rate,
            medical_company_rate: config.medical.company_rate,
            medical_personal_fixed: config.medical.personal_fixed || 0,
            medical_company_fixed: config.medical.company_fixed || 0,
            medical_base_lower: config.medical.base_lower,
            medical_base_upper: config.medical.base_upper,
            unemployment_personal_rate: config.unemployment.personal_rate,
            unemployment_company_rate: config.unemployment.company_rate,
            unemployment_base_lower: config.unemployment.base_lower,
            unemployment_base_upper: config.unemployment.base_upper,
            injury_personal_rate: config.injury.personal_rate,
            injury_company_rate: config.injury.company_rate,
            injury_base_lower: config.injury.base_lower,
            injury_base_upper: config.injury.base_upper,
            maternity_personal_rate: config.maternity.personal_rate,
            maternity_company_rate: config.maternity.company_rate,
            maternity_base_lower: config.maternity.base_lower,
            maternity_base_upper: config.maternity.base_upper,
            housing_fund_personal_rate: config.housing_fund.personal_rate,
            housing_fund_company_rate: config.housing_fund.company_rate,
            housing_fund_base_lower_new: config.housing_fund.base_lower,
            housing_fund_base_upper_new: config.housing_fund.base_upper,
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

        return data.map((row: any) => ({
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
                    base_lower: Number(row.pension_base_lower ?? row.base_lower),
                    base_upper: Number(row.pension_base_upper ?? row.base_upper),
                },
                medical: {
                    personal_rate: Number(row.medical_personal_rate),
                    company_rate: Number(row.medical_company_rate),
                    personal_fixed: Number(row.medical_personal_fixed || 0),
                    company_fixed: Number(row.medical_company_fixed || 0),
                    base_lower: Number(row.medical_base_lower ?? row.base_lower),
                    base_upper: Number(row.medical_base_upper ?? row.base_upper),
                },
                unemployment: {
                    personal_rate: Number(row.unemployment_personal_rate),
                    company_rate: Number(row.unemployment_company_rate),
                    base_lower: Number(row.unemployment_base_lower ?? row.base_lower),
                    base_upper: Number(row.unemployment_base_upper ?? row.base_upper),
                },
                injury: {
                    personal_rate: Number(row.injury_personal_rate),
                    company_rate: Number(row.injury_company_rate),
                    base_lower: Number(row.injury_base_lower ?? row.base_lower),
                    base_upper: Number(row.injury_base_upper ?? row.base_upper),
                },
                maternity: {
                    personal_rate: Number(row.maternity_personal_rate),
                    company_rate: Number(row.maternity_company_rate),
                    base_lower: Number(row.maternity_base_lower ?? row.base_lower),
                    base_upper: Number(row.maternity_base_upper ?? row.base_upper),
                },
                housing_fund: {
                    personal_rate: Number(row.housing_fund_personal_rate),
                    company_rate: Number(row.housing_fund_company_rate),
                    base_lower: Number(row.housing_fund_base_lower_new ?? row.housing_fund_base_lower),
                    base_upper: Number(row.housing_fund_base_upper_new ?? row.housing_fund_base_upper),
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

