document.addEventListener('DOMContentLoaded', function () {
    const urlParams = new URLSearchParams(window.location.search);
    const productId = urlParams.get('id');

    // Check if productId exists
    if (!productId) {
        console.error('No product ID found in URL');
        window.location.href = 'shop.html';
        return;
    }

    // Fetch product details
    async function fetchProductDetails() {
        try {
            const response = await fetch(`http://localhost:5002/api/product/${productId}`);

            // Check if response is okay
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();

            if (data.success) {
                const product = data.product;
                updateProductDetails(product);
                setupImageGallery(product);
                setupQuantityControls();
                setupWhatsAppSharing(product);
                handleAddToCart(product);
            } else {
                console.error('Failed to fetch product details');
            }
        } catch (error) {
            console.error('Error fetching product details:', error);
        }
    }

    function updateProductDetails(product) {
        // Update product name
        document.querySelector('.product-details__content h5').textContent = product.name;

        const productNameElement = document.getElementById('product-name');
        if (productNameElement) {
            productNameElement.textContent = product.name;
        }

        const descriptionElement = document.getElementById('productdescription');
        if (descriptionElement) {
            descriptionElement.textContent = stripHtmlTags(product.description) || 'No description available.';
        }

        // Update rating (using default 4.7 if no rating provided)
        const ratingContainer = document.querySelector('.flex-align.gap-12.flex-wrap .flex-align.gap-8');
        ratingContainer.innerHTML = generateStarRating(product.rating || 4.7);

        // Update description
        document.querySelector('.product-details__content p').textContent =
            product.description ? stripHtmlTags(product.description) : 'No description available.';

        // Update pricing (using first country pricing for AED)
        const aedPricing = product.country_pricing.find(p => p.currency_code === 'AED') ||
            product.country_pricing[0];
        const currentPrice = aedPricing ? aedPricing.discount : product.price;
        const originalPrice = aedPricing ? aedPricing.unit_price : currentPrice * 1.5;

        const priceContainer = document.querySelector('.mt-32.flex-align.flex-wrap.gap-32');
        priceContainer.querySelector('h4').textContent = `AED ${currentPrice.toFixed(2)}`;
        priceContainer.querySelector('.text-md.text-gray-500').textContent = `AED ${originalPrice.toFixed(2)}`;

        // Update stock progress
        const stockProgress = document.querySelector('.progress-bar');
        const availableStock = product.quantity || 45;
        const totalStock = 100;
        const stockPercentage = (availableStock / totalStock) * 100;

        stockProgress.style.width = `${stockPercentage}%`;
        document.querySelector('.text-sm.text-gray-700').textContent = `Available only: ${availableStock}`;

        // Update product specifications
        updateProductSpecifications(product);
    }

    function stripHtmlTags(html) {
        const temp = document.createElement('div');
        temp.innerHTML = html;
        return temp.textContent || temp.innerText || '';
    }

    function generateStarRating(rating) {
        return Array(5).fill().map((_, i) =>
            `<span class="text-15 fw-medium text-warning-600 d-flex">
                <i class="ph-fill ph-star ${i < Math.round(rating) ? 'active' : ''}"></i>
            </span>`
        ).join('');
    }


    function setupImageGallery(product) {
        const mainImageContainer = document.querySelector('.product-details__thumb-slider');
        const thumbnailContainer = document.querySelector('.product-details__images-slider');
    
        // Clear existing content
        mainImageContainer.innerHTML = '';
        thumbnailContainer.innerHTML = '';
    
        // Get all valid images (filter out empty strings)
        const images = [
            product.image,
            product.gallery1,
            product.gallery2,
            product.gallery3,
            product.gallery4,
            product.gallery5
        ].filter(img => img && img.trim() !== '');
    
        // If no images available, set a default image
        if (images.length === 0) {
            images.push('/assets/images/default-product.png');
        }
    
        // Set up main image
        const mainImageDiv = document.createElement('div');
        mainImageDiv.innerHTML = `
            <div class="product-details__thumb flex-center h-100">
                <img src="${images[0]}" 
                     alt="Main product image" 
                     onerror="this.src='/assets/images/default-product.png'"
                     class="main-product-image"
                     style="max-width: 100%; height: auto; object-fit: contain;">
            </div>
        `;
        mainImageContainer.appendChild(mainImageDiv);
    
        // Create thumbnail container
        const thumbnailWrapperDiv = document.createElement('div');
        thumbnailWrapperDiv.className = 'mt-24';
        thumbnailContainer.appendChild(thumbnailWrapperDiv);
    
        // Create thumbnail slider
        const sliderDiv = document.createElement('div');
        sliderDiv.className = 'thumbnail-slider';
        thumbnailWrapperDiv.appendChild(sliderDiv);
    
        // Add thumbnails
        images.forEach((img, index) => {
            const thumbnailDiv = document.createElement('div');
            thumbnailDiv.className = 'thumbnail-item cursor-pointer';
            thumbnailDiv.innerHTML = `
                <div>
                <div class="max-w-120 max-h-120 h-100 flex-center border border-gray-100 rounded-16 p-8 m-2">
                    <img src="${img}" 
                         alt="Product thumbnail ${index + 1}"
                         data-image="${img}"
                         onerror="this.src='/assets/images/default-product.png'"
                         style="max-width: 100%; height: auto; object-fit: contain;">
                </div>
                </div>
            `;
            sliderDiv.appendChild(thumbnailDiv);
    
            // Add click handler for each thumbnail
            thumbnailDiv.addEventListener('click', function() {
                // Update main image
                const mainImage = document.querySelector('.main-product-image');
                mainImage.src = img;
                
                // Update active state
                document.querySelectorAll('.thumbnail-item').forEach(thumb => {
                    thumb.classList.remove('active');
                });
                thumbnailDiv.classList.add('active');
            });
        });
    
        // Initialize Slick slider
        try {
            $('.thumbnail-slider').slick({
                slidesToShow: 4,
                slidesToScroll: 1,
                arrows: true,
                infinite: false,
                prevArrow: '<button type="button" class="slick-prev w-52 h-52 bg-main-50 text-main-600 text-xl hover-bg-main-600 hover-text-white flex-center rounded-circle"><i class="ph ph-arrow-left"></i></button>',
                nextArrow: '<button type="button" class="slick-next w-52 h-52 bg-main-50 text-main-600 text-xl hover-bg-main-600 hover-text-white flex-center rounded-circle"><i class="ph ph-arrow-right"></i></button>',
                responsive: [
                    {
                        breakpoint: 992,
                        settings: {
                            slidesToShow: 3,
                        }
                    },
                    {
                        breakpoint: 768,
                        settings: {
                            slidesToShow: 2,
                        }
                    }
                ]
            });
    
            document.querySelector('.thumbnail-item')?.classList.add('active');
        } catch (error) {
            console.warn('Slick slider initialization failed:', error);
        }
    }

    const facebookButton = document.getElementById('facebook');
    const currentURL = encodeURIComponent(window.location.href);
    facebookButton.href = `https://www.facebook.com/sharer/sharer.php?u=${currentURL}`;

    const whatsappButton = document.getElementById('whatsapp');
    whatsappButton.href = `https://api.whatsapp.com/send?text=${encodeURIComponent('Check this out: ' + window.location.href)}`;

    function setupQuantityControls() {
        const quantityMinus = document.querySelector('.quantity__minus');
        const quantityPlus = document.querySelector('.quantity__plus');
        const quantityInput = document.querySelector('.quantity__input');

        quantityMinus.addEventListener('click', () => {
            let currentValue = parseInt(quantityInput.value);
            if (currentValue > 1) {
                quantityInput.value = currentValue - 1;
            }
        });

        quantityPlus.addEventListener('click', () => {
            let currentValue = parseInt(quantityInput.value);
            quantityInput.value = currentValue + 1;
        });
    }

    function setupWhatsAppSharing(product) {
        const whatsappButton = document.getElementById('whatsapp-order');

        whatsappButton.addEventListener('click', (e) => {
            e.preventDefault();
            const quantity = document.querySelector('.quantity__input').value;
            const aedPricing = product.country_pricing.find(p => p.currency_code === 'AED') ||
                product.country_pricing[0];

            let message = `I'm interested in ${product.name}\n`;
            message += `Price: AED ${aedPricing ? aedPricing.discount : product.price}\n`;
            message += `Quantity: ${quantity}\n`;
            message += `Description: ${stripHtmlTags(product.description)}\n`;
            message += `image: ${stripHtmlTags(product.image)}\n`;

            const encodedMessage = encodeURIComponent(message)
                .replace(/%0A/g, '%0A')
                .replace(/%20/g, '+');

            const phoneNumber = '918086835242';

            function generateWhatsAppUrls(phoneNumber, message) {
                return [
                    `https://api.whatsapp.com/send?phone=${phoneNumber}&text=${message}`,
                    `whatsapp://send?phone=${phoneNumber}&text=${message}`,
                    `https://web.whatsapp.com/send?phone=${phoneNumber}&text=${message}`
                ];
            }

            // Advanced device detection and URL handling
            function openWhatsApp(urls) {
                const userAgent = navigator.userAgent.toLowerCase();
                const isMobile = /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/.test(userAgent);

                // Prioritize URLs based on device
                const urlsToTry = isMobile
                    ? [urls[0], urls[1], urls[2]]  // Mobile priority
                    : [urls[2], urls[0]];  // Desktop priority

                function attemptOpen(index = 0) {
                    if (index >= urlsToTry.length) {
                        navigator.clipboard.writeText(message).then(() => {
                            alert('Could not open WhatsApp. Message copied to clipboard.');
                        }).catch(() => {
                            alert('Unable to open WhatsApp. Please copy the message manually.');
                        });
                        return;
                    }

                    const url = urlsToTry[index];

                    const link = document.createElement('a');
                    link.href = url;
                    link.style.display = 'none';
                    document.body.appendChild(link);

                    try {
                        link.click();

                        setTimeout(() => {
                            document.body.removeChild(link);
                        }, 100);
                    } catch (error) {
                        console.error(`Failed to open URL: ${url}`, error);
                        attemptOpen(index + 1);
                    }
                }
                attemptOpen();
            }

            const whatsappUrls = generateWhatsAppUrls(phoneNumber, encodedMessage);
            openWhatsApp(whatsappUrls);
        });
    }

    function updateProductSpecifications(product) {
       
        const specsList = document.querySelector('.product-dContent__box ul');
        

        const specifications = [
            { label: 'Product Type', value: product.product_type || 'N/A' },
            { label: 'Brand', value: product.brand?.[0]?.name || 'N/A' },
            { label: 'Category', value: product.parent_category?.[0]?.parent_category || 'N/A' },
            { label: 'Unit', value: product.unit || 'N/A' },
            { label: 'Weight', value: product.weight || 'N/A' },
            { label: 'Attribute', value: product.attribute?.[0]?.name || 'N/A' },
            { label: 'Color', value: product.color?.[0]?.name || 'N/A' },
            { label: 'Shipping Time', value: `${product.shipping_time || 'N/A'} days` },
            { label: 'Shipping Price', value: `AED ${product.shipping_price || 'N/A'}` },
            { label: 'Tax', value: `AED ${product.tax || 'N/A'}` }
        ];

        specsList.innerHTML = specifications.map(spec => `
            <li class="text-gray-400 mb-14 flex-align gap-14">
                <span class="w-20 h-20 bg-main-50 text-main-600 text-xs flex-center rounded-circle">
                    <i class="ph ph-check"></i>
                </span>
                <span class="text-heading fw-medium">
                    ${spec.label}:
                    <span class="text-gray-500">${spec.value}</span>
                </span>
            </li>
        `).join('');
    }

    function handleAddToCart(product) {
        const addToCartButton = document.querySelector('[onClick="handleAddToCart"]');

        addToCartButton.addEventListener('click', (e) => {
            const quantity = document.querySelector('.quantity__input').value;
            const aedPricing = product.country_pricing.find(p => p.currency_code === 'AED') ||
                product.country_pricing[0];

            // Implement your cart logic here
            // This could involve:
            // 1. Adding item to localStorage/sessionStorage
            // 2. Sending data to backend via fetch
            // 3. Updating cart count in UI

            console.log('Adding to cart:', {
                productId: product._id,
                name: product.name,
                price: aedPricing ? aedPricing.discount : product.price,
                quantity: quantity
            });
        });
    }

    // Initialize the page
    fetchProductDetails();
});