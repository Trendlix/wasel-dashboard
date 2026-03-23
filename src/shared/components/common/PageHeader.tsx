interface IPageHeader {
    title: string;
    description: string;
}

const PageHeader: React.FC<IPageHeader> = ({ title, description }) => {
    return (
        <div>
            <h1 className="text-3xl leading-[36px] font-bold text-main-black">{title}</h1>
            <p className="text-main-gunmetalBlue text-base leading-[24px] mt-2">{description}</p>
        </div>
    );
}

export default PageHeader;