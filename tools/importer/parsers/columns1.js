/* global WebImporter */
export default function parse(element, { document }) {
  // Helper to get the left and right columns
  function getColumns(article) {
    const left = article.querySelector('.l-col-left');
    const right = article.querySelector('.l-col-right');
    return [left, right];
  }

  // Find the article block (should be only one per element)
  const article = element.querySelector('article');
  if (!article) return;

  // Get the left and right columns
  const [leftCol, rightCol] = getColumns(article);
  if (!leftCol || !rightCol) return;

  // Compose the table rows
  const headerRow = ['Columns (columns1)'];
  const contentRow = [leftCol, rightCol];

  // Create the block table
  const table = WebImporter.DOMUtils.createTable([
    headerRow,
    contentRow,
  ], document);

  // Replace the original element with the new table
  element.replaceWith(table);
}
