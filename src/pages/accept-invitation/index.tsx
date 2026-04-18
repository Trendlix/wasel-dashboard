import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import useAuthStore from "@/shared/hooks/store/useAuthStore";
import PageTransition from "@/shared/components/common/PageTransition";
import { resolveFirstAccessiblePath } from "@/shared/utils/rolePages";

const passwordSchema = z.object({
    password: z.string()
        .min(8, "Password must be at least 8 characters")
        .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
            "Password must contain uppercase, lowercase, number and special character"),
    confirmPassword: z.string()
}).refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
});

const totpSchema = z.object({
    totp: z.string().length(6, "Code must be 6 digits"),
});

type PasswordValues = z.infer<typeof passwordSchema>;
type TotpValues = z.infer<typeof totpSchema>;

type Step = "validating" | "set-password" | "twofa-ask" | "twofa-flow" | "success" | "invalid";

const AcceptInvitationPage = () => {
    const inputClassname = "border border-main-whiteMarble p-3! outline-0! ring-0! focus:ring-2 focus:ring-main-primary/50 focus:ring-offset-2 focus:ring-offset-main-primary/20 transition-colors duration-200 h-11 text-base font-medium";

    const [searchParams] = useSearchParams();
    const token = searchParams.get("token");
    const navigate = useNavigate();

    const { validateInvitation, acceptInvitation, setupTwoFaAuthenticated, enableTwoFaAuthenticated, fetchMe } = useAuthStore();

    const [step, setStep] = useState<Step>(() => (token ? "validating" : "invalid"));
    const [loading, setLoading] = useState(false);
    const [userData, setUserData] = useState<{ email: string; name?: string; role_name: string } | null>(null);
    const [twoFaData, setTwoFaData] = useState<{ qr: string; secret: string } | null>(null);

    const passwordForm = useForm<PasswordValues>({
        resolver: zodResolver(passwordSchema),
        defaultValues: { password: "", confirmPassword: "" },
    });

    const totpForm = useForm<TotpValues>({
        resolver: zodResolver(totpSchema),
        defaultValues: { totp: "" },
    });

    const redirectToFirstAllowedPage = async () => {
        await fetchMe();
        const nextProfile = useAuthStore.getState().userProfile;
        const targetPath = resolveFirstAccessiblePath(nextProfile?.role);
        navigate(targetPath, { replace: true });
    };

    useEffect(() => {
        if (!token) {
            return;
        }

        const checkToken = async () => {
            try {
                const data = await validateInvitation(token, setLoading);
                setUserData(data);
                setStep("set-password");
            } catch (err: any) {
                setStep("invalid");
            }
        };

        checkToken();
    }, [token, validateInvitation]);

    const onSetPassword = async (data: PasswordValues) => {
        if (!token) return;
        try {
            await acceptInvitation(token, data.password, setLoading, userData?.name);
            setStep("twofa-ask");
        } catch (err: any) {
            // Error toast handled by axios
        }
    };

    const handleSkip2fa = () => {
        setStep("success");
        setTimeout(() => {
            void redirectToFirstAllowedPage();
        }, 2000);
    };

    const handleStart2fa = async () => {
        try {
            const data = await setupTwoFaAuthenticated(setLoading);
            setTwoFaData({ qr: data.qr, secret: data.secret });
            setStep("twofa-flow");
        } catch (err: any) {
            // Error toast handled by axios
        }
    };

    const onVerifyTotp = async (data: TotpValues) => {
        try {
            await enableTwoFaAuthenticated(data.totp, setLoading);
            setStep("success");
            setTimeout(() => {
                void redirectToFirstAllowedPage();
            }, 2000);
        } catch (err: any) {
            // Error toast handled by axios
        }
    };

    return (
        <PageTransition>
            <div className="min-h-dvh w-full flex select-none">
                <div className="flex-1 relative">
                    <div className="absolute w-full h-full">
                        <img src="/pages/auth/truck.jpg" alt="truck" className="w-full h-full object-cover grayscale-25" />
                        <div className="absolute inset-0 bg-black/50" />
                    </div>
                    <div className="relative z-10 p-8 flex h-full flex-col">
                        <div className="flex-1">
                            <div className="flex items-end gap-3 bg-blue-200/15 common-rounded p-3 w-fit backdrop-blur-2xl">
                                <img src="/brand/logo.png" alt="WASEL FLEET Logo" className="w-20" />
                            </div>
                        </div>
                        <div className="flex-2">
                            <p className="font-bold text-2xl text-main-white/70 mb-4 tracking-wide">WELCOME TO WASEL</p>
                            <h2 className="font-black text-7xl leading-tight">
                                <p>
                                    <span className="text-main-white">
                                        Join the fleet <br />management
                                    </span>
                                    <br />
                                    <span className="text-main-primary font-black">revolution</span>
                                </p>
                            </h2>
                        </div>
                    </div>
                </div>

                <div className="flex-1 flex items-center justify-center px-6 bg-linear-to-tl from-main-primary/5 to-main-primary/0">
                    <div className="common-rounded border border-main-whiteMarble p-10 w-full max-w-xl flex flex-col gap-8 bg-white/50 backdrop-blur-2xl">
                        <div className="flex flex-col items-center gap-3 pb-6 border-b border-main-primary/20">
                            <div className="text-center">
                                <h1 className="text-2xl font-black text-main-primary tracking-wider">WASEL</h1>
                                <p className="text-xs font-bold text-main-primary/70 tracking-widest mt-0.5">FLEET MANAGEMENT</p>
                            </div>
                        </div>

                        {step === "validating" && (
                            <div className="flex flex-col items-center gap-4 py-8 text-center">
                                <div className="w-12 h-12 border-4 border-main-primary border-t-transparent rounded-full animate-spin" />
                                <p className="text-lg font-semibold text-main-primary">Validating your invitation...</p>
                            </div>
                        )}

                        {step === "invalid" && (
                            <div className="text-center flex flex-col gap-6 py-8">
                                <div className="text-main-red text-6xl">⚠️</div>
                                <h2 className="text-2xl font-black text-main-sharkGray">Invalid Invitation</h2>
                                <p className="text-main-sharkGray/70">This link is either expired, already used, or invalid. Please contact your administrator for a new invitation.</p>
                                <Button onClick={() => navigate("/account")} className="w-full bg-main-primary hover:bg-main-primary/90 text-white font-bold py-3 h-[48px]">
                                    Go to Login
                                </Button>
                            </div>
                        )}

                        {step === "set-password" && userData && (
                            <form className="flex flex-col gap-6" onSubmit={passwordForm.handleSubmit(onSetPassword)}>
                                <div className="text-center flex flex-col gap-2">
                                    <h2 className="text-xl font-black text-main-primary">Set Your Password</h2>
                                    <p className="text-sm text-main-sharkGray">
                                        Welcome <span className="font-bold text-main-primary">{userData.name || userData.email}</span>!
                                        You've been invited as <span className="font-bold text-main-primary">{userData.role_name}</span>.
                                    </p>
                                </div>

                                <Field label="New Password" error={passwordForm.formState.errors.password?.message}>
                                    <Input {...passwordForm.register("password")} type="password" placeholder="••••••••" className={inputClassname} />
                                </Field>

                                <Field label="Confirm Password" error={passwordForm.formState.errors.confirmPassword?.message}>
                                    <Input {...passwordForm.register("confirmPassword")} type="password" placeholder="••••••••" className={inputClassname} />
                                </Field>

                                <Button type="submit" disabled={loading} className="w-full bg-main-primary hover:bg-main-primary/90 text-white font-bold text-lg py-3 h-auto transition-all duration-200">
                                    {loading ? "Setting password..." : "Complete Setup"}
                                </Button>
                            </form>
                        )}

                        {step === "twofa-ask" && (
                            <div className="text-center flex flex-col gap-6 py-4">
                                <div className="bg-main-primary/5 p-6 rounded-full w-24 h-24 mx-auto flex items-center justify-center">
                                    <span className="text-4xl">🔐</span>
                                </div>
                                <div className="flex flex-col gap-2">
                                    <h2 className="text-2xl font-black text-main-primary">Secure Your Account</h2>
                                    <p className="text-sm text-main-sharkGray">
                                        We highly recommend enabling Two-Factor Authentication (2FA) for extra security.
                                        Would you like to set it up now?
                                    </p>
                                </div>
                                <div className="flex flex-col gap-3">
                                    <Button onClick={handleStart2fa} disabled={loading} className="w-full bg-main-primary hover:bg-main-primary/90 text-white font-bold text-lg py-3 h-auto">
                                        Yes, Secure my account
                                    </Button>
                                    <button onClick={handleSkip2fa} className="text-main-sharkGray font-semibold hover:text-main-primary transition-colors py-2">
                                        Skip for now
                                    </button>
                                </div>
                            </div>
                        )}

                        {step === "twofa-flow" && twoFaData && (
                            <form className="flex flex-col gap-6" onSubmit={totpForm.handleSubmit(onVerifyTotp)}>
                                <div className="text-center flex flex-col gap-2">
                                    <h2 className="text-xl font-black text-main-primary">Set up 2FA</h2>
                                    <p className="text-sm text-main-sharkGray">Scan the QR code with your authenticator app (e.g. Google Authenticator), then enter the 6-digit code.</p>
                                </div>
                                <div className="flex justify-center">
                                    <img src={twoFaData.qr} alt="2FA QR Code" className="w-48 h-48 common-rounded border border-main-whiteMarble" />
                                </div>
                                <div className="bg-main-titaniumWhite common-rounded p-3 text-center">
                                    <p className="text-xs text-main-sharkGray mb-1">Manual entry key</p>
                                    <p className="font-mono text-sm font-semibold text-main-primary tracking-widest break-all">{twoFaData.secret}</p>
                                </div>
                                <Field label="Verification Code" error={totpForm.formState.errors.totp?.message}>
                                    <Input {...totpForm.register("totp")} placeholder="000000" maxLength={6} className={cn(inputClassname, "text-center tracking-widest text-lg")} />
                                </Field>
                                <Button type="submit" disabled={loading} className="w-full bg-main-primary hover:bg-main-primary/90 text-white font-bold text-lg py-3 h-auto">
                                    {loading ? "Verifying..." : "Enable 2FA & Continue"}
                                </Button>
                            </form>
                        )}

                        {step === "success" && (
                            <div className="text-center flex flex-col gap-6 py-8">
                                <div className="bg-green-100 text-green-600 p-6 rounded-full w-24 h-24 mx-auto flex items-center justify-center text-4xl animate-bounce">
                                    ✓
                                </div>
                                <h2 className="text-2xl font-black text-main-primary">Setup Complete!</h2>
                                <p className="text-main-sharkGray">You're all set. Redirecting you to the dashboard...</p>
                                <div className="w-full bg-main-titaniumWhite h-1.5 rounded-full overflow-hidden">
                                    <div className="bg-main-primary h-full animate-[progress_2s_ease-in-out]" />
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </PageTransition>
    );
};

const Field = ({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) => (
    <div className="flex flex-col gap-2.5">
        <label className="text-base font-semibold text-main-primary">{label}</label>
        {children}
        {error && <p className="text-xs text-main-red font-medium">{error}</p>}
    </div>
);

export default AcceptInvitationPage;
