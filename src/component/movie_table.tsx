import React from "react";
import type { Movie } from "../model/movie";

interface MovieTableProps {
  movie: Movie;
  /**
   * 'salon'  — 沙龙篇目表格（左列 78.25pt，右列 341.7pt）
   * 'regular'— 周末影院表格（左列 85.3pt，右列 334.6pt，默认）
   */
  variant?: "salon" | "regular";
}

/**
 * 电影信息表格组件
 * 根据 variant 切换列宽，完美还原 Word 文档样式。
 */
export default function MovieTable({ movie, variant = "regular" }: MovieTableProps) {
    const isSalon = variant === "salon";
    const labelWidth = isSalon ? "78.25pt" : "85.3pt";
    const valueWidth = isSalon ? "341.7pt" : "334.6pt";
    const labelPadLeft = isSalon ? "2.85pt" : "5.4pt";

    const labelStyle: React.CSSProperties = {
        width: labelWidth,
        borderTop: "none",
        borderLeft: "none",
        borderBottom: "solid windowtext 1.0pt",
        borderRight: "solid windowtext 1.0pt",
        padding: `0 5.4pt 0 ${labelPadLeft}`,
        height: "21.25pt",
    };
    const valueStyle: React.CSSProperties = {
        width: valueWidth,
        border: "none",
        borderBottom: "solid windowtext 1.0pt",
        padding: `0 5.4pt 0 ${labelPadLeft}`,
        height: "21.25pt",
    };
    const labelStyleLast: React.CSSProperties = {
        ...labelStyle,
        borderBottom: "none",
    };
    const valueStyleLast: React.CSSProperties = {
        width: valueWidth,
        border: "none",
        padding: `0 5.4pt 0 ${labelPadLeft}`,
        height: "21.25pt",
        verticalAlign: "top",
    };

    const rows: { label: string; value: React.ReactNode }[] = [
        { label: "中文名", value: <span style={{ fontFamily: "华文楷体" }}>{movie.chinese}</span> },
        { label: "外文名", value: <span style={{ fontFamily: "华文楷体" }}>{movie.foreign}</span> },
        { label: "年份", value: <span style={{ fontFamily: "华文楷体" }}>{movie.year}</span> },
        { label: "导演", value: <span style={{ fontFamily: "华文楷体" }}>{movie.director}</span> },
        { label: "编剧", value: <span style={{ fontFamily: "华文楷体" }}>{movie.writer}</span> },
        { label: "主演", value: <span style={{ fontFamily: "华文楷体" }}>{movie.actors}</span> },
        { label: "类型", value: <span style={{ fontFamily: "华文楷体" }}>{movie.genre}</span> },
        { label: "制片地区/国家", value: <span style={{ fontFamily: "华文楷体" }}>{movie.region}</span> },
        {
            label: "片长",
            value: (
                <>
                    <span style={{ fontFamily: "华文楷体" }}>{movie.length}</span>
                    <span style={{ fontFamily: "华文楷体" }}>分钟</span>
                </>
            ),
        },
        { label: "豆瓣评分", value: <span style={{ fontFamily: "华文楷体" }}>{movie.douban}</span> },
        { label: "剧情简介", value: <span style={{ fontFamily: "华文宋体" }}>{movie.desc}</span> },
    ];

    return (
        <table
            className="MsoTableGrid"
            border={0}
            cellSpacing={0}
            cellPadding={0}
            style={{ marginLeft: "-.25pt", borderCollapse: "collapse", border: "none" }}
        >
            <tbody>
                {rows.map(({ label, value }) => (
                    <tr key={label} style={{ height: "21.25pt" }}>
                        <td style={labelStyle}>
                            <p className="MsoNormal" style={{ textAlign: "right", fontFamily: "华文宋体" }}>
                                {label}
                            </p>
                        </td>
                        <td style={valueStyle}>
                            <p className="MsoNormal" style={{ textAlign: "right", fontFamily: "华文宋体" }}>
                                {value}
                            </p>
                        </td>
                    </tr>
                ))}
                {/* 豆瓣短评 — 最后一行，无下边框，左对齐 */}
                <tr style={{ height: "21.25pt" }}>
                    <td style={labelStyleLast}>
                        <p className="MsoNormal" style={{ textAlign: "right", fontFamily: "华文宋体" }}>
                            豆瓣短评
                        </p>
                    </td>
                    <td style={valueStyleLast}>
                        <p
                            className="MsoNormal"
                            style={{
                                textAlign: "left",
                                lineHeight: "12pt",
                                background: "white",
                                fontFamily: "华文黑体",
                                fontSize: "10.0pt",
                                color: "black",
                            }}
                        >
                            {movie.short}
                        </p>
                    </td>
                </tr>
            </tbody>
        </table>
    );
}