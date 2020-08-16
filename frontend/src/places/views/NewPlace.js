import React from 'react';
import { useForm } from '../../shared/hooks/form-hook';
// import { useCallback, useReducer } from 'react';
// taked to new hook
import Input from '../../shared/components/FormElements/Input';
import { VALIDATOR_REQUIRE, VALIDATOR_MINLENGTH } from '../../shared/util/validators';
import Button from '../../shared/components/FormElements/Button';
import './PlaceForm.css';

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

    // pass  to useForm initialStates = initialInputs, initialFormValidity (in this case  is false) 
    const [ formState, inputHandler ]= useForm(
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

    const placeSubmitHandler = event => {
        event.preventDefault();
        console.log(formState.inputs)
    }

    return (
        <form className="place-form" onSubmit={placeSubmitHandler}>
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
    );
};

export default NewPlace;