import { createSlice, configureStore } from "@reduxjs/toolkit"
import { INITIAL_STATE } from "./state"

const basketSlice = createSlice({
  name: "basket",
  initialState: INITIAL_STATE,
  reducers: {
    add:  (state, action) => {
        
       state.push(action.payload)
      return state
    },
    remove: (state, action) => {
        console.log("remove")
        console.log(action.payload.id);
     const result = state.filter(x=>x.id = action.payload.id );
console.log(result)
     return result
    }
  }
})

const store = configureStore({ reducer: basketSlice.reducer })

export const { add, remove } = basketSlice.actions

export { basketSlice, store }