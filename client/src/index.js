// import the React and ReactDOM libraries or another file in our project
import React from 'react';
import ReactDOM from 'react-dom';
import RecipeList from "./components/RecipeList";

// const fetchRecipes = async () => {
//   // getting list of recipes from backend api (GET /fetch_recipes endpoint)
//   const url = `http://localhost:9000/fetch_recipes`;

//   const options = {
//     "method": "GET"
//   };
//   // calling api and waiting for response
//   const apiResponse = await fetch(url, options);
//   // turning response into json
//   const jsonApiResponse = await apiResponse.json();
//   // return the list of recipes from api response
//   return jsonApiResponse.results;
// };

// // we need to await as fetchRecipes is async
// const recipes = await fetchRecipes();
const recipes = [{  "id": 641993,  "title": "Easy Homemade Oreo Cookies",  "image": "https://spoonacular.com/recipeImages/641993-312x231.jpg",  "imageType": "jpg"},{  "id": 1055614,  "title": "How to Make a Louisiana Style Gumbo",  "image": "https://spoonacular.com/recipeImages/1055614-312x231.jpg",  "imageType": "jpg"},{  "id": 647197,  "title": "Honey Chipotle Pork Ribs",  "image": "https://spoonacular.com/recipeImages/647197-312x231.jpg",  "imageType": "jpg"},{  "id": 617047,  "title": "Rasmalai ",  "image": "https://spoonacular.com/recipeImages/617047-312x231.jpg",  "imageType": "jpg"},{  "id": 157994,  "title": "Oreo Balls",  "image": "https://spoonacular.com/recipeImages/157994-312x231.jpg",  "imageType": "jpg"},{  "id": 1184955,  "title": "How to Make Grilled Beer Butt Chicken",  "image": "https://spoonacular.com/recipeImages/1184955-312x231.jpg",  "imageType": "jpg"},{  "id": 715384,  "title": "Louisiana Style Gumbo",  "image": "https://spoonacular.com/recipeImages/715384-312x231.jpg",  "imageType": "jpg"},{  "id": 157159,  "title": "Pumpkin Sticky Buns",  "image": "https://spoonacular.com/recipeImages/157159-312x231.jpg",  "imageType": "jpg"},{  "id": 646589,  "title": "Hearty, Healthy Beef Stew",  "image": "https://spoonacular.com/recipeImages/646589-312x231.jpg",  "imageType": "jpg"},{  "id": 649764,  "title": "Lemon Roasted Chicken",  "image": "https://spoonacular.com/recipeImages/649764-312x231.jpg",  "imageType": "jpg"}];

// Create a react component // app component is showing comment component so it is parent component
const App = function() {
  return (
    <div>
      <h1>Up next: let's fry, Samurai</h1>
      {/* pass recipes from api to recipeList component, it is child component */}
      <RecipeList recipes={recipes} />
    </div>); //return jsx
};

// Take the react component and show it on the screen
ReactDOM.render(<App />, document.querySelector('#root')); // reference to the div with id root

