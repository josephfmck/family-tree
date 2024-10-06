import { createSlice, PayloadAction } from '@reduxjs/toolkit';

// ! 2. is set to rtk after pulled from api rtk query 
interface RelationshipIds {
  person_id_1: string;
  person_id_2: string;
  relationship_type_id: string;
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