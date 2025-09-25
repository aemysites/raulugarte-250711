/* global WebImporter */
export default function parse(element, { document }) {
  // Defensive: Only operate if element is a .country block
  if (!element || !element.classList.contains('country')) return;

  // Helper to get direct child by class
  const getChild = (cls) => Array.from(element.children).find((el) => el.classList.contains(cls));

  // 1. Country name (left column)
  const nameDiv = getChild('country__name');
  // 2. Address (second column)
  const addressDiv = getChild('country__address');
  // 3. Telephone (third column)
  const telDiv = getChild('country__telephone');
  // 4. Web/email (fourth column)
  const webDiv = getChild('country__web');

  // Defensive: fallback to empty span if missing
  const nameCell = nameDiv ? nameDiv : document.createElement('span');
  const addressCell = addressDiv ? addressDiv : document.createElement('span');
  const telCell = telDiv ? telDiv : document.createElement('span');
  const webCell = webDiv ? webDiv : document.createElement('span');

  // Build the table rows
  const headerRow = ['Columns (columns43)'];
  const contentRow = [nameCell, addressCell, telCell, webCell];

  const table = WebImporter.DOMUtils.createTable([
    headerRow,
    contentRow,
  ], document);

  element.replaceWith(table);
}
