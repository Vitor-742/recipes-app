import React, { useState } from 'react';
import PropTypes from 'prop-types';
import RecipesContext from './RecipesContext';

function RecipesProvider({ children }) {
  const [searchBarStatus, setSearchBarStatus] = useState(false);
  const [foodsList, setFoodsList] = useState([]);
  const [drinksList, setDrinksList] = useState([]);

  const context = {
    searchBarStatus,
    setSearchBarStatus,
    foodsList,
    setFoodsList,
    drinksList,
    setDrinksList,
  };
  return (
    <RecipesContext.Provider value={ context }>
      { children }
    </RecipesContext.Provider>
  );
}

RecipesProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export default RecipesProvider;
