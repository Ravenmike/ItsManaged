"use client";

import { useEffect, useRef, useState } from "react";

const DARK_THEME_CSS = `
  body {
    background: #0D0C1E !important;
    color: rgba(255,255,255,0.8) !important;
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  }
  h1, h2, h3, h4, h5, h6 { color: #fff !important; }
  h2 { color: #8B7CF6 !important; }
  p, li, td, th, span, label { color: rgba(255,255,255,0.75) !important; }
  strong, b { color: #fff !important; }
  a { color: #8B7CF6 !important; }
  a.btn { background: #6C5CE7 !important; color: #fff !important; }
  a.btn-gold { background: #C9A227 !important; color: #0D0C1E !important; }
  .step-box { background: rgba(255,255,255,0.05) !important; border-color: rgba(255,255,255,0.12) !important; }
  .step-num { background: #6C5CE7 !important; color: #fff !important; }
  .step-title { color: rgba(255,255,255,0.9) !important; }
  .callout { background: rgba(108,92,231,0.1) !important; border-left-color: #6C5CE7 !important; }
  .callout-warn { background: rgba(201,162,39,0.1) !important; border-left-color: #C9A227 !important; }
  .meta { color: rgba(255,255,255,0.4) !important; }
  .footer, .footer p { color: rgba(255,255,255,0.3) !important; }
  .faq h3 { color: rgba(255,255,255,0.9) !important; }
  .faq p { color: rgba(255,255,255,0.6) !important; }
  hr { border-color: rgba(255,255,255,0.12) !important; }
  thead tr { background: rgba(255,255,255,0.08) !important; }
  thead th { color: #FFD166 !important; }
  tbody td { border-color: rgba(255,255,255,0.08) !important; }
  tbody tr:nth-child(even) { background: rgba(255,255,255,0.03) !important; }
  blockquote { background: rgba(255,255,255,0.04) !important; border-left-color: #FFD166 !important; color: rgba(255,255,255,0.7) !important; }
  code, pre { background: rgba(255,255,255,0.08) !important; color: #FFD166 !important; }
  .info-box, .warning-box { background: rgba(255,255,255,0.05) !important; border-color: rgba(255,255,255,0.12) !important; }
  .info-box .box-title { color: #8B7CF6 !important; }
  .warning-box .box-title { color: #FFD166 !important; }
`;

/**
 * Renders article HTML in an iframe with dark-theme overrides.
 * Keeps the article's original styles for layout, injects dark colors.
 */
export function ArticleRenderer({ html }: { html: string }) {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [height, setHeight] = useState(500);

  useEffect(() => {
    const iframe = iframeRef.current;
    if (!iframe) return;

    const doc = iframe.contentDocument;
    if (!doc) return;

    // Check if the HTML is a full document or just a fragment
    const isFullDocument = /<html[\s>]/i.test(html);

    if (isFullDocument) {
      // Write the full document, then inject dark theme
      doc.open();
      doc.write(html);
      // Inject dark theme as last stylesheet
      const style = doc.createElement("style");
      style.textContent = DARK_THEME_CSS;
      doc.head.appendChild(style);
      doc.close();
    } else {
      // Fragment: wrap in a basic document
      doc.open();
      doc.write(`
        <!DOCTYPE html>
        <html><head>
          <style>${DARK_THEME_CSS}</style>
        </head><body>${html}</body></html>
      `);
      doc.close();
    }

    // Auto-resize iframe to content height
    const resize = () => {
      if (doc.body) {
        const newHeight = doc.body.scrollHeight + 32;
        setHeight(newHeight);
      }
    };

    // Resize after content loads (images, fonts, etc.)
    resize();
    const timer = setTimeout(resize, 500);
    const timer2 = setTimeout(resize, 1500);

    return () => {
      clearTimeout(timer);
      clearTimeout(timer2);
    };
  }, [html]);

  return (
    <iframe
      ref={iframeRef}
      className="w-full border-0"
      style={{ height: `${height}px`, background: "#0D0C1E" }}
      sandbox="allow-same-origin allow-popups"
      title="Article content"
    />
  );
}
