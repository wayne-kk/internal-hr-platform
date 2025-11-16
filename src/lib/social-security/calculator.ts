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
        return null // 社保下限必须小于上限（向后兼容）
    }
    if (config.housing_fund_base_lower >= config.housing_fund_base_upper) {
        return null // 公积金下限必须小于上限（向后兼容）
    }
    // 验证各险种的上下限
    if (config.pension.base_lower >= config.pension.base_upper) return null
    if (config.medical.base_lower >= config.medical.base_upper) return null
    if (config.unemployment.base_lower >= config.unemployment.base_upper) return null
    if (config.injury.base_lower >= config.injury.base_upper) return null
    if (config.maternity.base_lower >= config.maternity.base_upper) return null
    if (config.housing_fund.base_lower >= config.housing_fund.base_upper) return null

    // 计算各险种的实际缴费基数（每个险种使用自己的上下限）
    const pensionActualBase = Math.max(
        config.pension.base_lower,
        Math.min(salary, config.pension.base_upper)
    )
    const medicalActualBase = Math.max(
        config.medical.base_lower,
        Math.min(salary, config.medical.base_upper)
    )
    const unemploymentActualBase = Math.max(
        config.unemployment.base_lower,
        Math.min(salary, config.unemployment.base_upper)
    )
    const injuryActualBase = Math.max(
        config.injury.base_lower,
        Math.min(salary, config.injury.base_upper)
    )
    const maternityActualBase = Math.max(
        config.maternity.base_lower,
        Math.min(salary, config.maternity.base_upper)
    )
    const housingFundActualBase = Math.max(
        config.housing_fund.base_lower,
        Math.min(salary, config.housing_fund.base_upper)
    )

    // 计算社保实际缴费基数（向后兼容，使用统一基数的平均值作为显示）
    const actualBase = pensionActualBase // 使用养老保险基数作为代表

    // 计算公积金（支持保护规则）
    const protectionEnabled = config.housing_fund_protection_enabled ?? false
    let housingFundPersonal: number
    let housingFundCompany: number

    if (protectionEnabled) {
        // 启用保护规则
        const baseLower = config.housing_fund.base_lower
        const personalRate = config.housing_fund.personal_rate
        const companyRate = config.housing_fund.company_rate

        if (salary <= baseLower) {
            // 规则1：工资 <= 下限，个人不缴，公司按下限缴
            housingFundPersonal = 0
            housingFundCompany = Math.round(baseLower * companyRate)
        } else {
            const normalPersonal = salary * personalRate
            const afterDeduction = salary - normalPersonal

            if (afterDeduction < baseLower) {
                // 规则2：扣完后低于下限，个人限额缴（工资 - 下限），公司按工资缴
                housingFundPersonal = Math.round((salary - baseLower))
                housingFundCompany = Math.round(salary * companyRate)
            } else {
                // 规则3：正常计算
                housingFundPersonal = Math.round(normalPersonal)
                housingFundCompany = Math.round(salary * companyRate)
            }
        }
    } else {
        // 不启用保护规则，正常计算
        housingFundPersonal = Math.round(housingFundActualBase * config.housing_fund.personal_rate)
        housingFundCompany = Math.round(housingFundActualBase * config.housing_fund.company_rate)
    }

    // 计算各险种（每个险种使用自己的缴费基数）
    const items = [
        {
            name: INSURANCE_NAMES.pension,
            key: "pension",
            personal: Math.round(pensionActualBase * config.pension.personal_rate * 100) / 100,
            company: Math.round(pensionActualBase * config.pension.company_rate * 100) / 100,
            personalRate: config.pension.personal_rate,
            companyRate: config.pension.company_rate,
        },
        {
            name: INSURANCE_NAMES.medical,
            key: "medical",
            personal: Math.round((medicalActualBase * config.medical.personal_rate + (config.medical.personal_fixed || 0)) * 100) / 100,
            company: Math.round((medicalActualBase * config.medical.company_rate + (config.medical.company_fixed || 0)) * 100) / 100,
            personalRate: config.medical.personal_rate,
            companyRate: config.medical.company_rate,
        },
        {
            name: INSURANCE_NAMES.unemployment,
            key: "unemployment",
            personal: Math.round(unemploymentActualBase * config.unemployment.personal_rate * 100) / 100,
            company: Math.round(unemploymentActualBase * config.unemployment.company_rate * 100) / 100,
            personalRate: config.unemployment.personal_rate,
            companyRate: config.unemployment.company_rate,
        },
        {
            name: INSURANCE_NAMES.injury,
            key: "injury",
            personal: Math.round(injuryActualBase * config.injury.personal_rate * 100) / 100,
            company: Math.round(injuryActualBase * config.injury.company_rate * 100) / 100,
            personalRate: config.injury.personal_rate,
            companyRate: config.injury.company_rate,
        },
        {
            name: INSURANCE_NAMES.maternity,
            key: "maternity",
            personal: Math.round(maternityActualBase * config.maternity.personal_rate * 100) / 100,
            company: Math.round(maternityActualBase * config.maternity.company_rate * 100) / 100,
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
        housingFundBaseLower: config.housing_fund.base_lower,
        housingFundBaseUpper: config.housing_fund.base_upper,
        items,
        personalTotal,
        companyTotal,
        total,
        afterTaxSalary,
    }
}

