
// document.addEventListener('DOMContentLoaded', async () => {
//     try {
//         const categoryResponse = await fetch('http://localhost:5002/api/category');
//         const categoryData = await categoryResponse.json();

//         if (categoryData.success && categoryData.categories && categoryData.categories.length > 0) {
//             // Handle Sub-Categories
//             const subCategoryList = document.getElementById('categoryList');
//             if (subCategoryList) {
//                 subCategoryList.innerHTML = '';

//                 categoryData.categories.forEach(category => {
//                     if (category.name && Array.isArray(category.name)) {
//                         category.name.forEach(nameObj => {
//                             const li = document.createElement('li');
//                             li.className = 'mb-24';

//                             const divContainer = document.createElement('div');
//                             divContainer.className = 'form-check common-check common-radio';

//                             const input = document.createElement('input');
//                             input.className = 'form-check-input';
//                             input.type = 'radio';  // or 'checkbox' if you prefer
//                             input.name = 'subcategory';
//                             input.id = `subcategory-${nameObj._id}`;
//                             input.value = nameObj._id;

//                             const label = document.createElement('label');
//                             label.className = 'form-check-label';
//                             label.htmlFor = `subcategory-${nameObj._id}`;
//                             label.textContent = nameObj.value || 'Unnamed Sub-Category';

//                             divContainer.appendChild(input);
//                             divContainer.appendChild(label);
//                             li.appendChild(divContainer);
//                             subCategoryList.appendChild(li);
//                         });
//                     }
//                 });
//             }

//             const parentCategoryList = document.getElementById('parentcat_list');
//             if (parentCategoryList) {
//                 parentCategoryList.innerHTML = '';

//                 const parentCategories = categoryData.categories.filter(category => 
//                     category.parent_category || 
//                     category.isParent ||        
//                     (category.type && category.type.toLowerCase() === 'parent') 
//                 );

//                 console.log('Filtered Parent Categories:', parentCategories);

//                 parentCategories.forEach(category => {
//                     const li = document.createElement('li');
//                     li.className = 'mb-24';
//                     li.setAttribute('key', category._id);

//                     const divContainer = document.createElement('div');
//                     divContainer.className = 'form-check common-check common-radio';

//                     const input = document.createElement('input');
//                     input.className = 'form-check-input';
//                     input.type = 'radio';
//                     input.name = 'parentcategory';
//                     input.id = `parentcategory-${category._id}`;
//                     input.value = category._id;

//                     const label = document.createElement('label');
//                     label.className = 'form-check-label';
//                     label.htmlFor = `parentcategory-${category._id}`;
//                     label.textContent = category.parent_category || category.name || 'Unnamed Parent Category';

//                     divContainer.appendChild(input);
//                     divContainer.appendChild(label);
//                     li.appendChild(divContainer);
//                     parentCategoryList.appendChild(li);
//                 });
//             }

//             // Add event listeners for category selections
//             document.querySelectorAll('.form-check-input').forEach(input => {
//                 input.addEventListener('change', (e) => {
//                     const categoryId = e.target.value;
//                     const isChecked = e.target.checked;
//                     const categoryType = e.target.name;

//                     console.log(`${categoryType.charAt(0).toUpperCase() + categoryType.slice(1)} ${categoryId} is ${isChecked ? 'checked' : 'unchecked'}`);
//                 });
//             });
//         }

//         // Fetch brands from the API
//         const brandResponse = await fetch('http://localhost:5002/api/brand');
//         const brandData = await brandResponse.json();

//         console.log('Full Brand API Response:', brandData); // Detailed logging for debugging

//         if (brandData.success && brandData.brands && brandData.brands.length > 0) {
//             const brandList = document.getElementById('brandList');
//             if (brandList) {
//                 brandList.innerHTML = ''; // Clear the existing brand list

//                 // Iterate through the brands and create list items
//                 brandData.brands.forEach(brand => {
//                     const li = document.createElement('li');
//                     li.className = 'mb-24';
//                     li.setAttribute('key', brand._id);

//                     const divContainer = document.createElement('div');
//                     divContainer.className = 'form-check common-check common-radio';

//                     const input = document.createElement('input');
//                     input.className = 'form-check-input';
//                     input.type = 'radio';
//                     input.name = 'brand';
//                     input.id = `brand-${brand._id}`;
//                     input.value = brand._id;

//                     const label = document.createElement('label');
//                     label.className = 'form-check-label';
//                     label.htmlFor = `brand-${brand._id}`;
//                     label.textContent = brand.name || 'Unnamed Brand';

