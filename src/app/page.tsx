import { Calculator } from "@/components/sections/social-security-calculator"
import { SectionHeader } from "@/components/layout/section-header"

export default function Home() {
  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* 动态背景 */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-indigo-50/50 to-purple-50 dark:from-gray-950 dark:via-indigo-950/30 dark:to-purple-950" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(99,102,241,0.15),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(139,92,246,0.15),transparent_50%)]" />
        {/* 网格背景 */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]" />
        {/* 动态光效 */}
        <div className="absolute top-0 left-1/4 h-96 w-96 rounded-full bg-blue-400/20 blur-3xl animate-pulse" />
        <div className="absolute bottom-0 right-1/4 h-96 w-96 rounded-full bg-purple-400/20 blur-3xl animate-pulse delay-1000" />
      </div>

      <div className="relative mx-auto flex w-full max-w-7xl flex-col gap-8 sm:gap-12 px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-16">
        <SectionHeader
          title="中国五险一金自动计算工具"
          description="自动计算中国各地区五险一金（养老、医疗、失业、工伤、生育、公积金）缴纳金额，支持不同地区、不同险种比例、基数上限/下限等多维度参数配置。适用于人力资源、财务、个人用户等场景。"
        />
        <Calculator />
      </div>
    </div>
  )
}
