import React, { useEffect, useState } from 'react';
import CardDoneAndFavoriteRecipes from '../components/CardDoneAndFavoriteRecipes';
import Header from '../components/Header';

function DoneRecipes() {
  const [doneRecipes, setDoneRecipes] = useState([]);
  useEffect(() => {
    const LSdoneRecipes = localStorage.getItem('doneRecipes');
    const objDoneRecipes = JSON.parse(LSdoneRecipes);
    if (objDoneRecipes !== null) setDoneRecipes(objDoneRecipes);
  }, []);

  const handleClickFilter = ({ target: { textContent } }) => {
    const LSdoneRecipes = localStorage.getItem('doneRecipes');
    let objDoneRecipes = JSON.parse(LSdoneRecipes);
    if (objDoneRecipes === null) objDoneRecipes = [];
    if (textContent === 'All') {
      setDoneRecipes(objDoneRecipes);
    } else if (textContent === 'Drinks') {
      const filter = objDoneRecipes.filter(({ type }) => type === 'drink');
      setDoneRecipes(filter);
    } else if (textContent === 'Food') {
      const filter = objDoneRecipes.filter(({ type }) => type === 'food');
      setDoneRecipes(filter);
    }
  };

  return (
    <section>
      <div>
        <Header title="Done Recipes" />
        <button
          type="button"
          data-testid="filter-by-all-btn"
          onClick={ handleClickFilter }
        >
          All
        </button>
        <button
          type="button"
          data-testid="filter-by-food-btn"
          onClick={ handleClickFilter }
        >
          Food
        </button>
        <button
          type="button"
          data-testid="filter-by-drink-btn"
          onClick={ handleClickFilter }
        >
          Drinks
        </button>
        {doneRecipes && doneRecipes.map((recipe, index) => (
          <CardDoneAndFavoriteRecipes
            recipe={ recipe }
            index={ index }
            favorite={ false }
            key={ recipe.id }
          />))}
      </div>
    </section>
  );
}

export default DoneRecipes;