//                     divContainer.appendChild(input);
//                     divContainer.appendChild(label);
//                     li.appendChild(divContainer);
//                     brandList.appendChild(li);
//                 });
//             }
//         } else {
//             console.warn('No brands found or API response is invalid');
//         }

//     } catch (error) {
//         console.error('Error fetching or processing categories or brands:', error);

//         const errorContainer = document.createElement('div');
//         errorContainer.className = 'text-red-500 p-4';
//         errorContainer.textContent = 'Unable to load categories or brands. Please try again later.';

//         const subCategoryList = document.getElementById('categoryList');
//         const parentCategoryList = document.getElementById('parentcat_list');
//         const brandList = document.getElementById('brandList');

//         if (subCategoryList) subCategoryList.appendChild(errorContainer.cloneNode(true));
//         if (parentCategoryList) parentCategoryList.appendChild(errorContainer.cloneNode(true));
//         if (brandList) brandList.appendChild(errorContainer);
//     }
// });



// //greate
// // productListing.js
// class ProductListing {
//     constructor() {
//         this.baseUrl = 'http://localhost:5002/api/productweb';
//         this.currentPage = 1;
//         this.productsPerPage = 12;
//         this.totalProducts = 0;

//         this.initEventListeners();
//         this.fetchProducts();
//         this.fetchCategories();
//     }

//     initEventListeners() {
//         const categoryFilter = document.getElementById('categoryFilter');
//         const sortFilter = document.getElementById('sortFilter');

//         if (categoryFilter) {
//             categoryFilter.addEventListener('change', () => this.fetchProducts());
//         }

//         if (sortFilter) {
//             sortFilter.addEventListener('change', () => this.fetchProducts());
//         }
//     }

//     async fetchCategories() {
//         try {
//             // Replace with your actual endpoint to fetch categories
//             const response = await fetch('/api/categories');
//             const categories = await response.json();
//             const categorySelect = document.getElementById('categoryFilter');

//             if (categorySelect) {
//                 categories.forEach(category => {
//                     const option = document.createElement('option');
//                     option.value = category._id;
//                     option.textContent = category.name;
//                     categorySelect.appendChild(option);
//                 });
//             }
//         } catch (error) {
//             console.error('Error fetching categories:', error);
//         }
//     }

//     async fetchProducts() {
//         try {
//             const categoryFilter = document.getElementById('categoryFilter');
//             const sortFilter = document.getElementById('sortFilter');

//             let url = `${this.baseUrl}?`;

//             if (categoryFilter && categoryFilter.value) {
//                 url += `parent_category=${categoryFilter.value}&`;
//             }

//             // Additional filtering based on sort
//             if (sortFilter && sortFilter.value === 'featured') {
//                 url += 'featured=true&';
//             }

//             const response = await fetch(url);
//             const data = await response.json();

//             this.totalProducts = data.products.length;
//             this.renderProducts(this.sortProducts(data.products, sortFilter ? sortFilter.value : 'default'));
//             this.renderPagination();
//         } catch (error) {
//             console.error('Error fetching products:', error);
//         }
//     }

//     sortProducts(products, sortMethod) {
//         switch(sortMethod) {
//             case 'price-low':
//                 return products.sort((a, b) => this.extractPrice(a) - this.extractPrice(b));
//             case 'price-high':
//                 return products.sort((a, b) => this.extractPrice(b) - this.extractPrice(a));
//             case 'featured':
//                 return products.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));
//             default:
//                 return products;
//         }
//     }

//     extractPrice(product) {
//         // Check country_pricing first
//         if (product.country_pricing && product.country_pricing.length > 0) {
//             return parseFloat(product.country_pricing[0].price) || 0;
//         }

//         // Fallback to extracting price from description
//         const priceMatch = product.description?.match(/\$(\d+(\.\d{1,2})?)/);
//         return priceMatch ? parseFloat(priceMatch[1]) : 0;
//     }

//     renderProducts(products) {
//         const grid = document.getElementById('productGrid');
//         if (!grid) return;

//         grid.innerHTML = '';

//         const startIndex = (this.currentPage - 1) * this.productsPerPage;
//         const endIndex = startIndex + this.productsPerPage;
//         const paginatedProducts = products.slice(startIndex, endIndex);

//         paginatedProducts.forEach(product => {
//             const productCard = this.createProductCard(product);
//             grid.appendChild(productCard);
//         });
//     }

//     createProductCard(product) {
//         const card = document.createElement('div');
//         card.className = 'bg-white rounded-lg shadow-md overflow-hidden';

