class ProductListing {
    constructor() {
        this.baseUrl = 'http://localhost:5002/api/productweb';
        this.currentPage = 1;
        this.productsPerPage = 1;
        this.totalProducts = 0;
        this.selectedFilters = {
            parentCategory: '',
            subCategory: '',
            brand: ''
        };

        this.initEventListeners();
        this.fetchInitialData();
    }

    async fetchInitialData() {
        await Promise.all([
            this.fetchCategories(),
            this.fetchBrands(),
            this.fetchProducts()
        ]);
    }

    initEventListeners() {
        // Sort filter listener
        const sortFilter = document.getElementById('sortFilter');
        // if (sortFilter) {
        //     sortFilter.addEventListener('change', () => this.fetchProducts());
        // }

        if (sortFilter) {
            sortFilter.addEventListener('change', () => {
                this.currentPage = 1;
                this.fetchProducts();
            });
        }

         // Clear filter button listener
         const clearFilterBtn = document.getElementById('clearFilterBtn');
         if (clearFilterBtn) {
             clearFilterBtn.addEventListener('click', () => this.clearFilters());
         }

        // Radio button change listeners
        document.addEventListener('change', (e) => {
            if (e.target.type === 'radio') {
                switch (e.target.name) {
                    case 'parentcategory':
                        this.selectedFilters.parentCategory = e.target.value;
                        break;
                    case 'subcategory':
                        this.selectedFilters.subCategory = e.target.value;
                        break;
                    case 'brand':
                        this.selectedFilters.brand = e.target.value;
                        break;
                }
                this.currentPage = 1; 
                this.fetchProducts();
            }
        });
    }

    async fetchCategories() {
        try {
            const response = await fetch('http://localhost:5002/api/category');
            const data = await response.json();

            if (data.success && data.categories) {
                this.renderParentCategories(data.categories);
                this.renderSubCategories(data.categories);
            }
        } catch (error) {
            console.error('Error fetching categories:', error);
            this.showError('categoryList');
            this.showError('parentcat_list');
        }
    }

    async fetchBrands() {
        try {
            const response = await fetch('http://localhost:5002/api/brand');
            const data = await response.json();

            if (data.success && data.brands) {
                this.renderBrands(data.brands);
            }
        } catch (error) {
            console.error('Error fetching brands:', error);
            this.showError('brandList');
        }
    }

    renderParentCategories(categories) {
        const parentList = document.getElementById('parentcat_list');
        if (!parentList) return;

        const parentCategories = categories.filter(category =>
            category.parent_category ||
            category.isParent ||
            (category.type && category.type.toLowerCase() === 'parent')
        );

        parentList.innerHTML = parentCategories.map(category => `
            <li class="mb-24">
                <div class="form-check common-check common-radio">
                    <input type="radio" name="parentcategory" 
                           id="parentcategory-${category._id}" 
                           value="${category._id}" 
                           class="form-check-input">
                    <label class="form-check-label" for="parentcategory-${category._id}">
                        ${category.parent_category || category.name || 'Unnamed Category'}
                    </label>
                </div>
            </li>
        `).join('');
    }

    renderSubCategories(categories) {
        const subList = document.getElementById('categoryList');
        if (!subList) return;

        const subCategories = categories.flatMap(category =>
            category.name && Array.isArray(category.name) ? category.name : []
        );

        subList.innerHTML = subCategories.map(subCat => `
            <li class="mb-24">
                <div class="form-check common-check common-radio">
                    <input type="radio" name="subcategory" 
                           id="subcategory-${subCat._id}" 
                           value="${subCat._id}" 
                           class="form-check-input">
                    <label class="form-check-label" for="subcategory-${subCat._id}">
                        ${subCat.value || 'Unnamed Sub-Category'}
                    </label>
                </div>
            </li>
        `).join('');
    }

    renderBrands(brands) {
        const brandList = document.getElementById('brandList');
        if (!brandList) return;

        brandList.innerHTML = brands.map(brand => `
            <li class="mb-24">
                <div class="form-check common-check common-radio">
                    <input type="radio" name="brand" 
                           id="brand-${brand._id}" 
                           value="${brand._id}" 
                           class="form-check-input">
                    <label class="form-check-label" for="brand-${brand._id}">
                        ${brand.name || 'Unnamed Brand'}
                    </label>
                </div>
            </li>
        `).join('');
    }

    async fetchProducts() {
        try {
            const sortFilter = document.getElementById('sortFilter');
            let url = new URL(this.baseUrl);
            let params = new URLSearchParams();

            if (this.selectedFilters.parentCategory) {
                params.append('parent_category', this.selectedFilters.parentCategory);
            }
            if (this.selectedFilters.subCategory) {
                params.append('sub_category', this.selectedFilters.subCategory);
            }
            if (this.selectedFilters.brand) {
                params.append('brand', this.selectedFilters.brand);
            }

            if (sortFilter) {
                const sortValue = sortFilter.value.toLowerCase();
                if (sortValue === 'price-low') {
                    params.append('sort', 'price_asc');
                } else if (sortValue === 'price-high') {
                    params.append('sort', 'price_desc');
                } else if (sortValue === 'featured') {
                    params.append('featured', 'true');
                } else if (sortValue === "today's deal") {
                    params.append('todaysDeal', 'true');
                }
            }

            params.append('page', this.currentPage.toString());
            params.append('limit', this.productsPerPage.toString());

            url.search = params.toString();
            const response = await fetch(url);
            const data = await response.json();
            console.log(data, 'this');

            if (data.success) {
                this.totalProducts = data.count || data.products.length;
                const sortedProducts = this.sortProducts(data.products, sortFilter?.value);
                this.renderProducts(sortedProducts);
                this.renderPagination();
                this.renderResultsCount();
            }
        } catch (error) {
            console.error('Error fetching products:', error);
            this.showError('productGrid');
        }
    }

