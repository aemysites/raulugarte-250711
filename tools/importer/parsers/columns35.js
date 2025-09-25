/* global WebImporter */
export default function parse(element, { document }) {
  // Find the two-columns block
  const twoColumnsBlock = element.querySelector('.two-columns');
  if (!twoColumnsBlock) return;

  // Get the left and right columns
  const colLeft = twoColumnsBlock.querySelector('.col-left');
  const colRight = twoColumnsBlock.querySelector('.col-right');
  if (!colLeft || !colRight) return;

  // Prepare the header row
  const headerRow = ['Columns (columns35)'];

  // Prepare the columns row: left and right content
  // Use the entire colLeft and colRight as cell content for resilience
  const columnsRow = [colLeft, colRight];

  // Build the table data
  const tableData = [headerRow, columnsRow];

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(tableData, document);

  // Replace the original element with the new block table
  element.replaceWith(block);
}
