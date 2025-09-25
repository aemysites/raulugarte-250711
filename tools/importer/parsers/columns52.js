/* global WebImporter */
export default function parse(element, { document }) {
  // Helper to get all immediate children of a selector
  function getDirectChildren(parent, selector) {
    return Array.from(parent.querySelectorAll(`:scope > ${selector}`));
  }

  // --- LEFT COLUMN ---
  // Product image (main gallery)
  let leftColContent = [];
  const facts = element.querySelector('.l-col-left');
  if (facts) {
    // Product image
    const gallery = facts.querySelector('.product-gallery__large');
    if (gallery) {
      const imgLink = gallery.querySelector('a');
      if (imgLink && imgLink.querySelector('img')) {
        leftColContent.push(imgLink);
      }
    }

    // Product labels (icons)
    const labels = facts.querySelector('.c-product-detail__labels');
    if (labels) {
      leftColContent.push(labels);
    }

    // Technical data table
    const techInfo = facts.querySelector('.c-product-detail__techinfo');
    if (techInfo) {
      leftColContent.push(techInfo);
    }

    // Zubehör (Accessories)
    const zubehor = facts.querySelector('.c-zubehor');
    if (zubehor) {
      leftColContent.push(zubehor);
    }
  }

  // --- RIGHT COLUMN ---
  // Product title, subtitle, buttons, features, description
  let rightColContent = [];
  const info = element.querySelector('.l-col-right');
  if (info) {
    // Title, subtitle, buttons, features, description
    const sourceData = info.querySelector('#js-sourceData');
    if (sourceData) {
      // Title
      const title = sourceData.querySelector('h1');
      if (title) rightColContent.push(title);
      // Subtitle
      const subtitle = sourceData.querySelector('.c-product-detail__subtitle');
      if (subtitle) rightColContent.push(subtitle);
      // Buttons
      const links = sourceData.querySelector('.c-product-detail__info--links');
      if (links) rightColContent.push(links);
      // Features (Eigenschaften)
      const features = sourceData.querySelector('.c-product-detail__info--content > h2');
      const featuresList = sourceData.querySelector('.c-product-detail__info--content > ul');
      if (features) rightColContent.push(features);
      if (featuresList) rightColContent.push(featuresList);
      // Description paragraphs
      const descBlocks = sourceData.querySelectorAll('.c-product-detail__info--content .c-product-detail__info--content p, .c-product-detail__info--content > p');
      descBlocks.forEach(p => rightColContent.push(p));
    }
  }

  // Table header row
  const headerRow = ['Columns (columns52)'];
  // Table second row: left and right columns
  const secondRow = [leftColContent, rightColContent];

  // Build table
  const table = WebImporter.DOMUtils.createTable([
    headerRow,
    secondRow
  ], document);

  // Replace original element
  element.replaceWith(table);
}
