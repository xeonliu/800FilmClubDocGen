import { useState, useCallback, useEffect, useMemo, useRef } from "react";
import {
  ChevronDownIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  GlobeIcon,
  InfoIcon,
  PlusIcon,
  PrinterIcon,
  FileTextIcon,
  RotateCcwIcon,
  HelpCircleIcon,
  Trash2Icon,
  XIcon,
} from "lucide-react";
import DateSelect from "./date_select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import type { EditorFormData, EditorMovieData } from "../model/editor";
import type { Movie, MovieWithSchedule } from "../model/movie";
import type { DocumentData } from "../model/document";
import { createEmptyMovie } from "../utils/editor_utils";
import { formatChineseDateDisplay, isoDateToWeekday } from "../utils/date_format";
import MovieImportModal from "./movie_import_modal";
import TimeSelect from "./time_select";

const PANEL_WIDTH_KEY = "800_FILM_CLUB_PANEL_WIDTH";
const PANEL_MIN_WIDTH = 320;
const PANEL_MAX_WIDTH = 760;
const PANEL_DEFAULT_WIDTH = 420;

interface EditorPanelProps {
  data: EditorFormData;
  documentData: DocumentData;
  onChange: (data: EditorFormData) => void;
  onReset: () => void;
  collapsed: boolean;
  onToggleCollapse: () => void;
  activeTab?: "doc" | "report";
  onOpenTour?: () => void;
}

/** 可折叠区块 */
function Section({
  title,
  children,
  defaultOpen = true,
}: {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <Collapsible
      open={open}
      onOpenChange={setOpen}
      className="mb-3 overflow-hidden rounded-xl border bg-card shadow-xs"
    >
      <CollapsibleTrigger className="flex w-full items-center gap-2 bg-muted/60 px-3 py-2 text-left text-[13px] font-semibold transition-colors hover:bg-muted">
        <ChevronDownIcon
          className={cn(
            "size-4 shrink-0 text-muted-foreground transition-transform",
            !open && "-rotate-90"
          )}
        />
        <span>{title}</span>
      </CollapsibleTrigger>
      <CollapsibleContent>
        <div className="flex flex-col gap-3 p-3">{children}</div>
      </CollapsibleContent>
    </Collapsible>
  );
}

/** 表单项：标签 + 控件 */
function Field({
  label,
  tip,
  className,
  children,
}: {
  label: string;
  tip?: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div className={cn("flex min-w-0 flex-col gap-1.5", className)}>
      <Label className="text-xs text-muted-foreground">
        {label}
        {tip && (
          <Tooltip>
            <TooltipTrigger asChild>
              <InfoIcon className="size-3.5 cursor-help text-primary/70" />
            </TooltipTrigger>
            <TooltipContent className="max-w-64">{tip}</TooltipContent>
          </Tooltip>
        )}
      </Label>
      {children}
    </div>
  );
}

function Hint({ children }: { children: React.ReactNode }) {
  return <p className="text-xs leading-relaxed text-muted-foreground">{children}</p>;
}

