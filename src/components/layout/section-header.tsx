"use client"

import { Separator } from "@/components/ui/separator"
import { motion } from "framer-motion"

interface SectionHeaderProps {
    title: string
    description?: string
    action?: React.ReactNode
}

export function SectionHeader({ title, description, action }: SectionHeaderProps) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-4"
        >
            <div className="flex flex-wrap items-end justify-between gap-4">
                <div className="space-y-2">
                    <h2 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 dark:from-blue-400 dark:via-indigo-400 dark:to-purple-400 bg-clip-text text-transparent sm:text-4xl">
                        {title}
                    </h2>
                    {description ? (
                        <p className="max-w-3xl text-base text-muted-foreground leading-relaxed">{description}</p>
                    ) : null}
                </div>
                {action}
            </div>
            <Separator className="bg-gradient-to-r from-transparent via-border to-transparent" />
        </motion.div>
    )
}


