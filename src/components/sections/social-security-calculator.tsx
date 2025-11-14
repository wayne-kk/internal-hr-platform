"use client"

import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { toast } from "sonner"
import { Calculator as CalculatorIcon, MapPin, DollarSign, TrendingUp, Sparkles, PieChart as PieChartIcon, BarChart3 } from "lucide-react"
import type { CalculationResult } from "@/lib/social-security/types"
import { PieChart, Pie, Cell, ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, BarChart, Bar, type PieLabelRenderProps } from "recharts"

export function Calculator() {
    const [cities, setCities] = useState<string[]>([])
    const [selectedCity, setSelectedCity] = useState<string>("")
    const [salary, setSalary] = useState<string>("")
    const [result, setResult] = useState<CalculationResult | null>(null)
    const [loading, setLoading] = useState(false)
    const resultRef = useRef<HTMLDivElement>(null)

    // 加载城市列表
    useEffect(() => {
        fetch("/api/social-security/config")
            .then((res) => res.json())
            .then((data) => {
                if (data.cities) {
                    setCities(data.cities)
                    if (data.cities.length > 0) {
                        setSelectedCity(data.cities[0])
                    }
                }
            })
            .catch((error) => {
                console.error("加载城市列表失败:", error)
                toast.error("加载城市列表失败")
            })
    }, [])


    // 计算五险一金
    const handleCalculate = async () => {
        if (!selectedCity) {
            toast.error("请选择城市")
            return
        }

        const salaryNum = parseFloat(salary)
        if (!salary || isNaN(salaryNum) || salaryNum <= 0) {
            toast.error("请输入有效的工资数额")
            return
        }

        setLoading(true)
        try {
            const response = await fetch("/api/social-security/calculate", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    salary: salaryNum,
                    city: selectedCity,
                }),
            })

            const data = await response.json()

            if (!response.ok) {
                toast.error(data.error || "计算失败")
                setResult(null)
                return
            }

            setResult(data)
            toast.success("计算完成")

            // 滚动到结果区域（延迟一下让动画开始）
            setTimeout(() => {
                resultRef.current?.scrollIntoView({
                    behavior: "smooth",
                    block: "start"
                })
            }, 300)
        } catch (error) {
            console.error("计算失败:", error)
            toast.error("计算失败，请稍后重试")
            setResult(null)
        } finally {
            setLoading(false)
        }
    }

    // 格式化金额
    const formatCurrency = (amount: number) => {
        return `￥${amount.toFixed(2)}`
    }

    // 准备饼图数据
    const getPieChartData = () => {
        if (!result) return []
        return result.items.map((item) => ({
            name: item.name,
            value: item.personal,
            color: getColorForInsurance(item.key),
        }))
    }

    // 准备公司缴纳饼图数据
    const getCompanyPieChartData = () => {
        if (!result) return []
        return result.items.map((item) => ({
            name: item.name,
            value: item.company,
            color: getColorForInsurance(item.key),
        }))
    }

    // 获取险种颜色
    const getColorForInsurance = (key: string) => {
        const colors: Record<string, string> = {
            pension: "#3b82f6", // blue
            medical: "#10b981", // green
            unemployment: "#f59e0b", // amber
            injury: "#ef4444", // red
            maternity: "#8b5cf6", // purple
            housing_fund: "#ec4899", // pink
        }
        return colors[key] || "#6b7280"
    }

    // 准备折线图数据（不同工资水平下的缴纳趋势）
    const getLineChartData = () => {
        if (!result || !selectedCity) return []

        const baseSalary = result.baseSalary
        const steps = [0.5, 0.75, 1, 1.25, 1.5, 1.75, 2, 2.5, 3]

        return steps.map((multiplier) => {
            const salary = baseSalary * multiplier
            // 简化的计算逻辑（实际应该调用API，这里用比例估算）
            const personalTotal = (result.personalTotal / baseSalary) * salary
            const companyTotal = (result.companyTotal / baseSalary) * salary
            const total = personalTotal + companyTotal
            const afterTax = salary - personalTotal

            return {
                salary: Math.round(salary),
                personal: Math.round(personalTotal),
                company: Math.round(companyTotal),
                total: Math.round(total),
                afterTax: Math.round(afterTax),
            }
        })
    }

    // 准备柱状图数据（各险种对比）
    const getBarChartData = () => {
        if (!result) return []
        return result.items.map((item) => ({
            name: item.name,
            个人: item.personal,
            公司: item.company,
        }))
    }

    // 饼图颜色数组
    const COLORS = [
        "#3b82f6", // blue
        "#10b981", // green
        "#f59e0b", // amber
        "#ef4444", // red
        "#8b5cf6", // purple
        "#ec4899", // pink
    ]

    return (
        <div className="flex flex-col gap-8 sm:gap-10">
            {/* 输入区域 */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="w-full"
            >
                <Card className="relative overflow-hidden border border-blue-200/50 dark:border-blue-800/50 bg-gradient-to-br from-white/90 via-white/80 to-blue-50/30 backdrop-blur-xl shadow-2xl shadow-blue-500/10 dark:from-gray-900/90 dark:via-gray-900/80 dark:to-blue-950/30">
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-indigo-500/5 to-purple-500/5" />
                    <div className="absolute top-0 right-0 h-40 w-40 rounded-full bg-blue-400/20 blur-3xl animate-pulse" />
                    <div className="absolute bottom-0 left-0 h-32 w-32 rounded-full bg-indigo-400/10 blur-3xl" />
                    <CardHeader className="relative pb-6 pt-6 sm:pt-8">
                        <div className="flex items-center gap-3">
                            <div className="rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 p-2.5 shadow-lg shadow-blue-500/30">
                                <CalculatorIcon className="h-5 w-5 text-white" />
                            </div>
                            <div>
                                <CardTitle className="text-xl sm:text-2xl font-bold">计算参数</CardTitle>
                                <CardDescription className="text-sm sm:text-base mt-1.5 text-muted-foreground">
                                    输入工资和选择城市，系统将自动计算五险一金
                                </CardDescription>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent className="relative space-y-5 sm:space-y-6 pb-6 sm:pb-8">
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            className="space-y-2"
                        >
                            <Label htmlFor="city" className="flex items-center gap-2 text-sm font-medium">
                                <MapPin className="h-4 w-4 text-blue-500" />
                                选择城市
                            </Label>
                            <Select value={selectedCity} onValueChange={setSelectedCity}>
                                <SelectTrigger id="city" className="w-full h-12 sm:h-11 border-2 bg-white/50 backdrop-blur-sm dark:bg-gray-800/50 hover:border-blue-400 transition-colors text-base sm:text-sm">
                                    <SelectValue placeholder="请选择城市" />
                                </SelectTrigger>
                                <SelectContent>
                                    {cities.map((city) => (
                                        <SelectItem key={city} value={city} className="text-base sm:text-sm">
                                            {city}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 }}
                            className="space-y-2"
                        >
                            <Label htmlFor="salary" className="flex items-center gap-2 text-sm font-medium">
                                <DollarSign className="h-4 w-4 text-green-500" />
                                月工资（元）
                            </Label>
                            <Input
                                id="salary"
                                type="number"
                                placeholder="请输入月工资"
                                value={salary}
                                onChange={(e) => setSalary(e.target.value)}
                                min="0"
                                step="0.01"
                                className="h-12 sm:h-11 border-2 bg-white/50 backdrop-blur-sm dark:bg-gray-800/50 focus:border-blue-400 focus:ring-2 focus:ring-blue-400/20 transition-all text-base sm:text-sm"
                            />
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.4 }}
                        >
                            <Button
                                onClick={handleCalculate}
                                disabled={loading || !selectedCity || !salary}
                                className="w-full h-14 sm:h-12 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-700 hover:via-indigo-700 hover:to-purple-700 text-white font-semibold text-base sm:text-sm shadow-lg shadow-blue-500/30 hover:shadow-xl hover:shadow-blue-500/40 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed active:scale-95"
                            >
                                {loading ? (
                                    <span className="flex items-center gap-2">
                                        <motion.div
                                            animate={{ rotate: 360 }}
                                            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                                            className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full"
                                        />
                                        计算中...
                                    </span>
                                ) : (
                                    <span className="flex items-center gap-2">
                                        <Sparkles className="h-4 w-4" />
                                        开始计算
                                    </span>
                                )}
                            </Button>
                        </motion.div>
                    </CardContent>
                </Card>
            </motion.div>

            {/* 结果展示区域 */}
            <motion.div
                ref={resultRef}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: result ? 1 : 0, y: result ? 0 : 20 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className={result ? "block w-full" : "hidden"}
            >
                <Card className="relative overflow-hidden border border-purple-200/50 dark:border-purple-800/50 bg-gradient-to-br from-white/90 via-white/80 to-purple-50/30 backdrop-blur-xl shadow-2xl shadow-purple-500/10 dark:from-gray-900/90 dark:via-gray-900/80 dark:to-purple-950/30">
                    <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 via-pink-500/5 to-orange-500/5" />
                    <div className="absolute top-0 left-0 h-40 w-40 rounded-full bg-purple-400/20 blur-3xl animate-pulse" />
                    <div className="absolute bottom-0 right-0 h-32 w-32 rounded-full bg-pink-400/10 blur-3xl" />
                    <CardHeader className="relative pb-6 pt-6 sm:pt-8">
                        <div className="flex items-center gap-3">
                            <div className="rounded-xl bg-gradient-to-br from-purple-500 to-pink-600 p-2.5 shadow-lg shadow-purple-500/30">
                                <TrendingUp className="h-5 w-5 text-white" />
                            </div>
                            <div>
                                <CardTitle className="text-xl sm:text-2xl font-bold">计算结果</CardTitle>
                                <CardDescription className="text-sm sm:text-base mt-1.5 text-muted-foreground">
                                    五险一金缴纳明细及合计
                                </CardDescription>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent className="relative pb-6 sm:pb-8">
                        <AnimatePresence mode="wait">
                            {result ? (
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.95 }}
                                    transition={{ duration: 0.3 }}
                                    className="space-y-8 sm:space-y-10"
                                >
                                    {/* 基本信息 */}
                                    <motion.div
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.1 }}
                                        className="space-y-4 rounded-2xl border border-blue-200/60 dark:border-blue-800/60 bg-gradient-to-br from-blue-50/60 to-indigo-50/60 dark:from-blue-950/40 dark:to-indigo-950/40 backdrop-blur-sm p-5 sm:p-6 shadow-lg"
                                    >
                                        <div className="grid grid-cols-2 gap-3 sm:gap-4">
                                            <div className="space-y-1">
                                                <span className="text-xs text-muted-foreground font-medium">城市</span>
                                                <div className="text-sm sm:text-base font-semibold text-blue-600 dark:text-blue-400">{result.city}</div>
                                            </div>
                                            <div className="space-y-1">
                                                <span className="text-xs text-muted-foreground font-medium">输入工资</span>
                                                <div className="text-sm sm:text-base font-semibold">{formatCurrency(result.baseSalary)}</div>
                                            </div>
                                        </div>

                                        {/* 社保基数信息 */}
                                        <div className="space-y-2 p-3 rounded-lg bg-blue-50/50 dark:bg-blue-950/20 border border-blue-200/50 dark:border-blue-800/50">
                                            <div className="text-xs font-semibold text-blue-700 dark:text-blue-300 mb-2">社保缴费基数</div>
                                            <div className="grid grid-cols-2 gap-3">
                                                <div className="space-y-1">
                                                    <span className="text-xs text-muted-foreground font-medium">实际基数</span>
                                                    <div className="text-sm font-semibold text-indigo-600 dark:text-indigo-400">{formatCurrency(result.actualBase)}</div>
                                                </div>
                                                <div className="space-y-1">
                                                    <span className="text-xs text-muted-foreground font-medium">基数范围</span>
                                                    <div className="text-xs font-medium text-muted-foreground">
                                                        {formatCurrency(result.baseLower)} ~ {formatCurrency(result.baseUpper)}
                                                    </div>
                                                </div>
                                            </div>
                                            {result.baseSalary !== result.actualBase && (
                                                <div className="text-xs text-amber-600 dark:text-amber-400 mt-1">
                                                    ⚠️ 已调整（{result.baseSalary < result.baseLower ? '低于下限' : '超过上限'}）
                                                </div>
                                            )}
                                        </div>

                                        {/* 公积金基数信息 */}
                                        <div className="space-y-2 p-3 rounded-lg bg-purple-50/50 dark:bg-purple-950/20 border border-purple-200/50 dark:border-purple-800/50">
                                            <div className="text-xs font-semibold text-purple-700 dark:text-purple-300 mb-2">公积金缴费基数</div>
                                            <div className="grid grid-cols-2 gap-3">
                                                <div className="space-y-1">
                                                    <span className="text-xs text-muted-foreground font-medium">实际基数</span>
                                                    <div className="text-sm font-semibold text-purple-600 dark:text-purple-400">{formatCurrency(result.housingFundActualBase)}</div>
                                                </div>
                                                <div className="space-y-1">
                                                    <span className="text-xs text-muted-foreground font-medium">基数范围</span>
                                                    <div className="text-xs font-medium text-muted-foreground">
                                                        {formatCurrency(result.housingFundBaseLower)} ~ {formatCurrency(result.housingFundBaseUpper)}
                                                    </div>
                                                </div>
                                            </div>
                                            {result.baseSalary !== result.housingFundActualBase && (
                                                <div className="text-xs text-amber-600 dark:text-amber-400 mt-1">
                                                    ⚠️ 已调整（{result.baseSalary < result.housingFundBaseLower ? '低于下限' : '超过上限'}）
                                                </div>
                                            )}
                                        </div>
                                    </motion.div>

                                    {/* 明细表格 */}
                                    <motion.div
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.2 }}
                                        className="space-y-3 rounded-2xl border border-gray-200/60 dark:border-gray-800/60 bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm overflow-hidden shadow-lg"
                                    >
                                        <div className="overflow-x-auto">
                                            <Table>
                                                <TableHeader>
                                                    <TableRow className="bg-gradient-to-r from-gray-50 to-gray-100/50 dark:from-gray-800/50 dark:to-gray-900/50 border-b-2">
                                                        <TableHead className="font-semibold min-w-[80px] text-xs sm:text-sm">险种</TableHead>
                                                        <TableHead className="text-center font-semibold min-w-[70px] text-xs sm:text-sm">个人比例</TableHead>
                                                        <TableHead className="text-right font-semibold min-w-[90px] text-xs sm:text-sm">个人缴纳</TableHead>
                                                        <TableHead className="text-center font-semibold min-w-[70px] text-xs sm:text-sm">公司比例</TableHead>
                                                        <TableHead className="text-right font-semibold min-w-[90px] text-xs sm:text-sm">公司缴纳</TableHead>
                                                    </TableRow>
                                                </TableHeader>
                                                <TableBody>
                                                    {result.items.map((item, index) => (
                                                        <motion.tr
                                                            key={item.name}
                                                            initial={{ opacity: 0, x: -10 }}
                                                            animate={{ opacity: 1, x: 0 }}
                                                            transition={{ delay: 0.3 + index * 0.05 }}
                                                            className="border-b border-gray-100 dark:border-gray-800/50 hover:bg-blue-50/50 dark:hover:bg-blue-950/20 transition-colors"
                                                        >
                                                            <TableCell className="font-medium text-xs sm:text-sm py-3">{item.name}</TableCell>
                                                            <TableCell className="text-center py-3">
                                                                <span className="text-xs font-medium text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/30 px-1.5 sm:px-2 py-0.5 sm:py-1 rounded">
                                                                    {(item.personalRate * 100).toFixed(2)}%
                                                                </span>
                                                            </TableCell>
                                                            <TableCell className="text-right font-semibold text-blue-600 dark:text-blue-400 text-xs sm:text-sm py-3">
                                                                {formatCurrency(item.personal)}
                                                            </TableCell>
                                                            <TableCell className="text-center py-3">
                                                                <span className="text-xs font-medium text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-950/30 px-1.5 sm:px-2 py-0.5 sm:py-1 rounded">
                                                                    {(item.companyRate * 100).toFixed(2)}%
                                                                </span>
                                                            </TableCell>
                                                            <TableCell className="text-right font-semibold text-purple-600 dark:text-purple-400 text-xs sm:text-sm py-3">
                                                                {formatCurrency(item.company)}
                                                            </TableCell>
                                                        </motion.tr>
                                                    ))}
                                                    <TableRow className="bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-950/30 dark:to-purple-950/30 border-t-2 border-indigo-200 dark:border-indigo-800">
                                                        <TableCell className="font-bold text-sm sm:text-base py-3">合计</TableCell>
                                                        <TableCell className="text-center py-3">
                                                            <span className="text-xs font-medium text-muted-foreground">-</span>
                                                        </TableCell>
                                                        <TableCell className="text-right font-bold text-sm sm:text-base text-blue-600 dark:text-blue-400 py-3">
                                                            {formatCurrency(result.personalTotal)}
                                                        </TableCell>
                                                        <TableCell className="text-center py-3">
                                                            <span className="text-xs font-medium text-muted-foreground">-</span>
                                                        </TableCell>
                                                        <TableCell className="text-right font-bold text-sm sm:text-base text-purple-600 dark:text-purple-400 py-3">
                                                            {formatCurrency(result.companyTotal)}
                                                        </TableCell>
                                                    </TableRow>
                                                </TableBody>
                                            </Table>
                                        </div>
                                    </motion.div>

                                    {/* 汇总信息 */}
                                    <motion.div
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.4 }}
                                        className="space-y-5 rounded-2xl border border-blue-200/60 dark:border-blue-800/60 bg-gradient-to-br from-blue-50/60 via-purple-50/60 to-pink-50/60 dark:from-blue-950/40 dark:via-purple-950/40 dark:to-pink-950/40 backdrop-blur-sm p-6 sm:p-8 shadow-xl"
                                    >
                                        <div className="grid grid-cols-2 gap-3 sm:gap-4">
                                            <div className="space-y-1">
                                                <span className="text-xs text-muted-foreground font-medium">个人缴纳合计</span>
                                                <motion.div
                                                    initial={{ scale: 0.8, opacity: 0 }}
                                                    animate={{ scale: 1, opacity: 1 }}
                                                    transition={{ delay: 0.5, type: "spring" }}
                                                    className="text-lg sm:text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400 bg-clip-text text-transparent"
                                                >
                                                    {formatCurrency(result.personalTotal)}
                                                </motion.div>
                                                <div className="text-xs text-muted-foreground">
                                                    占工资 {(result.personalTotal / result.baseSalary * 100).toFixed(2)}%
                                                </div>
                                            </div>
                                            <div className="space-y-1">
                                                <span className="text-xs text-muted-foreground font-medium">公司缴纳合计</span>
                                                <motion.div
                                                    initial={{ scale: 0.8, opacity: 0 }}
                                                    animate={{ scale: 1, opacity: 1 }}
                                                    transition={{ delay: 0.6, type: "spring" }}
                                                    className="text-lg sm:text-xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 dark:from-purple-400 dark:to-pink-400 bg-clip-text text-transparent"
                                                >
                                                    {formatCurrency(result.companyTotal)}
                                                </motion.div>
                                                <div className="text-xs text-muted-foreground">
                                                    占工资 {(result.companyTotal / result.baseSalary * 100).toFixed(2)}%
                                                </div>
                                            </div>
                                        </div>
                                        <div className="border-t-2 border-gray-200 dark:border-gray-700 pt-3 sm:pt-4 space-y-2">
                                            <div className="flex justify-between items-center">
                                                <span className="text-sm sm:text-base font-semibold">总缴纳金额</span>
                                                <motion.span
                                                    initial={{ scale: 0.8, opacity: 0 }}
                                                    animate={{ scale: 1, opacity: 1 }}
                                                    transition={{ delay: 0.7, type: "spring" }}
                                                    className="text-xl sm:text-2xl font-extrabold bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 dark:from-indigo-400 dark:via-purple-400 dark:to-pink-400 bg-clip-text text-transparent"
                                                >
                                                    {formatCurrency(result.total)}
                                                </motion.span>
                                            </div>
                                            <div className="text-xs text-muted-foreground text-right">
                                                占工资 {(result.total / result.baseSalary * 100).toFixed(2)}%
                                            </div>
                                        </div>
                                        <div className="border-t-2 border-gray-200 dark:border-gray-700 pt-3 sm:pt-4 space-y-2">
                                            <div className="flex justify-between items-center">
                                                <span className="text-sm sm:text-base font-semibold">税后工资</span>
                                                <motion.span
                                                    initial={{ scale: 0.8, opacity: 0 }}
                                                    animate={{ scale: 1, opacity: 1 }}
                                                    transition={{ delay: 0.8, type: "spring" }}
                                                    className="text-2xl sm:text-3xl font-extrabold bg-gradient-to-r from-green-600 to-emerald-600 dark:from-green-400 dark:to-emerald-400 bg-clip-text text-transparent"
                                                >
                                                    {formatCurrency(result.afterTaxSalary)}
                                                </motion.span>
                                            </div>
                                            <div className="text-xs text-muted-foreground text-right">
                                                实际到手 {(result.afterTaxSalary / result.baseSalary * 100).toFixed(2)}%
                                            </div>
                                        </div>
                                    </motion.div>

                                    {/* 数据可视化 */}
                                    <motion.div
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.5 }}
                                        className="space-y-8 sm:space-y-10"
                                    >
                                        {/* 饼图区域 */}
                                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
                                            {/* 个人缴纳饼图 */}
                                            <motion.div
                                                initial={{ opacity: 0, scale: 0.9 }}
                                                animate={{ opacity: 1, scale: 1 }}
                                                transition={{ delay: 0.6 }}
                                                className="rounded-2xl border border-blue-200/60 dark:border-blue-800/60 bg-white/60 dark:bg-gray-900/60 backdrop-blur-sm p-5 sm:p-6 shadow-xl"
                                            >
                                                <div className="flex items-center gap-3 mb-5">
                                                    <div className="rounded-lg bg-blue-100 dark:bg-blue-900/30 p-2">
                                                        <PieChartIcon className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                                                    </div>
                                                    <h3 className="text-base sm:text-lg font-bold">个人缴纳分布</h3>
                                                </div>
                                                <ResponsiveContainer width="100%" height={280}>
                                                    <PieChart>
                                                        <Tooltip
                                                            formatter={(value: number) => formatCurrency(value)}
                                                            contentStyle={{
                                                                backgroundColor: "rgba(255, 255, 255, 0.95)",
                                                                border: "1px solid #e5e7eb",
                                                                borderRadius: "8px",
                                                            }}
                                                        />
                                                        <Legend
                                                            wrapperStyle={{ fontSize: "12px" }}
                                                            formatter={(value) => value}
                                                        />
                                                        <Pie
                                                            data={getPieChartData()}
                                                            cx="50%"
                                                            cy="50%"
                                                            labelLine={false}
                                                            label={(props: PieLabelRenderProps) => {
                                                                const { name, percent } = props
                                                                const percentValue = typeof percent === 'number' ? percent : 0
                                                                return `${name} ${(percentValue * 100).toFixed(0)}%`
                                                            }}
                                                            outerRadius={80}
                                                            fill="#8884d8"
                                                            dataKey="value"
                                                        >
                                                            {getPieChartData().map((entry, index) => (
                                                                <Cell key={`cell-${index}`} fill={entry.color} />
                                                            ))}
                                                        </Pie>
                                                    </PieChart>
                                                </ResponsiveContainer>
                                            </motion.div>

                                            {/* 公司缴纳饼图 */}
                                            <motion.div
                                                initial={{ opacity: 0, scale: 0.9 }}
                                                animate={{ opacity: 1, scale: 1 }}
                                                transition={{ delay: 0.7 }}
                                                className="rounded-2xl border border-purple-200/60 dark:border-purple-800/60 bg-white/60 dark:bg-gray-900/60 backdrop-blur-sm p-5 sm:p-6 shadow-xl"
                                            >
                                                <div className="flex items-center gap-3 mb-5">
                                                    <div className="rounded-lg bg-purple-100 dark:bg-purple-900/30 p-2">
                                                        <PieChartIcon className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                                                    </div>
                                                    <h3 className="text-base sm:text-lg font-bold">公司缴纳分布</h3>
                                                </div>
                                                <ResponsiveContainer width="100%" height={280}>
                                                    <PieChart>
                                                        <Tooltip
                                                            formatter={(value: number) => formatCurrency(value)}
                                                            contentStyle={{
                                                                backgroundColor: "rgba(255, 255, 255, 0.95)",
                                                                border: "1px solid #e5e7eb",
                                                                borderRadius: "8px",
                                                            }}
                                                        />
                                                        <Legend
                                                            wrapperStyle={{ fontSize: "12px" }}
                                                            formatter={(value) => value}
                                                        />
                                                        <Pie
                                                            data={getCompanyPieChartData()}
                                                            cx="50%"
                                                            cy="50%"
                                                            labelLine={false}
                                                            label={(props: PieLabelRenderProps) => {
                                                                const { name, percent } = props
                                                                const percentValue = typeof percent === 'number' ? percent : 0
                                                                return `${name} ${(percentValue * 100).toFixed(0)}%`
                                                            }}
                                                            outerRadius={80}
                                                            fill="#8884d8"
                                                            dataKey="value"
                                                        >
                                                            {getCompanyPieChartData().map((entry, index) => (
                                                                <Cell key={`cell-${index}`} fill={entry.color} />
                                                            ))}
                                                        </Pie>
                                                    </PieChart>
                                                </ResponsiveContainer>
                                            </motion.div>
                                        </div>

                                        {/* 柱状图 - 各险种对比 */}
                                        <motion.div
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: 0.8 }}
                                            className="rounded-2xl border border-indigo-200/60 dark:border-indigo-800/60 bg-white/60 dark:bg-gray-900/60 backdrop-blur-sm p-5 sm:p-6 shadow-xl"
                                        >
                                            <div className="flex items-center gap-3 mb-5">
                                                <div className="rounded-lg bg-indigo-100 dark:bg-indigo-900/30 p-2">
                                                    <BarChart3 className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                                                </div>
                                                <h3 className="text-base sm:text-lg font-bold">各险种缴纳对比</h3>
                                            </div>
                                            <ResponsiveContainer width="100%" height={320}>
                                                <BarChart data={getBarChartData()} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                                                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                                                    <XAxis
                                                        dataKey="name"
                                                        tick={{ fontSize: 12 }}
                                                        angle={-45}
                                                        textAnchor="end"
                                                        height={80}
                                                    />
                                                    <YAxis
                                                        tick={{ fontSize: 12 }}
                                                        tickFormatter={(value) => `￥${(value / 1000).toFixed(0)}k`}
                                                    />
                                                    <Tooltip
                                                        formatter={(value: number) => formatCurrency(value)}
                                                        contentStyle={{
                                                            backgroundColor: "rgba(255, 255, 255, 0.95)",
                                                            border: "1px solid #e5e7eb",
                                                            borderRadius: "8px",
                                                        }}
                                                    />
                                                    <Legend wrapperStyle={{ fontSize: "12px" }} />
                                                    <Bar dataKey="个人" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                                                    <Bar dataKey="公司" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
                                                </BarChart>
                                            </ResponsiveContainer>
                                        </motion.div>

                                        {/* 折线图 - 不同工资水平趋势 */}
                                        <motion.div
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: 0.9 }}
                                            className="rounded-2xl border border-green-200/60 dark:border-green-800/60 bg-white/60 dark:bg-gray-900/60 backdrop-blur-sm p-5 sm:p-6 shadow-xl"
                                        >
                                            <div className="flex items-center gap-3 mb-5">
                                                <div className="rounded-lg bg-green-100 dark:bg-green-900/30 p-2">
                                                    <TrendingUp className="h-5 w-5 text-green-600 dark:text-green-400" />
                                                </div>
                                                <h3 className="text-base sm:text-lg font-bold">不同工资水平下的缴纳趋势</h3>
                                            </div>
                                            <ResponsiveContainer width="100%" height={320}>
                                                <LineChart data={getLineChartData()} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                                                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                                                    <XAxis
                                                        dataKey="salary"
                                                        tick={{ fontSize: 12 }}
                                                        tickFormatter={(value) => `￥${(value / 1000).toFixed(0)}k`}
                                                    />
                                                    <YAxis
                                                        tick={{ fontSize: 12 }}
                                                        tickFormatter={(value) => `￥${(value / 1000).toFixed(0)}k`}
                                                    />
                                                    <Tooltip
                                                        formatter={(value: number, name: string) => [
                                                            formatCurrency(value),
                                                            name === "personal" ? "个人缴纳" : name === "company" ? "公司缴纳" : name === "total" ? "总缴纳" : "税后工资",
                                                        ]}
                                                        labelFormatter={(value) => `工资: ${formatCurrency(value)}`}
                                                        contentStyle={{
                                                            backgroundColor: "rgba(255, 255, 255, 0.95)",
                                                            border: "1px solid #e5e7eb",
                                                            borderRadius: "8px",
                                                        }}
                                                    />
                                                    <Legend
                                                        wrapperStyle={{ fontSize: "12px" }}
                                                        formatter={(value) => {
                                                            const map: Record<string, string> = {
                                                                personal: "个人缴纳",
                                                                company: "公司缴纳",
                                                                total: "总缴纳",
                                                                afterTax: "税后工资",
                                                            }
                                                            return map[value] || value
                                                        }}
                                                    />
                                                    <Line
                                                        type="monotone"
                                                        dataKey="personal"
                                                        stroke="#3b82f6"
                                                        strokeWidth={2}
                                                        dot={{ r: 4 }}
                                                        name="personal"
                                                    />
                                                    <Line
                                                        type="monotone"
                                                        dataKey="company"
                                                        stroke="#8b5cf6"
                                                        strokeWidth={2}
                                                        dot={{ r: 4 }}
                                                        name="company"
                                                    />
                                                    <Line
                                                        type="monotone"
                                                        dataKey="total"
                                                        stroke="#ef4444"
                                                        strokeWidth={2}
                                                        dot={{ r: 4 }}
                                                        name="total"
                                                    />
                                                    <Line
                                                        type="monotone"
                                                        dataKey="afterTax"
                                                        stroke="#10b981"
                                                        strokeWidth={2}
                                                        dot={{ r: 4 }}
                                                        name="afterTax"
                                                    />
                                                </LineChart>
                                            </ResponsiveContainer>
                                        </motion.div>
                                    </motion.div>
                                </motion.div>
                            ) : (
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.9 }}
                                    transition={{ duration: 0.3 }}
                                    className="py-8 sm:py-12"
                                >
                                    <div className="text-center space-y-3">
                                        <div className="mx-auto h-14 w-14 sm:h-16 sm:w-16 rounded-full bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900/30 dark:to-purple-900/30 flex items-center justify-center">
                                            <CalculatorIcon className="h-7 w-7 sm:h-8 sm:w-8 text-blue-500 dark:text-blue-400" />
                                        </div>
                                        <p className="text-sm sm:text-base font-medium">请输入工资和选择城市后点击计算</p>
                                        <p className="text-xs sm:text-sm text-muted-foreground">系统将自动为您计算五险一金明细</p>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </CardContent>
                </Card>
            </motion.div>
        </div>
    )
}

