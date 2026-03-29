export function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
}

export function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength).replace(/\s+\S*$/, "") + "...";
}

/**
 * Sanitize pasted HTML for KB article display.
 * Strips <html>, <head>, <body>, <!DOCTYPE>, and <style> tags,
 * extracting only the inner body content.
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

  // Remove inline style attributes that set light backgrounds or dark text
  content = content.replace(/\s*style="[^"]*"/gi, "");

  return content.trim();
}
