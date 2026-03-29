export function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
}

export function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength).replace(/\s+\S*$/, "") + "...";
}

/**
 * Sanitize pasted HTML for KB article display on the dark portal.
 * Keeps the original <style> block and inline styles intact,
 * then appends dark-theme overrides that take precedence.
 */
export function sanitizeArticleHtml(html: string): string {
  let content = html;

  // Remove <!DOCTYPE> declaration
  content = content.replace(/<!DOCTYPE[^>]*>/i, "");

  // Remove <html> wrapper
  content = content.replace(/<\/?html[^>]*>/gi, "");

  // Extract <style> blocks from <head>
  const styleBlocks: string[] = [];
  content.replace(/<style[^>]*>([\s\S]*?)<\/style>/gi, (_match, css: string) => {
    styleBlocks.push(css);
    return "";
  });

  // Remove entire <head> section
  content = content.replace(/<head[\s\S]*?<\/head>/gi, "");

  // Remove any remaining standalone <style> blocks (already extracted)
  content = content.replace(/<style[\s\S]*?<\/style>/gi, "");

  // Remove <script> blocks
  content = content.replace(/<script[\s\S]*?<\/script>/gi, "");

  // Remove <body> tags but keep content
  content = content.replace(/<\/?body[^>]*>/gi, "");

  // Dark-theme overrides — applied after the original styles
  const darkOverrides = `
    body, div, p, span, li, td, th, label { color: rgba(255,255,255,0.8) !important; }
    h1, h2, h3, h4, h5, h6 { color: #fff !important; }
    h2 { color: #8B7CF6 !important; }
    strong, b { color: #fff !important; }
    a { color: #8B7CF6 !important; }
    a.btn { color: #fff !important; background: #6C5CE7 !important; }
    a.btn-gold { color: #0D0C1E !important; background: #C9A227 !important; }
    .step-box { background: rgba(255,255,255,0.06) !important; border-color: rgba(255,255,255,0.12) !important; }
    .step-num { background: #6C5CE7 !important; color: #fff !important; }
    .step-title { color: rgba(255,255,255,0.9) !important; }
    .step-box p, .step-box li { color: rgba(255,255,255,0.65) !important; }
    .callout { background: rgba(108,92,231,0.1) !important; border-left-color: #6C5CE7 !important; color: rgba(255,255,255,0.8) !important; }
    .callout-warn { background: rgba(201,162,39,0.1) !important; border-left-color: #C9A227 !important; }
    .meta { color: rgba(255,255,255,0.4) !important; }
    .footer, .footer p { color: rgba(255,255,255,0.3) !important; }
    .faq h3 { color: rgba(255,255,255,0.9) !important; }
    .faq p { color: rgba(255,255,255,0.6) !important; }
    hr { border-color: rgba(255,255,255,0.12) !important; }
    table { border-color: rgba(255,255,255,0.12) !important; }
    thead tr { background: rgba(255,255,255,0.08) !important; }
    thead th { color: #FFD166 !important; }
    tbody td { border-color: rgba(255,255,255,0.08) !important; }
    tbody tr:nth-child(even) { background: rgba(255,255,255,0.03) !important; }
    blockquote { background: rgba(255,255,255,0.04) !important; border-left-color: #FFD166 !important; color: rgba(255,255,255,0.7) !important; }
    code, pre { background: rgba(255,255,255,0.08) !important; color: #FFD166 !important; }
  `;

  // Reconstruct: original styles + dark overrides + body content
  const combinedStyles = styleBlocks.length > 0
    ? `<style>${styleBlocks.join("\n")}\n${darkOverrides}</style>`
    : `<style>${darkOverrides}</style>`;

  return `${combinedStyles}\n${content.trim()}`;
}
