import React from 'react';
import { useParams } from 'react-router-dom';
import PlaceList from '../components/PlaceList';

export const DEF_PLACES = [
    {
        id: 'p1',
        title: 'Ellery Creek Big Hole',
        description: 'The best place in Outback',
        imageUrl: 'https://i0.wp.com/www.erldundaroadhouse.com/dsrtks-content/uploads/2016/04/Ellery-Creek-Big-Hole.jpg?ssl=1',
        address: 'Namatjira NT 0872, Australia',
        location: {
            lat: -23.7771692,
            lng: 133.0735555
        },
        creator: 'u1'
    },
    {
        id: 'p2',
        title: 'Ellery Creek Big Hole_2',
        description: 'The best place in Outback',
        imageUrl: 'https://picsum.photos/200',
        address: 'Namatjira NT 0872, Australia',
        location: {
            lat: 40.7484405,
            lng: -73.9878584
        },
        creator: 'u2'
    }
]

const UserPlaces = () => {
    const userId = useParams().userId;
    const loadedPlaces = DEF_PLACES.filter(place => place.creator === userId);
    return <PlaceList items={loadedPlaces} />; 
};

export default UserPlaces;