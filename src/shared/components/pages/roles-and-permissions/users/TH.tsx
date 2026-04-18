import React from "react";

const TH = ({ children }: { children: React.ReactNode }) => (
    <th className="text-main-hydrocarbon font-semibold text-sm py-4 px-6 text-left whitespace-nowrap">
        {children}
    </th>
);

export default TH;