//         const imageUrl = product.image || 'placeholder.jpg';
//         const price = product.country_pricing?.[0]?.price || 'N/A';

//         card.innerHTML = `
//             <div class="relative">
//                 <img src="${imageUrl}" alt="${product.name}" class="w-full h-48 object-cover">
//                 ${product.todaysDeal ? 
//                     '<span class="absolute top-2 left-2 bg-red-500 text-white px-2 py-1 rounded text-sm">Today\'s Deal</span>' : 
//                     ''}
//             </div>
//             <div class="p-4">
//                 <h3 class="font-bold text-lg mb-2">${product.name}</h3>
//                 <div class="flex justify-between items-center">
//                     <span class="text-xl font-semibold text-green-600">$${price}</span>
//                     <button class="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
//                         Add to Cart
//                     </button>
//                 </div>
//                 ${product.featured ? 
//                     '<span class="text-sm text-yellow-600 mt-2 block">Featured Product</span>' : 
//                     ''}
//             </div>
//         `;

//         return card;
//     }

//     renderPagination() {
//         const pagination = document.getElementById('pagination');
//         if (!pagination) return;

//         pagination.innerHTML = '';

//         const totalPages = Math.ceil(this.totalProducts / this.productsPerPage);

//         for (let i = 1; i <= totalPages; i++) {
//             const pageButton = document.createElement('button');
//             pageButton.textContent = i;
//             pageButton.className = `px-4 py-2 border rounded ${this.currentPage === i ? 'bg-blue-500 text-white' : 'bg-white'}`;
//             pageButton.addEventListener('click', () => {
//                 this.currentPage = i;
//                 this.fetchProducts();
//             });
//             pagination.appendChild(pageButton);
//         }
//     }
// }

// // Initialize the product listing when the page loads
// document.addEventListener('DOMContentLoaded', () => {
//     new ProductListing();
// });


document.addEventListener('DOMContentLoaded', async () => {
    try {
        const categoryResponse = await fetch('http://localhost:5002/api/category');
        const categoryData = await categoryResponse.json();

        if (categoryData.success && categoryData.categories && categoryData.categories.length > 0) {
            // Handle Sub-Categories
            const subCategoryList = document.getElementById('categoryList');
            if (subCategoryList) {
                subCategoryList.innerHTML = '';

                categoryData.categories.forEach(category => {
                    if (category.name && Array.isArray(category.name)) {
                        category.name.forEach(nameObj => {
                            const li = document.createElement('li');
                            li.className = 'mb-24';

                            const divContainer = document.createElement('div');
                            divContainer.className = 'form-check common-check common-radio';

                            const input = document.createElement('input');
                            input.className = 'form-check-input';
                            input.type = 'radio';  // or 'checkbox' if you prefer
                            input.name = 'subcategory';
                            input.id = `subcategory-${nameObj._id}`;
                            input.value = nameObj._id;

                            const label = document.createElement('label');
                            label.className = 'form-check-label';
                            label.htmlFor = `subcategory-${nameObj._id}`;
                            label.textContent = nameObj.value || 'Unnamed Sub-Category';

                            divContainer.appendChild(input);
                            divContainer.appendChild(label);
                            li.appendChild(divContainer);
                            subCategoryList.appendChild(li);
                        });
                    }
                });
            }

            const parentCategoryList = document.getElementById('parentcat_list');
            if (parentCategoryList) {
                parentCategoryList.innerHTML = '';

                const parentCategories = categoryData.categories.filter(category =>
                    category.parent_category ||
                    category.isParent ||
                    (category.type && category.type.toLowerCase() === 'parent')
                );

                console.log('Filtered Parent Categories:', parentCategories);

                parentCategories.forEach(category => {
                    const li = document.createElement('li');
                    li.className = 'mb-24';
                    li.setAttribute('key', category._id);

                    const divContainer = document.createElement('div');
                    divContainer.className = 'form-check common-check common-radio';

                    const input = document.createElement('input');
                    input.className = 'form-check-input';
                    input.type = 'radio';
                    input.name = 'parentcategory';
                    input.id = `parentcategory-${category._id}`;
                    input.value = category._id;

                    const label = document.createElement('label');
                    label.className = 'form-check-label';
                    label.htmlFor = `parentcategory-${category._id}`;
                    label.textContent = category.parent_category || category.name || 'Unnamed Parent Category';

                    divContainer.appendChild(input);
                    divContainer.appendChild(label);
                    li.appendChild(divContainer);
                    parentCategoryList.appendChild(li);
                });
            }

            // Add event listeners for category selections
            document.querySelectorAll('.form-check-input').forEach(input => {
                input.addEventListener('change', (e) => {
                    const categoryId = e.target.value;
                    const isChecked = e.target.checked;
                    const categoryType = e.target.name;

                    console.log(`${categoryType.charAt(0).toUpperCase() + categoryType.slice(1)} ${categoryId} is ${isChecked ? 'checked' : 'unchecked'}`);
                });
            });
        }

        // Fetch brands from the API
        const brandResponse = await fetch('http://localhost:5002/api/brand');
        const brandData = await brandResponse.json();

        console.log('Full Brand API Response:', brandData); // Detailed logging for debugging

        if (brandData.success && brandData.brands && brandData.brands.length > 0) {
            const brandList = document.getElementById('brandList');
            if (brandList) {
                brandList.innerHTML = ''; // Clear the existing brand list

                // Iterate through the brands and create list items
                brandData.brands.forEach(brand => {
                    const li = document.createElement('li');
                    li.className = 'mb-24';
                    li.setAttribute('key', brand._id);

                    const divContainer = document.createElement('div');
                    divContainer.className = 'form-check common-check common-radio';

                    const input = document.createElement('input');
                    input.className = 'form-check-input';
                    input.type = 'radio';
                    input.name = 'brand';
                    input.id = `brand-${brand._id}`;
                    input.value = brand._id;

                    const label = document.createElement('label');
                    label.className = 'form-check-label';
                    label.htmlFor = `brand-${brand._id}`;
                    label.textContent = brand.name || 'Unnamed Brand';

                    divContainer.appendChild(input);
                    divContainer.appendChild(label);
                    li.appendChild(divContainer);
                    brandList.appendChild(li);
                });
            }
        } else {
            console.warn('No brands found or API response is invalid');
        }

    } catch (error) {
        console.error('Error fetching or processing categories or brands:', error);

        const errorContainer = document.createElement('div');
        errorContainer.className = 'text-red-500 p-4';
        errorContainer.textContent = 'Unable to load categories or brands. Please try again later.';

        const subCategoryList = document.getElementById('categoryList');
        const parentCategoryList = document.getElementById('parentcat_list');
        const brandList = document.getElementById('brandList');

        if (subCategoryList) subCategoryList.appendChild(errorContainer.cloneNode(true));
        if (parentCategoryList) parentCategoryList.appendChild(errorContainer.cloneNode(true));
        if (brandList) brandList.appendChild(errorContainer);
    }
});

