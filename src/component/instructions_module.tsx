
/**
 * 模块 1（可选）：指示说明部分
 *
 * 对应 Word 文档开头的"请放映部主讲人……"段落和两条带项目符号的说明。
 */
export default function InstructionsModule() {
    return (
        <>
            {/* 第一行：请放映部主讲人 + 红色加粗提示 */}
            <p className="MsoNormal">
                <span style={{ fontFamily: "华文宋体" }}>请放映部主讲人</span>
                <b>
                    <u style={{ color: "#C00000", fontSize: "12pt", fontFamily: "华文宋体" }}>
                        在电影周的两周前，即前前一周的周四前
                    </u>
                </b>
            </p>

            {/* 第一条说明 */}
            <p className="MsoNormal list-para">
                <span style={{ fontFamily: "Wingdings", marginRight: "4pt" }}>&#178;</span>
                <span style={{ fontFamily: "华文宋体" }}>
                    填写好此表格，交给
                    <b>宣策部部长</b>
                </span>
            </p>

            {/* 第二条说明 */}
            <p className="MsoNormal list-para">
                <span style={{ fontFamily: "Wingdings", marginRight: "4pt" }}>&#178;</span>
                <span style={{ fontFamily: "华文宋体" }}>
                    并准备好影片放映资源，通过云盘（推荐jCloud）交由
                    <b>放映部部长</b>
                    检查
                </span>
            </p>

            {/* 空行 */}
            <p className="MsoNormal">
                <span style={{ fontFamily: "华文宋体" }}>&nbsp;</span>
            </p>
        </>
    );
}
