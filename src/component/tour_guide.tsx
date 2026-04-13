import { useState } from "react";
import { createPortal } from "react-dom";

interface TourGuideProps {
  open: boolean;
  onClose: () => void;
}

type OsTab = "windows" | "macos" | "linux";

const OS_LABELS: Record<OsTab, string> = {
  windows: "🪟 Windows",
  macos: "🍎 macOS",
  linux: "🐧 Linux",
};

export default function TourGuide({ open, onClose }: TourGuideProps) {
  const [osTab, setOsTab] = useState<OsTab>("windows");

  if (!open) return null;

  return createPortal(
    <div
      className="modal-overlay"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="使用指南"
    >
      <div
        className="modal-box tour-guide-modal"
        onClick={(e) => e.stopPropagation()}
      >
        {/* 标题栏 */}
        <div className="modal-header">
          <span className="modal-title">📖 使用指南</span>
          <button
            className="modal-close-btn"
            onClick={onClose}
            aria-label="关闭指南"
          >
            ✕
          </button>
        </div>

        {/* 正文 */}
        <div className="tour-guide-body">

          {/* ── 快速上手 ──────────────────────────── */}
          <section className="tour-section">
            <h3 className="tour-section-title">🚀 快速上手</h3>
            <ol className="tour-steps">
              <li className="tour-step">
                <span className="tour-step-num">1</span>
                <div className="tour-step-content">
                  <strong>填写基本信息</strong>
                  <p>在左侧编辑面板的「📌 基本信息」区块中，填写本期<em>周次</em>、<em>主讲人/策展人</em>、<em>主题</em>等字段。学号和院系专业仅用于报备表，可稍后填写。</p>
                </div>
              </li>
              <li className="tour-step">
                <span className="tour-step-num">2</span>
                <div className="tour-step-content">
                  <strong>添加放映篇目</strong>
                  <p>在「🎬 放映安排」区块点击 <code className="tour-code">+ 周末影院篇目</code> 或 <code className="tour-code">+ 沙龙篇目</code> 添加影片。点击 <code className="tour-code">🌐 从网络导入电影信息</code> 可从豆瓣/TMDB/IMDB自动填充影片信息。</p>
                </div>
              </li>
              <li className="tour-step">
                <span className="tour-step-num">3</span>
                <div className="tour-step-content">
                  <strong>填写主题介绍</strong>
                  <p>在「📝 主题介绍」区块填写正文段落，支持换行分段，将自动排版到宣传资料文档中。</p>
                </div>
              </li>
              <li className="tour-step">
                <span className="tour-step-num">4</span>
                <div className="tour-step-content">
                  <strong>实时预览</strong>
                  <p>右侧预览区会随编辑内容实时更新，无需手动刷新。</p>
                </div>
              </li>
              <li className="tour-step">
                <span className="tour-step-num">5</span>
                <div className="tour-step-content">
                  <strong>切换标签页</strong>
                  <p>预览区顶部有两个标签：<code className="tour-code">📄 电影周宣传资料</code> 和 <code className="tour-code">📋 放映报备表</code>，点击即可切换预览内容。<strong>打印时只会打印当前激活的标签页内容</strong>，请先切换到目标标签再打印。</p>
                </div>
              </li>
            </ol>
          </section>

          {/* ── 打印 / 导出 PDF ───────────────────── */}
          <section className="tour-section">
            <h3 className="tour-section-title">🖨️ 打印 / 导出 PDF</h3>

            <div className="tour-tip tour-tip-info">
              💡 <strong>打印前请先切换到目标标签页：</strong>确保预览区顶部高亮的是你想打印的文档（宣传资料或报备表），再点击左上角的打印按钮。
            </div>

            {/* OS 选项卡 */}
            <div className="tour-os-tabs">
              {(Object.keys(OS_LABELS) as OsTab[]).map((os) => (
                <button
                  key={os}
                  className={`tour-os-tab${osTab === os ? " active" : ""}`}
                  onClick={() => setOsTab(os)}
                >
                  {OS_LABELS[os]}
                </button>
              ))}
            </div>

            {/* Windows */}
            {osTab === "windows" && (
              <ol className="tour-steps">
                <li className="tour-step">
                  <span className="tour-step-num">1</span>
                  <div className="tour-step-content">
                    <strong>打开打印对话框</strong>
                    <p>点击左侧面板顶部的 <code className="tour-code">🖨️ 打印…</code> 按钮，或使用快捷键 <kbd className="tour-kbd">Ctrl</kbd> + <kbd className="tour-kbd">P</kbd>。</p>
                  </div>
                </li>
                <li className="tour-step">
                  <span className="tour-step-num">2</span>
                  <div className="tour-step-content">
                    <strong>选择目标为 PDF</strong>
                    <p>在「目标」下拉框中选择 <strong>另存为 PDF</strong>（Chrome/Edge）或 <strong>Microsoft Print to PDF</strong>。</p>
                  </div>
                </li>
                <li className="tour-step">
                  <span className="tour-step-num">3</span>
                  <div className="tour-step-content">
                    <strong>取消页眉和页脚</strong>
                    <p>点击「<strong>更多设置</strong>」展开，找到「<strong>页眉和页脚</strong>」复选框，<strong>取消勾选</strong>，避免打印出浏览器地址栏、日期等多余信息。</p>
                  </div>
                </li>
                <li className="tour-step">
                  <span className="tour-step-num">4</span>
                  <div className="tour-step-content">
                    <strong>保存 PDF</strong>
                    <p>点击「<strong>保存</strong>」，选择保存位置，即可得到 PDF 文件。</p>
                  </div>
                </li>
              </ol>
            )}

            {/* macOS */}
            {osTab === "macos" && (
              <ol className="tour-steps">
                <li className="tour-step">
                  <span className="tour-step-num">1</span>
                  <div className="tour-step-content">
                    <strong>打开打印对话框</strong>
                    <p>点击 <code className="tour-code">🖨️ 打印…</code> 按钮，或使用快捷键 <kbd className="tour-kbd">⌘</kbd> + <kbd className="tour-kbd">P</kbd>。</p>
                  </div>
                </li>
                <li className="tour-step">
                  <span className="tour-step-num">2</span>
                  <div className="tour-step-content">
                    <strong>选择目标为 PDF（Chrome/Edge）</strong>
                    <p>在「目标」中点击「<strong>更改…</strong>」，选择 <strong>另存为 PDF</strong>。</p>
                  </div>
                </li>
                <li className="tour-step">
                  <span className="tour-step-num">3</span>
                  <div className="tour-step-content">
                    <strong>取消页眉和页脚</strong>
                    <p>展开「<strong>更多设置</strong>」，取消勾选「<strong>页眉和页脚</strong>」。</p>
                    <div className="tour-tip tour-tip-note">
                      Safari 用户：打印对话框左下角点击「<strong>PDF ▾</strong>」→「存储为 PDF」；展开「显示详细信息」后取消「打印页眉和页脚」。
                    </div>
                  </div>
                </li>
                <li className="tour-step">
                  <span className="tour-step-num">4</span>
                  <div className="tour-step-content">
                    <strong>保存 PDF</strong>
                    <p>点击「<strong>保存</strong>」，选择保存路径即可。</p>
                  </div>
                </li>
              </ol>
            )}

            {/* Linux */}
            {osTab === "linux" && (
              <ol className="tour-steps">
                <li className="tour-step">
                  <span className="tour-step-num">1</span>
                  <div className="tour-step-content">
                    <strong>打开打印对话框</strong>
                    <p>点击 <code className="tour-code">🖨️ 打印…</code> 按钮，或使用快捷键 <kbd className="tour-kbd">Ctrl</kbd> + <kbd className="tour-kbd">P</kbd>。</p>
                  </div>
                </li>
                <li className="tour-step">
                  <span className="tour-step-num">2</span>
                  <div className="tour-step-content">
                    <strong>选择打印到文件</strong>
                    <p>在「目标」中选择 <strong>打印到文件</strong>（Chrome）或 <strong>另存为 PDF</strong>，文件格式选 PDF。</p>
                  </div>
                </li>
                <li className="tour-step">
                  <span className="tour-step-num">3</span>
                  <div className="tour-step-content">
                    <strong>取消页眉和页脚</strong>
                    <p>展开「<strong>更多设置</strong>」，取消勾选「<strong>页眉和页脚</strong>」。</p>
                  </div>
                </li>
                <li className="tour-step">
                  <span className="tour-step-num">4</span>
                  <div className="tour-step-content">
                    <strong>保存 PDF</strong>
                    <p>点击「<strong>保存</strong>」，选择保存路径即可。</p>
                  </div>
                </li>
              </ol>
            )}
          </section>

          {/* ── 其他功能 ──────────────────────────── */}
          <section className="tour-section">
            <h3 className="tour-section-title">📌 其他功能</h3>
            <ul className="tour-feature-list">
              <li>
                <strong>📝 导出文本</strong> — 将当前文档导出为纯文本，方便复制粘贴到微信/飞书等平台。
              </li>
              <li>
                <strong>🧹 重置</strong> — 清空所有已填写的内容，恢复到初始状态（<em>不可撤销</em>）。
              </li>
              <li>
                <strong>◀ / ▶ 折叠面板</strong> — 点击面板右上角箭头可折叠左侧编辑面板，获得更大的预览空间。
              </li>
              <li>
                <strong>自动保存</strong> — 所有填写内容自动保存到浏览器本地，刷新后不丢失。
              </li>
            </ul>
          </section>

        </div>

        {/* 底部 */}
        <div className="modal-footer">
          <button className="btn-primary" onClick={onClose}>
            知道了，开始使用
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}
