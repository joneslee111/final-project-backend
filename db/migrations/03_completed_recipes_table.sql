CREATE TABLE completed_recipes (
  id SERIAL PRIMARY KEY,
  completed BOOLEAN,
  user_id INT,
  recipe_id INT,
  FOREIGN KEY (user_id) REFERENCES users(id),
  FOREIGN KEY (recipe_id) REFERENCES curated_recipes(recipe_id));