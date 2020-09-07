import React, { useState, useContext } from 'react';
import { useHistory } from 'react-router-dom';
import { useForm } from '../../shared/hooks/form-hook';
// import { useCallback, useReducer } from 'react';
// taked to new hook
import Input from '../../shared/components/FormElements/Input';
import { VALIDATOR_REQUIRE, VALIDATOR_MINLENGTH } from '../../shared/util/validators';
import Button from '../../shared/components/FormElements/Button';
import './PlaceForm.css';
import ErrorModal from '../../shared/components/UIElements/ErrorModal';
import { AuthContext } from '../../shared/context/auth-context';
import LoadingSpinner from '../../shared/components/UIElements/LoadingSpinner';



// const formReducer = (state, action) => {
//     switch (action.type) {
//         case 'INPUT_CHANGE':
//             let formIsValid = true;
//             for (const inputId in state.inputs) {
//                 if (inputId === action.inputId) {
//                     formIsValid = formIsValid && action.isValid;
//                 }
//                 // in the case when input is not updated by curently action (below)
//                 else {
//                     formIsValid = formIsValid && state.inputs[inputId].isValid
//                 }
//             }

//             return {
//                 ...state,
//                 inputs: {
//                     ...state.inputs,
//                     // dynamically updates fields in changed input[action.inputId]
//                     [action.inputId]: { value: action.value, isValid: action.isValid }
//                 },
//                 isValid: formIsValid
//             };
//         default:
//             return state;
//     }
// };

const NewPlace = () => {
    const auth = useContext(AuthContext);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState()

    // pass  to useForm initialStates = initialInputs, initialFormValidity (in this case  is false) 
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
            }
        }, false
    );

    const history = useHistory();

    // const [formState, dispatch] = useReducer(formReducer, {
    //     inputs: {
    //         title: {
    //             value: '',
    //             isValid: false
    //         },
    //         description: {
    //             value: '',
    //             isValid: false
    //         },
    //         address: {
    //             value: '',
    //             isValid: false
    //         }
    //     },
    //     isValid: false
    // });

    // useCallback -wrap a function and define dependencies (in array []) of this function under which it schould re-rendered
    // const inputHandler = useCallback((id, value, isValid) => {
    //     dispatch({
    //         type: 'INPUT_CHANGE',
    //         value: value,
    //         isValid: isValid,
    //         inputId: id
    //     })
    // }, []);


    const placeSubmitHandler = async event => {
        event.preventDefault();
        setIsLoading(true);
        try {
            const response = await fetch('http://localhost:5051/api/places', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    title: formState.inputs.title.value,
                    description: formState.inputs.description.value,
                    address: formState.inputs.address.value,
                    creator: auth.userId
                })
            });

            const responseData = await response.json();

            if (!response.ok) {
                throw new Error(responseData.message);
            };
            setIsLoading(false);
            //redirecting to other site
            history.push('/');

        } catch (error) {
            setIsLoading(false);
            setError(error.message || 'Something went wrong, please try again.');
        }
    };

    const errorHandler = () => {
        setError(null);
    };


    // pure react
    // const placeSubmitHandler = event => {
    //     event.preventDefault();
    //     console.log(formState.inputs)
    // }

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