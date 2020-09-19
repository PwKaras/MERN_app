import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import PlaceList from '../components/PlaceList';
import ErrorModal from '../../shared/components/UIElements/ErrorModal';
import LoadingSpinner from '../../shared/components/UIElements/LoadingSpinner';


const UserPlaces = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState();
    const [userPlaces, setUserPlaces] = useState();
    const userId = useParams().userId;
    useEffect(() => {
        const fetchPlaces = async () => {
            setIsLoading(true);
            try {
                const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/places/user/${userId}`);
                const responseData = await response.json();
                if (!response.ok) {
                    throw new Error(responseData.message);
                }
                setUserPlaces(responseData.places);
                setIsLoading(false);
            } catch (error) {
                setError(error.message);
                setIsLoading(false);
            }
        };
        fetchPlaces()
    }, [userId]);

    const errorHandler = () => {
        setError(null);
    };

    const placeDeletedHandler = (deletedPlaceId) => {
        setUserPlaces(prevPlaces => prevPlaces.filter(place => place.id !==deletedPlaceId));
     };
    return (
        <>
            <ErrorModal error={error} onClear={errorHandler} />
            {isLoading && (
                <div className="center">
                    <LoadingSpinner />
                </div>
            )}
            {!isLoading && userPlaces && <PlaceList items={userPlaces} onDeletePlace={placeDeletedHandler} />};
        </>
    )
};

export default UserPlaces;