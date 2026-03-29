export function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
}

export function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength).replace(/\s+\S*$/, "") + "...";
}

/**
 * Sanitize pasted HTML for KB article display.
 * Strips document-level tags but preserves inline styles,
 * only overriding color properties via CSS.
 */
export function sanitizeArticleHtml(html: string): string {
  let content = html;

  // Remove <!DOCTYPE> declaration
  content = content.replace(/<!DOCTYPE[^>]*>/i, "");

  // Remove <html> wrapper
  content = content.replace(/<\/?html[^>]*>/gi, "");

  // Remove entire <head> section (includes <style>, <meta>, <title>, etc.)
  content = content.replace(/<head[\s\S]*?<\/head>/gi, "");

  // Remove any remaining standalone <style> blocks
  content = content.replace(/<style[\s\S]*?<\/style>/gi, "");

  // Remove any remaining <script> blocks
  content = content.replace(/<script[\s\S]*?<\/script>/gi, "");

  // Remove <body> tags but keep content
  content = content.replace(/<\/?body[^>]*>/gi, "");

  // Strip only color-related inline style properties, keep layout properties
  // This preserves padding, margin, border-radius, display, text-align, etc.
  content = content.replace(/style="([^"]*)"/gi, (_match, styles: string) => {
    const cleaned = styles
      .split(";")
      .map((s: string) => s.trim())
      .filter((s: string) => {
        if (!s) return false;
        const prop = s.split(":")[0]?.trim().toLowerCase() ?? "";
        // Remove color-related properties
        const colorProps = [
          "color", "background", "background-color",
          "border-color", "border-left-color", "border-right-color",
          "border-top-color", "border-bottom-color",
        ];
        return !colorProps.includes(prop);
      })
      .join("; ");
    return cleaned ? `style="${cleaned}"` : "";
  });

  return content.trim();
}
