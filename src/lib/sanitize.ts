import DOMPurify from "dompurify";

// İzin verilen HTML tag ve attribute'ları — blog içeriği için güvenli set
const ALLOWED_TAGS = [
  "h1", "h2", "h3", "h4", "h5", "h6", "p", "br", "hr",
  "strong", "em", "b", "i", "u", "s", "mark",
  "ul", "ol", "li", "blockquote",
  "a", "img", "figure", "figcaption",
  "table", "thead", "tbody", "tr", "th", "td",
  "div", "span", "pre", "code",
];

const ALLOWED_ATTR = [
  "href", "target", "rel", "src", "alt", "title", "width", "height",
  "class", "id", "style", "loading", "decoding",
];

export function sanitizeHTML(dirty: string): string {
  return DOMPurify.sanitize(dirty, {
    ALLOWED_TAGS,
    ALLOWED_ATTR,
    ALLOW_DATA_ATTR: false,
    ADD_ATTR: ["target"], // a etiketlerinde target="_blank" izin ver
  });
}
