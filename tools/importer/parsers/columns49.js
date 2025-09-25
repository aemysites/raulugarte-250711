/* global WebImporter */
export default function parse(element, { document }) {
  // Helper to get direct children by class
  function getChildByClass(parent, className) {
    return Array.from(parent.children).find(child => child.classList.contains(className));
  }

  // Get all the relevant content blocks
  const department = getChildByClass(element, 'country__department');
  const regions = getChildByClass(element, 'country__regions');
  const contacts = getChildByClass(element, 'country__contacts');
  const telephone = getChildByClass(element, 'country__telephone');

  // Clean up email href if needed (remove any <br> or HTML in mailto)
  if (contacts) {
    const email = contacts.querySelector('a.email');
    if (email && email.getAttribute('href')) {
      const href = email.getAttribute('href');
      // Remove any HTML tags and whitespace from the mailto
      const cleanHref = href.replace(/<[^>]*>/g, '').replace(/\s+/g, '');
      email.setAttribute('href', cleanHref);
    }
  }

  // Compose the columns: department, regions, contacts, telephone
  const headerRow = ['Columns (columns49)'];
  const contentRow = [
    department || document.createElement('div'),
    regions || document.createElement('div'),
    contacts || document.createElement('div'),
    telephone || document.createElement('div')
  ];

  const table = WebImporter.DOMUtils.createTable([
    headerRow,
    contentRow
  ], document);

  element.replaceWith(table);
}
