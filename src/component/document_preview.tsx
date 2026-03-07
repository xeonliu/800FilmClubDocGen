import type { DocumentData } from "../model/document";
import "../styles/document.css";

import InstructionsModule from "./instructions_module";
import BasicInfoModule from "./basic_info_module";
import ScheduleTable from "./schedule";
import ThemeModule from "./theme_module";
import SalonModule from "./salon_module";
import WeekendCinemaModule from "./weekend_cinema_module";

interface Props {
    data: DocumentData;
}

/**
 * 完整文档预览组件
 *
 * 将六个模块渲染在 A4 页面容器中，屏幕上以纸张阴影效果呈现，
 * 打印/导出 PDF 时自动套用 @page 尺寸与分页规则。
 *
 * 布局示意：
 *   ┌──────────────────────────────┐
 *   │  模块 1：指示说明（可选）       │
 *   │  模块 2：基本信息              │
 *   │  模块 3：放映安排              │
 *   │  模块 4：关于电影周主题         │
 *   ├── ── ── 分页线 ── ── ── ──── ┤
 *   │  模块 5：周五沙龙              │
 *   │  模块 6：周末影院              │
 *   └──────────────────────────────┘
 */
export default function DocumentPreview({ data }: Props) {
    const { showInstructions = true, info, schedule, themeText, salonQuote, salonReview } = data;

    // 沙龙篇目（isSalon === true）
    const salonMovie = schedule.movies.find((m) => m.isSalon);
    // 周末影院篇目（非沙龙）
    const weekendMovies = schedule.movies.filter((m) => !m.isSalon);

    return (
        <div className="doc-viewer">
            <div className="doc-page">
                {/* ── 模块 1：指示说明（可选） ─────────────────── */}
                {showInstructions && <InstructionsModule />}

                {/* ── 模块 2：基本信息 ─────────────────────────── */}
                <BasicInfoModule info={info} />

                {/* ── 模块 3：放映安排 ─────────────────────────── */}
                <ScheduleTable schedule={schedule} />

                {/* ── 模块 4：关于电影周主题 ───────────────────── */}
                <ThemeModule themeText={themeText} />

                {/* ── 分页线（屏幕可见，打印时隐藏并由 break-before 接管） */}
                <div className="doc-page-break-screen" aria-hidden="true">
                    — 分页 —
                </div>

                {/* ── 模块 5：周五沙龙 ─────────────────────────── */}
                {salonMovie && (
                    <SalonModule
                        movie={salonMovie}
                        quote={salonQuote}
                        review={salonReview}
                    />
                )}

                <p className="MsoNormal">
                    <span style={{ fontFamily: "华文宋体" }}>&nbsp;</span>
                </p>

                {/* ── 模块 6：周末影院 ─────────────────────────── */}
                {weekendMovies.length > 0 && (
                    <WeekendCinemaModule movies={weekendMovies} />
                )}
            </div>
        </div>
    );
}
