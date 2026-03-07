
interface Props {
    themeText: string;
}

/**
 * 模块 4：关于电影周主题
 *
 * h1 + 正文段落（100-300 字左右的主题阐释）。
 */
export default function ThemeModule({ themeText }: Props) {
    return (
        <>
            <h1>关于电影周主题</h1>

            <p className="MsoNormal">
                <span style={{ fontFamily: "华文宋体" }}>{themeText}</span>
            </p>
        </>
    );
}
