import { createSlice, configureStore } from "@reduxjs/toolkit"
import { INITIAL_STATE } from "./state"
import isEqual from 'lodash/isEqual';
import cloneDeep from 'lodash/cloneDeep';


const basketSlice = createSlice({
  name: "basket",
  initialState: INITIAL_STATE,
  reducers: {
    add:  (state, action) => {
            // vérifier le choix des fc et des persomenu si différent créer un product différent 
           let stateNew=cloneDeep(state);
            console.log("state start")
          if (stateNew.length==0){
            stateNew.push(action.payload);

          }else{
            stateNew.forEach(productExistant=> {

          let checkIfPersoDataMatch = false;
          if (productExistant && productExistant.persoData && isEqual(action.payload.persoData, productExistant.persoData)){
            checkIfPersoDataMatch= true;
          }
          let checkIfformulaChoicedMatch = false;
          if (productExistant && productExistant.formulaChoiced && isEqual(action.payload.formulaChoiced,  productExistant.formulaChoiced) ){
            checkIfformulaChoicedMatch= true;
          }
          console.log(action.payload.id)
       let IndexRaw = stateNew.findIndex(productEx=> productEx.id == action.payload.id && isEqual(action.payload.formulaChoiced,  productEx.formulaChoiced)  && isEqual(action.payload.persoData,productEx.persoData));
       console.log(IndexRaw)
        if (IndexRaw!==-1 &&  checkIfPersoDataMatch==true && checkIfformulaChoicedMatch ==true ){
          stateNew[IndexRaw].quantity=  stateNew[IndexRaw].quantity+1;
        }else{
          console.log("push")
          stateNew.push(action.payload)
        }   
      })}
      return stateNew;
       },
    remove: (state, action) => {
      let stateNew=cloneDeep(state);

      stateNew.map(productExistant=> {
  
        let checkIfPersoDataMatch = false;
        if (productExistant && productExistant.persoData && isEqual(action.payload.persoData, productExistant.persoData)){
          checkIfPersoDataMatch= true;
        }
        let checkIfformulaChoicedMatch = false;
        if (productExistant && productExistant.formulaChoiced && isEqual(action.payload.formulaChoiced, productExistant.formulaChoiced) ){
          checkIfformulaChoicedMatch= true;
        }

          if(productExistant.id == action.payload.id 
            && checkIfformulaChoicedMatch ==true
            && checkIfPersoDataMatch==true 
            &&  productExistant.quantity>1){
              productExistant.quantity=  productExistant.quantity-1
              console.log("reduce")
          }else if (productExistant.id == action.payload.id 
            && checkIfformulaChoicedMatch ==true
            && checkIfPersoDataMatch==true 
            && productExistant.quantity==1){
              console.log("kill")

              stateNew= stateNew.filter(prodEx=> prodEx.id !== action.payload.id &&  isEqual(action.payload.formulaChoiced, prodEx.formulaChoiced)
              && isEqual(action.payload.persoData, prodEx.persoData)) ;
                        }
      })
      return stateNew
  },
    emptyall: (state, action) => {
        state = [];
        return state
    }
  }
})

 function arraysEqual(arr1:any, arr2:any) {
  if (arr1.length !== arr2.length)
    return false;
  for (var i = arr1.length; i--;) {
    if (arr1[i] !== arr2[i])
      return false;
  }
  return true;
}
const store = configureStore({ reducer: basketSlice.reducer })

export const { add, remove, emptyall } = basketSlice.actions

export { basketSlice, store }