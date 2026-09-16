// ==========================================
// RECIPE BOOK - TASK 24
// ==========================================

// Default recipes
const defaultRecipes = [
    {
        id: Date.now() + 1,
        name: "Masala Dosa",
        category: "Breakfast",
        ingredients:
            "2 cups rice\n1 cup urad dal\n2 potatoes\n1 onion\nGreen chilies\nSalt\nOil",
        instructions:
            "Soak rice and urad dal separately for 5-6 hours.\n\nGrind them into a smooth batter and ferment overnight.\n\nPrepare potato masala with onion and spices.\n\nHeat a pan and spread dosa batter into a thin circle.\n\nAdd potato masala and fold the dosa.",
        time: "30 minutes",
        image:
            "https://images.unsplash.com/photo-1668236543090-82eba5ee5976?auto=format&fit=crop&w=800&q=80"
    },

    {
        id: Date.now() + 2,
        name: "Veg Biryani",
        category: "Dinner",
        ingredients:
            "2 cups basmati rice\nMixed vegetables\nOnion\nTomato\nBiryani masala\nMint leaves\nSalt",
        instructions:
            "Wash and soak basmati rice.\n\nCook vegetables with onion, tomato and spices.\n\nAdd partially cooked rice.\n\nCover and cook on low flame until the rice is completely cooked.\n\nGarnish with mint leaves.",
        time: "45 minutes",
        image:
            "https://images.unsplash.com/photo-1589302168068-964664d93dc0?auto=format&fit=crop&w=800&q=80"
    },

    {
        id: Date.now() + 3,
        name: "Chocolate Cake",
        category: "Dessert",
        ingredients:
            "1 cup flour\n1/2 cup cocoa powder\n1 cup sugar\n2 eggs\n1/2 cup milk\n1/2 cup butter\n1 tsp baking powder",
        instructions:
            "Mix flour, cocoa powder, sugar and baking powder.\n\nAdd eggs, milk and melted butter.\n\nMix everything well.\n\nPour the mixture into a cake pan.\n\nBake at 180°C for approximately 30 minutes.",
        time: "40 minutes",
        image:
            "https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=800&q=80"
    }
];


// ==========================================
// GET RECIPES FROM LOCAL STORAGE
// ==========================================

let recipes = JSON.parse(localStorage.getItem("recipes"));

if (!recipes || recipes.length === 0) {
    recipes = defaultRecipes;
    saveRecipes();
}


// ==========================================
// SAVE RECIPES
// ==========================================

function saveRecipes() {
    localStorage.setItem("recipes", JSON.stringify(recipes));
}


// ==========================================
// RENDER RECIPES
// ==========================================

function renderRecipes() {

    const recipeList = document.getElementById("recipeList");

    const searchText =
        document.getElementById("searchInput").value
        .toLowerCase()
        .trim();

    const selectedCategory =
        document.getElementById("categoryFilter").value;

    const filteredRecipes = recipes.filter(recipe => {

        const matchesSearch =
            recipe.name.toLowerCase().includes(searchText) ||
            recipe.ingredients.toLowerCase().includes(searchText);

        const matchesCategory =
            selectedCategory === "All" ||
            recipe.category === selectedCategory;

        return matchesSearch && matchesCategory;
    });

    document.getElementById("recipeCount").textContent =
        `${filteredRecipes.length} recipe${filteredRecipes.length !== 1 ? "s" : ""}`;

    if (filteredRecipes.length === 0) {

        recipeList.innerHTML = `
            <div class="empty">
                <h3>🍽️ No Recipes Found</h3>
                <p>Try another search or add a new recipe.</p>
            </div>
        `;

        return;
    }

    recipeList.innerHTML = filteredRecipes.map(recipe => {

        return `
            <article class="recipe-card">

                <img
                    src="${recipe.image || 'https://images.unsplash.com/photo-1498837167922-ddd27525d352?auto=format&fit=crop&w=800&q=80'}"
                    alt="${escapeHTML(recipe.name)}"
                    onerror="this.src='https://images.unsplash.com/photo-1498837167922-ddd27525d352?auto=format&fit=crop&w=800&q=80'"
                >

                <div class="card-body">

                    <span class="category">
                        ${escapeHTML(recipe.category)}
                    </span>

                    <h3>
                        ${escapeHTML(recipe.name)}
                    </h3>

                    <p class="card-time">
                        ⏱️ ${escapeHTML(recipe.time)}
                    </p>

                    <div class="card-buttons">

                        <button
                            class="view-btn"
                            onclick="viewRecipe(${recipe.id})">
                            View
                        </button>

                        <button
                            class="edit-btn"
                            onclick="editRecipe(${recipe.id})">
                            Edit
                        </button>

                        <button
                            class="delete-btn"
                            onclick="deleteRecipe(${recipe.id})">
                            Delete
                        </button>

                    </div>

                </div>

            </article>
        `;

    }).join("");
}