/** 单部影片的编辑区块 */
function MovieEditor({
  movie,
  index,
  onChange,
  onRemove,
}: {
  movie: EditorMovieData;
  index: number;
  onChange: (m: EditorMovieData) => void;
  onRemove: () => void;
}) {
  const [importModalOpen, setImportModalOpen] = useState(false);

  function set<K extends keyof EditorMovieData>(key: K, value: EditorMovieData[K]) {
    onChange({ ...movie, [key]: value });
  }

  function handleImport(partial: Partial<Movie>) {
    onChange({ ...movie, ...partial });
  }

  const movieLabel = movie.chinese ? movie.chinese : `篇目 ${index + 1}`;

  const fields = [
    { key: "chinese", label: "中文名", hint: "电影中文名称" },
    { key: "foreign", label: "外文名", hint: "原片名或英文名" },
    { key: "year", label: "年份", hint: "上映年份，如 1984" },
    { key: "director", label: "导演", hint: "多人用 / 分隔" },
    { key: "writer", label: "编剧", hint: "多人用 / 分隔" },
    { key: "actors", label: "主演", hint: "多人用 / 分隔" },
    { key: "genre", label: "类型", hint: "如 剧情 / 战争" },
    { key: "region", label: "地区", hint: "如 中国大陆" },
    { key: "length", label: "片长(分钟)", hint: "如 120" },
    { key: "douban", label: "豆瓣评分", hint: "如 9.1" },
  ] as { key: keyof EditorMovieData; label: string; hint: string }[];

  return (
    <div className="flex flex-col gap-3 rounded-xl border bg-muted/30 p-3">
      <div className="flex items-center justify-between gap-2">
        <div className="flex min-w-0 items-center gap-2">
          <Badge variant={movie.isSalon ? "default" : "secondary"}>
            {movie.isSalon ? "沙龙" : "放映"}
          </Badge>
          <span className="truncate text-[13px] font-semibold">{movieLabel}</span>
        </div>
        <div className="flex shrink-0 items-center gap-2">
          <Label className="cursor-pointer text-xs" title="标记为周五沙龙篇目">
            <Checkbox
              checked={movie.isSalon}
              onCheckedChange={(v) => set("isSalon", v === true)}
            />
            沙龙
          </Label>
          <Button
            variant="ghost"
            size="icon-sm"
            className="text-muted-foreground hover:text-destructive"
            onClick={onRemove}
            title="删除此篇目"
            aria-label="删除此篇目"
          >
            <Trash2Icon />
          </Button>
        </div>
      </div>

      {/* 放映时间 */}
      <div className="grid grid-cols-3 gap-2">
        <Field label="放映日期">
          <DateSelect
            value={movie.showDate}
            onChange={(date) => set("showDate", date)}
          />
        </Field>
        <Field label="开始时间">
          <TimeSelect
            value={movie.startTime}
            onChange={(v) => set("startTime", v)}
          />
        </Field>
        <Field label="结束时间">
          <TimeSelect value={movie.endTime} onChange={(v) => set("endTime", v)} />
        </Field>
      </div>

      <Button
        variant="outline"
        size="sm"
        className="w-full border-dashed text-primary"
        onClick={() => setImportModalOpen(true)}
        title="从豆瓣/TMDB/IMDB导入电影信息"
      >
        <GlobeIcon />
        从网络导入电影信息
      </Button>

      {/* 电影基本信息字段 */}
      <div className="grid grid-cols-2 gap-2">
        {fields.map(({ key, label, hint }) => (
          <Field key={key} label={label}>
            <Input
              className="h-7 text-xs md:text-xs"
              placeholder={hint}
              value={movie[key] as string}
              onChange={(e) => set(key, e.target.value)}
            />
          </Field>
        ))}
      </div>

      <Field label="剧情简介">
        <Textarea
          className="text-xs md:text-xs"
          placeholder="剧情概述，约100字"
          rows={3}
          value={movie.desc}
          onChange={(e) => set("desc", e.target.value)}
        />
      </Field>

      <Field label="豆瓣短评">
        <Textarea
          className="text-xs md:text-xs"
          placeholder="豆瓣热门短评一则"
          rows={2}
          value={movie.short}
          onChange={(e) => set("short", e.target.value)}
        />
      </Field>

      {/* 报备表字段：获奖信息 / 推荐理由 / 放映风险 */}
      <Field label="获奖信息">
        <Input
          className="h-7 text-xs md:text-xs"
          placeholder='所获主要奖项，如无则填"无"'
          value={movie.awards}
          onChange={(e) => set("awards", e.target.value)}
        />
      </Field>

      <Field
        label="推荐理由"
        tip="请从所获奖项、影视地位、艺术解读等角度阐述选片的原因（仅用于报备表）"
      >
        <Textarea
          className="text-xs md:text-xs"
          placeholder="请从所获奖项、影视地位、艺术解读等角度阐述选片的原因"
          rows={3}
          value={movie.recommendation}
          onChange={(e) => set("recommendation", e.target.value)}
        />
      </Field>

      <Field
        label="放映风险"
        tip="1）查找并附上该电影可放映的所有官方渠道（如爱奇艺、腾讯视频、bilibili）；2）若无在线正版播放渠道，可查找官方电影节或电影资料馆的公映记录；3）如以上均无，请对电影主题、镜头、台词等可能存在的风险进行预判（仅用于报备表）"
      >
        <Textarea
          className="text-xs md:text-xs"
          placeholder="附上官方放映渠道链接，或说明放映风险"
          rows={2}
          value={movie.risk}
          onChange={(e) => set("risk", e.target.value)}
        />
      </Field>

      {/* 沙龙专属字段：引言与导赏 */}
      {movie.isSalon && (
        <div className="flex flex-col gap-3 rounded-lg border border-primary/30 bg-primary/5 p-3">
          <Field label="沙龙引言">
            <Input
              className="h-7 text-xs md:text-xs"
              placeholder="一句电影中的台词..."
              value={movie.salonQuote || ""}
              onChange={(e) => set("salonQuote", e.target.value)}
            />
          </Field>
          <Field label="沙龙导赏正文">
            {(movie.salonReview || [""]).map((text, idx) => (
              <div key={idx} className="flex gap-1.5">
                <Textarea
                  className="flex-1 text-xs md:text-xs"
                  placeholder={`第 ${idx + 1} 段导赏文字...`}
                  rows={3}
                  value={text}
                  onChange={(e) => {
                    const next = [...(movie.salonReview || [""])];
                    next[idx] = e.target.value;
                    set("salonReview", next);
                  }}
                />
                <Button
                  variant="ghost"
                  size="icon-sm"
                  className="text-muted-foreground hover:text-destructive"
                  aria-label="删除此段"
                  onClick={() => {
                    const next = (movie.salonReview || [""]).filter(
                      (_, i) => i !== idx
                    );
                    set("salonReview", next.length ? next : [""]);
                  }}
                >
                  <XIcon />
                </Button>
              </div>
            ))}
            <Button
              variant="outline"
              size="sm"
              className="self-start"
              onClick={() =>
                set("salonReview", [...(movie.salonReview || [""]), ""])
              }
            >
              <PlusIcon />
              添加导赏段落
            </Button>
          </Field>
        </div>
      )}

      {importModalOpen && (
        <MovieImportModal
          onImport={handleImport}
          onClose={() => setImportModalOpen(false)}
        />
      )}
    </div>
  );
}

