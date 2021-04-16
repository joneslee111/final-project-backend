// this is a function which takes one argument (array of recipes)
const RecipeList = (props) => {
  const listRecipes = props.recipes.map((recipe) =>
    <div key={recipe.id.toString()}>
      <h3>{recipe.title}</h3>
      <img src={recipe.image} />
    </div>
  );

  return (
    <div>{listRecipes}</div>
  );
};

// export recipeList component so that can be imported in other places
export default RecipeList;