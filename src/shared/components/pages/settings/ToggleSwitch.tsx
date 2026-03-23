import clsx from "clsx";

interface IToggleSwitch {
    enabled: boolean;
    onChange: (val: boolean) => void;
}

const ToggleSwitch = ({ enabled, onChange }: IToggleSwitch) => {
    return (
        <button
            type="button"
            role="switch"
            aria-checked={enabled}
            onClick={() => onChange(!enabled)}
            className={clsx(
                "relative w-12 h-6 rounded-full transition-colors duration-200 shrink-0",
                enabled ? "bg-main-primary" : "bg-main-silverSteel/40"
            )}
        >
            <span
                className={clsx(
                    "absolute top-1 w-4 h-4 bg-main-white rounded-full shadow transition-all duration-200",
                    enabled ? "left-7" : "left-1"
                )}
            />
        </button>
    );
};

export default ToggleSwitch;