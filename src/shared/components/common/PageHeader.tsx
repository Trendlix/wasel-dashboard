interface IPageHeader {
    title: string;
    description: string;
}

const PageHeader: React.FC<IPageHeader> = ({ title, description }) => {
    return (
        <div className="space-y-0">
            <h1 className="text-3xl leading-[36px] font-bold text-main-black animate-wasel-header-title">
                {title}
            </h1>
            <p className="text-main-gunmetalBlue text-base leading-[24px] mt-2 animate-wasel-header-desc">
                {description}
            </p>
        </div>
    );
};

export default PageHeader;