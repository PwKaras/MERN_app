import React from 'react';
import {  useParams } from 'react-router-dom';
import PlaceList from '../components/PlaceList';

const DEF_PLACES = [
    {
        id: 'p1',
        title: 'Ellery Creek Big Hole',
        description: 'The best place in Outback',
        imageUrl: 'https://picsum.photos/200',
        address: 'Namatjira NT 0872, Australia',
        location: {
            lat: -23.9688475,
            lng: 132.4374386
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
            lat: -23.9688475,
            lng: 132.4374386
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