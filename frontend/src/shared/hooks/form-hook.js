import { useCallback, useReducer } from 'react';

// taked from NewPlace.js
const formReducer = (state, action) => {
    switch (action.type) {
        case 'INPUT_CHANGE':
            let formIsValid = true;
            for (const inputId in state.inputs) {
                if (inputId === action.inputId) {
                    formIsValid = formIsValid && action.isValid;
                }
                // in the case when input is not updated by curently action (below)
                else {
                    formIsValid = formIsValid && state.inputs[inputId].isValid
                }
            }

            return {
                ...state,
                inputs: {
                    ...state.inputs,
                    // dynamically updates fields in changed input[action.inputId]
                    [action.inputId]: { value: action.value, isValid: action.isValid }
                },
                isValid: formIsValid
            };
        default:
            return state;
    }
};
export const useForm = (initialInputs, initialFormValidity) => {

    // taked from NewPlaces.js
    // initial states could be diferents when use new hook so, to set inital state from outside initialInputs and initialFormValidity
    const [formState, dispatch] = useReducer(formReducer, {
        inputs: initialInputs,
        // {
        //     title: {
        //         value: '',
        //         isValid: false
        //     },
        //     description: {
        //         value: '',
        //         isValid: false
        //     },
        //     address: {
        //         value: '',
        //         isValid: false
        //     }
        // },
        isValid: initialFormValidity
        // isValid: false
    });

    // taked from NewPlace.js
    const inputHandler = useCallback((id, value, isValid) => {
        dispatch({
            type: 'INPUT_CHANGE',
            value: value,
            isValid: isValid,
            inputId: id
        })
    }, []);

    return [formState, inputHandler];
};
