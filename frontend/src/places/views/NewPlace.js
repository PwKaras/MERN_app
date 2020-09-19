import React, { useState, useContext } from 'react';
import { useHistory } from 'react-router-dom';
import { useForm } from '../../shared/hooks/form-hook';
import Input from '../../shared/components/FormElements/Input';
import { VALIDATOR_REQUIRE, VALIDATOR_MINLENGTH, VALIDATOR_FILE } from '../../shared/util/validators';
import Button from '../../shared/components/FormElements/Button';
import './PlaceForm.css';
import ErrorModal from '../../shared/components/UIElements/ErrorModal';
import { AuthContext } from '../../shared/context/auth-context';
import LoadingSpinner from '../../shared/components/UIElements/LoadingSpinner';
import ImageUpload from '../../shared/components/FormElements/ImageUpload';


const NewPlace = () => {
    const auth = useContext(AuthContext);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState()

    const [formState, inputHandler] = useForm(
        {
            title: {
                value: '',
                isValid: false
            },
            description: {
                value: '',
                isValid: false
            },
            address: {
                value: '',
                isValid: false
            },
            image: {
                value: null,
                isValid: false
            }
        }, false
    );

    const history = useHistory();

    const placeSubmitHandler = async event => {
        event.preventDefault();
        setIsLoading(true);
        try {
            const formData = new FormData();
            formData.append('title', formState.inputs.title.value);
            formData.append('description', formState.inputs.description.value);
            formData.append('address', formState.inputs.address.value);
            formData.append('image', formState.inputs.image.value)
            const response = await fetch(process.env.REACT_APP_BACKEND_URL + '/places', {
                method: 'POST',
                headers: {
                    Authorization: 'Bearer ' + auth.token
                },
                body: formData
            });

            const responseData = await response.json();

            if (!response.ok) {
                throw new Error(responseData.message);
            };
            setIsLoading(false);
            history.push('/');

        } catch (error) {
            setIsLoading(false);
            setError(error.message || 'Something went wrong, please try again.');
        }
    };

    const errorHandler = () => {
        setError(null);
    };


    return (
        <>
            <ErrorModal error={error} onClear={errorHandler} />
            <form className="place-form" onSubmit={placeSubmitHandler}>
                {isLoading && <LoadingSpinner asOverlay />}
                <Input
                    id="title"
                    element="input"
                    type="text"
                    label="Title"
                    validators={[VALIDATOR_REQUIRE()]}
                    errorText="Please enter a valid title."
                    onInput={inputHandler}
                />
                <ImageUpload
                    center
                    id="image"
                    element="input"
                    type="file"
                    label="image"
                    validators={[VALIDATOR_FILE()]}
                    errorText="Please add new place`s image."
                    onInput={inputHandler}
                />
                <Input
                    id="description"
                    element="textarea"
                    label="Description"
                    validators={[VALIDATOR_REQUIRE(), VALIDATOR_MINLENGTH(5)]}
                    errorText="Please enter a valid description (at least 5 characters)."
                    onInput={inputHandler}
                />
                <Input
                    id="address"
                    element="input"
                    type="text"
                    label="Address"
                    validators={[VALIDATOR_REQUIRE()]}
                    errorText="Please enter a valid address."
                    onInput={inputHandler}
                />
                <Button type="submit" disabled={!formState.isValid}>ADD PLACE</Button>
            </form>
        </>
    );
};

export default NewPlace;