const ORDINAL = ["一", "二", "三", "四", "五"];

function normalizeText(value?: string): string {
  const trimmed = value?.trim();
  return trimmed ? trimmed : "—";
}

function formatDuration(value: string): string {
  const trimmed = value.trim();
  return trimmed ? `${trimmed}分钟` : "—";
}

function formatDocMovieDetails(movie: MovieWithSchedule): string {
  const lines = [
    `中文名：${normalizeText(movie.chinese)}`,
    `外文名：${normalizeText(movie.foreign)}`,
    `年份：${normalizeText(movie.year)}`,
    `导演：${normalizeText(movie.director)}`,
    `编剧：${normalizeText(movie.writer)}`,
    `主演：${normalizeText(movie.actors)}`,
    `类型：${normalizeText(movie.genre)}`,
    `制片地区/国家：${normalizeText(movie.region)}`,
    `片长：${formatDuration(movie.length)}`,
    `豆瓣评分：${normalizeText(movie.douban)}`,
    `剧情简介：${normalizeText(movie.desc)}`,
    `豆瓣短评：${normalizeText(movie.short)}`,
  ];
  return lines.join("\n");
}

function formatReportMovieDetails(movie: MovieWithSchedule): string {
  const awards = movie.awards.trim() ? movie.awards.trim() : "无";
  const lines = [
    `中文名：${normalizeText(movie.chinese)}`,
    `外文名：${normalizeText(movie.foreign)}`,
    `年份：${normalizeText(movie.year)}`,
    `导演：${normalizeText(movie.director)}`,
    `编剧：${normalizeText(movie.writer)}`,
    `主演：${normalizeText(movie.actors)}`,
    `类型：${normalizeText(movie.genre)}`,
    `制片地区/国家：${normalizeText(movie.region)}`,
    `片长：${formatDuration(movie.length)}`,
    `豆瓣评分：${normalizeText(movie.douban)}`,
    `剧情简介：${normalizeText(movie.desc)}`,
    `获奖信息：${awards}`,
    `推荐理由：${normalizeText(movie.recommendation)}`,
    `放映风险：${normalizeText(movie.risk)}`,
  ];
  return lines.join("\n");
}

