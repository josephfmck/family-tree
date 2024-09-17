import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface Person {
    id: string;
    first_name: string;
    last_name: string;
}

const personsSlice = createSlice({
  name: 'persons',
  initialState: [] as Person[],
  reducers: {
    setPersons: (state, action: PayloadAction<Person[]>) => {
      return action.payload;
    },
    addPerson: (state, action: PayloadAction<Person>) => {
      state.push(action.payload);
    },
  },
});

export const { setPersons, addPerson } = personsSlice.actions;
export default personsSlice.reducer;