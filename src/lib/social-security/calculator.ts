// 五险一金计算逻辑
import { socialSecurityConfig, getCityConfig } from "./config"
import { getCityConfigFromDB } from "./db"
import type { CalculationResult, CalculateRequest, CityConfig } from "./types"

const INSURANCE_NAMES = {
    pension: "养老保险",
    medical: "医疗保险",
    unemployment: "失业保险",
    injury: "工伤保险",
    maternity: "生育保险",
    housing_fund: "住房公积金",
} as const

/**
 * 计算五险一金
 * @param request 计算请求（工资和城市）
 * @returns 计算结果
 */
export async function calculateSocialSecurity(
    request: CalculateRequest
): Promise<CalculationResult | null> {
    const { salary, city, customConfig } = request

    // 验证输入
    if (!salary || salary <= 0) {
        return null
    }

    if (!city) {
        return null
    }

    // 获取城市配置（优先级：自定义配置 > 数据库配置 > 文件配置）
    let config: CityConfig | null = customConfig || null
    if (!config) {
        // 优先从数据库读取
        config = await getCityConfigFromDB(city)
        // 如果数据库没有，则从文件读取
        if (!config) {
            config = getCityConfig(city)
            if (!config) {
                return null
            }
        }
    }

    // 验证配置的有效性
    if (config.base_lower >= config.base_upper) {
        return null // 社保下限必须小于上限
    }
    if (config.housing_fund_base_lower >= config.housing_fund_base_upper) {
        return null // 公积金下限必须小于上限
    }

    // 计算社保实际缴费基数（限制在上下限范围内）
    const actualBase = Math.max(
        config.base_lower,
        Math.min(salary, config.base_upper)
    )

    // 计算公积金实际缴费基数（独立计算，限制在公积金上下限范围内）
    const housingFundActualBase = Math.max(
        config.housing_fund_base_lower,
        Math.min(salary, config.housing_fund_base_upper)
    )

    // 计算公积金（支持保护规则）
    const protectionEnabled = config.housing_fund_protection_enabled ?? false
    let housingFundPersonal: number
    let housingFundCompany: number

    if (protectionEnabled) {
        // 启用保护规则
        const baseLower = config.housing_fund_base_lower
        const personalRate = config.housing_fund.personal_rate
        const companyRate = config.housing_fund.company_rate

        if (salary <= baseLower) {
            // 规则1：工资 <= 下限，个人不缴，公司按下限缴
            housingFundPersonal = 0
            housingFundCompany = Math.round(baseLower * companyRate * 100) / 100
        } else {
            const normalPersonal = salary * personalRate
            const afterDeduction = salary - normalPersonal

            if (afterDeduction < baseLower) {
                // 规则2：扣完后低于下限，个人限额缴（工资 - 下限），公司按工资缴
                housingFundPersonal = Math.round((salary - baseLower) * 100) / 100
                housingFundCompany = Math.round(salary * companyRate * 100) / 100
            } else {
                // 规则3：正常计算
                housingFundPersonal = Math.round(normalPersonal * 100) / 100
                housingFundCompany = Math.round(salary * companyRate * 100) / 100
            }
        }
    } else {
        // 不启用保护规则，正常计算
        housingFundPersonal = Math.round(housingFundActualBase * config.housing_fund.personal_rate * 100) / 100
        housingFundCompany = Math.round(housingFundActualBase * config.housing_fund.company_rate * 100) / 100
    }

    // 计算各险种（五险使用社保基数，公积金使用公积金基数）
    const items = [
        {
            name: INSURANCE_NAMES.pension,
            key: "pension",
            personal: Math.round(actualBase * config.pension.personal_rate * 100) / 100,
            company: Math.round(actualBase * config.pension.company_rate * 100) / 100,
            personalRate: config.pension.personal_rate,
            companyRate: config.pension.company_rate,
        },
        {
            name: INSURANCE_NAMES.medical,
            key: "medical",
            personal: Math.round((actualBase * config.medical.personal_rate + (config.medical.personal_fixed || 0)) * 100) / 100,
            company: Math.round(actualBase * config.medical.company_rate * 100) / 100,
            personalRate: config.medical.personal_rate,
            companyRate: config.medical.company_rate,
        },
        {
            name: INSURANCE_NAMES.unemployment,
            key: "unemployment",
            personal: Math.round(actualBase * config.unemployment.personal_rate * 100) / 100,
            company: Math.round(actualBase * config.unemployment.company_rate * 100) / 100,
            personalRate: config.unemployment.personal_rate,
            companyRate: config.unemployment.company_rate,
        },
        {
            name: INSURANCE_NAMES.injury,
            key: "injury",
            personal: Math.round(actualBase * config.injury.personal_rate * 100) / 100,
            company: Math.round(actualBase * config.injury.company_rate * 100) / 100,
            personalRate: config.injury.personal_rate,
            companyRate: config.injury.company_rate,
        },
        {
            name: INSURANCE_NAMES.maternity,
            key: "maternity",
            personal: Math.round(actualBase * config.maternity.personal_rate * 100) / 100,
            company: Math.round(actualBase * config.maternity.company_rate * 100) / 100,
            personalRate: config.maternity.personal_rate,
            companyRate: config.maternity.company_rate,
        },
        {
            name: INSURANCE_NAMES.housing_fund,
            key: "housing_fund",
            personal: housingFundPersonal,
            company: housingFundCompany,
            personalRate: config.housing_fund.personal_rate,
            companyRate: config.housing_fund.company_rate,
        },
    ]

    // 计算合计
    const personalTotal = Math.round(
        items.reduce((sum, item) => sum + item.personal, 0) * 100
    ) / 100
    const companyTotal = Math.round(
        items.reduce((sum, item) => sum + item.company, 0) * 100
    ) / 100
    const total = Math.round((personalTotal + companyTotal) * 100) / 100

    // 计算税后工资（工资 - 个人缴纳）
    const afterTaxSalary = Math.round((salary - personalTotal) * 100) / 100

    return {
        city,
        baseSalary: salary,
        actualBase,
        baseLower: config.base_lower,
        baseUpper: config.base_upper,
        housingFundActualBase,
        housingFundBaseLower: config.housing_fund_base_lower,
        housingFundBaseUpper: config.housing_fund_base_upper,
        items,
        personalTotal,
        companyTotal,
        total,
        afterTaxSalary,
    }
}

