const searchBtn = document.getElementById('search-btn');
const searchInput = document.getElementById('search-input');
const resultsDiv = document.getElementById('results');
const showAllBtn = document.getElementById('show-all-btn');
const mealDetailsModal = new bootstrap.Modal(document.getElementById('mealDetailsModal'));
let allMeals = [];

searchBtn.addEventListener('click', async () => {
    const query = searchInput.value.trim();
    if (!query) return alert('Please enter a meal name.');

    const apiUrl = `https://www.themealdb.com/api/json/v1/1/search.php?s=${query}`;
    resultsDiv.innerHTML = '';
    showAllBtn.classList.add('d-none');

    try {
        const response = await fetch(apiUrl);
        const data = await response.json();
        if (data.meals) {
            allMeals = data.meals;
            displayMeals(allMeals.slice(0, 5));
            if (allMeals.length > 5) {
                showAllBtn.classList.remove('d-none');
            }
        } else {
            resultsDiv.innerHTML = '<p class="text-center">No meals found. Try another search.</p>';
        }
    } catch (error) {
        console.error('Error fetching data:', error);
        resultsDiv.innerHTML = '<p class="text-center text-danger">There was an error fetching the meals. Please try again later.</p>';
    }
});

showAllBtn.addEventListener('click', () => {
    displayMeals(allMeals);
    showAllBtn.classList.add('d-none');
});

function displayMeals(meals) {
    resultsDiv.innerHTML = meals.map(meal => `
        <div class="col-md-4 col-sm-6">
            <div class="card meal-card">
                <img src="${meal.strMealThumb}" alt="${meal.strMeal}" class="card-img-top">
                <div class="card-body">
                    <h5 class="card-title">${meal.strMeal}</h5>
                    <p class="card-text">Meal ID: <span class="text-primary">${meal.idMeal}</span></p>
                    <button class="btn btn-primary" onclick="showMealDetails(${meal.idMeal})">Details</button>
                </div>
            </div>
        </div>
    `).join('');
}

async function showMealDetails(mealId) {
    const apiUrl = `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealId}`;
    try {
        const response = await fetch(apiUrl);
        const data = await response.json();
        const meal = data.meals[0];

        document.getElementById('mealTitle').textContent = meal.strMeal;
        document.getElementById('mealId').textContent = meal.idMeal;
        document.getElementById('mealImage').src = meal.strMealThumb;
        document.getElementById('mealInstructions').textContent = meal.strInstructions;
        document.getElementById('mealCategory').textContent = meal.strCategory || 'N/A';
        document.getElementById('mealArea').textContent = meal.strArea || 'N/A';

        mealDetailsModal.show();
    } catch (error) {
        console.error('Error fetching meal details:', error);
        alert('Could not fetch meal details. Please try again later.');
    }
}
