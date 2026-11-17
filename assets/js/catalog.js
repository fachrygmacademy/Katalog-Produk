/**
 * catalog.js - Filter & Pencarian Katalog Produk Client-Side
 * Berjalan sepenuhnya di browser tanpa library eksternal.
 * Menjaga SEO karena elemen HTML sudah ada di DOM awal.
 */

document.addEventListener('DOMContentLoaded', function () {
  'use strict';

  const searchInput = document.getElementById('catalogSearchInput');
  const filterButtons = document.querySelectorAll('.filter-btn');
  const productCards = document.querySelectorAll('.catalog-item');
  const emptyState = document.getElementById('catalogEmptyState');
  const resultCounter = document.getElementById('catalogResultCount');
  const totalProducts = productCards.length;

  let currentCategory = 'all';
  let searchQuery = '';

  function filterProducts() {
    let visibleCount = 0;
    const query = searchQuery.trim().toLowerCase();

    productCards.forEach(function (card) {
      const cardCategory = card.getAttribute('data-category') || '';
      const cardTitle = (card.querySelector('.card-product-title') ? card.querySelector('.card-product-title').textContent : '').toLowerCase();
      const cardDesc = (card.querySelector('.card-product-desc') ? card.querySelector('.card-product-desc').textContent : '').toLowerCase();
      const cardTags = (card.getAttribute('data-tags') || '').toLowerCase();

      const matchesCategory = (currentCategory === 'all' || cardCategory === currentCategory);
      const matchesSearch = query === '' || 
                            cardTitle.includes(query) || 
                            cardDesc.includes(query) || 
                            cardTags.includes(query);

      if (matchesCategory && matchesSearch) {
        card.style.display = '';
        visibleCount++;
      } else {
        card.style.display = 'none';
      }
    });

    // Update Result Counter
    if (resultCounter) {
      resultCounter.textContent = `Menampilkan ${visibleCount} dari ${totalProducts} produk`;
    }

    // Toggle Empty State
    if (emptyState) {
      if (visibleCount === 0) {
        emptyState.classList.remove('d-none');
      } else {
        emptyState.classList.add('d-none');
      }
    }
  }

  // Handle Search Input (Debounced)
  if (searchInput) {
    let debounceTimer;
    searchInput.addEventListener('input', function (e) {
      clearTimeout(debounceTimer);
      debounceTimer = setTimeout(function () {
        searchQuery = e.target.value;
        filterProducts();
      }, 150);
    });

    // Clear search button / escape key
    searchInput.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') {
        searchInput.value = '';
        searchQuery = '';
        filterProducts();
      }
    });
  }

  // Handle Category Buttons
  if (filterButtons.length > 0) {
    filterButtons.forEach(function (btn) {
      btn.addEventListener('click', function () {
        filterButtons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        currentCategory = btn.getAttribute('data-filter') || 'all';
        filterProducts();
      });
    });
  }

  // Initial Counter Setup
  if (resultCounter) {
    resultCounter.textContent = `Menampilkan ${totalProducts} dari ${totalProducts} produk`;
  }
});
