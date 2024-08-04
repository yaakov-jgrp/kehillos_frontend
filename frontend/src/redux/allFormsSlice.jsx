import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  allForms: [],
};

export const allFormsSlice = createSlice({
  name: "allForms",
  initialState,
  reducers: {
    setAllFormsState: (state, action) => {
      state.allForms = action.payload;
      localStorage.setItem("allForms", JSON.stringify(action.payload));
    },
  },
});

export const { setAllFormsState } = allFormsSlice.actions;

export default allFormsSlice.reducer;
