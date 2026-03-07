import type { Info } from "./info";
import type { Schedule } from "./schedule";

/**
 * 完整文档数据结构，对应六个模块：
 *  1. 指示说明（可选）
 *  2. 基本信息
 *  3. 放映安排
 *  4. 关于电影周主题
 *  5. 周五沙龙
 *  6. 周末影院
 */
export interface DocumentData {
  /** 是否显示模块1指示说明（默认 true） */
  showInstructions?: boolean;
  /** 模块2：基本信息 */
  info: Info;
  /** 模块3+5+6：放映安排（isSalon=true 的为沙龙篇目） */
  schedule: Schedule;
  /** 模块4：关于电影周主题的段落文字 */
  themeText: string;
  /** 模块5：沙龙篇目导赏——居中台词/引言 */
  salonQuote: string;
  /** 模块5：沙龙篇目导赏——2-3 段导赏文字 */
  salonReview: string[];
}
