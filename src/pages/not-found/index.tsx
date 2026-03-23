import { Link } from "react-router-dom";
import { MoveLeft } from "lucide-react";

const NotFoundPage = () => {
    return (
        <div className="flex items-center justify-center w-full h-screen bg-gray-100">
            <div className="flex flex-col items-center justify-center gap-6 bg-main-primary common-rounded p-14 shadow-2xl w-[480px]">
                {/* Logo */}
                <img src="/brand/logo.png" alt="Brand Logo" className="w-[120px] object-contain" />

                {/* Divider */}
                <div className="w-full h-px bg-main-white/10" />

                {/* 404 */}
                <div className="flex flex-col items-center gap-2">
                    <h1 className="text-8xl font-extrabold text-main-white tracking-tight">
                        404
                    </h1>
                    <p className="text-main-white/60 text-base font-medium">
                        Oops! The page you're looking for doesn't exist.
                    </p>
                </div>

                {/* Back Button */}
                <Link
                    to="/"
                    className="flex items-center gap-2 bg-main-white text-main-primary font-semibold text-sm px-6 py-2.5 common-rounded hover:bg-main-white/90 transition duration-200"
                >
                    <MoveLeft size={16} />
                    Back to Dashboard
                </Link>
            </div>
        </div>
    );
};

export default NotFoundPage;