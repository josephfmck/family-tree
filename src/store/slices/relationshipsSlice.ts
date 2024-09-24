import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface RelationshipIds {
  person1Id: string;
  person2Id: string;
  relationshipTypeId: string;
}


// ! strictly used for back end purposes ( not really necessary here but may come in handy)
const relationshipsSlice = createSlice({
  name: 'relationships',
  initialState: [] as RelationshipIds[],
  reducers: {
    setRelationships: (state, action: PayloadAction<RelationshipIds[]>) => {
      return action.payload;
    },
    // ? doesnt need Ids here because its front end
    addRelationship: (state, action: PayloadAction<RelationshipIds>) => {
      state.push(action.payload);
    },
  },
});

export const { setRelationships, addRelationship } = relationshipsSlice.actions;
export default relationshipsSlice.reducer;