    clearFilters() {
        this.selectedFilters = {
            parentCategory: '',
            subCategory: '',
            brand: '',
        };
        document.querySelectorAll('input[type="radio"]').forEach(input => input.checked = false);
        const sortFilter = document.getElementById('sorting');
        if (sortFilter) sortFilter.value = '1';

        window.scrollTo({
            top: 0,
            behavior: 'smooth',
        });

        this.currentPage = 1; 
        this.fetchProducts();
    }

    sortProducts(products, sortMethod) {
        switch (sortMethod) {
            case 'price-low':
                return [...products].sort((a, b) => this.extractPrice(a) - this.extractPrice(b));
            case 'price-high':
                return [...products].sort((a, b) => this.extractPrice(b) - this.extractPrice(a));
            case 'featured':
                return [...products].sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));
            default:
                return products;
        }
    }

    extractPrice(product) {
        if (product.country_pricing?.[0]?.price) {
            return parseFloat(product.country_pricing[0].price) || 0;
        }
        const priceMatch = product.description?.match(/\$(\d+(\.\d{1,2})?)/);
        return priceMatch ? parseFloat(priceMatch[1]) : 0;
    }

    renderProducts(products) {
        const grid = document.getElementById('productGrid');
        if (!grid) return;

        if (products.length === 0) {
            grid.innerHTML = '<div class="col-span-3 text-center py-8">No products found matching your criteria.</div>';
            return;
        }

        grid.innerHTML = products.map(product => this.createProductCard(product)).join('');
    }

    createProductCard(product) {
        const imageUrl = product.image || '/placeholder.jpg';
        const aedPricing = product.country_pricing.find(pricing => pricing.currency_code === 'AED');
        const price = aedPricing?.unit_price || 'N/A';
        const discount = aedPricing?.discount || 'N/A';

        return `
            <div class="product-card h-100 p-4 border border-gray-200 rounded-lg hover:border-blue-600 transition-all">
                 <a href="product-details.html" class="product-card__thumb flex-center rounded-8 bg-gray-50 position-relative">
                <img src="${imageUrl}" alt="${product.name}" class="w-auto ">
                ${product.todaysDeal ?
                '<span class="product-card__badge bg-primary-600 px-8 py-4 text-sm text-white position-absolute inset-inline-start-0 inset-block-start-0">Today\'s Deal</span>' :
                ''}
                 </a>
                 <div class="product-card__content mt-16">
                <h6 class="title text-lg fw-semibold mt-12 mb-8">
                    <a href="product-details.html" class="link text-line-2">${product.name}</a>
                </h6>
                <div class="product-card__price my-20">
                      <span class="text-gray-400 text-md fw-semibold text-decoration-line-through">AED ${price}</span>
                      <span class="text-heading text-md fw-semibold ">AED ${discount}<span
                      class="text-gray-500 fw-normal"></span> </span>
                 </div>
                 <div
                   class="product-card__cart btn bg-gray-50 text-heading hover-bg-main-600 hover-text-white py-11 px-24 rounded-8 flex-center gap-8 fw-medium"
                    tabindex="0">
                     Add To Cart <i class="ph ph-shopping-cart"></i>
                     </div>
                </div>
            </div>
                
        `;
    }

    renderResultsCount() {
        const resultsCount = document.getElementById('resultsCount');
        if (!resultsCount) return;

        const start = (this.currentPage - 1) * this.productsPerPage + 1;
        const end = Math.min(this.currentPage * this.productsPerPage, this.totalProducts);

        resultsCount.textContent = `Showing ${start}-${end} of ${this.totalProducts} results`;
    }

    renderPagination() {
        const pagination = document.getElementById('pagination');
        if (!pagination) return;

        const totalPages = Math.ceil(this.totalProducts / this.productsPerPage);
        let paginationHTML = '';

        // Previous button
        paginationHTML += `
            <li class="page-item ${this.currentPage === 1 ? 'opacity-50 pointer-events-none' : ''}">
                <button class="page-link h-64 w-64 flex-center text-xxl rounded-8 fw-medium text-neutral-600 border border-gray-100" onclick="productListing.changePage(${this.currentPage - 1})">
                 <i class="ph-bold ph-arrow-left"></i>
                </button>
            </li>
        `;

        // Page numbers
        for (let i = 1; i <= totalPages; i++) {
            paginationHTML += `
            <li class="page-item">
             <a class="page-link h-64 w-64 flex-center text-md rounded-8 fw-medium text-neutral-600 border border-gray-100 ${this.currentPage === i ? 'bg-blue-600 text-white' : ''}" onclick="productListing.changePage(${i})" href="#">${i}</a>
            </li>
            `;
        }

        // Next button
        paginationHTML += `
            <li class="page-item ${this.currentPage === totalPages ? 'opacity-50 pointer-events-none' : ''}">
                <button class="page-link h-64 w-64 flex-center text-xxl rounded-8 fw-medium text-neutral-600 border border-gray-100" onclick="productListing.changePage(${this.currentPage + 1})">
                    <i class="ph-bold ph-arrow-right"></i>
                </button>
            </li>
        `;

        pagination.innerHTML = paginationHTML;
    }

    changePage(page) {
        this.currentPage = page;
        this.fetchProducts();
    }

    showError(containerId) {
        const container = document.getElementById(containerId);
        if (container) {
            container.innerHTML = `
                <div class="text-red-500 p-4">
                    Unable to load data. Please try again later.
                </div>
            `;
        }
    }
}

// Initialize the product listing
let productListing;
document.addEventListener('DOMContentLoaded', () => {
    productListing = new ProductListing();
});