// Product Listing Class
class ProductListing {
    constructor() {
        this.baseUrl = 'http://localhost:5002/api/productweb';
        this.currentPage = 1;
        this.productsPerPage = 12;
        this.totalProducts = 0;

        this.initEventListeners();
        this.fetchProducts();
        this.fetchCategories();
    }

    initEventListeners() {
        const categoryFilter = document.getElementById('categoryFilter');
        const sortFilter = document.getElementById('sortFilter');

        if (categoryFilter) {
            categoryFilter.addEventListener('change', () => this.fetchProducts());
        }

        if (sortFilter) {
            sortFilter.addEventListener('change', () => this.fetchProducts());
        }
    }

    async fetchCategories() {
        try {
            const response = await fetch('http://localhost:5002/api/category');
            const categoryData = await response.json();
            const categorySelect = document.getElementById('categoryFilter');

            if (categorySelect && categoryData.success && categoryData.categories) {
                categoryData.categories.forEach(category => {
                    const option = document.createElement('option');
                    option.value = category._id;
                    option.textContent = category.parent_category || category.name || 'Unnamed Category';
                    categorySelect.appendChild(option);
                });
            }
        } catch (error) {
            console.error('Error fetching categories:', error);
        }
    }

    async fetchProducts() {
        try {
            const categoryFilter = document.getElementById('categoryFilter');
            const sortFilter = document.getElementById('sortFilter');

            let url = `${this.baseUrl}?`;

            if (categoryFilter && categoryFilter.value) {
                url += `parent_category=${categoryFilter.value}&`;
            }

            // Additional filtering based on sort
            if (sortFilter && sortFilter.value === 'featured') {
                url += 'featured=true&';
            }

            const response = await fetch(url);
            const data = await response.json();

            this.totalProducts = data.products.length;
            this.renderProducts(this.sortProducts(data.products, sortFilter ? sortFilter.value : 'default'));
            this.renderPagination();
        } catch (error) {
            console.error('Error fetching products:', error);
        }
    }

