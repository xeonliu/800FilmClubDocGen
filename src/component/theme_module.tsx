
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
                <span className="MsoSubtleReference">
                    这个只需要简单写一小段话就好了，尽量控制在100-300字~
                </span>
            </p>

            <p className="MsoNormal">
                <span className="MsoSubtleReference">
                    例如：为何选择这个主题？希望展示/讲述什么？......
                </span>
            </p>

            <p className="MsoNormal">
                <span style={{ fontFamily: "华文宋体" }}>{themeText}</span>
            </p>
        </>
    );
}
