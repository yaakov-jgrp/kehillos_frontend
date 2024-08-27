import { createSlice } from "@reduxjs/toolkit";
import { formatDate } from "../utils/helpers";

const initialState = {
  id: 1,
  isPined: false,
  name: "",
  description: "",
  blocks: [],
  fields: [],
  conditions: [],
  createdAt: formatDate("2024-07-07T13:21:06.408+00:00"),
  lastEditedAt: formatDate("2024-07-07T13:21:06.408+00:00"),
};

export const activeFormSlice = createSlice({
  name: "activeForm",
  initialState,
  reducers: {
    setActiveForm: (state, action) => {
      const {
        id,
        isPined,
        name,
        description,
        blocks,
        fields,
        conditions,
        createdAt,
        lastEditedAt,
      } = action.payload;
      state.id = id;
      state.isPined = isPined;
      state.name = name;
      state.description = description;
      state.blocks = blocks;
      state.fields = fields;
      state.conditions = conditions;
      state.createdAt = createdAt;
      state.lastEditedAt = lastEditedAt;
    },
    setActiveFormName: (state, action) => {
      const { name } = action.payload;
      state.name = name;
    },
    setActiveFormDescription: (state, action) => {
      const { description } = action.payload;
      state.description = description;
    },
    setActiveFormPinStatus: (state, action) => {
      const { isPined } = action.payload;
      state.isPined = isPined;
    },
    setBlocks: (state, action) => {
      state.blocks = action.payload;
      const payload = {
        id: state.id,
        isPined: state.isPined,
        name: state.name,
        description: state.description,
        blocks: state.blocks,
        fields: state.fields,
        conditions: state.conditions,
        createdAt: state.createdAt,
        lastEditedAt: state.lastEditedAt,
      };
      localStorage.setItem("activeForm", JSON.stringify(payload));
    },
    setFields: (state, action) => {
      state.fields = action.payload;
      const payload = {
        id: state.id,
        isPined: state.isPined,
        name: state.name,
        description: state.description,
        blocks: state.blocks,
        fields: state.fields,
        conditions: state.conditions,
        createdAt: state.createdAt,
        lastEditedAt: state.lastEditedAt,
      };
      localStorage.setItem("activeForm", JSON.stringify(payload));
    },
    setConditions: (state, action) => {
      state.conditions = action.payload;
      const payload = {
        id: state.id,
        isPined: state.isPined,
        name: state.name,
        description: state.description,
        blocks: state.blocks,
        fields: state.fields,
        conditions: state.conditions,
        createdAt: state.createdAt,
        lastEditedAt: state.lastEditedAt,
      };
      localStorage.setItem("activeForm", JSON.stringify(payload));
    },
  },
});

export const {
  setActiveForm,
  setActiveFormName,
  setActiveFormDescription,
  setActiveFormPinStatus,
  setBlocks,
  setFields,
  setConditions,
} = activeFormSlice.actions;

export default activeFormSlice.reducer;
