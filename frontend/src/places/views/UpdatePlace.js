import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useForm } from '../../shared/hooks/form-hook';
import { DEF_PLACES } from './UserPlaces';
import Input from '../../shared/components/FormElements/Input';
import { VALIDATOR_REQUIRE, VALIDATOR_MINLENGTH } from '../../shared/util/validators';
import Button from '../../shared/components/FormElements/Button';
import Card from '../../shared/components/UIElements/Card';
import './PlaceForm.css';
// import PlaceList from '../components/PlaceList';


// FILTER - map
// const UpdatePlace = () => {
// const updatePlaceId = useParams().updatePlaceId
// const UpdatePlace = DEF_PLACES.filter(place => place.id === updatePlaceId);
// return (
//         <PlaceList items={UpdatePlace} />
//     );
// };

// FIND - not have map
const UpdatePlace = () => {
    const [isLoading, setIsLoading] = useState(true);
    const updatePlaceId = useParams().updatePlaceId

    const [formState, inputHandler, setFormData] = useForm({
        title: {
            value: '',
            isValid: false
        },
        description: {
            value: '',
            isValid: false
        }
    }, false)
    // if (!updatePlace) {
    //     return (
    //         <div className="center">
    //             <h2>Could not find place!</h2>
    //         </div>
    //     )
    // };
    const updatePlace = DEF_PLACES.find(place => place.id === updatePlaceId);

    useEffect(() => {
        if (updatePlace) {
            setFormData({
                title: {
                    value: updatePlace.title,
                    isValid: true
                },
                description: {
                    value: updatePlace.description,
                    isValid: true
                }
            }, true);
        }
        setIsLoading(false);
    }, [setFormData, updatePlace]);

    const placeUpdateSubmitHandler = event => {
        event.preventDefault();
        console.log(formState.inputs)
    };


    if (!updatePlace) {
        return (
            <div className="center">
                <Card><h2>Could not find place
                    </h2></Card>
            </div>
        )

    }

    if (isLoading) {
        return (
            <div className="center">
                <h2>Loading...</h2>
            </div>
        );
    };

    return (
        <form className="place-form" onSubmit={placeUpdateSubmitHandler}>
            <Input
                id="title"
                element="input"
                type="text"
                label="Title"
                validators={[VALIDATOR_REQUIRE()]}
                errorText="Please enter a valid title."
                onInput={inputHandler}
                // initialValue={updatePlace.title}
                // initialValid={true}
                // taked from useForm
                initialValue={formState.inputs.title.value}
                initialValid={formState.inputs.title.isValid}
            />
            <Input
                id="description"
                element="textarea"
                label="Description"
                validators={[VALIDATOR_REQUIRE(), VALIDATOR_MINLENGTH(5)]}
                errorText="Please enter a valid description (at least 5 characters)."
                onInput={inputHandler}
                // initialValue={updatePlace.description}
                // initialValid={true}
                // taked from useForm hook
                initialValue={formState.inputs.description.value}
                initialValid={formState.inputs.description.isValid}
            />
            <Button type="submit" disabled={!formState.isValid}>UPDATE PLACE</Button>
        </form>

    );
};

export default UpdatePlace;