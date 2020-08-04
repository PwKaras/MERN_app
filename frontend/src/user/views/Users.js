import React from 'react';
import UsersList from '../components/UsersList';

const Users = () => {
    const USERS = [
        // {
        //     id: "ul12",
        //     name: "Pawel",
        //     image: "https://picsum.photos/200",
        //     placeCount: 3
        // }
    ];

    return (
        <UsersList items={USERS} />
    )
};

export default Users;