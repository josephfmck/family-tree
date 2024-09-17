import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface RelationshipNames {
    id: string;
    person1_first_name: string;
    person1_last_name: string;
    person2_first_name: string;
    person2_last_name: string;
    relationship_type: string;
}

// ! strictly used for front end purposes
const relationshipNamesSlice = createSlice({
  name: 'relationshipNames',
  initialState: [] as RelationshipNames[],
  reducers: {
    setRelationshipNames: (state, action: PayloadAction<RelationshipNames[]>) => {
      return action.payload;
    },
    addRelationshipNames: (state, action: PayloadAction<RelationshipNames>) => {
      state.push(action.payload);
    },
  },
});

export const { setRelationshipNames, addRelationshipNames } = relationshipNamesSlice.actions;
export default relationshipNamesSlice.reducer;