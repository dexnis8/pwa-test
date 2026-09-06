import DOMPurify from "dompurify";
import katex from "katex";
import "katex/dist/katex.min.css";

/**
 * Rendering question text safely.
 *
 * Extracted from PracticeSession so duel mode renders questions, options and
 * explanations exactly the way practice already does. Two screens quietly
 * disagreeing about how to draw a fraction would be worse than either being
 * wrong on its own.
 */

// DOMPurify config that allows the markup KaTeX produces (spans w/ style & class,
// and svg/path used for things like square roots) while still sanitizing everything else.
export const KATEX_SANITIZE_CONFIG = {
  ADD_TAGS: [
    "svg",
    "path",
    "annotation",
    "semantics",
    "mrow",
    "mo",
    "mn",
    "mi",
  ],
  ADD_ATTR: [
    "class",
    "style",
    "viewBox",
    "preserveAspectRatio",
    "d",
    "width",
    "height",
    "xmlns",
    "aria-hidden",
    "focusable",
  ],
};

/**
 * Renders any LaTeX math found in a string using KaTeX and returns HTML.
 * Supports:
 *   $$...$$  and  \[...\]   -> display (block) math
 *   $...$    and  \(...\)   -> inline math
 * Anything that fails to parse is left as-is (so we never blow up on malformed input).
 */
export const renderMathInText = (text) => {
  if (!text) return "";
  let result = text;

  const safeRender = (math, displayMode) => {
    try {
      return katex.renderToString(math.trim(), {
        displayMode,
        throwOnError: false,
        strict: false,
      });
    } catch {
      // If KaTeX genuinely throws (shouldn't, given throwOnError: false), fall back to raw text
      return math;
    }
  };

  // Display math first, so it isn't accidentally swallowed by the inline patterns below
  result = result.replace(/\$\$([\s\S]+?)\$\$/g, (match, math) =>
    safeRender(math, true),
  );
  result = result.replace(/\\\[([\s\S]+?)\\\]/g, (match, math) =>
    safeRender(math, true),
  );

  // Inline math
  result = result.replace(/\\\(([\s\S]+?)\\\)/g, (match, math) =>
    safeRender(math, false),
  );
  result = result.replace(/\$([^$\n]+?)\$/g, (match, math) =>
    safeRender(math, false),
  );

  return result;
};

/** Full formatter for explanation text: math, markdown-ish styling, lists. */
export const formatExplanation = (explanation) => {
  if (!explanation) return "";

  let formatted = explanation;

  // Fix common encoding issues that show up in the raw source data
  formatted = formatted.replace(/\bimes\b/g, "×");
  formatted = formatted.replace(/\bext\{([^}]*)\}/g, "$1");

  // Render real LaTeX math (fractions, roots, sums, matrices, sub/superscripts, etc.)
  // Do this BEFORE the markdown-style replacements below so we don't mangle KaTeX's output.
  formatted = renderMathInText(formatted);

  // Handle Markdown-style formatting
  formatted = formatted.replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>");
  formatted = formatted.replace(/\*([^*:]+):\*\*/g, "<strong>$1:</strong>");
  formatted = formatted.replace(/(?<!\*)\*([^*\n]+)\*(?!\*)/g, "<em>$1</em>");

  // Convert asterisk bullet points to proper HTML lists
  if (formatted.match(/^\s*\*[^*]/m)) {
    const lines = formatted.split("\n");
    let inList = false;
    const processedLines = [];

    for (const line of lines) {
      const trimmedLine = line.trim();

      if (trimmedLine.match(/^\*[^*]/)) {
        if (!inList) {
          processedLines.push(
            '<ul class="list-disc list-inside mt-2 mb-2 space-y-1">',
          );
          inList = true;
        }
        const content = trimmedLine.replace(/^\*\s*/, "").trim();
        processedLines.push(`<li class="ml-2">${content}</li>`);
      } else {
        if (inList && trimmedLine === "") continue;
        if (inList) {
          processedLines.push("</ul>");
          inList = false;
        }
        if (trimmedLine !== "") {
          processedLines.push(`<p class="mb-2">${trimmedLine}</p>`);
        }
      }
    }

    if (inList) processedLines.push("</ul>");
    formatted = processedLines.join("\n");
  } else {
    formatted = formatted.replace(/\n\s*\n/g, '</p><p class="mb-2">');
    formatted = `<p class="mb-2">${formatted}</p>`;
  }

  // Collapse whitespace but leave KaTeX's internal markup untouched —
  // KaTeX doesn't rely on repeated spaces for layout.
  formatted = formatted.replace(/[ \t]+/g, " ");
  formatted = formatted.replace(/\s+([.,!?;:])/g, "$1");

  return formatted;
};

/**
 * Lighter-weight formatter for question stems and answer options: fixes
 * encoding issues, renders real LaTeX, and supports basic bold/italic, without
 * the paragraph/bullet-list wrapping used for longer explanation text.
 */
export const formatQuestionContent = (text) => {
  if (!text) return "";

  let formatted = text;
  formatted = formatted.replace(/\bimes\b/g, "×");
  formatted = formatted.replace(/\bext\{([^}]*)\}/g, "$1");
  formatted = renderMathInText(formatted);
  formatted = formatted.replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>");
  formatted = formatted.replace(/(?<!\*)\*([^*\n]+)\*(?!\*)/g, "<em>$1</em>");

  return formatted;
};

/** Sanitised HTML ready for dangerouslySetInnerHTML. */
export const safeHtml = (html) =>
  DOMPurify.sanitize(html || "", KATEX_SANITIZE_CONFIG);

/** Convenience: format + sanitise in one call, for the two common shapes. */
export const questionHtml = (text) => safeHtml(formatQuestionContent(text));
export const explanationHtml = (text) => safeHtml(formatExplanation(text));
