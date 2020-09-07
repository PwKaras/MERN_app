import React, { useState, useContext, useEffect, useCallback } from 'react';
import Card from '../../shared/components/UIElements/Card';
import Button from '../../shared/components/FormElements/Button';
import Modal from '../../shared/components/UIElements/Modal';
import Map from '../../shared/components/UIElements/Map';
import { AuthContext } from '../../shared/context/auth-context';
import './PlaceItem.css';
import { useParams } from 'react-router-dom';
import ErrorModal from '../../shared/components/UIElements/ErrorModal';
import LoadingSpinner from '../../shared/components/UIElements/LoadingSpinner';
import { useHttpClient } from '../../shared/hooks/http-hook';


const PlaceItem = props => {
    const auth = useContext(AuthContext);
    const userId = useParams().userId;
    const { isLoading, error, sendRequest, clearError } = useHttpClient();
    // const [isLoading, setIsLoading] = useState(true);
    // const [error, setError] = useState();


    const [showMap, setShowMap] = useState(false);
    const [showConfirmModal, setShowConfirmModal] = useState(false);

    const openMapHandler = () => setShowMap(true);
    const closeMapHandler = () => setShowMap(false);

    const showDeleteWarningHandler = () => setShowConfirmModal(true);
    const cancelDeleteHandler = () => setShowConfirmModal(false);

    const confirmDeleteHandler = async () => {
        setShowConfirmModal(false);
        try {
            await sendRequest(
                `http://localhost:5051/api/places/${props.id}`,
                'DELETE'
            );
            props.onDelete(props.id);
        } catch (err) { }
    };



    //   infinitive loop - useEffect or useCalback
    // const {onDelete, id}= props;
    // const confirmDeleteHandler =
    //     useCallback(() => {
    //         const fetchDeletedPlace = async () => {

    //             setShowConfirmModal(false);
    //             // console.log('DELITING...');


    //             setIsLoading(true);
    //             try {
    //                 const response = await fetch(`http://localhost:5051/api/places/${id}`, { method: 'DELETE' });
    //                 const responseData = await response.json();
    //                 if (!response.ok) {
    //                     throw new Error(responseData.message);
    //                 };
    //                 setIsLoading(false);
    //                 onDelete(id);
    //                 return
    //             } catch (error) {
    //                 setError(error.message);
    //                 setIsLoading(false);
    //             }
    //             fetchDeletedPlace();
    //         }
    //     }
    //         , [onDelete,id]
    //     );


    // const clearError = () => {
    //     setError(null);
    // };

    return (
        <>
            <ErrorModal error={error} onClear={clearError} />
            <Modal
                show={showMap}
                onCancel={closeMapHandler}
                header={props.address}
                contentClass="place-item__modal-content"
                footerClass="place-item__modal-actions"
                footer={<Button onClick={closeMapHandler}>CLOSE</Button>}
            >
                <div className="map-container">
                    <Map center={props.coordinates} zoom={16} />
                </div>
            </Modal>
            <Modal
                show={showConfirmModal}
                onCancel={cancelDeleteHandler}
                header="Are you sure?"
                footerClass="place-item__modal-actions"
                footer={
                    <>
                        <Button inverse onClick={cancelDeleteHandler}>CANCEL</Button>
                        <Button danger onClick={confirmDeleteHandler} >DELETE</Button>
                    </>
                }
            >
                <p>Do you want to proceed and delete this place? Please note that it can`t be undone thereafter.</p>
            </Modal>
            <li className="place-item">
                <Card className="place-item__content">
                    {isLoading && <LoadingSpinner asOverlay />}
                    <div className=" place-item__image">
                        <img src={props.image} alt={props.title} />
                    </div>
                    <div className="place-item__info">
                        <h2>{props.title}</h2>
                        <h3>{props.address}</h3>
                        <p>{props.description}</p>
                    </div>
                    <div className="place-item__actions">
                        <Button inverse onClick={openMapHandler}>VIEW ON MAP</Button>
                        {
                            // auth.userId === props.creatorId &&
                            auth.userId === userId
                            && (
                                <>
                                    <Button to={`/places/${props.id}`}>EDIT</Button>
                                    <Button danger
                                        onClick={showDeleteWarningHandler}
                                    >DELETE</Button>
                                </>
                            )}
                    </div>
                </Card>
            </li>
        </>
    )
};

export default PlaceItem;