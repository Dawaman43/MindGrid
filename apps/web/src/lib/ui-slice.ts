import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

const FOCUS_AREAS = ["Search", "Governance", "Analytics"] as const;

export type FocusArea = (typeof FOCUS_AREAS)[number];

export interface UiState {
  focusArea: FocusArea;
}

const initialState: UiState = {
  focusArea: "Search",
};

const uiSlice = createSlice({
  name: "ui",
  initialState,
  reducers: {
    setFocusArea: (state, action: PayloadAction<FocusArea>) => {
      state.focusArea = action.payload;
    },
  },
});

export const { setFocusArea } = uiSlice.actions;
export const uiReducer = uiSlice.reducer;
export { FOCUS_AREAS };
