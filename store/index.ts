import { createSlice, configureStore } from "@reduxjs/toolkit"
import { INITIAL_STATE } from "./state"

const basketSlice = createSlice({
  name: "basket",
  initialState: INITIAL_STATE,
  reducers: {
    add:  (state, action) => {
       let IndexRaw = state.findIndex(x=> x.id == action.payload.id);
        if (IndexRaw==-1){
            state.push(action.payload)
        }else{
            state[IndexRaw].quantity=  state[IndexRaw].quantity+1;
        }
      return state
    },
    remove: (state, action) => {
        state.map(productExistant=> {
            if(productExistant.id == action.payload.id && productExistant.quantity>1){
                productExistant.quantity=  productExistant.quantity-1
            }else if (productExistant.id == action.payload.id && productExistant.quantity==1){
               state =  state.filter(x=> x.id !== action.payload.id);
                          }
        })
        return state
    }
  }
})

const store = configureStore({ reducer: basketSlice.reducer })

export const { add, remove } = basketSlice.actions

export { basketSlice, store }