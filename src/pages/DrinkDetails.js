import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import '../styles/DrinkDetails.css';
import { useHistory } from 'react-router';
import { getDrinkDetails, getMealsRecommends } from '../services/API';
import SugestionCard from './SugestionsCard';
import shareIcon from '../images/shareIcon.svg';
import blackHeart from '../images/blackHeartIcon.svg';
import whiteHeart from '../images/whiteHeartIcon.svg';
import { FIRST_SIX, CLIPBOARD_MESSAGE } from '../data/consts';
import { recipeStatus, favoriteStatus, setFavoriteDrink } from '../services/Functions';

function DrinkDetails(props) {
  const { match: { params: { id } } } = props;
  const [drinkDetails, setDrinkDetails] = useState([]);
  const [recipe, setRecipe] = useState([]);
  const [foodData, setFoodData] = useState([]);
  const [btnStatus, setBtnStatus] = useState('newRecipe');
  const [clipboardMessage, setClipBoardMessage] = useState('');
  const [favStatus, setFavStatus] = useState(false);
  const history = useHistory();
  const { pathname } = history.location;
  const request = async (drinkId) => {
    const apiResult = await getDrinkDetails(drinkId);
    setDrinkDetails(apiResult.drinks[0]);
    const entriesArr = Object.entries(apiResult.drinks[0]);
    const ingredients = entriesArr.filter((elem) => elem[0].includes('strIngredient'))
      .filter((ing) => ing[1] !== '' && ing[1] !== null)
      .map((ing) => ing[1]);
    const measures = entriesArr.filter((elem) => elem[0].includes('strMeasure'))
      .filter((mea) => mea[1] !== ' ' && mea[1] !== null && mea[1] !== '')
      .map((mea) => mea[1]);
    const SIZE = ingredients.length;
    const ARRAY = [];
    for (let i = 0; i < SIZE; i += 1) {
      ARRAY.push(`${ingredients[i]} - ${measures[i]}`);
    }
    setRecipe(ARRAY);
  };
  const data = async () => {
    const dataResult = await getMealsRecommends();
    setFoodData(dataResult);
  };
  const startRecipe = () => {
    history.push(`/drinks/${id}/in-progress`);
  };
  const copyToClipboard = () => {
    const url = `http://localhost:3000${pathname}`;
    navigator.clipboard.writeText(url);
    setClipBoardMessage(CLIPBOARD_MESSAGE);
  };
  useEffect(() => {
    request(id);
    data();
    recipeStatus(id, 'cocktails', setBtnStatus);
    favoriteStatus(id, setFavStatus);
  }, []);

  return (
    <section>
      <img
        data-testid="recipe-photo"
        className="mealImg"
        src={ drinkDetails.strDrinkThumb }
        alt={ `${drinkDetails.strDrink}` }
      />
      <h1 data-testid="recipe-title">{drinkDetails.strDrink}</h1>
      <h2 data-testid="recipe-category">{drinkDetails.strAlcoholic}</h2>
      <section>
        <button type="button" onClick={ copyToClipboard }>
          <img src={ shareIcon } alt="shareIcon" data-testid="share-btn" />
        </button>
        <button
          type="button"
          onClick={ () => setFavoriteDrink(favStatus, setFavStatus, drinkDetails) }
        >
          <img
            src={ favStatus ? blackHeart : whiteHeart }
            alt="favIcon"
            data-testid="favorite-btn"
          />
        </button>
      </section>
      {clipboardMessage === CLIPBOARD_MESSAGE && <span>{CLIPBOARD_MESSAGE}</span>}
      {recipe.length !== 0 && recipe.map((rec, i) => (
        <div key={ i }>
          <span
            data-testid={ `${i}-ingredient-name-and-measure` }
            key={ i }
          >
            { rec }
          </span>
        </div>
      ))}
      <p data-testid="instructions">{drinkDetails.strInstructions}</p>
      {drinkDetails.strYoutube !== undefined && <iframe data-testid="video" title="recipe-video" src={ `https://www.youtube.com/embed/${mealDetails.strYoutube.split('=')[1]}` } /> }
      <section className="carousel">
        {foodData.length !== 0 && foodData.map((rec, i) => (i <= FIRST_SIX
          && (
            <SugestionCard
              key={ rec.idMeal }
              index={ i }
              name={ rec.strMeal }
              image={ rec.strMealThumb }
            />)
        ))}
      </section>
      {btnStatus === 'newRecipe'
      && (
        <button
          className="start-btn"
          type="button"
          data-testid="start-recipe-btn"
          onClick={ startRecipe }
        >
          Start Recipe
        </button>)}
      {btnStatus === 'inProgressRecipe'
      && (
        <button
          className="start-btn"
          type="button"
          data-testid="start-recipe-btn"
        >
          Continue Recipe
        </button>)}
    </section>
  );
}

DrinkDetails.propTypes = {
  match: PropTypes.shape({
    params: PropTypes.shape({
      id: PropTypes.string,
    }),
  }),
}.isRequired;

export default DrinkDetails;
