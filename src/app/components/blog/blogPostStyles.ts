export const blogPostCSS = `
.prose-article h2 {
  font-family: var(--font-syne, 'Syne', sans-serif);
  font-weight: 900;
  font-size: 1.5rem;
  color: #0f172a;
  margin-top: 2.5rem;
  margin-bottom: 1rem;
  line-height: 1.25;
  padding-bottom: 0.5rem;
  border-bottom: 2px solid #e0e7ff;
}
.prose-article h3 {
  font-weight: 800;
  font-size: 1.15rem;
  color: #1e293b;
  margin-top: 1.75rem;
  margin-bottom: 0.75rem;
}
.prose-article p {
  margin-bottom: 1.2rem;
  color: #475569;
}
.prose-article ul {
  list-style: none;
  padding: 0;
  margin: 0 0 1.5rem 0;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}
.prose-article ul li {
  display: flex;
  align-items: flex-start;
  gap: 0.5rem;
  color: #475569;
  font-size: 0.95rem;
  padding: 0.5rem 0.75rem;
  background: #f8fafc;
  border-radius: 0.75rem;
}
.prose-article ul li::before {
  content: "→";
  color: #6366f1;
  font-weight: 700;
  flex-shrink: 0;
  margin-top: 0.05rem;
}
.prose-article table {
  width: 100%;
  border-collapse: collapse;
  margin: 1.5rem 0 2rem;
  border-radius: 1rem;
  overflow: hidden;
  border: 1px solid #e2e8f0;
}
.prose-article th {
  background: #4f46e5;
  color: white;
  font-weight: 800;
  padding: 0.875rem 1.25rem;
  text-align: left;
  font-size: 0.875rem;
}
.prose-article td {
  padding: 0.75rem 1.25rem;
  font-size: 0.875rem;
  color: #475569;
  border-bottom: 1px solid #f1f5f9;
}
.prose-article tr:last-child td {
  border-bottom: none;
}
.prose-article tr:nth-child(even) td {
  background: #f8fafc;
}
.prose-article strong {
  font-weight: 700;
  color: #1e293b;
}
.booking-cta {
  margin: 2.5rem 0 0.5rem;
}
.booking-cta-inner {
  display: flex;
  align-items: center;
  gap: 1.25rem;
  background: linear-gradient(135deg, #0D1235 0%, #1e1b4b 100%);
  border-radius: 1.5rem;
  padding: 1.5rem 1.75rem;
  flex-wrap: wrap;
}
.booking-cta-icon {
  font-size: 2rem;
  flex-shrink: 0;
}
.booking-cta-text {
  flex: 1;
  min-width: 200px;
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}
.booking-cta-text strong {
  color: #fff !important;
  font-size: 1rem;
  font-weight: 800;
}
.booking-cta-text span {
  color: rgba(255,255,255,0.55);
  font-size: 0.85rem;
  line-height: 1.5;
}
.booking-cta-btn {
  display: inline-flex;
  align-items: center;
  background: linear-gradient(135deg, #6366f1, #7c3aed);
  color: #fff;
  font-weight: 800;
  font-size: 0.9rem;
  padding: 0.75rem 1.5rem;
  border-radius: 0.875rem;
  text-decoration: none;
  white-space: nowrap;
  flex-shrink: 0;
  box-shadow: 0 8px 24px rgba(99,102,241,0.4);
  transition: opacity 0.2s;
}
.booking-cta-btn:hover {
  opacity: 0.88;
}
`;