    sortProducts(products, sortMethod) {
        switch (sortMethod) {
            case 'price-low':
                return products.sort((a, b) => this.extractPrice(a) - this.extractPrice(b));
            case 'price-high':
                return products.sort((a, b) => this.extractPrice(b) - this.extractPrice(a));
            case 'featured':
                return products.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));
            default:
                return products;
        }
    }

    extractPrice(product) {
        // Check country_pricing first
        if (product.country_pricing && product.country_pricing.length > 0) {
            return parseFloat(product.country_pricing[0].price) || 0;
        }

        // Fallback to extracting price from description
        const priceMatch = product.description?.match(/\$(\d+(\.\d{1,2})?)/);
        return priceMatch ? parseFloat(priceMatch[1]) : 0;
    }

    renderProducts(products) {
        const grid = document.getElementById('productGrid');
        if (!grid) return;

        grid.innerHTML = '';

        const startIndex = (this.currentPage - 1) * this.productsPerPage;
        const endIndex = startIndex + this.productsPerPage;
        const paginatedProducts = products.slice(startIndex, endIndex);

        paginatedProducts.forEach(product => {
            const productCard = this.createProductCard(product);
            grid.appendChild(productCard);
        });
    }

    createProductCard(product) {
        const card = document.createElement('div');
        card.className = 'product-card h-100 p-16 border border-gray-100 hover-border-main-600 rounded-16 position-relative transition-2';

        const imageUrl = product.image || 'placeholder.jpg';
        const price = product.country_pricing?.[0]?.price || 'N/A';

        card.innerHTML = `
            <a href="product-details.html" class="product-card__thumb flex-center rounded-8 bg-gray-50 position-relative">
                <img src="${imageUrl}" alt="${product.name}" class="w-auto ">
                ${product.todaysDeal ? 
                    '<span class="product-card__badge bg-primary-600 px-8 py-4 text-sm text-white position-absolute inset-inline-start-0 inset-block-start-0">Today\'s Deal</span>' : 
                    ''}
            </a>
            <div class="product-card__content mt-10">
                <h6 class="title text-lg fw-semibold mt-12 mb-8">
                    <a href="product-details.html" class="link text-line-2">${product.name}</a>
                </h6>
                <div class="product-card__price my-20">
                      <span class="text-gray-400 text-md fw-semibold text-decoration-line-through">${product.price}</span>
                      <span class="text-heading text-md fw-semibold ">${product.discount}<span
                      class="text-gray-500 fw-normal">/Qty</span> </span>
                  </div>
                <a href="cart.html" class="product-card__cart btn bg-gray-50 text-heading hover-bg-main-600 hover-text-white py-11 px-24 rounded-8 flex-center gap-8 fw-medium">
                    Add To Cart <i class="ph ph-shopping-cart"></i>
                </a>
            </div>
        `;

        return card;
    }

    renderPagination() {
        const pagination = document.getElementById('pagination');
        if (!pagination) return;

        pagination.innerHTML = '';

        const totalPages = Math.ceil(this.totalProducts / this.productsPerPage);

        // Previous page button
        const prevButton = document.createElement('li');
        prevButton.className = 'page-item';
        prevButton.innerHTML = `
            <a class="page-link h-64 w-64 flex-center text-xxl rounded-8 fw-medium text-neutral-600 border border-gray-100" href="#">
                <i class="ph-bold ph-arrow-left"></i>
            </a>
        `;
        pagination.appendChild(prevButton);

        // Page number buttons
        for (let i = 1; i <= totalPages; i++) {
            const pageItem = document.createElement('li');
            pageItem.className = `page-item ${this.currentPage === i ? 'active' : ''}`;
            pageItem.innerHTML = `
                <a class="page-link h-64 w-64 flex-center text-md rounded-8 fw-medium text-neutral-600 border border-gray-100" href="#">
                    ${i}
                </a>
            `;
            pageItem.addEventListener('click', () => {
                this.currentPage = i;
                this.fetchProducts();
            });
            pagination.appendChild(pageItem);
        }

        // Next page button
        const nextButton = document.createElement('li');
        nextButton.className = 'page-item';
        nextButton.innerHTML = `
            <a class="page-link h-64 w-64 flex-center text-xxl rounded-8 fw-medium text-neutral-600 border border-gray-100" href="#">
                <i class="ph-bold ph-arrow-right"></i>
            </a>
        `;
        pagination.appendChild(nextButton);
    }
}

// Initialize the product listing when the page loads
document.addEventListener('DOMContentLoaded', () => {
    new ProductListing();
});