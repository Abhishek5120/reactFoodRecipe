import { useEffect, useState } from "react";
import "./App.css";

const BASE_URL = "https://www.themealdb.com/api/json/v1/1/filter.php?i=";

export default function App() {
  const [data, setData] = useState([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [ingredient, setIngredient] = useState([]);
  const [noResults, setNoResults] = useState(false);
  const [selectedIngredient, setSelectedIngredient] = useState(null);

  function chooseIngredient(idx) {
    const newIngredient = ingredient[idx];
    setInput(newIngredient);
    setSelectedIngredient(newIngredient);
    findDish(newIngredient);
  }


  function findDish(newIngredient) {
    const searchIng = newIngredient || input;
    if (searchIng.length === 0) {
      alert("Please provide/choose an Ingredient first");
      return;
    }

    setIsLoading(true);
    setNoResults(false);
    // Fetching Meal List on Search button click
    fetch(BASE_URL + searchIng)
      .then((res) => res.json())
      .then((data) => {
        if (data.meals) {
          setData(data.meals);
        } else {
          setData([]);
          setNoResults(true); // Set noResults to true if no meals are found
        }
      })
      .catch((err) => console.log(err))
      .finally(() => {
        setIsLoading(false);
      });
  }

  useEffect(() => {
    /*
      fetching ingredient List in first rendering 
      to give user some options to choose from
     */
    fetch("https://www.themealdb.com/api/json/v1/1/list.php?i=list")
      .then((res) => res.json())
      .then((data) => {
        const ingredientArr = data.meals.filter((ing, idx) => {
          if (idx < 30) return ing;
        });
        setIngredient(ingredientArr.map((ing, idx) => ing.strIngredient));
      })
      .catch((err) => console.log(err));
    // .finally(() => console.log(ingredient));
  }, []);

  return (
    <div className="App">
      <header>
      <nav>
        <input
          className="searchBox"
          value={input}
          placeholder="Enter the ingredients..."
          onChange={(e) => setInput(e.target.value)}
        />
        <button className="searchButton" onClick={() => findDish(input)}>
          Search
        </button>
      </nav>
      </header>
      <p>
        Search a meal by it's main ingredient! Or choose one from the given list
      </p>
      <div className="ingredient">
        <ul className="ingredientUnorderedList">
          {ingredient.map((ing, idx) => (
            <li
              key={ing}
              className={`ingredients ${
                selectedIngredient === ing ? "selected" : ""
              }`}
              onClick={() => chooseIngredient(idx)}
            >
              {ing}
            </li>
          ))}
        </ul>
      </div>
      {isLoading && <Loader />}
      {/* Display "No Recipe Found" message if no results and not loading */}
      {!isLoading && noResults && <p>No Recipe Found</p>}
      {data.length !== 0 && !noResults ? <MealList meals={data} /> : null}
    </div>
  );
}

function Loader() {
  return <div>Loading Meals from the ingredients provided...</div>;
}

function MealList({ meals }) {
  return (
    <div className="mealList">
      {meals.map((meal) => (
        <Meal
          key={meal.idMeal}
          name={meal.strMeal}
          imgSrc={meal.strMealThumb}
        />
      ))}
    </div>
  );
}

function Meal({ name, imgSrc }) {
  return (
    <div className="recipe">
      <img src={imgSrc} height="180px" width="180px" />
      <p>{name}</p>
    </div>
  );
}

