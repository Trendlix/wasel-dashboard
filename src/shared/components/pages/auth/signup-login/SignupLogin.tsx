import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { formInputClass } from "@/shared/components/common/formStyles";

// ─── Icons ────────────────────────────────────────────────────────────────────

const MailIcon = () => (
    <svg className="size-4 text-main-silverSteel" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25H4.5a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5H4.5a2.25 2.25 0 00-2.25 2.25m19.5 0l-9.75 6.75L2.25 6.75" />
    </svg>
);

const LockIcon = () => (
    <svg className="size-4 text-main-silverSteel" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
    </svg>
);

const UserIcon = () => (
    <svg className="size-4 text-main-silverSteel" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
    </svg>
);

const ArrowRightIcon = () => (
    <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
    </svg>
);

// ─── Schemas ──────────────────────────────────────────────────────────────────

const loginSchema = z.object({
    email: z.string().email("Enter a valid email address"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    remember: z.boolean().optional(),
});

const signupSchema = z.object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    email: z.string().email("Enter a valid email address"),
    password: z.string().min(6, "Password must be at least 6 characters"),
});

type LoginValues = z.infer<typeof loginSchema>;
type SignupValues = z.infer<typeof signupSchema>;

// ─── Component ────────────────────────────────────────────────────────────────

