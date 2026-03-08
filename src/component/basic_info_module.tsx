import type { Info } from "../model/info";

interface Props {
    info: Info;
}

/**
 * 模块 2：基本信息部分
 *
 * h1 + 四行段落：周数、主讲人、主题、主题阐释。
 */
export default function BasicInfoModule({ info }: Props) {
    return (
        <>
            <h1>基本信息</h1>

            <p className="MsoNormal">
                <span style={{ fontFamily: "华文宋体" }}>电影周周数：{info.week}</span>
            </p>

            <p className="MsoNormal">
                <span style={{ fontFamily: "华文宋体" }}>主讲人姓名：{info.speaker}</span>
            </p>

            <p className="MsoNormal">
                <span style={{ fontFamily: "华文宋体" }}>电影周主题：{info.theme}</span>
            </p>

            <p className="MsoNormal">
                <span style={{ fontFamily: "华文宋体" }}>一句对主题的阐释：{info.themeDesc}</span>
            </p>

            <p className="MsoNormal">
                <span style={{ fontFamily: "华文宋体" }}>&nbsp;</span>
            </p>
        </>
    );
}
