document.addEventListener("DOMContentLoaded", () => {
    const countrySelect = document.getElementById("countrySelect");
    const countryDisplayElement = document.getElementById("selectedCountryDisplay");

    // Function to fetch countries from the API
    const fetchCountries = async () => {
        try {
            console.log("Fetching countries...");
            const response = await fetch("http://localhost:5001/api/country_web");

            if (!response.ok) {
                throw new Error(`Failed to fetch countries: HTTP ${response.status}`);
            }

            const apiResponse = await response.json();
            console.log("Full API Response:", apiResponse);

            // Extract countries from the correct property
            const countries = apiResponse.data || [];
            console.log("Extracted Countries:", countries);

            return countries;
        } catch (error) {
            console.error("Error fetching countries:", error);
            if (countrySelect) {
                countrySelect.innerHTML = `
                    <option value="" disabled selected>Error loading locations</option>
                `;
            }
            return [];
        }
    };

    // Function to populate the dropdown with countries
    const populateDropdown = (countries) => {
        if (!countrySelect) return;

        console.log("Populating dropdown...");
        countrySelect.innerHTML = '<option value="">Select location</option>';

        countries.forEach((country) => {
            const countryData = {
                id: country._id || "",
                name: country.country || "Unknown",
                country_code: country.currency_code || "", 
                currency: country.currency || "",
                flag: country.flag || ""
            };

            const option = document.createElement("option");
            option.value = JSON.stringify(countryData);
            option.textContent = countryData.name || countryData.country_code;
            countrySelect.appendChild(option);

            console.log("Added Country Option:", countryData);
        });

        // Restore previously selected country
        restoreSavedCountry(countries);
    };

    // Function to restore saved country selection
    const restoreSavedCountry = (countries) => {
        const savedCountry = localStorage.getItem('selectedCountry');
        if (savedCountry) {
            try {
                const parsedCountry = JSON.parse(savedCountry);
                console.log("Attempting to restore saved country:", parsedCountry);

                // Set the dropdown to the saved country
                Array.from(countrySelect.options).forEach((option) => {
                    try {
                        const optionData = JSON.parse(option.value || '{}');
                        if (optionData.name === parsedCountry.name) {
                            countrySelect.value = option.value;
                            updateSelectedCountryDisplay(parsedCountry);
                            triggerProductListingRefresh();
                            console.log("Restored previous country selection:", optionData);
                        }
                    } catch (parseError) {
                        console.error("Error parsing option data:", parseError);
                    }
                });
            } catch (error) {
                console.error("Error parsing saved country:", error);
            }
        }
    };

    // Function to update country display
    const updateSelectedCountryDisplay = (selectedCountry) => {
        if (countryDisplayElement) {
            const displayContent = `
                <strong>Selected Country:</strong>
                <div class="selected-country-details">
                    <p><strong>Name:</strong> ${selectedCountry.name}</p>
                    <p><strong>Currency Code:</strong> ${selectedCountry.country_code}</p>
                    <p><strong>Currency:</strong> ${selectedCountry.currency}</p>
                    ${selectedCountry.flag ? `<img src="${selectedCountry.flag}" alt="${selectedCountry.name} flag" class="country-flag">` : ''}
                </div>
            `;
            countryDisplayElement.innerHTML = displayContent;
            countryDisplayElement.style.display = 'block';
        } else {
            console.warn("No display element found for selected country");
        }
    };

    // Function to trigger product listing refresh
    const triggerProductListingRefresh = () => {
        if (typeof productListing !== 'undefined' && productListing) {
            console.log("Refreshing product listing for new country");
            productListing.currentPage = 1;
            productListing.fetchProducts();
        } else {
            console.warn("Product listing not available for refresh");
        }
    };

    // Country selection event listener
    const handleCountrySelection = async (event) => {
        const selectedValue = countrySelect.value;
        console.log("Selected value (raw):", selectedValue);

        if (selectedValue) {
            try {
                const selectedCountry = JSON.parse(selectedValue);
                console.log("Selected Country Details (parsed):", selectedCountry);

                // Store the selected country in localStorage
                localStorage.setItem('selectedCountry', JSON.stringify(selectedCountry));

                // Update country display
                updateSelectedCountryDisplay(selectedCountry);

                // Trigger product listing refresh
                triggerProductListingRefresh();

                // Optional: Send selected country to backend
                try {
                    const response = await fetch('http://localhost:5001/api/save-selected-country', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify(selectedCountry)
                    });

                    const result = await response.json();
                    console.log('Country save response:', result);
                } catch (saveError) {
                    console.error('Error saving selected country:', saveError);
                }

            } catch (error) {
                console.error("Error parsing selected country:", error);
            }
        } else {
            // Remove from localStorage if no country is selected
            localStorage.removeItem('selectedCountry');
            
            // Hide display if exists
            if (countryDisplayElement) {
                countryDisplayElement.style.display = 'none';
            }
        }
    };

    // Add event listener to country select
    if (countrySelect) {
        countrySelect.addEventListener("change", handleCountrySelection);
    }

    // Main initialization function
    const initCountrySelection = async () => {
        // Fetch countries
        const countries = await fetchCountries();

        // Populate dropdown
        populateDropdown(countries);
    };

    // Initialize country selection
    initCountrySelection();
});


