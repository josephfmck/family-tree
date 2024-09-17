import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface RelationshipType {
    id: string;
    relationship: string;
}

//! FRONT END
const relationshipTypesSlice = createSlice({
  name: 'relationshipTypes',
  initialState: [] as RelationshipType[],
  reducers: {
    setRelationshipTypes: (state, action: PayloadAction<RelationshipType[]>) => {
      return action.payload;
    },
    addRelationshipType: (state, action: PayloadAction<RelationshipType>) => {
      state.push(action.payload);
    },
  },
});

export const { setRelationshipTypes, addRelationshipType } = relationshipTypesSlice.actions;
export default relationshipTypesSlice.reducer;