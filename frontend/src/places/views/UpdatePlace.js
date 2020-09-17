import React, { useEffect, useState, useContext } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import { useForm } from '../../shared/hooks/form-hook';
import Input from '../../shared/components/FormElements/Input';
import { VALIDATOR_REQUIRE, VALIDATOR_MINLENGTH } from '../../shared/util/validators';
import Button from '../../shared/components/FormElements/Button';
import './PlaceForm.css';
import LoadingSpinner from '../../shared/components/UIElements/LoadingSpinner';
import ErrorModal from '../../shared/components/UIElements/ErrorModal';
import { AuthContext } from '../../shared/context/auth-context';


const UpdatePlace = () => {
    const [updatePlace, setUpdatePlace] = useState();
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState();
    const updatePlaceId = useParams().updatePlaceId;
    const history = useHistory();
    const auth = useContext(AuthContext);

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


    useEffect(() => {
        const fetchPlace = async () => {
            setIsLoading(true);
            try {
                const response = await fetch(`http://localhost:5051/api/places/${updatePlaceId}`);
                const responseData = await response.json();
                if (!response.ok) {
                    throw new Error(responseData.message);
                };
                setUpdatePlace(responseData.place);
                setFormData({
                    title: {
                        value: responseData.place.title,
                        isValid: true
                    },
                    description: {
                        value: responseData.place.description,
                        isValid: true
                    }
                }, true);
            } catch (error) {
                setError(error.message);
            }
            setIsLoading(false);
        };
        fetchPlace();
    }, [updatePlaceId, setFormData]);


    const placeUpdateSubmitHandler = async event => {
        event.preventDefault();
        setIsLoading(true);
        try {
            const response = await fetch(`http://localhost:5051/api/places/${updatePlaceId}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: 'Bearer ' + auth.token
                },
                body: JSON.stringify({
                    newTitle: formState.inputs.title.value,
                    newDescription: formState.inputs.description.value

                })
            });
            const responseData = await response.json();
            if (!response.ok) {
                throw new Error(responseData.message);
            };
            setIsLoading(false);
            history.push(`/${auth.userId}/places`);
        } catch (error) {
            setIsLoading(false);
            setError(error.message || 'Something went wrong, please try again.');
        }
    };

    const errorHandler = () => {
        setError(null);
    };
    if (isLoading) {
        return (
            <div className="center">
                <LoadingSpinner />
            </div>
        );
    };

    if (!updatePlace && !error) {
        return (
            <div className="center">
                <h2>Could not find place!</h2>
            </div>
        )
    };


    return (
        <>
            <ErrorModal error={error} onClear={errorHandler} />
            {!isLoading && updatePlace &&
                <form className="place-form" onSubmit={placeUpdateSubmitHandler}>
                    <Input
                        id="title"
                        element="input"
                        type="text"
                        label="Title"
                        validators={[VALIDATOR_REQUIRE()]}
                        errorText="Please enter a valid title."
                        onInput={inputHandler}
                        initialValue={updatePlace.title}
                        initialValid={true}
                    />
                    <Input
                        id="description"
                        element="textarea"
                        label="Description"
                        validators={[VALIDATOR_REQUIRE(), VALIDATOR_MINLENGTH(5)]}
                        errorText="Please enter a valid description (at least 5 characters)."
                        onInput={inputHandler}
                        initialValue={updatePlace.description}
                        initialValid={true}
                    />
                    <Button type="submit" disabled={!formState.isValid}>UPDATE PLACE</Button>
                </form>
            }
        </>
    );
};

export default UpdatePlace;