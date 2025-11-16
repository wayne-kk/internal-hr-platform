// 五险一金配置数据
import type { SocialSecurityConfig } from "./types"

// 2024年主要城市五险一金配置（示例数据，实际使用时需要定期更新）
export const socialSecurityConfig: SocialSecurityConfig = {
    北京: {
        base_lower: 5360, // 向后兼容字段
        base_upper: 31884, // 向后兼容字段
        housing_fund_base_lower: 2320, // 向后兼容字段
        housing_fund_base_upper: 31884, // 向后兼容字段
        pension: { personal_rate: 0.08, company_rate: 0.16, base_lower: 5360, base_upper: 31884 },
        medical: { personal_rate: 0.02, company_rate: 0.10, personal_fixed: 0, company_fixed: 0, base_lower: 5360, base_upper: 31884 },
        unemployment: { personal_rate: 0.002, company_rate: 0.008, base_lower: 5360, base_upper: 31884 },
        injury: { personal_rate: 0, company_rate: 0.004, base_lower: 5360, base_upper: 31884 },
        maternity: { personal_rate: 0, company_rate: 0.008, base_lower: 5360, base_upper: 31884 },
        housing_fund: { personal_rate: 0.12, company_rate: 0.12, base_lower: 2320, base_upper: 31884 },
    },
    上海: {
        base_lower: 7310,
        base_upper: 36549,
        housing_fund_base_lower: 2590,
        housing_fund_base_upper: 36549,
        pension: { personal_rate: 0.08, company_rate: 0.16, base_lower: 7310, base_upper: 36549 },
        medical: { personal_rate: 0.02, company_rate: 0.10, personal_fixed: 0, company_fixed: 0, base_lower: 7310, base_upper: 36549 },
        unemployment: { personal_rate: 0.005, company_rate: 0.005, base_lower: 7310, base_upper: 36549 },
        injury: { personal_rate: 0, company_rate: 0.0016, base_lower: 7310, base_upper: 36549 },
        maternity: { personal_rate: 0, company_rate: 0.01, base_lower: 7310, base_upper: 36549 },
        housing_fund: { personal_rate: 0.07, company_rate: 0.07, base_lower: 2590, base_upper: 36549 },
    },
    广州: {
        base_lower: 2300,
        base_upper: 38082,
        housing_fund_base_lower: 2300,
        housing_fund_base_upper: 38082,
        pension: { personal_rate: 0.08, company_rate: 0.14, base_lower: 2300, base_upper: 38082 },
        medical: { personal_rate: 0.02, company_rate: 0.065, personal_fixed: 0, company_fixed: 0, base_lower: 2300, base_upper: 38082 },
        unemployment: { personal_rate: 0.002, company_rate: 0.0048, base_lower: 2300, base_upper: 38082 },
        injury: { personal_rate: 0, company_rate: 0.002, base_lower: 2300, base_upper: 38082 },
        maternity: { personal_rate: 0, company_rate: 0.0085, base_lower: 2300, base_upper: 38082 },
        housing_fund: { personal_rate: 0.12, company_rate: 0.12, base_lower: 2300, base_upper: 38082 },
    },
    深圳: {
        base_lower: 2360,
        base_upper: 31938,
        housing_fund_base_lower: 2360,
        housing_fund_base_upper: 31938,
        pension: { personal_rate: 0.08, company_rate: 0.13, base_lower: 2360, base_upper: 31938 },
        medical: { personal_rate: 0.02, company_rate: 0.062, personal_fixed: 0, company_fixed: 0, base_lower: 2360, base_upper: 31938 },
        unemployment: { personal_rate: 0.003, company_rate: 0.007, base_lower: 2360, base_upper: 31938 },
        injury: { personal_rate: 0, company_rate: 0.0014, base_lower: 2360, base_upper: 31938 },
        maternity: { personal_rate: 0, company_rate: 0.0045, base_lower: 2360, base_upper: 31938 },
        housing_fund: { personal_rate: 0.13, company_rate: 0.13, base_lower: 2360, base_upper: 31938 },
    },
    杭州: {
        base_lower: 3957,
        base_upper: 19783,
        housing_fund_base_lower: 1860,
        housing_fund_base_upper: 19783,
        pension: { personal_rate: 0.08, company_rate: 0.14, base_lower: 3957, base_upper: 19783 },
        medical: { personal_rate: 0.02, company_rate: 0.105, personal_fixed: 0, company_fixed: 0, base_lower: 3957, base_upper: 19783 },
        unemployment: { personal_rate: 0.005, company_rate: 0.005, base_lower: 3957, base_upper: 19783 },
        injury: { personal_rate: 0, company_rate: 0.002, base_lower: 3957, base_upper: 19783 },
        maternity: { personal_rate: 0, company_rate: 0.008, base_lower: 3957, base_upper: 19783 },
        housing_fund: { personal_rate: 0.12, company_rate: 0.12, base_lower: 1860, base_upper: 19783 },
    },
    成都: {
        base_lower: 2966,
        base_upper: 20307,
        housing_fund_base_lower: 1650,
        housing_fund_base_upper: 20307,
        pension: { personal_rate: 0.08, company_rate: 0.16, base_lower: 2966, base_upper: 20307 },
        medical: { personal_rate: 0.02, company_rate: 0.075, personal_fixed: 0, company_fixed: 0, base_lower: 2966, base_upper: 20307 },
        unemployment: { personal_rate: 0.004, company_rate: 0.006, base_lower: 2966, base_upper: 20307 },
        injury: { personal_rate: 0, company_rate: 0.002, base_lower: 2966, base_upper: 20307 },
        maternity: { personal_rate: 0, company_rate: 0.006, base_lower: 2966, base_upper: 20307 },
        housing_fund: { personal_rate: 0.12, company_rate: 0.12, base_lower: 1650, base_upper: 20307 },
    },
    南京: {
        base_lower: 4494,
        base_upper: 24042,
        housing_fund_base_lower: 1620,
        housing_fund_base_upper: 24042,
        pension: { personal_rate: 0.08, company_rate: 0.16, base_lower: 4494, base_upper: 24042 },
        medical: { personal_rate: 0.02, company_rate: 0.09, personal_fixed: 0, company_fixed: 0, base_lower: 4494, base_upper: 24042 },
        unemployment: { personal_rate: 0.005, company_rate: 0.005, base_lower: 4494, base_upper: 24042 },
        injury: { personal_rate: 0, company_rate: 0.002, base_lower: 4494, base_upper: 24042 },
        maternity: { personal_rate: 0, company_rate: 0.008, base_lower: 4494, base_upper: 24042 },
        housing_fund: { personal_rate: 0.12, company_rate: 0.12, base_lower: 1620, base_upper: 24042 },
    },
    武汉: {
        base_lower: 3739.8,
        base_upper: 18699,
        housing_fund_base_lower: 1750,
        housing_fund_base_upper: 18699,
        pension: { personal_rate: 0.08, company_rate: 0.16, base_lower: 3739.8, base_upper: 18699 },
        medical: { personal_rate: 0.02, company_rate: 0.08, personal_fixed: 0, company_fixed: 0, base_lower: 3739.8, base_upper: 18699 },
        unemployment: { personal_rate: 0.003, company_rate: 0.007, base_lower: 3739.8, base_upper: 18699 },
        injury: { personal_rate: 0, company_rate: 0.0024, base_lower: 3739.8, base_upper: 18699 },
        maternity: { personal_rate: 0, company_rate: 0.005, base_lower: 3739.8, base_upper: 18699 },
        housing_fund: { personal_rate: 0.12, company_rate: 0.12, base_lower: 1750, base_upper: 18699 },
    },
    西安: {
        base_lower: 3632,
        base_upper: 18159,
        housing_fund_base_lower: 1680,
        housing_fund_base_upper: 18159,
        pension: { personal_rate: 0.08, company_rate: 0.16, base_lower: 3632, base_upper: 18159 },
        medical: { personal_rate: 0.02, company_rate: 0.07, personal_fixed: 0, company_fixed: 0, base_lower: 3632, base_upper: 18159 },
        unemployment: { personal_rate: 0.003, company_rate: 0.007, base_lower: 3632, base_upper: 18159 },
        injury: { personal_rate: 0, company_rate: 0.002, base_lower: 3632, base_upper: 18159 },
        maternity: { personal_rate: 0, company_rate: 0.005, base_lower: 3632, base_upper: 18159 },
        housing_fund: { personal_rate: 0.12, company_rate: 0.12, base_lower: 1680, base_upper: 18159 },
    },
    苏州: {
        base_lower: 4250,
        base_upper: 24042,
        housing_fund_base_lower: 1620,
        housing_fund_base_upper: 24042,
        pension: { personal_rate: 0.08, company_rate: 0.16, base_lower: 4250, base_upper: 24042 },
        medical: { personal_rate: 0.02, company_rate: 0.09, personal_fixed: 0, company_fixed: 0, base_lower: 4250, base_upper: 24042 },
        unemployment: { personal_rate: 0.005, company_rate: 0.005, base_lower: 4250, base_upper: 24042 },
        injury: { personal_rate: 0, company_rate: 0.002, base_lower: 4250, base_upper: 24042 },
        maternity: { personal_rate: 0, company_rate: 0.008, base_lower: 4250, base_upper: 24042 },
        housing_fund: { personal_rate: 0.12, company_rate: 0.12, base_lower: 1620, base_upper: 24042 },
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

