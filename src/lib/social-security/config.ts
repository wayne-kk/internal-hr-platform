// 五险一金配置数据
import type { SocialSecurityConfig } from "./types"

// 2024年主要城市五险一金配置（示例数据，实际使用时需要定期更新）
export const socialSecurityConfig: SocialSecurityConfig = {
    北京: {
        base_lower: 5360,
        base_upper: 31884,
        housing_fund_base_lower: 2320,
        housing_fund_base_upper: 31884,
        pension: { personal_rate: 0.08, company_rate: 0.16 },
        medical: { personal_rate: 0.02, company_rate: 0.10, personal_fixed: 0 },
        unemployment: { personal_rate: 0.002, company_rate: 0.008 },
        injury: { personal_rate: 0, company_rate: 0.004 },
        maternity: { personal_rate: 0, company_rate: 0.008 },
        housing_fund: { personal_rate: 0.12, company_rate: 0.12 },
    },
    上海: {
        base_lower: 7310,
        base_upper: 36549,
        housing_fund_base_lower: 2590,
        housing_fund_base_upper: 36549,
        pension: { personal_rate: 0.08, company_rate: 0.16 },
        medical: { personal_rate: 0.02, company_rate: 0.10, personal_fixed: 0 },
        unemployment: { personal_rate: 0.005, company_rate: 0.005 },
        injury: { personal_rate: 0, company_rate: 0.0016 },
        maternity: { personal_rate: 0, company_rate: 0.01 },
        housing_fund: { personal_rate: 0.07, company_rate: 0.07 },
    },
    广州: {
        base_lower: 2300,
        base_upper: 38082,
        housing_fund_base_lower: 2300,
        housing_fund_base_upper: 38082,
        pension: { personal_rate: 0.08, company_rate: 0.14 },
        medical: { personal_rate: 0.02, company_rate: 0.065 },
        unemployment: { personal_rate: 0.002, company_rate: 0.0048 },
        injury: { personal_rate: 0, company_rate: 0.002 },
        maternity: { personal_rate: 0, company_rate: 0.0085 },
        housing_fund: { personal_rate: 0.12, company_rate: 0.12 },
    },
    深圳: {
        base_lower: 2360,
        base_upper: 31938,
        housing_fund_base_lower: 2360,
        housing_fund_base_upper: 31938,
        pension: { personal_rate: 0.08, company_rate: 0.13 },
        medical: { personal_rate: 0.02, company_rate: 0.062 },
        unemployment: { personal_rate: 0.003, company_rate: 0.007 },
        injury: { personal_rate: 0, company_rate: 0.0014 },
        maternity: { personal_rate: 0, company_rate: 0.0045 },
        housing_fund: { personal_rate: 0.13, company_rate: 0.13 },
    },
    杭州: {
        base_lower: 3957,
        base_upper: 19783,
        housing_fund_base_lower: 1860,
        housing_fund_base_upper: 19783,
        pension: { personal_rate: 0.08, company_rate: 0.14 },
        medical: { personal_rate: 0.02, company_rate: 0.105 },
        unemployment: { personal_rate: 0.005, company_rate: 0.005 },
        injury: { personal_rate: 0, company_rate: 0.002 },
        maternity: { personal_rate: 0, company_rate: 0.008 },
        housing_fund: { personal_rate: 0.12, company_rate: 0.12 },
    },
    成都: {
        base_lower: 2966,
        base_upper: 20307,
        housing_fund_base_lower: 1650,
        housing_fund_base_upper: 20307,
        pension: { personal_rate: 0.08, company_rate: 0.16 },
        medical: { personal_rate: 0.02, company_rate: 0.075 },
        unemployment: { personal_rate: 0.004, company_rate: 0.006 },
        injury: { personal_rate: 0, company_rate: 0.002 },
        maternity: { personal_rate: 0, company_rate: 0.006 },
        housing_fund: { personal_rate: 0.12, company_rate: 0.12 },
    },
    南京: {
        base_lower: 4494,
        base_upper: 24042,
        housing_fund_base_lower: 1620,
        housing_fund_base_upper: 24042,
        pension: { personal_rate: 0.08, company_rate: 0.16 },
        medical: { personal_rate: 0.02, company_rate: 0.09 },
        unemployment: { personal_rate: 0.005, company_rate: 0.005 },
        injury: { personal_rate: 0, company_rate: 0.002 },
        maternity: { personal_rate: 0, company_rate: 0.008 },
        housing_fund: { personal_rate: 0.12, company_rate: 0.12 },
    },
    武汉: {
        base_lower: 3739.8,
        base_upper: 18699,
        housing_fund_base_lower: 1750,
        housing_fund_base_upper: 18699,
        pension: { personal_rate: 0.08, company_rate: 0.16 },
        medical: { personal_rate: 0.02, company_rate: 0.08 },
        unemployment: { personal_rate: 0.003, company_rate: 0.007 },
        injury: { personal_rate: 0, company_rate: 0.0024 },
        maternity: { personal_rate: 0, company_rate: 0.005 },
        housing_fund: { personal_rate: 0.12, company_rate: 0.12 },
    },
    西安: {
        base_lower: 3632,
        base_upper: 18159,
        housing_fund_base_lower: 1680,
        housing_fund_base_upper: 18159,
        pension: { personal_rate: 0.08, company_rate: 0.16 },
        medical: { personal_rate: 0.02, company_rate: 0.07 },
        unemployment: { personal_rate: 0.003, company_rate: 0.007 },
        injury: { personal_rate: 0, company_rate: 0.002 },
        maternity: { personal_rate: 0, company_rate: 0.005 },
        housing_fund: { personal_rate: 0.12, company_rate: 0.12 },
    },
    苏州: {
        base_lower: 4250,
        base_upper: 24042,
        housing_fund_base_lower: 1620,
        housing_fund_base_upper: 24042,
        pension: { personal_rate: 0.08, company_rate: 0.16 },
        medical: { personal_rate: 0.02, company_rate: 0.09 },
        unemployment: { personal_rate: 0.005, company_rate: 0.005 },
        injury: { personal_rate: 0, company_rate: 0.002 },
        maternity: { personal_rate: 0, company_rate: 0.008 },
        housing_fund: { personal_rate: 0.12, company_rate: 0.12 },
    },
}

// 获取所有支持的城市列表
export function getSupportedCities(): string[] {
    return Object.keys(socialSecurityConfig).sort()
}

// 获取指定城市的配置
export function getCityConfig(city: string): SocialSecurityConfig[string] | null {
    return socialSecurityConfig[city] || null
}

