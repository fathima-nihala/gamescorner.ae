class CategoryManager {
  constructor(apiBaseUrl = "http://localhost:5000/api") {
    this.apiBaseUrl = apiBaseUrl;

    // Bind the method to preserve context
    this.extractCategoryName = this.extractCategoryName.bind(this);

    // Safe element selection with fallbacks
    this.categoriesList =
      document.getElementById("categoriesList") ||
      this.createFallbackElement("categoriesList");
    this.loadingIndicator =
      document.getElementById("loadingIndicator") ||
      this.createFallbackElement("loadingIndicator");
    this.errorMessage =
      document.getElementById("errorMessage") ||
      this.createFallbackElement("errorMessage");

    // Category filter input
    this.categoryFilter = document.getElementById("categoryFilter");

    // Breadcrumb navigation
    this.breadcrumbContainer =
      document.getElementById("breadcrumbContainer") ||
      this.createFallbackElement("breadcrumbContainer");

    // Navigation stack to track category hierarchy
    this.categoryStack = [];

    this.gamingCategories = {
      Monitors: [],
      Consoles: ["PS5", "Xbox", "Switch", "Portable Consoles", "PS4"],
      Games: ["PS5 Games", "PS4 Games", "Switch Games", "Xbox Games"],
      Accessories: [
        "Gaming Chairs",
        "Gaming Table",
        "Keyboard",
        "Mouse",
        "Joystick & Controllers",
        "Mouse Pads",
      ],
      "PC Parts": [
        "Processor",
        "Motherboard",
        "RAM",
        "Graphic Card",
        "Power Supply",
      ],
      "Pre owned": [
        "Pre owned consoles",
        "Pre owned games",
        "Laptops",
        "i pad",
      ],
    };
    ``;
    // Add event listener for filtering if the input exists
    if (this.categoryFilter) {
      this.categoryFilter.addEventListener("input", (e) =>
        this.fetchAndRenderCategories(e.target.value)
      );
    } else {
      console.warn(
        "Category filter input not found. Filtering will be disabled."
      );
    }
  }

  // Create a fallback element if not found
  createFallbackElement(id) {
    const element = document.createElement("div");
    element.id = id;
    document.body.appendChild(element);
    return element;
  }

  // Render breadcrumb navigation
  updateBreadcrumbs() {
    // Clear existing breadcrumbs
    this.breadcrumbContainer.innerHTML = "";

    // Add home/root link
    const homeLink = document.createElement("span");
    homeLink.innerHTML = "Home";
    homeLink.classList.add("breadcrumb-item", "cursor-pointer");
    homeLink.addEventListener("click", () => this.resetToRootCategories());
    this.breadcrumbContainer.appendChild(homeLink);

    // Render breadcrumb trail
    this.categoryStack.forEach((category, index) => {
      const separator = document.createElement("span");
      separator.textContent = " > ";
      this.breadcrumbContainer.appendChild(separator);

      const categoryLink = document.createElement("span");
      categoryLink.textContent = category;
      categoryLink.classList.add("breadcrumb-item", "cursor-pointer");

      // Allow navigating to previous levels
      categoryLink.addEventListener("click", () => {
        // Remove items after this index
        this.categoryStack = this.categoryStack.slice(0, index + 1);
        this.fetchAndRenderCategories(category);
      });

      this.breadcrumbContainer.appendChild(categoryLink);
    });
  }

  // Reset to root categories
  resetToRootCategories() {
    this.categoryStack = [];
    this.fetchAndRenderCategories();
    this.updateBreadcrumbs();
  }

  // Fetch categories from the backend
  async fetchCategories(parentCategory = "", searchTerm = "") {
    try {
      console.log("Fetching categories with parent:", parentCategory);

      // Construct URL with optional parent category and search filter
      let url = `${this.apiBaseUrl}/category`;
      const params = new URLSearchParams();

      if (parentCategory) {
        params.append("parent_category", parentCategory);
      }

      if (searchTerm) {
        params.append("search", searchTerm);
      }

      // Append parameters if they exist
      if (params.toString()) {
        url += `?${params.toString()}`;
      }

      console.log("Fetch URL:", url);

      // Show loading indicator
      this.loadingIndicator.style.display = "block";

      // Clear the categories list and error message
      this.categoriesList.innerHTML = "";
      this.errorMessage.textContent = "";

      const response = await fetch(url);

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      console.log("Fetched categories data:", data);

      return data.categories || [];
    } catch (error) {
      console.error("Fetch error:", error);
      this.handleError(error);
      return [];
    } finally {
      this.loadingIndicator.style.display = "none";
    }
  }

  // Render categories in the list
  async fetchAndRenderCategories() {
    try {
      const categories = await this.fetchCategories(); // Fetch categories from API

      if (!categories || categories.length === 0) {
        this.categoriesList.innerHTML = `
                <li class="text-center text-gray-500 py-4">
                    No categories found.
                </li>`;
        return;
      }

      this.categoriesList.innerHTML = ""; // Clear previous items

      categories.forEach((category) => {
        const { parent_category, name, icon } = category;

        // Create main menu item for the parent_category
        const mainMenuItem = document.createElement("li");
        mainMenuItem.classList.add("has-submenus-submenu");

        const menuLink = document.createElement("a");
        menuLink.href = "javascript:void(0)";
        menuLink.className =
          "text-gray-500 text-15 py-12 px-16 flex-align gap-8 rounded-0";
        menuLink.innerHTML = `
                <span class="text-xl d-flex">
                    <img src="${icon}" alt="${parent_category} Icon" class="w-14 h-14">
                </span>
                <span>${parent_category}</span>
                ${
                  name && name.length > 0
                    ? `<span class="icon text-md d-flex ms-auto">
                              <i class="ph ph-caret-right"></i>
                          </span>`
                    : ""
                }
            `;

        mainMenuItem.appendChild(menuLink);

        // If there are subcategories, create a submenu
        if (name && name.length > 0) {
          const submenuContainer = document.createElement("div");
          submenuContainer.className = "submenus-submenu py-16";

          const submenuTitle = document.createElement("h6");
          submenuTitle.className = "text-lg px-16 submenus-submenu__title";
          submenuTitle.textContent = parent_category;

          const submenuList = document.createElement("ul");
          submenuList.className =
            "submenus-submenu__list max-h-300 overflow-y-auto scroll-sm";

          name.forEach((subcategory) => {
            const subMenuItem = document.createElement("li");
            const subMenuLink = document.createElement("a");
            subMenuLink.href = "shop.html";
            subMenuLink.textContent = subcategory.value;

            subMenuItem.appendChild(subMenuLink);
            submenuList.appendChild(subMenuItem);
          });

          submenuContainer.appendChild(submenuTitle);
          submenuContainer.appendChild(submenuList);

          mainMenuItem.appendChild(submenuContainer);
        }

        this.categoriesList.appendChild(mainMenuItem);
      });
    } catch (error) {
      console.error("Error rendering categories:", error);
      this.handleError(error);
    }
  }

  // Helper method to extract category name safely
  extractCategoryName(name) {
    if (typeof name === "string") {
      return name;
    }
    if (Array.isArray(name)) {
      // Use arrow function to preserve context or bind the method
      return name.map((n) => this.extractCategoryName(n)).join(", ");
    }
    if (typeof name === "object" && name !== null) {
      // Use arrow function or bind to preserve context
      return Object.values(name)
        .map((n) => this.extractCategoryName(n))
        .join(", ");
    }
    return "Unnamed Category";
  }

  // Method to remove object ID from category name
  removeCategoryId(name) {
    // Remove any patterns like [123] or (456) from the end of the string
    return name.replace(/\s*[\[\(]\d+[\]\)]$/, "").trim();
  }

  // Handle errors
  handleError(error) {
    console.error("Error:", error);
    this.errorMessage.textContent = `Error: ${error.message}`;
    this.errorMessage.style.display = "block";
  }

  // Initialize the category manager
  init() {
    this.fetchAndRenderCategories();

    // Optional: Add a back button to return to previous level
    const backButton = document.getElementById("backButton");
    if (backButton) {
      backButton.addEventListener("click", () => {
        if (this.categoryStack.length > 1) {
          // Remove the current category and go back to previous
          this.categoryStack.pop();
          const previousCategory =
            this.categoryStack[this.categoryStack.length - 1];
          this.fetchAndRenderCategories(previousCategory);
        } else {
          // If at root, reset to initial state
          this.resetToRootCategories();
        }
      });
    }
  }
}

// Initialize when DOM is fully loaded
document.addEventListener("DOMContentLoaded", () => {
  console.log("DOM fully loaded. Initializing CategoryManager.");
  const categoryManager = new CategoryManager();
  categoryManager.init();
});
