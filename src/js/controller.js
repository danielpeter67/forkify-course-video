import * as model from './model.js';
import { MODAL_CLOSE_SEC } from './config.js';
import reciepView from './views/reciepView.js';
import SearchView from './views/searchView.js';
import ResultsViews from './views/ResultsViews.js';
import paginationView from './views/paginationView.js';
import bookmarksView from './views/bookmarksView.js';
import addRecipeView from './views/addRecipeView.js';

import 'core-js/stable';
import 'regenerator-runtime/runtime';
import { async } from 'regenerator-runtime';

// https://forkify-api.herokuapp.com/v2

// Prevent reload
// if (module.hot) {
//   module.hot.accept();
// }

///////////////////////////////////////

const controlRecipes = async function () {
  try {
    const id = window.location.hash.slice(1);

    if (!id) return;
    reciepView.renderSpinner();

    // 0. Update result view to mark selected search result
    ResultsViews.update(model.getSearchResultsPage());

    // 1. updating bookmark view
    bookmarksView.update(model.state.bookmarks);

    // 2. Loading Recipe
    await model.loadRecipe(id);

    // 3. Rendering Recipe
    reciepView.render(model.state.recipe);
  } catch (err) {
    reciepView.renderError();
    console.error(err);
  }
};

const controlSearchResults = async function () {
  try {
    ResultsViews.renderSpinner();

    // 1) Get search query
    const query = SearchView.getQuery();
    if (!query) return;

    // 2) Load search results
    await model.loadSearchResults(query);

    // 3) Get search results
    // ResultsViews.render(model.state.search.results);
    ResultsViews.render(model.getSearchResultsPage());

    // 4) Render initial pagination buttons
    paginationView.render(model.state.search);
  } catch (err) {
    console.error(err);
  }
};

const controlPagination = function (goToPage) {
  // 3) Get NEW search results
  ResultsViews.render(model.getSearchResultsPage(goToPage));

  // 4) Render pagination buttons
  paginationView.render(model.state.search);
};

const controlServings = function (newServings) {
  // Update the recipe serving (in state)
  model.updateServings(newServings);

  // Update the recipe view
  // reciepView.render(model.state.recipe);
  reciepView.update(model.state.recipe);
};

const controlAddBookmark = function () {
  // 1) Add / Remove bookmark
  if (!model.state.recipe.bookmarked) model.addBookmark(model.state.recipe);
  else model.deleteBookmark(model.state.recipe.id);

  // 2) Update bookmark
  reciepView.update(model.state.recipe);

  // 3) Render bookmarks
  bookmarksView.render(model.state.bookmarks);
};

const controlBookmarks = function () {
  bookmarksView.render(model.state.bookmarks);
};

const controlAddRecipe = async function (newRecipe) {
  try {
    // Render loading spinner
    addRecipeView.renderSpinner();

    // Upload the new recipe data
    await model.uploadRecipe(newRecipe);

    // Render recipe
    reciepView.render(model.state.recipe);

    // Success message
    addRecipeView.renderMessage();

    // Render bookmark view
    bookmarksView.render(model.state.bookmarks);

    // Change Id in Url
    window.history.pushState(null, '', `#${model.state.recipe.id}`);

    // Close form window
    setTimeout(() => {
      addRecipeView.toggleWindow();
    }, MODAL_CLOSE_SEC * 1000);
  } catch (err) {
    console.error('💥', err);
    addRecipeView.renderError(err.message);
  }
};

const newFeature = function () {
  console.log('Welcome!');
};

const init = function () {
  bookmarksView.addHandlerRender(controlBookmarks);
  reciepView.addHandlerRender(controlRecipes);
  reciepView.addHandlerUpdateServings(controlServings);
  reciepView.addHandlerAddBookmark(controlAddBookmark);
  SearchView.addHandlerSearch(controlSearchResults);
  paginationView.addHandlerClick(controlPagination);
  addRecipeView.addHandlerUpload(controlAddRecipe);
<<<<<<< HEAD
  console.log('Welcome!');
=======
  newFeature();
>>>>>>> new-feature
};

init();