function buildDocExportText(data: DocumentData): string {
  const lines: string[] = [];
  const salonMovies = data.schedule.movies.filter((m) => m.isSalon);
  const regularMovies = data.schedule.movies.filter((m) => !m.isSalon);

  lines.push("电影周宣传资料");
  lines.push(`周次：${normalizeText(data.info.week)}`);
  lines.push(`主讲人/策展人：${normalizeText(data.info.speaker)}`);
  lines.push(`主题：${normalizeText(data.info.theme)}`);
  lines.push(`主题简介：${normalizeText(data.info.themeDesc)}`);
  lines.push("");
  lines.push("放映安排：");
  data.schedule.movies.forEach((movie) => {
    const dateLabel = formatChineseDateDisplay(movie.showDate);
    const prefix = movie.isSalon ? "【沙龙】" : "【放映】";
    lines.push(
      `${prefix}${dateLabel} ${movie.startTime}-${movie.endTime}《${normalizeText(
        movie.chinese
      )}》`
    );
  });
  lines.push("");
  lines.push("主题介绍：");
  lines.push(normalizeText(data.themeText));

  if (salonMovies.length > 0) {
    lines.push("");
    lines.push("周五沙龙：");
    salonMovies.forEach((movie, idx) => {
      lines.push(`沙龙篇目${idx + 1}：${normalizeText(movie.chinese)}`);
      lines.push(formatDocMovieDetails(movie));
      lines.push("");
      const quote = (movie.salonQuote ?? "").trim();
      const review = (movie.salonReview ?? []).filter((p) => p.trim().length > 0);
      if (quote.length > 0 || review.length > 0) {
        lines.push("沙龙引言：");
        lines.push(normalizeText(quote));
        lines.push("");
        lines.push("沙龙导赏：");
        if (review.length > 0) {
          review.forEach((para, reviewIdx) => {
            lines.push(`${reviewIdx + 1}. ${normalizeText(para)}`);
          });
        } else {
          lines.push("—");
        }
        lines.push("");
      }
    });
  }

  if (regularMovies.length > 0) {
    lines.push("周末影院：");
    regularMovies.forEach((movie, idx) => {
      const weekday = isoDateToWeekday(movie.showDate) || "—";
      const ordinal = ORDINAL[idx] ?? String(idx + 1);
      lines.push(`放映篇目${ordinal}：${weekday}`);
      lines.push(formatDocMovieDetails(movie));
      lines.push("");
    });
  }

  return lines.join("\n").replace(/\n{3,}/g, "\n\n").trim();
}

function buildReportExportText(data: DocumentData): string {
  const lines: string[] = [];
  const salonMovies = data.schedule.movies.filter((m) => m.isSalon);
  const regularMovies = data.schedule.movies.filter((m) => !m.isSalon);

  lines.push("主题影展信息报备表");
  lines.push(`学期：${normalizeText(data.semester)}`);
  lines.push(`周次：${normalizeText(data.info.week)}`);
  lines.push("");
  lines.push("放映安排：");
  data.schedule.movies.forEach((movie) => {
    const dateLabel = formatChineseDateDisplay(movie.showDate);
    const prefix = movie.isSalon ? "【沙龙】" : "【放映】";
    lines.push(
      `${prefix}${dateLabel} ${movie.startTime}-${movie.endTime}《${normalizeText(
        movie.chinese
      )}》`
    );
  });
  lines.push("");
  lines.push(`放映主题：${normalizeText(data.info.theme)}`);
  lines.push("策展人信息：");
  lines.push(`姓名：${normalizeText(data.info.speaker)}`);
  lines.push(`学号：${normalizeText(data.info.studentId)}`);
  lines.push(`院系专业：${normalizeText(data.info.department)}`);
  lines.push("");
  lines.push("放映意义：");
  lines.push(normalizeText(data.significance));
  lines.push("");
  lines.push("整体放映风险评价：");
  lines.push(normalizeText(data.overallRisk));

  if (salonMovies.length > 0) {
    lines.push("");
    lines.push("沙龙篇目：");
    salonMovies.forEach((movie, idx) => {
      lines.push(`沙龙篇目${idx + 1}：`);
      lines.push(formatReportMovieDetails(movie));
      lines.push("");
    });
  }

  if (regularMovies.length > 0) {
    lines.push("放映篇目：");
    regularMovies.forEach((movie, idx) => {
      lines.push(`放映篇目${idx + 1}：`);
      lines.push(formatReportMovieDetails(movie));
      lines.push("");
    });
  }

  return lines.join("\n").replace(/\n{3,}/g, "\n\n").trim();
}

