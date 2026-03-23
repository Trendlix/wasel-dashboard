import { CircleAlert } from "lucide-react"

const Alert = ({ title, description }: { title: string, description: string }) => {
    return (<div className="common-rounded border-2 border-main-mustardGold p-4 flex items-start gap-2.5 bg-main-mustardGold/10">
        <div>
            <CircleAlert className="text-main-mustardGold" />
        </div>
        <div className="space-y-1">
            <p className="font-medium text-base leading-6 text-main-mirage"> {title}</p>
            <p className="text-main-hydrocarbon text-sm leading-4">{description}</p>
        </div>
    </div>)
}

export default Alert;