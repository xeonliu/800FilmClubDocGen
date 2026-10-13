import { useState } from "react";
import { AlertTriangleIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
import type { ImportSource } from "../model/editor";
import type { Movie } from "../model/movie";

interface MovieImportModalProps {
  onImport: (movie: Partial<Movie>) => void;
  onClose: () => void;
}

const SOURCE_OPTIONS: {
  value: ImportSource;
  label: string;
  placeholder: string;
  tooltip?: {
    title: string;
    description: string;
    linkLabel: string;
    link: string;
  };
}[] = [
  {
    value: "douban",
    label: "豆瓣",
    placeholder: "https://movie.douban.com/subject/1291546/",
  },
  {
    value: "tmdb",
    label: "TMDB",
    placeholder: "https://www.themoviedb.org/movie/680",
    tooltip: {
      title: "TMDB",
      description: "The Movie Database，全球影视数据库与开放 API。",
      linkLabel: "https://www.themoviedb.org/",
      link: "https://www.themoviedb.org/",
    },
  },
  {
    value: "imdb",
    label: "IMDB",
    placeholder: "https://www.imdb.com/title/tt0110912/",
    tooltip: {
      title: "IMDb",
      description: "Internet Movie Database，全球影视数据库与评分站。",
      linkLabel: "https://www.imdb.com/",
      link: "https://www.imdb.com/",
    },
  },
];

/** 后端 API 地址。
 *  开发时默认 http://localhost:8000（本地，无需 HTTPS）。
 *  生产部署时请在 GitHub Action 的环境变量或项目的 .env 中设置 VITE_API_BASE
 */
const API_BASE = (import.meta.env.VITE_API_BASE as string | undefined) ?? "http://localhost:8000";

/**
 * 电影信息导入弹窗
 * 支持从豆瓣 / TMDB / IMDB 导入电影信息
 */
export default function MovieImportModal({
  onImport,
  onClose,
}: MovieImportModalProps) {
  const [source, setSource] = useState<ImportSource>("douban");
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const currentOption = SOURCE_OPTIONS.find((o) => o.value === source)!;

  function isValidMovieResponse(data: unknown): data is Partial<Movie> {
    if (!data || typeof data !== "object" || Array.isArray(data)) return false;

    const obj = data as Record<string, unknown>;
    const possibleFields: Array<keyof Movie> = [
      "chinese",
      "foreign",
      "year",
      "director",
      "writer",
      "actors",
      "genre",
      "region",
      "length",
      "douban",
      "desc",
      "short",
    ];

    const hasKnownField = possibleFields.some((key) => key in obj);
    if (!hasKnownField) return false;

    return possibleFields.every((key) =>
      obj[key] === undefined || typeof obj[key] === "string"
    );
  }

  async function handleImport() {
    if (!url.trim()) {
      setError("请输入电影链接");
      return;
    }
    setLoading(true);
    setError(null);

    let resp: Response;
    try {
      resp = await fetch(`${API_BASE}/api/fetch-movie`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ source, url: url.trim() }),
      });
    } catch {
      setError("网络连接失败：无法连接到服务，请检查网络是否可用");
      setLoading(false);
      return;
    }

    if (!resp.ok) {
      const data = await resp.json().catch(() => ({}));
      const detail =
        typeof (data as { detail?: unknown }).detail === "string"
          ? (data as { detail: string }).detail
          : `请求失败 (${resp.status})`;
      setError(`爬取失败：${detail}`);
      setLoading(false);
      return;
    }

    let body: unknown;
    try {
      body = await resp.json();
    } catch {
      setError("返回数据异常：服务返回的不是有效 JSON");
      setLoading(false);
      return;
    }

    if (!isValidMovieResponse(body)) {
      setError("返回数据异常：服务返回结构不符合预期，请稍后重试");
      setLoading(false);
      return;
    }

    try {
      onImport(body);
      onClose();
    } catch {
      setError("返回数据异常：导入失败，返回字段可能不完整");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Dialog open onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>从网络导入电影信息</DialogTitle>
          <DialogDescription>
            粘贴 {currentOption.label} 电影页面链接，后端将自动解析并填入表单
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-4">
          {/* 来源选择 */}
          <div className="flex flex-col gap-2">
            <Label>数据来源</Label>
            <div className="flex gap-2">
              {SOURCE_OPTIONS.map((opt) => {
                const btn = (
                  <Button
                    key={opt.value}
                    size="sm"
                    variant={source === opt.value ? "default" : "outline"}
                    className="rounded-full px-4"
                    onClick={() => {
                      setSource(opt.value);
                      setUrl("");
                      setError(null);
                    }}
                  >
                    {opt.label}
                  </Button>
                );
                if (!opt.tooltip) return btn;
                return (
                  <Tooltip key={opt.value}>
                    <TooltipTrigger asChild>{btn}</TooltipTrigger>
                    <TooltipContent className="max-w-64">
                      <div className="font-semibold">{opt.tooltip.title}</div>
                      <div className="mb-1 opacity-80">{opt.tooltip.description}</div>
                      <a
                        className="underline"
                        href={opt.tooltip.link}
                        target="_blank"
                        rel="noreferrer"
                      >
                        {opt.tooltip.linkLabel}
                      </a>
                    </TooltipContent>
                  </Tooltip>
                );
              })}
            </div>
          </div>

          {/* URL 输入 */}
          <div className="flex flex-col gap-2">
            <Label htmlFor="import-url">电影链接</Label>
            <Input
              id="import-url"
              type="url"
              placeholder={currentOption.placeholder}
              value={url}
              onChange={(e) => {
                setUrl(e.target.value);
                setError(null);
              }}
              onKeyDown={(e) => e.key === "Enter" && handleImport()}
              disabled={loading}
              autoFocus
            />
          </div>

          {/* 错误提示 */}
          {error && (
            <div className="flex items-start gap-2 rounded-lg border border-destructive/30 bg-destructive/10 px-3 py-2 text-xs text-destructive">
              <AlertTriangleIcon className="mt-0.5 size-3.5 shrink-0" />
              {error}
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={loading}>
            取消
          </Button>
          <Button onClick={handleImport} disabled={loading || !url.trim()}>
            {loading ? "导入中…" : "确认导入"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
