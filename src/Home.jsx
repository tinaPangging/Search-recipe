import React, { useState, useContext } from "react";
import axios from "axios";
import Grid from "@material-ui/core/Grid";
import TextField from "@material-ui/core/TextField";
import InputAdornment from "@material-ui/core/InputAdornment";
import SearchIcon from "@material-ui/icons/Search";
import Results from "./Results";
import { makeStyles } from "@material-ui/core/styles";
import { Context } from "./stateManagement/Store";
import FilterCuisine from "./FilterCuisine";

const useStyles = makeStyles({
  search: {
    cursor: "pointer"
  }
});

const Home = props => {
  const classes = useStyles();
  const [enter, setEnter] = useState(false);
  const [state, dispatch] = useContext(Context);
  const [isValid, setIsValid] = useState(true);

  const onSearch = () => {
    if (state && state.inputValue) {
      axios
        .get(
          `https://api.spoonacular.com/recipes/complexSearch?&apiKey=d533817c8f724f739cf8a6975796f939&query=${state.inputValue}&&number=100`
        )
        .then(res => {
          
          dispatch({
            type: "SET_POSTS",
            data: res.data,
            pageNumber: 0,
            cuisine: "Select cuisine",
            selectedIndex: 0,
            enter: true,
            inputValue: state.inputValue
          });
        })
        .catch(error => {
          console.log(error);
          dispatch({ type: "SET_ERROR", data: error });
        });
    }
  };

  return (
    <Grid style={{ backgroundColor: "black" }}>
      <Grid
        container
        justify="center"
        style={{ paddingTop: 50, paddingLeft: 40, paddingRight: 40 }}
      >
        <Grid xs={12} sm={6} item>
          <Grid
            style={{ paddingBottom: 40 }}
            alignItems="center"
            justify="center"
            container
          >
            <img src="recipe.png" width="100" height="100" />
          </Grid>
          <TextField
            onChange={e => {
              dispatch({
                type: "SET_POSTS",
                // data: state.data,
                data: [],
                pageNumber: state.pageNumber,
                cuisine: "Select cuisine",
                selectedIndex: 0,
                enter: false,
                inputValue: e.target.value
              });
              setIsValid(true);
            }}
            variant="outlined"
            fullWidth
            type="text"
            InputProps={{
              endAdornment: (
                <InputAdornment onClick={onSearch} position="end">
                  <SearchIcon className={classes.search} />
                </InputAdornment>
              )
            }}
            style={{ backgroundColor: "white", borderRadius: "10px" }}
            placeholder="Search recipe"
            value={state.inputValue}
          />
        </Grid>
      </Grid>

      {state &&
        state.data &&
        state.data.results &&
        state.data.results.length > 0 && (
          <Results
            testData={state.data.results}
            history={props.history}
            enter={enter}
            setEnter={setEnter}
            state={state}
            dispatch={dispatch}
          />
        )}

      {!isValid && (
        <Grid container justify="center" style={{ color: "white" , paddingTop:20,fontFamily: "Papyrus",  fontWeight: "bold"}}>
          Oops! No recipe found
        </Grid>
      )}
      {state.enter && (
        <FilterCuisine
          state={state}
          dispatch={dispatch}
          value={state.inputValue}
          setIsValid={setIsValid}
        />
      )}

    </Grid>
  );
};

export default Home;
