
document.addEventListener('DOMContentLoaded', async () => {
    try {
        const categoryResponse = await fetch('http://localhost:5002/api/category');
        const categoryData = await categoryResponse.json();
        
        console.log('Full API Response:', categoryData); // Detailed logging for debugging
        
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
