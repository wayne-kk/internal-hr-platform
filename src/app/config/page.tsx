"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { toast } from "sonner"
import { Settings, Plus, Save, RefreshCw, Trash2, Edit2, Shield } from "lucide-react"
import { SectionHeader } from "@/components/layout/section-header"
import { AdminGuard } from "@/components/auth/admin-guard"
import type { CityConfig } from "@/lib/social-security/types"

interface ConfigItem {
    id: string
    city: string
    config: CityConfig
    created_at: string
    updated_at: string
    version: number
}

function ConfigPageContent() {
    const [configs, setConfigs] = useState<ConfigItem[]>([])
    const [loading, setLoading] = useState(false)
    const [editingCity, setEditingCity] = useState<string | null>(null)
    const [formData, setFormData] = useState<CityConfig | null>(null)
    const [newCity, setNewCity] = useState("")

    // 加载所有配置
    const loadConfigs = async () => {
        setLoading(true)
        try {
            const response = await fetch("/api/social-security/config?all=true")
            const data = await response.json()
            if (data.configs) {
                setConfigs(data.configs)
            }
        } catch (error) {
            console.error("加载配置失败:", error)
            toast.error("加载配置失败")
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        loadConfigs()
    }, [])

    // 开始编辑
    const handleEdit = (item: ConfigItem) => {
        setEditingCity(item.city)
        setFormData({ ...item.config })
    }

    // 开始新建
    const handleNew = () => {
        if (!newCity.trim()) {
            toast.error("请输入城市名称")
            return
        }
        setEditingCity(newCity)
        // 使用默认配置
        setFormData({
            base_lower: 3000,
            base_upper: 30000,
            housing_fund_base_lower: 2000,
            housing_fund_base_upper: 30000,
            pension: { personal_rate: 0.08, company_rate: 0.16 },
            medical: { personal_rate: 0.02, company_rate: 0.10, personal_fixed: 0 },
            unemployment: { personal_rate: 0.002, company_rate: 0.008 },
            injury: { personal_rate: 0, company_rate: 0.004 },
            maternity: { personal_rate: 0, company_rate: 0.008 },
            housing_fund: { personal_rate: 0.12, company_rate: 0.12 },
            housing_fund_protection_enabled: false,
        })
        setNewCity("")
    }

    // 保存配置
    const handleSave = async () => {
        if (!editingCity || !formData) {
            return
        }

        // 验证配置
        if (formData.base_lower >= formData.base_upper) {
            toast.error("社保缴费基数下限必须小于上限")
            return
        }
        if (formData.housing_fund_base_lower >= formData.housing_fund_base_upper) {
            toast.error("公积金缴费基数下限必须小于上限")
            return
        }

        setLoading(true)
        try {
            const response = await fetch("/api/social-security/config", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    city: editingCity,
                    config: formData,
                }),
            })

            const data = await response.json()

            if (!response.ok) {
                toast.error(data.error || "保存失败")
                return
            }

            toast.success("配置保存成功")
            setEditingCity(null)
            setFormData(null)
            await loadConfigs()
        } catch (error) {
            console.error("保存配置失败:", error)
            toast.error("保存配置失败")
        } finally {
            setLoading(false)
        }
    }

    // 取消编辑
    const handleCancel = () => {
        setEditingCity(null)
        setFormData(null)
        setNewCity("")
    }

    return (
        <div className="relative min-h-screen overflow-hidden">
            {/* 动态背景 */}
            <div className="fixed inset-0 -z-10">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-indigo-50/50 to-purple-50 dark:from-gray-950 dark:via-indigo-950/30 dark:to-purple-950" />
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(99,102,241,0.15),transparent_50%)]" />
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(139,92,246,0.15),transparent_50%)]" />
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]" />
            </div>

            <div className="relative mx-auto flex w-full max-w-7xl flex-col gap-8 px-6 py-8">
                <SectionHeader
                    title="五险一金配置管理"
                    description="管理各城市的五险一金缴费比例和基数上下限配置"
                />

                <div className="grid gap-6 lg:grid-cols-3">
                    {/* 配置列表 */}
                    <Card className="lg:col-span-2 relative overflow-hidden border-0 bg-gradient-to-br from-white/80 via-white/60 to-white/40 backdrop-blur-xl shadow-xl dark:from-gray-900/80 dark:via-gray-900/60 dark:to-gray-900/40">
                        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-indigo-500/5 to-purple-500/5" />
                        <CardHeader className="relative">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <div className="rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 p-2">
                                        <Settings className="h-5 w-5 text-white" />
                                    </div>
                                    <CardTitle className="text-xl">城市配置列表</CardTitle>
                                </div>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={loadConfigs}
                                    disabled={loading}
                                >
                                    <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
                                </Button>
                            </div>
                        </CardHeader>
                        <CardContent className="relative">
                            <div className="space-y-4">
                                {/* 新建城市 */}
                                <div className="flex gap-2">
                                    <Input
                                        placeholder="输入新城市名称"
                                        value={newCity}
                                        onChange={(e) => setNewCity(e.target.value)}
                                        onKeyDown={(e) => {
                                            if (e.key === "Enter") {
                                                handleNew()
                                            }
                                        }}
                                    />
                                    <Button onClick={handleNew}>
                                        <Plus className="h-4 w-4 mr-2" />
                                        新建
                                    </Button>
                                </div>

                                {/* 配置表格 */}
                                <div className="rounded-lg border border-gray-200/50 dark:border-gray-800/50 bg-white/30 dark:bg-gray-900/30 backdrop-blur-sm overflow-hidden">
                                    <Table>
                                        <TableHeader>
                                            <TableRow className="bg-gradient-to-r from-gray-50 to-gray-100/50 dark:from-gray-800/50 dark:to-gray-900/50 border-b-2">
                                                <TableHead className="font-semibold">城市</TableHead>
                                                <TableHead className="font-semibold">社保基数范围</TableHead>
                                                <TableHead className="font-semibold">公积金基数范围</TableHead>
                                                <TableHead className="font-semibold">更新时间</TableHead>
                                                <TableHead className="font-semibold text-right">操作</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {configs.map((item) => (
                                                <TableRow key={item.id} className="hover:bg-blue-50/50 dark:hover:bg-blue-950/20">
                                                    <TableCell className="font-medium">{item.city}</TableCell>
                                                    <TableCell className="text-sm text-muted-foreground">
                                                        {item.config.base_lower.toLocaleString()} ~ {item.config.base_upper.toLocaleString()}
                                                    </TableCell>
                                                    <TableCell className="text-sm text-muted-foreground">
                                                        {item.config.housing_fund_base_lower.toLocaleString()} ~ {item.config.housing_fund_base_upper.toLocaleString()}
                                                    </TableCell>
                                                    <TableCell className="text-xs text-muted-foreground">
                                                        {new Date(item.updated_at).toLocaleDateString("zh-CN")}
                                                    </TableCell>
                                                    <TableCell className="text-right">
                                                        <Button
                                                            variant="ghost"
                                                            size="sm"
                                                            onClick={() => handleEdit(item)}
                                                        >
                                                            <Edit2 className="h-4 w-4" />
                                                        </Button>
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* 编辑配置 */}
                    {editingCity && formData && (
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="lg:col-span-1"
                        >
                            <Card className="relative overflow-hidden border-0 bg-gradient-to-br from-white/80 via-white/60 to-white/40 backdrop-blur-xl shadow-xl dark:from-gray-900/80 dark:via-gray-900/60 dark:to-gray-900/40">
                                <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 via-pink-500/5 to-orange-500/5" />
                                <CardHeader className="relative">
                                    <CardTitle className="text-xl">编辑配置：{editingCity}</CardTitle>
                                    <CardDescription>修改五险一金参数</CardDescription>
                                </CardHeader>
                                <CardContent className="relative space-y-6 max-h-[calc(100vh-250px)] overflow-y-auto">
                                    {/* 基数配置 */}
                                    <div className="space-y-4">
                                        <div className="space-y-3">
                                            <Label className="text-sm font-semibold">社保缴费基数范围</Label>
                                            <div className="grid grid-cols-2 gap-3">
                                                <div className="space-y-1">
                                                    <Label className="text-xs">下限（元）</Label>
                                                    <Input
                                                        type="number"
                                                        value={formData.base_lower}
                                                        onChange={(e) => {
                                                            const value = parseFloat(e.target.value)
                                                            if (!isNaN(value) && value >= 0) {
                                                                setFormData({
                                                                    ...formData,
                                                                    base_lower: value,
                                                                })
                                                            }
                                                        }}
                                                        className="h-9 text-sm"
                                                        min="0"
                                                        step="1"
                                                    />
                                                </div>
                                                <div className="space-y-1">
                                                    <Label className="text-xs">上限（元）</Label>
                                                    <Input
                                                        type="number"
                                                        value={formData.base_upper}
                                                        onChange={(e) => {
                                                            const value = parseFloat(e.target.value)
                                                            if (!isNaN(value) && value >= 0) {
                                                                setFormData({
                                                                    ...formData,
                                                                    base_upper: value,
                                                                })
                                                            }
                                                        }}
                                                        className="h-9 text-sm"
                                                        min="0"
                                                        step="1"
                                                    />
                                                </div>
                                            </div>
                                        </div>

                                        <div className="space-y-3">
                                            <Label className="text-sm font-semibold">公积金缴费基数范围</Label>
                                            <div className="grid grid-cols-2 gap-3">
                                                <div className="space-y-1">
                                                    <Label className="text-xs">下限（元）</Label>
                                                    <Input
                                                        type="number"
                                                        value={formData.housing_fund_base_lower}
                                                        onChange={(e) => {
                                                            const value = parseFloat(e.target.value)
                                                            if (!isNaN(value) && value >= 0) {
                                                                setFormData({
                                                                    ...formData,
                                                                    housing_fund_base_lower: value,
                                                                })
                                                            }
                                                        }}
                                                        className="h-9 text-sm"
                                                        min="0"
                                                        step="1"
                                                    />
                                                </div>
                                                <div className="space-y-1">
                                                    <Label className="text-xs">上限（元）</Label>
                                                    <Input
                                                        type="number"
                                                        value={formData.housing_fund_base_upper}
                                                        onChange={(e) => {
                                                            const value = parseFloat(e.target.value)
                                                            if (!isNaN(value) && value >= 0) {
                                                                setFormData({
                                                                    ...formData,
                                                                    housing_fund_base_upper: value,
                                                                })
                                                            }
                                                        }}
                                                        className="h-9 text-sm"
                                                        min="0"
                                                        step="1"
                                                    />
                                                </div>
                                            </div>
                                        </div>

                                        <div className="space-y-3 rounded-lg border-2 border-blue-200/50 dark:border-blue-800/50 bg-gradient-to-br from-blue-50/50 to-indigo-50/30 dark:from-blue-950/20 dark:to-indigo-950/20 p-4">
                                            <div className="flex items-start justify-between gap-4">
                                                <div className="flex-1 space-y-2">
                                                    <div className="flex items-center gap-2">
                                                        <Shield className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                                                        <Label className="text-sm font-semibold">公积金保护规则</Label>
                                                    </div>
                                                    <p className="text-xs text-muted-foreground leading-relaxed">
                                                        启用后，系统将自动保护低收入员工：
                                                        <br />
                                                        • 工资 ≤ 下限：个人不缴，公司按下限缴
                                                        <br />
                                                        • 扣完后低于下限：个人限额缴（工资-下限），公司按工资缴
                                                        <br />
                                                        • 扣完后 ≥ 下限：正常计算
                                                    </p>
                                                </div>
                                                <div className="flex items-center gap-2 pt-1">
                                                    <input
                                                        type="checkbox"
                                                        checked={formData.housing_fund_protection_enabled ?? false}
                                                        onChange={(e) => {
                                                            setFormData({
                                                                ...formData,
                                                                housing_fund_protection_enabled: e.target.checked,
                                                            })
                                                        }}
                                                        className="h-5 w-5 rounded border-2 border-gray-300 text-blue-600 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 cursor-pointer"
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* 险种比例配置 */}
                                    <div className="space-y-3">
                                        <Label className="text-sm font-semibold">各险种缴费比例（%）</Label>
                                        <Tabs defaultValue="pension" className="w-full">
                                            <TabsList className="grid w-full grid-cols-3 h-auto p-1">
                                                <TabsTrigger value="pension" className="text-xs">养老</TabsTrigger>
                                                <TabsTrigger value="medical" className="text-xs">医疗</TabsTrigger>
                                                <TabsTrigger value="unemployment" className="text-xs">失业</TabsTrigger>
                                                <TabsTrigger value="injury" className="text-xs">工伤</TabsTrigger>
                                                <TabsTrigger value="maternity" className="text-xs">生育</TabsTrigger>
                                                <TabsTrigger value="housing_fund" className="text-xs">公积金</TabsTrigger>
                                            </TabsList>
                                            <TabsContent value="pension" className="space-y-2 mt-3">
                                                <div className="grid grid-cols-2 gap-2">
                                                    <div className="space-y-1">
                                                        <Label className="text-xs">个人比例（%）</Label>
                                                        <Input
                                                            type="number"
                                                            value={(formData.pension.personal_rate * 100).toFixed(2)}
                                                            onChange={(e) => {
                                                                const value = parseFloat(e.target.value) / 100
                                                                if (!isNaN(value) && value >= 0 && value <= 1) {
                                                                    setFormData({
                                                                        ...formData,
                                                                        pension: { ...formData.pension, personal_rate: value },
                                                                    })
                                                                }
                                                            }}
                                                            className="h-9 text-sm"
                                                            min="0"
                                                            max="100"
                                                            step="0.01"
                                                        />
                                                    </div>
                                                    <div className="space-y-1">
                                                        <Label className="text-xs">公司比例（%）</Label>
                                                        <Input
                                                            type="number"
                                                            value={(formData.pension.company_rate * 100).toFixed(2)}
                                                            onChange={(e) => {
                                                                const value = parseFloat(e.target.value) / 100
                                                                if (!isNaN(value) && value >= 0 && value <= 1) {
                                                                    setFormData({
                                                                        ...formData,
                                                                        pension: { ...formData.pension, company_rate: value },
                                                                    })
                                                                }
                                                            }}
                                                            className="h-9 text-sm"
                                                            min="0"
                                                            max="100"
                                                            step="0.01"
                                                        />
                                                    </div>
                                                </div>
                                            </TabsContent>
                                            <TabsContent value="medical" className="space-y-3 mt-3">
                                                <div className="space-y-2">
                                                    <Label className="text-xs font-semibold text-blue-600 dark:text-blue-400">缴费比例（%）</Label>
                                                    <div className="grid grid-cols-2 gap-2">
                                                        <div className="space-y-1">
                                                            <Label className="text-xs">个人比例</Label>
                                                            <Input
                                                                type="number"
                                                                value={(formData.medical.personal_rate * 100).toFixed(2)}
                                                                onChange={(e) => {
                                                                    const value = parseFloat(e.target.value) / 100
                                                                    if (!isNaN(value) && value >= 0 && value <= 1) {
                                                                        setFormData({
                                                                            ...formData,
                                                                            medical: { ...formData.medical, personal_rate: value },
                                                                        })
                                                                    }
                                                                }}
                                                                className="h-9 text-sm"
                                                                min="0"
                                                                max="100"
                                                                step="0.01"
                                                            />
                                                        </div>
                                                        <div className="space-y-1">
                                                            <Label className="text-xs">公司比例</Label>
                                                            <Input
                                                                type="number"
                                                                value={(formData.medical.company_rate * 100).toFixed(2)}
                                                                onChange={(e) => {
                                                                    const value = parseFloat(e.target.value) / 100
                                                                    if (!isNaN(value) && value >= 0 && value <= 1) {
                                                                        setFormData({
                                                                            ...formData,
                                                                            medical: { ...formData.medical, company_rate: value },
                                                                        })
                                                                    }
                                                                }}
                                                                className="h-9 text-sm"
                                                                min="0"
                                                                max="100"
                                                                step="0.01"
                                                            />
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="space-y-2 rounded-lg border border-blue-200/50 dark:border-blue-800/50 bg-blue-50/30 dark:bg-blue-950/20 p-3">
                                                    <Label className="text-xs font-semibold text-blue-600 dark:text-blue-400">个人固定金额（元）</Label>
                                                    <p className="text-xs text-muted-foreground mb-2">医疗保险个人部分支持比例+固定金额同时生效，公司部分仅按比例计算</p>
                                                    <div className="space-y-1">
                                                        <Label className="text-xs">个人固定金额</Label>
                                                        <Input
                                                            type="number"
                                                            value={formData.medical.personal_fixed || 0}
                                                            onChange={(e) => {
                                                                const value = parseFloat(e.target.value)
                                                                if (!isNaN(value) && value >= 0) {
                                                                    setFormData({
                                                                        ...formData,
                                                                        medical: { ...formData.medical, personal_fixed: value },
                                                                    })
                                                                }
                                                            }}
                                                            className="h-9 text-sm"
                                                            min="0"
                                                            step="0.01"
                                                            placeholder="0"
                                                        />
                                                    </div>
                                                </div>
                                            </TabsContent>
                                            <TabsContent value="unemployment" className="space-y-2 mt-3">
                                                <div className="grid grid-cols-2 gap-2">
                                                    <div className="space-y-1">
                                                        <Label className="text-xs">个人比例（%）</Label>
                                                        <Input
                                                            type="number"
                                                            value={(formData.unemployment.personal_rate * 100).toFixed(2)}
                                                            onChange={(e) => {
                                                                const value = parseFloat(e.target.value) / 100
                                                                if (!isNaN(value) && value >= 0 && value <= 1) {
                                                                    setFormData({
                                                                        ...formData,
                                                                        unemployment: { ...formData.unemployment, personal_rate: value },
                                                                    })
                                                                }
                                                            }}
                                                            className="h-9 text-sm"
                                                            min="0"
                                                            max="100"
                                                            step="0.01"
                                                        />
                                                    </div>
                                                    <div className="space-y-1">
                                                        <Label className="text-xs">公司比例（%）</Label>
                                                        <Input
                                                            type="number"
                                                            value={(formData.unemployment.company_rate * 100).toFixed(2)}
                                                            onChange={(e) => {
                                                                const value = parseFloat(e.target.value) / 100
                                                                if (!isNaN(value) && value >= 0 && value <= 1) {
                                                                    setFormData({
                                                                        ...formData,
                                                                        unemployment: { ...formData.unemployment, company_rate: value },
                                                                    })
                                                                }
                                                            }}
                                                            className="h-9 text-sm"
                                                            min="0"
                                                            max="100"
                                                            step="0.01"
                                                        />
                                                    </div>
                                                </div>
                                            </TabsContent>
                                            <TabsContent value="injury" className="space-y-2 mt-3">
                                                <div className="grid grid-cols-2 gap-2">
                                                    <div className="space-y-1">
                                                        <Label className="text-xs">个人比例（%）</Label>
                                                        <Input
                                                            type="number"
                                                            value={(formData.injury.personal_rate * 100).toFixed(2)}
                                                            onChange={(e) => {
                                                                const value = parseFloat(e.target.value) / 100
                                                                if (!isNaN(value) && value >= 0 && value <= 1) {
                                                                    setFormData({
                                                                        ...formData,
                                                                        injury: { ...formData.injury, personal_rate: value },
                                                                    })
                                                                }
                                                            }}
                                                            className="h-9 text-sm"
                                                            min="0"
                                                            max="100"
                                                            step="0.01"
                                                        />
                                                    </div>
                                                    <div className="space-y-1">
                                                        <Label className="text-xs">公司比例（%）</Label>
                                                        <Input
                                                            type="number"
                                                            value={(formData.injury.company_rate * 100).toFixed(2)}
                                                            onChange={(e) => {
                                                                const value = parseFloat(e.target.value) / 100
                                                                if (!isNaN(value) && value >= 0 && value <= 1) {
                                                                    setFormData({
                                                                        ...formData,
                                                                        injury: { ...formData.injury, company_rate: value },
                                                                    })
                                                                }
                                                            }}
                                                            className="h-9 text-sm"
                                                            min="0"
                                                            max="100"
                                                            step="0.01"
                                                        />
                                                    </div>
                                                </div>
                                            </TabsContent>
                                            <TabsContent value="maternity" className="space-y-2 mt-3">
                                                <div className="grid grid-cols-2 gap-2">
                                                    <div className="space-y-1">
                                                        <Label className="text-xs">个人比例（%）</Label>
                                                        <Input
                                                            type="number"
                                                            value={(formData.maternity.personal_rate * 100).toFixed(2)}
                                                            onChange={(e) => {
                                                                const value = parseFloat(e.target.value) / 100
                                                                if (!isNaN(value) && value >= 0 && value <= 1) {
                                                                    setFormData({
                                                                        ...formData,
                                                                        maternity: { ...formData.maternity, personal_rate: value },
                                                                    })
                                                                }
                                                            }}
                                                            className="h-9 text-sm"
                                                            min="0"
                                                            max="100"
                                                            step="0.01"
                                                        />
                                                    </div>
                                                    <div className="space-y-1">
                                                        <Label className="text-xs">公司比例（%）</Label>
                                                        <Input
                                                            type="number"
                                                            value={(formData.maternity.company_rate * 100).toFixed(2)}
                                                            onChange={(e) => {
                                                                const value = parseFloat(e.target.value) / 100
                                                                if (!isNaN(value) && value >= 0 && value <= 1) {
                                                                    setFormData({
                                                                        ...formData,
                                                                        maternity: { ...formData.maternity, company_rate: value },
                                                                    })
                                                                }
                                                            }}
                                                            className="h-9 text-sm"
                                                            min="0"
                                                            max="100"
                                                            step="0.01"
                                                        />
                                                    </div>
                                                </div>
                                            </TabsContent>
                                            <TabsContent value="housing_fund" className="space-y-2 mt-3">
                                                <div className="grid grid-cols-2 gap-2">
                                                    <div className="space-y-1">
                                                        <Label className="text-xs">个人比例（%）</Label>
                                                        <Input
                                                            type="number"
                                                            value={(formData.housing_fund.personal_rate * 100).toFixed(2)}
                                                            onChange={(e) => {
                                                                const value = parseFloat(e.target.value) / 100
                                                                if (!isNaN(value) && value >= 0 && value <= 1) {
                                                                    setFormData({
                                                                        ...formData,
                                                                        housing_fund: { ...formData.housing_fund, personal_rate: value },
                                                                    })
                                                                }
                                                            }}
                                                            className="h-9 text-sm"
                                                            min="0"
                                                            max="100"
                                                            step="0.01"
                                                        />
                                                    </div>
                                                    <div className="space-y-1">
                                                        <Label className="text-xs">公司比例（%）</Label>
                                                        <Input
                                                            type="number"
                                                            value={(formData.housing_fund.company_rate * 100).toFixed(2)}
                                                            onChange={(e) => {
                                                                const value = parseFloat(e.target.value) / 100
                                                                if (!isNaN(value) && value >= 0 && value <= 1) {
                                                                    setFormData({
                                                                        ...formData,
                                                                        housing_fund: { ...formData.housing_fund, company_rate: value },
                                                                    })
                                                                }
                                                            }}
                                                            className="h-9 text-sm"
                                                            min="0"
                                                            max="100"
                                                            step="0.01"
                                                        />
                                                    </div>
                                                </div>
                                            </TabsContent>
                                        </Tabs>
                                    </div>

                                    {/* 操作按钮 */}
                                    <div className="flex gap-2 pt-4 border-t">
                                        <Button
                                            onClick={handleSave}
                                            disabled={loading}
                                            className="flex-1"
                                        >
                                            <Save className="h-4 w-4 mr-2" />
                                            保存
                                        </Button>
                                        <Button
                                            variant="outline"
                                            onClick={handleCancel}
                                            disabled={loading}
                                        >
                                            取消
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        </motion.div>
                    )}
                </div>
            </div>
        </div>
    )
}

export default function ConfigPage() {
    return (
        <AdminGuard>
            <ConfigPageContent />
        </AdminGuard>
    )
}

