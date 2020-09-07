import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import PlaceList from '../components/PlaceList';
import ErrorModal from '../../shared/components/UIElements/ErrorModal';
import LoadingSpinner from '../../shared/components/UIElements/LoadingSpinner';

export const DEF_PLACES = [
    // {
    //     id: 'p1',
    //     title: 'Ellery Creek Big Hole',
    //     description: 'The best place in Outback',
    //     image: 'https://i0.wp.com/www.erldundaroadhouse.com/dsrtks-content/uploads/2016/04/Ellery-Creek-Big-Hole.jpg?ssl=1',
    //     address: 'Namatjira NT 0872, Australia',
    //     location: {
    //         lat: -23.7771692,
    //         lng: 133.0735555
    //     },
    //     creator: 'u1'
    // },
    // {
    //     id: 'p2',
    //     title: 'Ellery Creek Big Hole_2',
    //     description: 'The best place in Outback',
    //     image: 'https://picsum.photos/200',
    //     address: 'Namatjira NT 0872, Australia',
    //     location: {
    //         lat: 40.7484405,
    //         lng: -73.9878584
    //     },
    //     creator: 'u2'
    // }
]

const UserPlaces = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState();
    const [userPlaces, setUserPlaces] = useState();
    const userId = useParams().userId;
    useEffect(() => {
        const fetchPlaces = async () => {
            setIsLoading(true);
            try {
                const response = await fetch(`http://localhost:5051/api/places/user/${userId}`);
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

    // pure react with dummy Places
    // const loadedPlaces = DEF_PLACES.filter(place => place.creator === userId);

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