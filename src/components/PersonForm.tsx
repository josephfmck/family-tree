import React, { useState } from 'react';
import { useAddPersonMutation } from '@/store/api/personsApi';



export default function PersonForm() {

    //! state 
    // rtk query 
    const [addPerson, { isLoading }] = useAddPersonMutation();

      
    const [firstName, setFirstName] = useState<string>('');
    const [lastName, setLastName] = useState<string>('');

    //  handle to update the input state 
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        if (name === 'fname') {
            setFirstName(value);
        } else if (name === 'lname') {
            setLastName(value);
        }
      };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        // Handle form submission, like sending data to an API
        if (!firstName || !lastName) {
            console.error('All fields are required');
            return;
        }

        try {
            await addPerson({
                first_name: firstName,
                last_name: lastName
            }).unwrap();
            // Clear form on success
            setFirstName('');
            setLastName('');
        } catch (err) {
            // Error is handled by RTK Query
            console.error('Failed to add relationship:', err);
        }

    };
  
  return (
    <>
    <h1>Add Person</h1>
    <form onSubmit={handleSubmit}>
        <label htmlFor="fname">First Name:</label><br />
        <input
          type="text"
          id="fname"
          name="fname"
          value={firstName}
          onChange={handleChange}
          required
        /><br /><br />

        <label htmlFor="lname">Last Name:</label><br />
        <input
          type="text"
          id="lname"
          name="lname"
          value={lastName}
          onChange={handleChange}
          required
        /><br /><br />

        <button type="submit">Submit</button>
    </form>
    </>
  );
}