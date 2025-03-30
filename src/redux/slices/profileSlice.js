import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  personalInfo: {
    fullName: "",
    email: "",
    gender: "",
    dateOfBirth: "",
    levelOfStudy: "",
    avatarUrl: null,
  },
  department: null,
  interests: [],
  completionStep: 1, // tracks which step user is on
  isProfileCompleted: false,
};

export const profileSlice = createSlice({
  name: "profile",
  initialState,
  reducers: {
    updatePersonalInfo: (state, action) => {
      state.personalInfo = {
        ...state.personalInfo,
        ...action.payload,
      };
    },
    setDepartment: (state, action) => {
      state.department = action.payload;
    },
    addInterest: (state, action) => {
      if (!state.interests.includes(action.payload)) {
        state.interests.push(action.payload);
      }
    },
    removeInterest: (state, action) => {
      state.interests = state.interests.filter(
        (interest) => interest !== action.payload
      );
    },
    setInterests: (state, action) => {
      state.interests = action.payload;
    },
    setCompletionStep: (state, action) => {
      state.completionStep = action.payload;
    },
    incrementCompletionStep: (state) => {
      state.completionStep += 1;
    },
    completeProfile: (state) => {
      state.isProfileCompleted = true;
    },
    resetProfile: () => initialState,
  },
});

// Export actions
export const {
  updatePersonalInfo,
  setDepartment,
  addInterest,
  removeInterest,
  setInterests,
  setCompletionStep,
  incrementCompletionStep,
  completeProfile,
  resetProfile,
} = profileSlice.actions;

// Export selectors
export const selectPersonalInfo = (state) => state.profile.personalInfo;
export const selectDepartment = (state) => state.profile.department;
export const selectInterests = (state) => state.profile.interests;
export const selectCompletionStep = (state) => state.profile.completionStep;
export const selectIsProfileCompleted = (state) =>
  state.profile.isProfileCompleted;

export default profileSlice.reducer;
