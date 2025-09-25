/* global WebImporter */
export default function parse(element, { document }) {
  // Helper to get direct children by class
  function getChildByClass(parent, className) {
    return Array.from(parent.children).find(child => child.classList.contains(className));
  }

  // Find the main footer container
  const container = getChildByClass(element, 'footer-container') || element;

  // Get the three main columns as seen in the screenshots
  // 1. Left: mail/contact
  // 2. Middle: links
  // 3. Right: info + social
  const mailCol = getChildByClass(container, 'footer__mail');
  const linksCol = getChildByClass(container, 'footer-links');
  const infoCol = getChildByClass(container, 'footer__info');

  // Defensive: If any column is missing, skip that cell
  const columns = [];
  if (mailCol) columns.push(mailCol);
  if (linksCol) columns.push(linksCol);
  if (infoCol) columns.push(infoCol);

  // Build the table rows
  const headerRow = ['Columns (columns17)'];
  const columnsRow = columns;

  const table = WebImporter.DOMUtils.createTable([
    headerRow,
    columnsRow
  ], document);

  element.replaceWith(table);
}
