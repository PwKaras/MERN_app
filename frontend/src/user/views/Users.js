import React, { useEffect, useState } from 'react';
import UsersList from '../components/UsersList';
import ErrorModal from '../../shared/components/UIElements/ErrorModal';
import LoadingSpinner from '../../shared/components/UIElements/LoadingSpinner';
import { useHttpClient } from '../../shared/hooks/http-hook';

const Users = () => {
    // const USERS = [
    //     {
    //         id: "u1",
    //         name: "Pawel",
    //         image: "https://picsum.photos/200",
    //         placeCount: 3
    //     }
    // ];
    // const [isLoading, setIsLoading] = useState(false);
    // const [error, setError] = useState();
    const [loadedUsers, setLoadedUser] = useState();
    const { isLoading, error, sendRequest, clearError } = useHttpClient();

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const responseData = await sendRequest('http://localhost:5051/api/users');
                setLoadedUser(responseData.allUsers);

            } catch (error) { }
        }
        fetchUsers();

    }, [sendRequest]);
    //in this case sendRequest is dependancy of react hook



    //pure fetch()
    // useEffect(() => {
    //     const sendRequest = async () => {
    //         setIsLoading(true);
    //         try {
    //             const response = await fetch('http://localhost:5051/api/users');
    //             const responseData = await response.json();
    //             if (!response.ok) {
    //                 throw new Error(responseData.message);
    //             }
    //             setLoadedUser(responseData.allUsers);
    //         } catch (error) {
    //             setError(error.message);
    //         }
    //         setIsLoading(false);
    //     };
    //     sendRequest();
    // }, []);

    // const errorHandler = () => {
    //     setError(null);
    // };

    //simplest fetch()
    // useEffect(() => {
    //     fetch('http://localhost:5051/api/users')
    //         .then(response => response.json())
    //         .then(responseData =>
    //             setLoadedUser(responseData.allUsers)
    //         )
    // },
    //     //[] - empty - only once runing, in other hand warring of infinity loop - fetching user in every change in view
    //     []);

    return (<>
        <ErrorModal error={error} onClear={clearError} />
        {isLoading && (
            <div className="center">
                <LoadingSpinner />
            </div>
        )}
        {!isLoading && loadedUsers && <UsersList items={loadedUsers} />}
    </>
    )
};

export default Users;