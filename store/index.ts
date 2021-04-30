import { createSlice, configureStore } from "@reduxjs/toolkit";
import { INITIAL_STATE } from "./state";
import isEqual from "lodash/isEqual";
import cloneDeep from "lodash/cloneDeep";

const findInArray = (data:any, state:any)=> {
  return state.findIndex((element:any) => element.id === data.id && isEqual(element.persoData, data.persoData) && isEqual(element.formulaChoiced, data.formulaChoiced))
}

const basketSlice = createSlice({
  name: "basket",
  initialState: INITIAL_STATE,
  reducers: {
    add: (state, action) => {
      // vérifier le choix des fc et des persomenu si différent créer un product différent
      let stateNew = cloneDeep(state);
      if (stateNew.length == 0) {
        stateNew.push(action.payload);
      } else {
        const index = findInArray(action.payload, stateNew)
        if(index === -1) {
          stateNew.push(action.payload)
        }
        else {
          stateNew[index].quantity = stateNew[index].quantity + 1
        }
      }
      return stateNew;
    },
    remove: (state, action) => {
      let stateNew = cloneDeep(state);
      const index = findInArray(action.payload, stateNew)
      if(index !== -1) {
        if(stateNew[index].quantity > 1)
          stateNew[index].quantity = stateNew[index].quantity - 1
        else stateNew = stateNew.filter((element, i) => i !== index)
      }
      return stateNew;
    },
    emptyall: (state, action) => {
      state = [];
      return state;
    },
  },
});

const store = configureStore({ reducer: basketSlice.reducer });

export const { add, remove, emptyall } = basketSlice.actions;

export { basketSlice, store };