function buildExportText(data: DocumentData, activeTab: "doc" | "report"): string {
  return activeTab === "report" ? buildReportExportText(data) : buildDocExportText(data);
}

/**
 * 左侧编辑面板
 * 包含所有表单字段、可折叠区块、打印按钮
 */
export default function EditorPanel({
  data,
  documentData,
  onChange,
  collapsed,
  onToggleCollapse,
  onReset,
  activeTab = "doc",
  onOpenTour,
}: EditorPanelProps) {
  const setInfo = useCallback(
    (key: keyof typeof data.info, value: string) => {
      onChange({ ...data, info: { ...data.info, [key]: value } });
    },
    [data, onChange]
  );

  const setMovies = useCallback(
    (movies: EditorMovieData[]) => onChange({ ...data, movies }),
    [data, onChange]
  );

  function updateMovie(index: number, movie: EditorMovieData) {
    const next = [...data.movies];
    next[index] = movie;
    setMovies(next);
  }

  function removeMovie(index: number) {
    setMovies(data.movies.filter((_, i) => i !== index));
  }

  function addMovie(isSalon: boolean) {
    setMovies([...data.movies, createEmptyMovie(isSalon)]);
  }

  const tabName = activeTab === "report" ? "报备表" : "宣传资料";
  const [exportModalOpen, setExportModalOpen] = useState(false);
  const [width, setWidth] = useState(() => {
    const saved = Number(localStorage.getItem(PANEL_WIDTH_KEY));
    return Number.isFinite(saved) && saved >= PANEL_MIN_WIDTH
      ? Math.min(saved, PANEL_MAX_WIDTH)
      : PANEL_DEFAULT_WIDTH;
  });
  const [resizing, setResizing] = useState(false);
  const [copyStatus, setCopyStatus] = useState("");
  const exportTextAreaRef = useRef<HTMLTextAreaElement | null>(null);
  const exportText = useMemo(
    () => buildExportText(documentData, activeTab),
    [documentData, activeTab]
  );

  useEffect(() => {
    if (!exportModalOpen) return;
    const timer = window.setTimeout(() => {
      const el = exportTextAreaRef.current;
      if (!el) return;
      el.focus();
      el.select();
    }, 50);
    return () => window.clearTimeout(timer);
  }, [exportModalOpen, exportText]);

  async function handleCopy() {
    if (!exportText) return;
    try {
      await navigator.clipboard.writeText(exportText);
      setCopyStatus("已复制");
      return;
    } catch {
      setCopyStatus("");
    }
    const el = exportTextAreaRef.current;
    if (!el) {
      setCopyStatus("复制失败");
      return;
    }
    el.focus();
    el.select();
    try {
      const ok = document.execCommand("copy");
      setCopyStatus(ok ? "已复制" : "复制失败");
    } catch {
      setCopyStatus("复制失败");
    }
  }

  function handleDownload() {
    const blob = new Blob([exportText], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `800电影社_${tabName}_纯文本.txt`;
    link.click();
    URL.revokeObjectURL(url);
    setCopyStatus("已生成TXT");
  }

  function closeExport() {
    setExportModalOpen(false);
    setCopyStatus("");
  }

  function startResize(e: React.PointerEvent<HTMLDivElement>) {
    e.preventDefault();
    const startX = e.clientX;
    const startWidth = width;
    setResizing(true);
    let latest = startWidth;
    const onMove = (ev: PointerEvent) => {
      latest = Math.min(
        PANEL_MAX_WIDTH,
        Math.max(PANEL_MIN_WIDTH, startWidth + ev.clientX - startX)
      );
      setWidth(latest);
    };
    const onUp = () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
      document.body.style.cursor = "";
      document.body.style.userSelect = "";
      setResizing(false);
      localStorage.setItem(PANEL_WIDTH_KEY, String(latest));
    };
    document.body.style.cursor = "col-resize";
    document.body.style.userSelect = "none";
    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);
  }

  return (
    <div
      className={cn(
        "editor-panel relative z-10 flex shrink-0",
        !resizing && "transition-[width] duration-200"
      )}
      style={{ width: collapsed ? 40 : width }}
    >
    <aside
      className="flex min-w-0 flex-1 flex-col overflow-x-hidden overflow-y-auto border-r bg-background"
      aria-label="编辑面板"
    >
      {/* 折叠切换按钮 */}
      <Button
        variant="outline"
        size="icon-xs"
        className="absolute top-3 right-2 z-20"
        onClick={onToggleCollapse}
        title={collapsed ? "展开编辑面板" : "折叠编辑面板"}
        aria-label={collapsed ? "展开编辑面板" : "折叠编辑面板"}
      >
        {collapsed ? <ChevronRightIcon /> : <ChevronLeftIcon />}
      </Button>

      {!collapsed && (
        <div className="flex flex-1 flex-col p-3 pb-6">
          <div className="mb-3 flex flex-col gap-2 pr-8">
            <h2 className="m-0 text-sm font-semibold">信息填写</h2>
            <div className="flex flex-wrap items-center gap-1.5">
              <Button
                size="sm"
                onClick={() => window.print()}
                title={`打印当前预览标签页 / 导出 PDF（当前：${tabName}）`}
              >
                <PrinterIcon />
                打印{tabName}
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setExportModalOpen(true);
                  setCopyStatus("");
                }}
                title={`导出当前预览标签页为纯文本（当前：${tabName}）`}
              >
                <FileTextIcon />
                导出文本
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="hover:border-destructive/40 hover:text-destructive"
                onClick={onReset}
                title="重置所有数据到初始状态"
                aria-label="重置所有数据到初始状态"
              >
                <RotateCcwIcon />
                重置
              </Button>
              {onOpenTour && (
                <Button
                  variant="ghost"
                  size="icon-sm"
                  onClick={onOpenTour}
                  title="打开使用指南"
                  aria-label="打开使用指南"
                >
                  <HelpCircleIcon />
                </Button>
              )}
            </div>
          </div>

          {/* ─── 基本信息 ─── */}
          <Section title="📌 基本信息">
            <div className="grid grid-cols-2 gap-2">
              <Field label="周次" tip="本期活动周次编号，如 9">
                <Input
                  className="h-7 text-xs md:text-xs"
                  placeholder="如：9"
                  value={data.info.week}
                  onChange={(e) => setInfo("week", e.target.value)}
                />
              </Field>
              <Field label="主讲人/策展人" tip="本期主讲/策展嘉宾姓名">
                <Input
                  className="h-7 text-xs md:text-xs"
                  placeholder="姓名"
                  value={data.info.speaker}
                  onChange={(e) => setInfo("speaker", e.target.value)}
                />
              </Field>
              <Field label="学号" tip="策展人学号（仅用于报备表）">
                <Input
                  className="h-7 text-xs md:text-xs"
                  placeholder="学号（报备表用）"
                  value={data.info.studentId}
                  onChange={(e) => setInfo("studentId", e.target.value)}
                />
              </Field>
              <Field label="院系专业" tip="策展人院系专业（仅用于报备表）">
                <Input
                  className="h-7 text-xs md:text-xs"
                  placeholder="如：计算机科学与技术"
                  value={data.info.department}
                  onChange={(e) => setInfo("department", e.target.value)}
                />
              </Field>
            </div>
            <Field label="主题" tip="本期主题名称">
              <Input
                className="h-7 text-xs md:text-xs"
                placeholder="主题名称"
                value={data.info.theme}
                onChange={(e) => setInfo("theme", e.target.value)}
              />
            </Field>
            <Field label="主题简介" tip="一句话介绍本期主题">
              <Input
                className="h-7 text-xs md:text-xs"
                placeholder="一句话介绍"
                value={data.info.themeDesc}
                onChange={(e) => setInfo("themeDesc", e.target.value)}
              />
            </Field>
            <Field label="学期" tip="学期标识，如 2025年秋（用于报备表标题）">
              <Input
                className="h-7 text-xs md:text-xs"
                placeholder="如：2025年秋（报备表用）"
                value={data.semester}
                onChange={(e) => onChange({ ...data, semester: e.target.value })}
              />
            </Field>
            <Label className="cursor-pointer text-xs">
              <Checkbox
                checked={data.showInstructions}
                onCheckedChange={(v) =>
                  onChange({ ...data, showInstructions: v === true })
                }
              />
              显示指示说明（模块1）
            </Label>
          </Section>

          {/* ─── 主题介绍 ─── */}
          <Section title="📝 主题介绍">
            <Field label="正文段落" tip="第4模块展示的主题正文介绍">
              <Textarea
                className="min-h-28 text-xs md:text-xs"
                placeholder="主题介绍正文，可多段，使用换行分段"
                rows={6}
                value={data.themeText}
                onChange={(e) => onChange({ ...data, themeText: e.target.value })}
              />
            </Field>
          </Section>

          {/* ─── 报备表专属信息 ─── */}
          <Section title="📑 报备表信息" defaultOpen={false}>
            <Hint>以下字段仅用于放映报备表，不影响宣传资料。</Hint>
            <Field label="放映意义" tip="简要说明本次影展的选片意义和策划初衷">
              <Textarea
                className="text-xs md:text-xs"
                placeholder="简要说明本次影展的选片意义和策划初衷"
                rows={4}
                value={data.significance}
                onChange={(e) =>
                  onChange({ ...data, significance: e.target.value })
                }
              />
            </Field>
            <Field
              label="整体放映风险评价"
              tip="对本次影展所有影片整体放映风险的综合评估"
            >
              <Textarea
                className="text-xs md:text-xs"
                placeholder="对本次影展所有影片整体放映风险的综合评估"
                rows={3}
                value={data.overallRisk}
                onChange={(e) =>
                  onChange({ ...data, overallRisk: e.target.value })
                }
              />
            </Field>
          </Section>

          {/* ─── 放映安排 ─── */}
          <Section title="🎬 放映安排">
            <Hint>
              点击"添加篇目"增加影片，勾选"沙龙"标记为周五沙龙篇目。篇目数量可任意增减。
            </Hint>
            {data.movies.map((movie, i) => (
              <MovieEditor
                key={i}
                movie={movie}
                index={i}
                onChange={(m) => updateMovie(i, m)}
                onRemove={() => removeMovie(i)}
              />
            ))}
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                className="flex-1 border-dashed"
                onClick={() => addMovie(false)}
                title="添加一部周末影院篇目"
              >
                <PlusIcon />
                周末影院篇目
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="flex-1 border-dashed text-primary"
                onClick={() => addMovie(true)}
                title="添加一部沙龙篇目"
              >
                <PlusIcon />
                沙龙篇目
              </Button>
            </div>
          </Section>
        </div>
      )}

      <Dialog
        open={exportModalOpen}
        onOpenChange={(o) => (o ? setExportModalOpen(true) : closeExport())}
      >
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>导出纯文本</DialogTitle>
            <DialogDescription>
              可复制文本（已自动全选），支持直接复制或下载 TXT 文件
            </DialogDescription>
          </DialogHeader>
          <Textarea
            ref={exportTextAreaRef}
            className="min-h-72 font-mono text-xs md:text-xs"
            value={exportText}
            readOnly
            onFocus={() => exportTextAreaRef.current?.select()}
          />
          <DialogFooter className="items-center">
            <span className="mr-auto text-xs text-muted-foreground">
              {copyStatus}
            </span>
            <Button variant="outline" onClick={handleDownload}>
              下载 TXT
            </Button>
            <Button onClick={handleCopy}>一键复制</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </aside>

    {/* 拖拽调整宽度的分隔条 */}
    {!collapsed && (
      <div
        role="separator"
        aria-orientation="vertical"
        aria-label="拖拽调整侧边栏宽度"
        title="拖拽调整宽度，双击恢复默认"
        className="group absolute inset-y-0 -right-1.5 z-30 flex w-3 cursor-col-resize items-center justify-center"
        onPointerDown={startResize}
        onDoubleClick={() => {
          setWidth(PANEL_DEFAULT_WIDTH);
          localStorage.setItem(PANEL_WIDTH_KEY, String(PANEL_DEFAULT_WIDTH));
        }}
      >
        <div
          className={cn(
            "h-full w-0.5 rounded bg-transparent transition-colors group-hover:bg-primary/60",
            resizing && "bg-primary"
          )}
        />
      </div>
    )}
    </div>
  );
}
