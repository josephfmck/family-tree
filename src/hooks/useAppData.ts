import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
// backend
import { useGetRelationshipsQuery } from '../store/api/relationshipsApi';
import { useGetPersonsQuery } from '../store/api/personsApi';
import { useGetRelationshipTypesQuery } from '../store/api/relationshipTypesApi';
import { useGetRelationshipNamesQuery } from '@/store/api/relationshipNamesApi';

// front
import { setRelationships } from '../store/slices/relationshipsSlice';
import { setPersons } from '../store/slices/personsSlice';
import { setRelationshipTypes } from '../store/slices/relationshipTypesSlice';
import { setRelationshipNames } from '../store/slices/relationshipNamesSlice';


//* hook pulling in the rtk query and set it to rtk 
export const useAppData = () => {
  const dispatch = useDispatch();
  
//   ! API GET
  // ! these are IDs
  const { 
    data: relationships, 
    error: relationshipsError, 
    isLoading: isLoadingRelationships 
  } = useGetRelationshipsQuery(
    undefined, {
      refetchOnMountOrArgChange: true, // refetches whenever the component is mounted
      refetchOnFocus: true,            // refetches when the window regains focus
      refetchOnReconnect: true,        // refetches when the network reconnects    
  }
);

  // ! these are names of the relationships
  const { 
    data: relationshipNames, 
    error: relationshipNamesError, 
    isLoading: isLoadingRelationshipNames 
  } = useGetRelationshipNamesQuery(
    undefined, {
      refetchOnMountOrArgChange: true,
      refetchOnFocus: true,
      refetchOnReconnect: true,        // refetches when the network reconnects    
    }
  );

  const { 
    data: persons, 
    error: personsError, 
    isLoading: isLoadingPersons 
  } = useGetPersonsQuery(
    undefined, {
      refetchOnMountOrArgChange: true,
      refetchOnFocus: true,
      refetchOnReconnect: true,        // refetches when the network reconnects    
    }
  );

  const { 
    data: relationshipTypes, 
    error: relationshipTypesError, 
    isLoading: isLoadingRelationshipTypes 
  } = useGetRelationshipTypesQuery(
    undefined, {
      refetchOnMountOrArgChange: true,
      refetchOnFocus: true,
      refetchOnReconnect: true,        // refetches when the network reconnects    
    }
  );

  // dispatch to the front end rtk
  useEffect(() => {
    // ! IDs
    if (relationships) dispatch(setRelationships(relationships));
    // ! names
    if (relationshipNames) dispatch(setRelationshipNames(relationshipNames));
    if (persons) dispatch(setPersons(persons));
    if (relationshipTypes) dispatch(setRelationshipTypes(relationshipTypes));
  }, [relationships, persons, relationshipTypes, dispatch]);

  const isLoading = isLoadingRelationships || isLoadingPersons || isLoadingRelationshipTypes || isLoadingRelationshipNames;
  const error = relationshipsError || personsError || relationshipTypesError || relationshipNamesError;

  return { isLoading, error };
};