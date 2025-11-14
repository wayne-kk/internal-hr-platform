// 五险一金类型定义

export interface InsuranceRate {
    personal_rate: number // 个人缴费比例
    company_rate: number // 公司缴费比例
}

export interface MedicalInsuranceRate extends InsuranceRate {
    personal_fixed?: number // 个人固定金额（元），仅医疗保险个人部分使用，公司部分不加固定金额
}

export interface CityConfig {
    base_lower: number // 社保缴费基数下限
    base_upper: number // 社保缴费基数上限
    housing_fund_base_lower: number // 公积金缴费基数下限
    housing_fund_base_upper: number // 公积金缴费基数上限
    pension: InsuranceRate // 养老保险
    medical: MedicalInsuranceRate // 医疗保险（支持比例+固定金额）
    unemployment: InsuranceRate // 失业保险
    injury: InsuranceRate // 工伤保险
    maternity: InsuranceRate // 生育保险
    housing_fund: InsuranceRate // 住房公积金
    housing_fund_protection_enabled?: boolean // 是否启用公积金保护规则（保护低收入员工）
}

export interface SocialSecurityConfig {
    [city: string]: CityConfig
}

export interface CalculationItem {
    name: string // 险种名称
    personal: number // 个人缴纳金额
    company: number // 公司缴纳金额
    personalRate: number // 个人缴费比例
    companyRate: number // 公司缴费比例
    key: string // 险种key（用于获取配置）
}

export interface CalculationResult {
    city: string // 城市
    baseSalary: number // 输入工资
    actualBase: number // 社保实际缴费基数（经过上下限限制）
    baseLower: number // 社保缴费基数下限
    baseUpper: number // 社保缴费基数上限
    housingFundActualBase: number // 公积金实际缴费基数（经过上下限限制）
    housingFundBaseLower: number // 公积金缴费基数下限
    housingFundBaseUpper: number // 公积金缴费基数上限
    items: CalculationItem[] // 各险种明细
    personalTotal: number // 个人缴纳合计
    companyTotal: number // 公司缴纳合计
    total: number // 合计
    afterTaxSalary: number // 税后工资（工资 - 个人缴纳）
}

export interface CalculateRequest {
    salary: number // 工资
    city: string // 城市
    customConfig?: CityConfig // 可选的自定义配置，如果不提供则使用城市默认配置
}