const SignupLogin = () => {
    const [mode, setMode] = useState<"login" | "signup">("login");
    const isLogin = mode === "login";

    const loginForm = useForm<LoginValues>({
        resolver: zodResolver(loginSchema),
        defaultValues: { email: "", password: "", remember: false },
    });

    const signupForm = useForm<SignupValues>({
        resolver: zodResolver(signupSchema),
        defaultValues: { name: "", email: "", password: "" },
    });

    const onLogin = (data: LoginValues) => {
        console.log("Login:", data);
    };

    const onSignup = (data: SignupValues) => {
        console.log("Signup:", data);
    };

    return (
        <div className="min-h-dvh w-full flex">

            {/* ── Left panel ─────────────────────────────────────────────────── */}
            <div
                className="hidden lg:flex flex-col justify-between w-[52%] relative overflow-hidden"
                style={{
                    background: "linear-gradient(160deg, #001f5b 0%, #003a99 50%, #004aad 100%)",
                }}
            >
                {/* Decorative circles */}
                <div className="absolute -top-24 -left-24 w-96 h-96 rounded-full bg-white/5" />
                <div className="absolute top-1/3 -right-32 w-80 h-80 rounded-full bg-main-secondary/10" />
                <div className="absolute -bottom-20 left-1/4 w-64 h-64 rounded-full bg-white/5" />

                {/* Top: logo */}
                <div className="relative z-10 p-10 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-main-secondary flex items-center justify-center">
                        <svg className="size-5 text-main-primary" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M1.5 8.25C1.5 7.422 2.172 6.75 3 6.75h15.75c.828 0 1.5.672 1.5 1.5v9a1.5 1.5 0 01-1.5 1.5H3a1.5 1.5 0 01-1.5-1.5v-9zM21 10.5h.75a1.5 1.5 0 011.5 1.5v4.5a1.5 1.5 0 01-1.5 1.5H21V10.5zM5.25 16.5a2.25 2.25 0 100-4.5 2.25 2.25 0 000 4.5zM15.75 16.5a2.25 2.25 0 100-4.5 2.25 2.25 0 000 4.5z" />
                        </svg>
                    </div>
                    <span className="text-white font-bold text-lg tracking-wide">WASEL FLEET</span>
                </div>

                {/* Middle: headline */}
                <div className="relative z-10 px-10">
                    <p className="text-main-secondary text-xs font-semibold tracking-[0.2em] uppercase mb-4">
                        Kinetic Authority
                    </p>
                    <h1 className="text-5xl font-extrabold text-white leading-tight">
                        Manage your<br />operations<br />
                        <span className="text-main-secondary">smarter</span>
                        <span className="text-white"> & </span>
                        <span className="text-main-secondary">faster.</span>
                    </h1>
                    <div className="w-12 h-1 bg-main-secondary rounded-full mt-5 mb-5" />
                    <p className="text-white/50 text-sm max-w-xs leading-relaxed">
                        Optimizing logistics through real-time telemetry and predictive intelligence.
                    </p>
                </div>

                {/* Bottom: stats */}
                <div className="relative z-10 p-10 flex gap-10">
                    <div>
                        <p className="text-white text-3xl font-extrabold">14.2k</p>
                        <p className="text-white/40 text-xs font-semibold tracking-widest uppercase mt-1">Active Units</p>
                    </div>
                    <div>
                        <p className="text-white text-3xl font-extrabold">99.9%</p>
                        <p className="text-white/40 text-xs font-semibold tracking-widest uppercase mt-1">Uptime Rate</p>
                    </div>
                </div>
            </div>

            {/* ── Right panel ────────────────────────────────────────────────── */}
            <div className="flex-1 flex flex-col bg-white">
                <div className="flex-1 flex items-center justify-center px-8 py-12">
                    <div className="w-full max-w-[420px]">

                        {/* Title */}
                        <h2 className="text-3xl font-extrabold text-main-primary mb-1">
                            {isLogin ? "Welcome Back" : "Create Account"}
                        </h2>
                        <p className="text-main-sharkGray text-sm mb-8">
                            {isLogin
                                ? "Access your fleet management command center."
                                : "Register to join the WASEL admin platform."}
                        </p>

                        {/* Toggle tabs */}
                        <div className="flex rounded-xl border border-main-whiteMarble overflow-hidden mb-8">
                            {(["login", "signup"] as const).map((tab) => (
                                <button
                                    key={tab}
                                    onClick={() => setMode(tab)}
                                    className={cn(
                                        "flex-1 py-2.5 text-sm font-semibold transition-all capitalize",
                                        mode === tab
                                            ? "bg-white text-main-primary shadow-sm"
                                            : "bg-main-titaniumWhite text-main-sharkGray hover:text-main-mirage"
                                    )}
                                >
                                    {tab === "login" ? "Login" : "Register"}
                                </button>
                            ))}
                        </div>

                        {/* ── Login form ── */}
                        {isLogin && (
                            <form onSubmit={loginForm.handleSubmit(onLogin)} className="space-y-5">
                                <InputField
                                    label="WORK EMAIL"
                                    error={loginForm.formState.errors.email?.message}
                                    icon={<MailIcon />}
                                >
                                    <Input
                                        type="email"
                                        placeholder="name@company.com"
                                        className={cn(formInputClass, "bg-main-titaniumWhite pl-10")}
                                        {...loginForm.register("email")}
                                    />
                                </InputField>

                                <div>
                                    <div className="flex justify-between items-center mb-1.5">
                                        <label className="text-xs font-semibold tracking-widest text-main-hydrocarbon uppercase">
                                            Password
                                        </label>
                                        <button type="button" className="text-xs text-main-primary font-semibold hover:underline">
                                            Forgot Password?
                                        </button>
                                    </div>
                                    <div className="relative">
                                        <span className="absolute left-3 top-1/2 -translate-y-1/2"><LockIcon /></span>
                                        <Input
                                            type="password"
                                            placeholder="••••••••"
                                            className={cn(formInputClass, "bg-main-titaniumWhite pl-10")}
                                            {...loginForm.register("password")}
                                        />
                                    </div>
                                    {loginForm.formState.errors.password && (
                                        <p className="text-xs text-main-remove mt-1">{loginForm.formState.errors.password.message}</p>
                                    )}
                                </div>

                                <label className="flex items-center gap-2.5 cursor-pointer select-none">
                                    <input
                                        type="checkbox"
                                        className="w-4 h-4 rounded border-main-whiteMarble accent-main-primary cursor-pointer"
                                        {...loginForm.register("remember")}
                                    />
                                    <span className="text-sm text-main-sharkGray">Keep me logged in on this device</span>
                                </label>

                                <Button
                                    type="submit"
                                    disabled={loginForm.formState.isSubmitting}
                                    className="w-full h-13 bg-main-primary hover:bg-main-primary/90 text-white font-bold text-base rounded-xl flex items-center justify-center gap-2"
                                >
                                    Sign In to Dashboard <ArrowRightIcon />
                                </Button>

                                <Divider label="OR CONTINUE WITH" />

                                <div className="grid grid-cols-2 gap-3">
                                    <SocialButton label="Google" icon={
                                        <svg className="size-4" viewBox="0 0 24 24">
                                            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                                            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                                            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" />
                                            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                                        </svg>
                                    } />
                                    <SocialButton label="SSO" icon={
                                        <svg className="size-4 text-main-gunmetalBlue" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 21h16.5M4.5 3h15M5.25 3v18m13.5-18v18M9 6.75h1.5m-1.5 3h1.5m-1.5 3h1.5m3-6H15m-1.5 3H15m-1.5 3H15M9 21v-3.375c0-.621.504-1.125 1.125-1.125h3.75c.621 0 1.125.504 1.125 1.125V21" />
                                        </svg>
                                    } />
                                </div>
                            </form>
                        )}

                        {/* ── Signup form ── */}
                        {!isLogin && (
                            <form onSubmit={signupForm.handleSubmit(onSignup)} className="space-y-5">
                                <InputField
                                    label="FULL NAME"
                                    error={signupForm.formState.errors.name?.message}
                                    icon={<UserIcon />}
                                >
                                    <Input
                                        type="text"
                                        placeholder="John Doe"
                                        className={cn(formInputClass, "bg-main-titaniumWhite pl-10")}
                                        {...signupForm.register("name")}
                                    />
                                </InputField>

                                <InputField
                                    label="WORK EMAIL"
                                    error={signupForm.formState.errors.email?.message}
                                    icon={<MailIcon />}
                                >
                                    <Input
                                        type="email"
                                        placeholder="name@company.com"
                                        className={cn(formInputClass, "bg-main-titaniumWhite pl-10")}
                                        {...signupForm.register("email")}
                                    />
                                </InputField>

                                <InputField
                                    label="PASSWORD"
                                    error={signupForm.formState.errors.password?.message}
                                    icon={<LockIcon />}
                                >
                                    <Input
                                        type="password"
                                        placeholder="••••••••"
                                        className={cn(formInputClass, "bg-main-titaniumWhite pl-10")}
                                        {...signupForm.register("password")}
                                    />
                                </InputField>

                                <Button
                                    type="submit"
                                    disabled={signupForm.formState.isSubmitting}
                                    className="w-full h-13 bg-main-primary hover:bg-main-primary/90 text-white font-bold text-base rounded-xl flex items-center justify-center gap-2"
                                >
                                    Create Account <ArrowRightIcon />
                                </Button>
                            </form>
                        )}
                    </div>
                </div>

                {/* Footer */}
                <div className="px-8 py-5 border-t border-main-whiteMarble flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-main-silverSteel">
                    <span>© {new Date().getFullYear()} Wasel Fleet Management. All rights reserved.</span>
                    <div className="flex gap-5">
                        {["Privacy Policy", "System Status", "Contact Support"].map((item) => (
                            <button key={item} className="hover:text-main-primary transition-colors">{item}</button>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

const InputField = ({
    label, error, icon, children,
}: {
    label: string;
    error?: string;
    icon: React.ReactNode;
    children: React.ReactNode;
}) => (
    <div>
        <label className="block text-xs font-semibold tracking-widest text-main-hydrocarbon uppercase mb-1.5">
            {label}
        </label>
        <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2">{icon}</span>
            {children}
        </div>
        {error && <p className="text-xs text-main-remove mt-1">{error}</p>}
    </div>
);

const Divider = ({ label }: { label: string }) => (
    <div className="flex items-center gap-3 my-1">
        <div className="flex-1 h-px bg-main-whiteMarble" />
        <span className="text-xs text-main-silverSteel font-medium tracking-widest">{label}</span>
        <div className="flex-1 h-px bg-main-whiteMarble" />
    </div>
);

const SocialButton = ({ label, icon }: { label: string; icon: React.ReactNode }) => (
    <button
        type="button"
        className="flex items-center justify-center gap-2 h-11 rounded-xl border border-main-whiteMarble bg-white hover:bg-main-titaniumWhite transition-colors text-sm font-semibold text-main-gunmetalBlue"
    >
        {icon} {label}
    </button>
);

export default SignupLogin;
