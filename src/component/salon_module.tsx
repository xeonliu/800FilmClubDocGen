import { Fragment } from "react";
import type { Movie } from "../model/movie";
import MovieTable from "./movie_table";

interface Props {
    /** 沙龙篇目电影信息 */
    movie: Movie;
    /** 居中引言（台词） */
    quote: string;
    /** 2-3 段导赏文字 */
    review: string[];
}

/**
 * 模块 5：周五沙龙
 *
 * 本模块在打印时独立分页（break-before: page）。
 * 包含：
 *   h1: 周五沙龙
 *   h2: 一、沙龙篇目电影基本信息：
 *   电影信息表格（salon 变体）
 *   h2: 二、沙龙导赏：
 *   居中引言
 *   2-3 段导赏正文
 */
export default function SalonModule({ movie, quote, review }: Props) {
    return (
        /* doc-page-break-print：打印时在此处强制分页 */
        <div className="doc-page-break-print">
            <h1>周五沙龙</h1>

            <p className="MsoNormal">
                <span style={{ fontFamily: "华文宋体" }}>&nbsp;</span>
            </p>

            <h2>一、沙龙篇目电影基本信息：</h2>

            <p className="MsoNormal">
                <span style={{ fontFamily: "华文宋体" }}>&nbsp;</span>
            </p>

            <MovieTable movie={movie} variant="salon" />

            <p className="MsoNormal">
                <span style={{ fontFamily: "华文仿宋" }}>&nbsp;</span>
            </p>

            <h2>二、沙龙导赏：</h2>

            <p className="MsoNormal">
                <span style={{ fontFamily: "华文宋体" }}>&nbsp;</span>
            </p>

            {/* 居中引言 */}
            <p className="MsoNormal salon-quote">
                <span style={{ fontFamily: "华文仿宋" }}>{quote}</span>
            </p>

            <p className="MsoNormal">
                <span style={{ fontFamily: "华文宋体" }}>&nbsp;</span>
            </p>

            {/* 导赏正文段落 */}
            {review.map((para, idx) => (
                <Fragment key={idx}>
                    <p className="MsoNormal">
                        <span style={{ fontFamily: "华文宋体" }}>{para}</span>
                    </p>
                    {idx < review.length - 1 && (
                        <p className="MsoNormal">
                            <span style={{ fontFamily: "华文宋体" }}>&nbsp;</span>
                        </p>
                    )}
                </Fragment>
            ))}
        </div>
    );
}
