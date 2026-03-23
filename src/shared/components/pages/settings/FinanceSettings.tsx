import { DollarSign } from "lucide-react";
import { useState } from "react";
import SettingsSectionHeader from "./SettingsSectionHeader";
import SettingsField from "./SettingsField";
import SettingsInput from "./SettingsInput";

const FinanceSettings = () => {
    const [form, setForm] = useState({
        commissionRate: "15",
        platformFee: "138",
        currency: "",
    });

    const set = (key: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) =>
        setForm((prev) => ({ ...prev, [key]: e.target.value }));

    return (
        <div className="bg-main-white border border-main-whiteMarble common-rounded p-6">
            <SettingsSectionHeader
                icon={DollarSign}
                title="Finance Settings"
                iconBg="bg-main-vividMint/10"
                iconColor="text-main-vividMint"
            />

            <div className="flex flex-col gap-5">
                <SettingsField label="Commission Rate (%)" hint="Platform commission on each trip">
                    <SettingsInput
                        type="number"
                        value={form.commissionRate}
                        onChange={set("commissionRate")}
                        suffix="%"
                    />
                </SettingsField>

                <SettingsField label="Platform Fee (EGP)" hint="Fixed fee per transaction">
                    <SettingsInput
                        type="number"
                        value={form.platformFee}
                        onChange={set("platformFee")}
                    />
                </SettingsField>

                <SettingsField label="Currency">
                    <SettingsInput
                        value={form.currency}
                        onChange={set("currency")}
                        placeholder="e.g. EGP"
                    />
                </SettingsField>

                {/* Config Summary */}
                <div className="border border-main-primary/30 bg-main-primary/5 common-rounded p-4">
                    <p className="text-main-primary font-semibold text-sm mb-1">Current Configuration:</p>
                    <p className="text-main-mirage text-sm">
                        {form.commissionRate}% commission + EGP {form.platformFee} platform fee = Driver receives {100 - Number(form.commissionRate)}% of trip fare
                    </p>
                </div>
            </div>
        </div>
    );
};

export default FinanceSettings;