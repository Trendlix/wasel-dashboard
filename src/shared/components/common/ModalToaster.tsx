import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { useEffect } from "react"
import { CheckCircle, XCircle, AlertTriangle, Info } from "lucide-react"

interface ModalToasterProps {
    message: string
    severity: "success" | "error" | "alert" | "info"
    open: boolean
    setOpen: (value: boolean) => void
    duration?: number
}

const ModalToaster = ({
    message,
    severity,
    open,
    setOpen,
    duration = 3000,
}: ModalToasterProps) => {

    useEffect(() => {
        if (!open) return

        const timer = setTimeout(() => {
            setOpen(false)
        }, duration)

        return () => clearTimeout(timer)
    }, [open, duration, setOpen])

    const config = {
        success: {
            color: "text-emerald-900 bg-emerald-50 border-emerald-200",
            icon: <CheckCircle className="w-5 h-5" />,
            title: "Success",
        },
        error: {
            color: "text-rose-900 bg-rose-50 border-rose-200",
            icon: <XCircle className="w-5 h-5" />,
            title: "Error",
        },
        alert: {
            color: "text-amber-900 bg-amber-50 border-amber-200",
            icon: <AlertTriangle className="w-5 h-5" />,
            title: "Warning",
        },
        info: {
            color: "text-cyan-900 bg-cyan-50 border-cyan-200",
            icon: <Info className="w-5 h-5" />,
            title: "Info",
        },
    }

    const current = config[severity]

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent className={`border shadow-2xl rounded-2xl ${current.color}`}>
                <DialogHeader className="flex flex-row gap-3 items-start">
                    <div className="mt-0.5">{current.icon}</div>
                    <div>
                        <DialogTitle className="text-base tracking-tight">{current.title}</DialogTitle>
                        <DialogDescription className="text-inherit leading-relaxed mt-1">
                            {message}
                        </DialogDescription>
                    </div>
                </DialogHeader>
            </DialogContent>
        </Dialog>
    )
}

export default ModalToaster
