import {
  AlignmentType, BorderStyle, Document, HeadingLevel, HeightRule,
  LineRuleType, Packer, Paragraph, SectionType, Table, TableCell, TableLayoutType,
  TableRow, TextRun, UnderlineType, VerticalAlign, WidthType,
} from "docx";
import type { IBorderOptions } from "docx";

// CSS lengths are converted to Word's twentieths of a point (twips).
function twips(value: string): number {
  const number = parseFloat(value);
  if (!Number.isFinite(number)) return 0;
  return Math.round(number * (value.endsWith("pt") ? 20 : 15));
}

function font(style: CSSStyleDeclaration) {
  const name = style.fontFamily.split(",")[0].trim().replace(/["']/g, "") || "等线";
  return { name, eastAsia: name };
}

function runs(element: HTMLElement): TextRun[] {
  const result: TextRun[] = [];
  function visit(node: Node) {
    if (node.nodeType === Node.TEXT_NODE) {
      const style = getComputedStyle(node.parentElement!);
      const lines = (node.textContent ?? "").replace(/\r\n?/g, "\n").split("\n");
      lines.forEach((text, index) => result.push(new TextRun({
        text,
        break: index ? 1 : undefined,
        font: font(style),
        size: Math.round(twips(style.fontSize) / 10) || 21,
        bold: style.fontWeight === "bold" || Number(style.fontWeight) >= 600,
        italics: style.fontStyle === "italic",
        underline: style.textDecorationLine.includes("underline") ? { type: UnderlineType.SINGLE } : undefined,
        color: "000000",
      })));
    } else if (node instanceof HTMLElement) {
      if (node.tagName === "BR") result.push(new TextRun({ break: 1 }));
      else node.childNodes.forEach(visit);
    }
  }
  element.childNodes.forEach(visit);
  return result;
}

function paragraph(element: HTMLElement, parentIndent = 0): Paragraph {
  const style = getComputedStyle(element);
  const heading = element.tagName === "H1" || element.tagName === "H2";
  const alignment = style.textAlign === "center" ? AlignmentType.CENTER
    : style.textAlign === "right" ? AlignmentType.RIGHT
    : style.textAlign === "justify" ? AlignmentType.JUSTIFIED : AlignmentType.LEFT;
  const indent = twips(style.textIndent);
  return new Paragraph({
    children: runs(element),
    heading: element.tagName === "H1" ? HeadingLevel.HEADING_1
      : element.tagName === "H2" ? HeadingLevel.HEADING_2 : undefined,
    alignment,
    keepNext: heading || element.nextElementSibling?.tagName === "TABLE",
    widowControl: true,
    indent: {
      left: parentIndent + twips(style.marginLeft),
      ...(indent < 0 ? { hanging: -indent } : { firstLine: indent }),
    },
    spacing: {
      before: twips(style.marginTop), after: twips(style.marginBottom),
      // Word's automatic Chinese line spacing is larger than the browser's normal line box.
      line: style.lineHeight === "normal" ? Math.round(twips(style.fontSize) * 1.2) : twips(style.lineHeight),
      lineRule: LineRuleType.EXACT,
    },
  });
}

function border(style: CSSStyleDeclaration, side: "Top" | "Bottom" | "Left" | "Right"): IBorderOptions {
  const kind = style[`border${side}Style`];
  return kind === "none" || !twips(style[`border${side}Width`])
    ? { style: BorderStyle.NIL, size: 0, color: "000000" }
    : { style: BorderStyle.SINGLE, size: Math.max(1, Math.round(twips(style[`border${side}Width`]) * 0.4)), color: "000000" };
}

function table(element: HTMLTableElement, availableWidth: number): Table {
  const firstRow = element.rows[0];
  const widths = Array.from(firstRow.cells).map(cell => {
    // Inline widths are the template's intended column proportions, independent of viewport zoom.
    return twips(cell.style.width || getComputedStyle(cell).width);
  });
  const total = widths.reduce((sum, width) => sum + width, 0);
  const columnWidths = widths.map(width => Math.round(availableWidth * width / total));
  const noBorder = { style: BorderStyle.NIL, size: 0, color: "000000" };
  return new Table({
    width: { size: availableWidth, type: WidthType.DXA },
    columnWidths,
    layout: TableLayoutType.FIXED,
    borders: { top: noBorder, bottom: noBorder, left: noBorder, right: noBorder, insideHorizontal: noBorder, insideVertical: noBorder },
    rows: Array.from(element.rows).map(row => new TableRow({
      height: { value: twips(row.style.height) || 425, rule: HeightRule.ATLEAST },
      children: Array.from(row.cells).map((cell, index) => {
        const style = getComputedStyle(cell);
        const children = blocks(cell);
        return new TableCell({
          width: { size: columnWidths[index], type: WidthType.DXA },
          verticalAlign: style.verticalAlign === "top" ? VerticalAlign.TOP : VerticalAlign.CENTER,
          margins: { top: twips(style.paddingTop), bottom: twips(style.paddingBottom), left: twips(style.paddingLeft), right: twips(style.paddingRight) },
          borders: { top: border(style, "Top"), bottom: border(style, "Bottom"), left: border(style, "Left"), right: border(style, "Right") },
          children: children.length ? children : [new Paragraph("")],
        });
      }),
    })),
  });
}

function blocks(element: HTMLElement, availableWidth = 8306, parentIndent = 0): (Paragraph | Table)[] {
  const result: (Paragraph | Table)[] = [];
  for (const child of element.children) {
    if (!(child instanceof HTMLElement)) continue;
    if (child instanceof HTMLTableElement) {
      result.push(table(child, availableWidth));
      // Word requires a paragraph after a table; keep it small to preserve the preview spacing.
      result.push(new Paragraph({ spacing: { before: 0, after: 0, line: 20 }, children: [new TextRun({ text: "", size: 2 })] }));
    } else if (/^(P|H[1-6])$/.test(child.tagName)) {
      result.push(paragraph(child, parentIndent));
    } else {
      result.push(...blocks(child, availableWidth, parentIndent + twips(getComputedStyle(child).marginLeft)));
    }
  }
  return result;
}

/** Export the actual preview, including its table layouts, fonts and page boundaries. */
export async function exportWordPreview(pages: HTMLElement[], title: string): Promise<Blob> {
  if (!pages.length) throw new Error("没有可导出的文档预览");
  const document = new Document({
    title,
    styles: { default: {
      document: { run: { font: { name: "等线", eastAsia: "等线" }, size: 21, color: "000000" }, paragraph: { spacing: { before: 0, after: 0, line: 240 } } },
      heading1: { run: { font: { name: "华文宋体", eastAsia: "华文宋体" }, size: 32, bold: true, color: "000000" } },
      heading2: { run: { font: { name: "华文宋体", eastAsia: "华文宋体" }, size: 21, bold: true, italics: true, underline: { type: UnderlineType.SINGLE }, color: "000000" } },
    } },
    sections: pages.map(page => {
      const style = getComputedStyle(page);
      const margin = { top: twips(style.paddingTop), right: twips(style.paddingRight), bottom: twips(style.paddingBottom), left: twips(style.paddingLeft) };
      const width = 11906;
      return {
        properties: { type: SectionType.NEXT_PAGE, page: { size: { width, height: 16838 }, margin } },
        children: blocks(page, width - margin.left - margin.right),
      };
    }),
  });
  return Packer.toBlob(document);
}
