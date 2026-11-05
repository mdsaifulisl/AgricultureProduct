const allowedTags = new Set(['P', 'BR', 'STRONG', 'B', 'EM', 'I', 'U', 'S', 'H1', 'H2', 'H3', 'H4', 'UL', 'OL', 'LI', 'BLOCKQUOTE', 'A', 'IMG', 'HR', 'CODE', 'PRE', 'TABLE', 'THEAD', 'TBODY', 'TR', 'TH', 'TD']);

/** ব্লগ HTML থেকে script, event handler, javascript: URL এবং অজানা tag সরায়। */
export function sanitizeHtml(html: string): string {
  const parsed = new DOMParser().parseFromString(html, 'text/html');
  const clean = (node: ParentNode) => {
    Array.from(node.childNodes).forEach((child) => {
      if (child.nodeType === Node.ELEMENT_NODE) {
        const el = child as HTMLElement;
        if (!allowedTags.has(el.tagName)) { el.remove(); return; }
        for (const attr of Array.from(el.attributes)) {
          const safe = (el.tagName === 'A' && attr.name === 'href') || (el.tagName === 'IMG' && ['src', 'alt', 'title', 'width', 'height'].includes(attr.name));
          if (!safe || ((attr.name === 'href' || attr.name === 'src') && !/^(https?:|\/|#)/i.test(attr.value))) el.removeAttribute(attr.name);
        }
        clean(el);
      } else if (child.nodeType !== Node.TEXT_NODE) child.remove();
    });
  };
  clean(parsed.body);
  return parsed.body.innerHTML;
}
