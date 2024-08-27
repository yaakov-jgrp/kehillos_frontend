import { configureStore } from "@reduxjs/toolkit";
import activeFormReducer from "./activeFormSlice";
import allFormsReducer from "./allFormsSlice";

export const store = configureStore({
  reducer: {
    activeForm: activeFormReducer,
    allFormsState: allFormsReducer,
  },
});
