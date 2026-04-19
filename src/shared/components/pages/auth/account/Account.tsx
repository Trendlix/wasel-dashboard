import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { formInputClass } from "@/shared/components/common/formStyles";
import useAuthStore, { CreateAccountCase } from "@/shared/hooks/store/useAuthStore";
import { resolveFirstAccessiblePath } from "@/shared/utils/rolePages";

const loginSchema = z.object({
    email: z.string().email("Invalid email address"),
    password: z.string().min(6, "Password must be at least 6 characters"),
});

const signupSchema = z.object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    email: z.string().email("Invalid email address"),
    password: z.string().min(6, "Password must be at least 6 characters"),
});

const totpSchema = z.object({
    totp: z.string().length(6, "Code must be 6 digits"),
});

type LoginValues = z.infer<typeof loginSchema>;
type SignupValues = z.infer<typeof signupSchema>;
type TotpValues = z.infer<typeof totpSchema>;
type Screen = "form" | "twofa-setup" | "twofa-verify";

const Account = () => {
    const inputClassname = formInputClass;
    const [mode, setMode] = useState<"login" | "signup">("login");
    const [screen, setScreen] = useState<Screen>("form");
    const [loading, setLoading] = useState(false);
    const isLogin = mode === "login";

    const navigate = useNavigate();
    const { createAccount, verifyTwoFa, twoFaSetupData, fetchMe } = useAuthStore();

    const loginForm = useForm<LoginValues>({
        resolver: zodResolver(loginSchema),
        defaultValues: { email: "", password: "" },
    });

    const signupForm = useForm<SignupValues>({
        resolver: zodResolver(signupSchema),
        defaultValues: { name: "", email: "", password: "" },
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

    const handleCreateAccount = async (email: string, password: string, name?: string) => {
        try {
            const result = await createAccount(email, password, setLoading, name);

            if (result === CreateAccountCase.LOGIN_SUCCESS) {
                await redirectToFirstAllowedPage();
            } else if (result === CreateAccountCase.TWOFA_SETUP_REQUIRED) {
                setScreen("twofa-setup");
            } else if (result === CreateAccountCase.TWOFA_VERIFICATION_REQUIRED) {
                setScreen("twofa-verify");
            }
        } catch (err: unknown) {
            if (import.meta.env.DEV) console.error(err);
        } finally {
            if (name) {
                signupForm.reset();
            } else {
                loginForm.reset();
            }
        }
    };

    const onLogin = (data: LoginValues) => handleCreateAccount(data.email, data.password);
    const onSignup = (data: SignupValues) => handleCreateAccount(data.email, data.password, data.name);

    const onVerifyTotp = async (data: TotpValues) => {
        try {
            await verifyTwoFa(data.totp, setLoading);
            await redirectToFirstAllowedPage();
        } catch (err: unknown) {
            if (import.meta.env.DEV) console.error(err);
        } finally {
            totpForm.reset();
        }
    };

    const handleModeSwitch = (nextMode: "login" | "signup") => {
        setMode(nextMode);
        loginForm.reset();
        signupForm.reset();
    };

    return (
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
                        <p className="font-bold text-2xl text-main-white/70 mb-4 tracking-wide">KINETIC AUTHORITY</p>
                        <h2 className="font-black text-7xl leading-tight">
                            <p>
                                <span className="text-main-white">
                                    Manage your <br />operations
                                </span>
                                <br />
                                <span className="text-main-primary font-black">smarter</span> <span className="text-main-white font-black">&</span> <span className="text-main-primary font-black">faster</span>
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
                    {screen === "twofa-setup" && twoFaSetupData && (
                        <form className="flex flex-col gap-6" onSubmit={totpForm.handleSubmit(onVerifyTotp)}>
                            <div className="text-center flex flex-col gap-2">
                                <h2 className="text-xl font-black text-main-primary">Set up Two-Factor Authentication</h2>
                                <p className="text-sm text-main-sharkGray">Scan the QR code with your authenticator app, then enter the 6-digit code.</p>
                            </div>
                            <div className="flex justify-center">
                                <img src={twoFaSetupData.qr} alt="2FA QR Code" className="w-48 h-48 common-rounded border border-main-whiteMarble" />
                            </div>
                            <div className="bg-main-titaniumWhite common-rounded p-3 text-center">
                                <p className="text-xs text-main-sharkGray mb-1">Manual entry key</p>
                                <p className="font-mono text-sm font-semibold text-main-primary tracking-widest break-all">{twoFaSetupData.secret}</p>
                            </div>
                            <Field label="Verification Code" error={totpForm.formState.errors.totp?.message}>
                                <Input {...totpForm.register("totp")} placeholder="000000" maxLength={6} className={cn(inputClassname, "text-center tracking-widest text-lg")} />
                            </Field>
                            <Button type="submit" disabled={loading} className="w-full bg-main-primary hover:bg-main-primary/90 text-white font-bold text-lg py-3 h-auto transition-all duration-200 shadow-md">
                                {loading ? "Verifying..." : "Activate Account"}
                            </Button>
                        </form>
                    )}
                    {screen === "twofa-verify" && (
                        <form className="flex flex-col gap-6" onSubmit={totpForm.handleSubmit(onVerifyTotp)}>
                            <div className="text-center flex flex-col gap-2">
                                <h2 className="text-xl font-black text-main-primary">Two-Factor Authentication</h2>
                                <p className="text-sm text-main-sharkGray">Enter the 6-digit code from your authenticator app to continue.</p>
                            </div>
                            <Field label="Verification Code" error={totpForm.formState.errors.totp?.message}>
                                <Input {...totpForm.register("totp")} placeholder="000000" maxLength={6} className={cn(inputClassname, "text-center tracking-widest text-lg")} />
                            </Field>
                            <Button type="submit" disabled={loading} className="w-full bg-main-primary hover:bg-main-primary/90 text-white font-bold text-lg py-3 h-auto transition-all duration-200 shadow-md">
                                {loading ? "Verifying..." : "Verify & Login"}
                            </Button>
                            <button type="button" onClick={() => setScreen("form")} className="text-center text-sm text-main-primary/70 hover:underline">
                                Back to login
                            </button>
                        </form>
                    )}
                    {screen === "form" && (
                        <>
                            <div dir="ltr" className="flex gap-3 bg-main-primary/10 p-1.5 common-rounded">
                                <button
                                    type="button"
                                    onClick={() => handleModeSwitch("login")}
                                    className={cn(
                                        "flex-1 py-2.5 px-4 font-semibold text-base transition-all duration-200 common-rounded",
                                        isLogin ? "bg-main-primary text-white shadow-lg" : "text-main-primary hover:bg-main-primary/5"
                                    )}
                                >
                                    Login
                                </button>
                                <button
                                    type="button"
                                    onClick={() => handleModeSwitch("signup")}
                                    className={cn(
                                        "flex-1 py-2.5 px-4 font-semibold text-base transition-all duration-200 common-rounded",
                                        !isLogin ? "bg-main-primary text-white shadow-lg" : "text-main-primary hover:bg-main-primary/5"
                                    )}
                                >
                                    Sign Up
                                </button>
                            </div>
                            <form className="flex flex-col gap-6">
                                {isLogin ? (
                                    <>
                                        <Field label="Email" error={loginForm.formState.errors.email?.message}>
                                            <Input {...loginForm.register("email")} placeholder="Enter your email" className={inputClassname} />
                                        </Field>
                                        <Field label="Password" error={loginForm.formState.errors.password?.message}>
                                            <Input {...loginForm.register("password")} type="password" placeholder="Enter your password" className={inputClassname} />
                                        </Field>
                                        <Button onClick={loginForm.handleSubmit(onLogin)} disabled={loading} className="w-full bg-main-primary hover:bg-main-primary/90 text-white font-bold text-lg py-3 h-auto transition-all duration-200 shadow-md">
                                            {loading ? "Logging in..." : "Login"}
                                        </Button>
                                    </>
                                ) : (
                                    <>
                                        <Field label="Name" error={signupForm.formState.errors.name?.message}>
                                            <Input {...signupForm.register("name")} placeholder="Enter your name" className={inputClassname} />
                                        </Field>
                                        <Field label="Email" error={signupForm.formState.errors.email?.message}>
                                            <Input {...signupForm.register("email")} placeholder="Enter your email" className={inputClassname} />
                                        </Field>
                                        <Field label="Password" error={signupForm.formState.errors.password?.message}>
                                            <Input {...signupForm.register("password")} type="password" placeholder="Enter your password" className={inputClassname} />
                                        </Field>
                                        <Button onClick={signupForm.handleSubmit(onSignup)} disabled={loading} className="w-full bg-main-primary hover:bg-main-primary/90 text-white font-bold text-lg py-3 h-auto transition-all duration-200 shadow-md">
                                            {loading ? "Creating account..." : "Sign Up"}
                                        </Button>
                                    </>
                                )}
                            </form>
                            <p className="text-center text-sm font-medium text-main-primary/70">
                                {isLogin ? "Don't have an account? " : "Already have an account? "}
                                <button
                                    type="button"
                                    onClick={() => handleModeSwitch(isLogin ? "signup" : "login")}
                                    className="text-main-primary font-semibold hover:underline transition-all"
                                >
                                    {isLogin ? "Sign Up" : "Login"}
                                </button>
                            </p>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

const Field = ({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) => (
    <div className="flex flex-col gap-2.5">
        <label className="text-base font-semibold text-main-primary">{label}</label>
        {children}
        {error && <p className="text-xs text-main-red font-medium">{error}</p>}
    </div>
);

export default Account;
