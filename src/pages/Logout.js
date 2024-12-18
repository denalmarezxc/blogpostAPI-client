import { Navigate } from 'react-router-dom';

import {useContext, useEffect} from 'react';

import UserContext from '../context/UserContext';

export default function Logout(){

	// consume user context
	const { setUser, unsetUser} = useContext(UserContext);
	// clear the localstorage
	

	useEffect(()=>{
		unsetUser();
		
		setUser({
			id: null,
			isAdmin: null
		})

	}, [])

	// localStorage.clear();

	return(

		<Navigate to='/login' />

	)
}