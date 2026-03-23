import clsx from "clsx"
import ChartHeader from "./ChartHeader";
import { Link } from "react-router-dom";
import { pendingVerifications, type IPendingVerification } from "../../../core/pages/dashboard";

const Pendingverifications = () => {
    return (
        <div className={clsx("space-y-4", "bg-main-white border border-main-whiteMarble common-rounded p-6 overflow-hidden")}>
            <ChartHeader title="Pending Verifications" no={3} />
            <div className="space-y-2.5">
                {
                    pendingVerifications?.map((item) => (
                        <Item key={item.id} item={item} />
                    ))
                }
            </div>
        </div>
    );
}

const Item = ({ item }: { item: IPendingVerification }) => {
    return (<div className="py-3 px-2 flex items-center justify-between bg-main-luxuryWhite common-rounded">
        <div className="flex items-center gap-3">
            <div className="bg-main-primary w-[40px] h-[40px] p-2.5 rounded-full uppercase text-main-white font-bold text-sm flex items-center justify-center">
                {item.name.slice(0, 2)}
            </div>
            <div className="space-y-1">
                <p className="text-main-mirage font-medium text-base lading-[24px]">{item.name}</p>
                <p className="text-main-sharkGray text-sm font-normal leading-[20px]">{item.role}</p>
            </div>
        </div>
        <div className="gap-y-1 flex items-end justify-end flex-col">
            <p className="text-[12px] leading-[16px] text-main-silverSteel">{item.createdAt.toLocaleString()}</p>
            <Link to="/dashboard/verifications" className="text-main-primary font-medium text-sm leading-[20px] capitalize ">Review</Link>
        </div>
    </div>)
}

export default Pendingverifications;