// ==========================================
// OPEN ADD RECIPE FORM
// ==========================================

function openForm() {

    document.getElementById("recipeModal").style.display = "block";

    document.getElementById("recipeForm").reset();

    document.getElementById("recipeId").value = "";

    document.getElementById("formTitle").textContent = "Add Recipe";
}


// ==========================================
// CLOSE FORM
// ==========================================

function closeForm() {
    document.getElementById("recipeModal").style.display = "none";
}


// ==========================================
// ADD / UPDATE RECIPE
// ==========================================

document
    .getElementById("recipeForm")
    .addEventListener("submit", function(event) {

        event.preventDefault();

        const id = document.getElementById("recipeId").value;

        const recipeData = {

            id: id ? Number(id) : Date.now(),

            name:
                document.getElementById("recipeName").value.trim(),

            category:
                document.getElementById("recipeCategory").value,

            ingredients:
                document.getElementById("recipeIngredients").value.trim(),

            instructions:
                document.getElementById("recipeInstructions").value.trim(),

            time:
                document.getElementById("recipeTime").value.trim(),

            image:
                document.getElementById("recipeImage").value.trim()
        };


        // UPDATE
        if (id) {

            recipes = recipes.map(recipe => {

                if (recipe.id === Number(id)) {
                    return recipeData;
                }

                return recipe;
            });

        }

        // ADD
        else {

            recipes.push(recipeData);
        }


        saveRecipes();

        renderRecipes();

        closeForm();

        alert(
            id
                ? "Recipe updated successfully! ✅"
                : "Recipe added successfully! 🎉"
        );
    });


// ==========================================
// EDIT RECIPE
// ==========================================

function editRecipe(id) {

    const recipe = recipes.find(recipe => recipe.id === id);

    if (!recipe) return;

    document.getElementById("recipeModal").style.display = "block";

    document.getElementById("formTitle").textContent =
        "Edit Recipe";

    document.getElementById("recipeId").value =
        recipe.id;

    document.getElementById("recipeName").value =
        recipe.name;

    document.getElementById("recipeCategory").value =
        recipe.category;

    document.getElementById("recipeIngredients").value =
        recipe.ingredients;

    document.getElementById("recipeInstructions").value =
        recipe.instructions;

    document.getElementById("recipeTime").value =
        recipe.time;

    document.getElementById("recipeImage").value =
        recipe.image || "";
}


// ==========================================
// DELETE RECIPE
// ==========================================

function deleteRecipe(id) {

    const recipe = recipes.find(recipe => recipe.id === id);

    if (!recipe) return;

    const confirmed = confirm(
        `Are you sure you want to delete "${recipe.name}"?`
    );

    if (!confirmed) {
        return;
    }

    recipes = recipes.filter(recipe => recipe.id !== id);

    saveRecipes();

    renderRecipes();
}


// ==========================================
// VIEW RECIPE DETAILS
// ==========================================

function viewRecipe(id) {

    const recipe = recipes.find(recipe => recipe.id === id);

    if (!recipe) return;

    document.getElementById("detailModal").style.display = "block";

    document.getElementById("detailImage").src =
        recipe.image ||
        "https://images.unsplash.com/photo-1498837167922-ddd27525d352?auto=format&fit=crop&w=800&q=80";

    document.getElementById("detailName").textContent =
        recipe.name;

    document.getElementById("detailCategory").textContent =
        recipe.category;

    document.getElementById("detailTime").textContent =
        recipe.time;

    document.getElementById("detailIngredients").textContent =
        recipe.ingredients;

    document.getElementById("detailInstructions").textContent =
        recipe.instructions;
}


// ==========================================
// CLOSE DETAILS
// ==========================================

function closeDetails() {
    document.getElementById("detailModal").style.display = "none";
}


// ==========================================
// CLOSE MODALS WHEN CLICKING OUTSIDE
// ==========================================

window.addEventListener("click", function(event) {

    const recipeModal =
        document.getElementById("recipeModal");

    const detailModal =
        document.getElementById("detailModal");

    if (event.target === recipeModal) {
        closeForm();
    }

    if (event.target === detailModal) {
        closeDetails();
    }
});


// ==========================================
// SECURITY HELPER
// ==========================================

function escapeHTML(text) {

    return String(text)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}


// ==========================================
// INITIAL DISPLAY
// ==========================================

renderRecipes();