    // Function to fetch categories from the backend
    async function fetchCategories(parentCategory = '', id = '') {
        try {
            let queryParams = '';
            if (parentCategory) {
                queryParams = `?parent_category=${parentCategory}`;
            } else if (id) {
                queryParams = `?id=${id}`;
            }

            const response = await fetch(`/api/categories${queryParams}`);
            const data = await response.json();

            if (!data.success) {
                throw new Error(data.message);
            }

            return data.categories;
        } catch (error) {
            console.error('Error fetching categories:', error);
            throw error;
        }
    }

    // Function to render categories in the HTML
    function renderCategories(categories) {
        const categoryContainer = document.getElementById('category-container');

        if (!categoryContainer) {
            console.error('Category container not found');
            return;
        }

        const categoryHTML = categories.map(category => `
            <div class="col-xxl-3 col-lg-4 col-sm-6">
                <div class="vendor-card text-center px-16 pb-24">
                    <div>
                        <img src="${category.image || 'assets/images/thumbs/placeholder.png'}" alt="${category.name}" class="vendor-card__logo m-12">
                        <h6 class="title mt-32">${category.name}</h6>
                        ${category.description ? `<span class="text-heading text-sm d-block">${category.description}</span>` : ''}
                        <a href="shop.html?category=${category._id}" class="btn btn-main-two rounded-pill py-6 px-16 text-12 mt-8">
                            View Products
                        </a>
                    </div>
                    ${category.subcategories ? renderSubcategories(category.subcategories) : ''}
                </div>
            </div>
        `).join('');

        categoryContainer.innerHTML = categoryHTML;
    }

    // Function to render subcategories
    function renderSubcategories(subcategories) {
        return `
            <div class="vendor-card__list mt-22 flex-center flex-wrap gap-8">
                ${subcategories.map(sub => `
                    <div class="vendor-card__item bg-white rounded-circle flex-center">
                        <a href="shop.html?category=${sub._id}" title="${sub.name}">
                            <img src="${sub.image || 'assets/images/thumbs/placeholder.png'}" alt="${sub.name}">
                        </a>
                    </div>
                `).join('')}
            </div>
        `;
    }

    // Function to initialize the category display
    async function initializeCategories() {
        try {
            // Show loading state
            const categoryContainer = document.getElementById('category-container');
            categoryContainer.innerHTML = '<div class="text-center">Loading categories...</div>';

            // Fetch categories
            const categories = await fetchCategories();

            // Render categories
            renderCategories(categories);

            // Add event listeners for any interactive elements
            addCategoryEventListeners();
        } catch (error) {
            // Show error state
            const categoryContainer = document.getElementById('category-container');
            categoryContainer.innerHTML = `
                <div class="text-center text-danger">
                    Error loading categories. Please try again later.
                </div>
            `;
        }
    }

    // Function to add event listeners
    function addCategoryEventListeners() {
        // Add click handlers for category filtering
        document.querySelectorAll('[data-category-filter]').forEach(button => {
            button.addEventListener('click', async (e) => {
                const parentCategory = e.target.dataset.categoryFilter;
                try {
                    const filteredCategories = await fetchCategories(parentCategory);
                    renderCategories(filteredCategories);
                } catch (error) {
                    console.error('Error filtering categories:', error);
                }
            });
        });

        // Add click handlers for fetching by ID
        document.querySelectorAll('[data-category-id]').forEach(button => {
            button.addEventListener('click', async (e) => {
                const id = e.target.dataset.categoryId;
                try {
                    const categoriesById = await fetchCategories('', id);
                    renderCategories(categoriesById);
                } catch (error) {
                    console.error('Error fetching categories by ID:', error);
                }
            });
        });
    }

    // Initialize when the DOM is loaded
    document.addEventListener('DOMContentLoaded', initializeCategories);

    export { fetchCategories, renderCategories, initializeCategories };
