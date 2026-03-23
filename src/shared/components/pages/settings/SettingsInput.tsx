import clsx from "clsx";

interface ISettingsInput extends React.InputHTMLAttributes<HTMLInputElement> {
    suffix?: string;
}

const SettingsInput = ({ suffix, className, ...props }: ISettingsInput) => {
    return (
        <div className="relative flex items-center">
            <input
                {...props}
                className={clsx(
                    "w-full h-11 border border-main-whiteMarble common-rounded px-4 text-sm text-main-mirage outline-none",
                    "placeholder:text-main-silverSteel focus:border-main-primary transition-colors bg-main-white",
                    suffix && "pr-10",
                    className
                )}
            />
            {suffix && (
                <span className="absolute right-4 text-main-sharkGray text-sm">{suffix}</span>
            )}
        </div>
    );
};

export default SettingsInput;