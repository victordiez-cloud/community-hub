import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useForm } from 'react-hook-form';
import {
    Container, Row, Col, Card, Badge, Button, Form, Alert, Spinner, ListGroup,
} from 'react-bootstrap';
import {
    fetchEventDetail,
    registerForEvent,
    sendEventMessage,
    clearEventsError,
    clearEventsSuccess,
    clearCurrentEvent,
} from '../features/events/eventsSlice';

function EventDetailPage() {
    const { id } = useParams();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { user, token } = useSelector(state => state.auth);
    const { currentEvent, detailLoading, loading, error } = useSelector(state => state.events);

    const [registerSuccess, setRegisterSuccess] = useState(null);
    const [registerError, setRegisterError] = useState(null);
    const [msgSuccess, setMsgSuccess] = useState(null);
    const [msgError, setMsgError] = useState(null);
    const [paymentMethod, setPaymentMethod] = useState('stripe');
    const [localMessages, setLocalMessages] = useState([]);
    // msgId → true : l'organisateur a demandé la suppression, en attente admin
    const [pendingDeletion, setPendingDeletion] = useState({});
    // msgId → true : admin a validé la suppression, message masqué définitivement
    const [deletedMessages, setDeletedMessages] = useState({});

    const { register, handleSubmit, reset, formState: { errors } } = useForm();

    useEffect(() => {
        dispatch(fetchEventDetail(id));
        return () => {
            dispatch(clearCurrentEvent());
            dispatch(clearEventsError());
            dispatch(clearEventsSuccess());
        };
    }, [id, dispatch]);

    const handleRegister = async () => {
        setRegisterError(null);
        setRegisterSuccess(null);
        const result = await dispatch(registerForEvent({ eventId: Number(id), paymentMethod }));
        if (registerForEvent.fulfilled.match(result)) {
            setRegisterSuccess('Inscription confirmée !');
            dispatch(fetchEventDetail(id));
        } else {
            setRegisterError(result.payload || 'Une erreur est survenue.');
        }
    };

    const onSendMessage = async (data) => {
        setMsgError(null);
        setMsgSuccess(null);
        const result = await dispatch(sendEventMessage({ eventId: Number(id), message: data.message }));
        if (sendEventMessage.fulfilled.match(result)) {
            // Affichage immédiat pour l'envoyeur
            const tempMsg = {
                id: `local-${Date.now()}`,
                pseudo: user?.pseudo,
                message: data.message,
                created_at: new Date().toISOString(),
            };
            setLocalMessages(prev => [...prev, tempMsg]);
            reset();
            setMsgSuccess('Message envoyé !');
            setTimeout(() => setMsgSuccess(null), 3000);
            // Re-fetch pour que tous les utilisateurs voient le message via l'API
            const refreshResult = await dispatch(fetchEventDetail(id));
            if (fetchEventDetail.fulfilled.match(refreshResult)) {
                // L'API a renvoyé les messages → plus besoin des messages locaux
                setLocalMessages([]);
            }
        } else {
            setMsgError(result.payload || 'Une erreur est survenue.');
        }
    };

    const handleRequestDeletion = (msgId) => {
        setPendingDeletion(prev => ({ ...prev, [msgId]: true }));
    };

    const handleAdminDelete = (msgId) => {
        setDeletedMessages(prev => ({ ...prev, [msgId]: true }));
        setPendingDeletion(prev => { const next = { ...prev }; delete next[msgId]; return next; });
    };

    const handleAdminKeep = (msgId) => {
        setPendingDeletion(prev => { const next = { ...prev }; delete next[msgId]; return next; });
    };

    const formatDate = (dateStr) => {
        if (!dateStr) return '';
        return new Date(dateStr).toLocaleDateString('fr-FR', {
            day: '2-digit', month: 'long', year: 'numeric',
            hour: '2-digit', minute: '2-digit',
        });
    };

    const isAdmin = Number(user?.user_status_id) === 3;
    const isPremium = user?.is_premium;

    const event = currentEvent;
    // Organisateur de CET événement uniquement (l'API peut retourner organizer_id ou user_id)
    const isEventOrganizer = !isAdmin && (
        Number(event?.organizer_id) === Number(user?.id) ||
        Number(event?.user_id) === Number(user?.id)
    );
    const apiMessages = Array.isArray(event?.messages) ? event.messages : [];
    // Fusionner messages API + messages envoyés localement, puis filtrer les supprimés
    const allMessages = [...apiMessages, ...localMessages];
    const visibleMessages = allMessages.filter(msg => !deletedMessages[msg.id]);
    const participantsCount = event?.participants_count ?? event?.registrations_count ?? 0;
    const maxReached = event?.max_participants && participantsCount >= event.max_participants;

    if (detailLoading) {
        return (
            <Container className="mt-5 text-center">
                <Spinner animation="border" variant="primary" />
            </Container>
        );
    }

    if (!event) {
        return (
            <Container className="mt-5">
                <Alert variant="danger">Événement introuvable.</Alert>
                <Button variant="secondary" onClick={() => navigate('/events')}>Retour aux événements</Button>
            </Container>
        );
    }

    return (
        <Container className="mt-4 mb-5">
            <Button variant="outline-secondary" size="sm" className="mb-3" onClick={() => navigate('/events')}>
                ← Retour
            </Button>

            {error && (
                <Alert variant="danger" dismissible onClose={() => dispatch(clearEventsError())}>{error}</Alert>
            )}

            <Row>
                <Col md={8}>
                    <h2 className="mb-2">{event.name}</h2>

                    <div className="d-flex gap-2 flex-wrap mb-3">
                        <Badge bg={event.price_type === 'payant' ? 'warning' : 'success'} text="dark">
                            {event.price_type === 'payant' ? `${event.price} € / personne` : 'Gratuit'}
                        </Badge>
                        <Badge bg="secondary">
                            {event.event_type === 'presentiel' ? 'Présentiel' : 'Distanciel'}
                        </Badge>
                        {event.category_name && <Badge bg="info" text="dark">{event.category_name}</Badge>}
                    </div>

                    <p className="text-muted">{event.introduction}</p>

                    <ListGroup variant="flush" className="mb-4">
                        <ListGroup.Item><strong>Début :</strong> {formatDate(event.start_date)}</ListGroup.Item>
                        <ListGroup.Item><strong>Fin :</strong> {formatDate(event.end_date)}</ListGroup.Item>
                        <ListGroup.Item>
                            <strong>Participants :</strong> {participantsCount}
                            {event.max_participants && ` / ${event.max_participants}`}
                        </ListGroup.Item>
                        {event.organizer_pseudo && (
                            <ListGroup.Item><strong>Organisateur :</strong> @{event.organizer_pseudo}</ListGroup.Item>
                        )}
                    </ListGroup>

                    {/* Inscription */}
                    {token && isPremium && (
                        <Card className="mb-4">
                            <Card.Body>
                                <Card.Title className="h6">S'inscrire à cet événement</Card.Title>
                                {registerSuccess && <Alert variant="success">{registerSuccess}</Alert>}
                                {registerError && <Alert variant="danger">{registerError}</Alert>}
                                {maxReached ? (
                                    <Alert variant="warning" className="mb-0">
                                        Le nombre maximum de participants est atteint.
                                    </Alert>
                                ) : (
                                    <div className="d-flex align-items-center gap-3 flex-wrap">
                                        {event.price_type === 'payant' && (
                                            <Form.Select
                                                value={paymentMethod}
                                                onChange={e => setPaymentMethod(e.target.value)}
                                                style={{ width: 'auto' }}
                                            >
                                                <option value="stripe">Stripe</option>
                                                <option value="cheque">Chèque</option>
                                            </Form.Select>
                                        )}
                                        <Button variant="primary" disabled={loading} onClick={handleRegister}>
                                            {loading ? 'Inscription...' : event.price_type === 'payant'
                                                ? `Payer ${event.price} € et s'inscrire`
                                                : "S'inscrire gratuitement"}
                                        </Button>
                                    </div>
                                )}
                                {event.price_type === 'payant' && !maxReached && (
                                    <p className="text-muted small mt-2 mb-0">
                                        Une taxe de 10% est prélevée par CommunityHub. L'organisateur reçoit {(event.price * 0.9).toFixed(2)} €.
                                    </p>
                                )}
                            </Card.Body>
                        </Card>
                    )}

                    {token && !isPremium && (
                        <Alert variant="info">
                            Vous devez être <strong>premium</strong> pour vous inscrire à cet événement.
                        </Alert>
                    )}

                    {/* Messages forum */}
                    <h5 className="mb-3">Messages ({visibleMessages.filter(m => !pendingDeletion[m.id] && !deletedMessages[m.id]).length})</h5>

                    {token && (
                        <Card className="mb-4">
                            <Card.Body>
                                {msgSuccess && <Alert variant="success">{msgSuccess}</Alert>}
                                {msgError && <Alert variant="danger">{msgError}</Alert>}
                                <Form onSubmit={handleSubmit(onSendMessage)}>
                                    <Form.Group className="mb-2">
                                        <Form.Control
                                            as="textarea"
                                            rows={2}
                                            placeholder="Laisser un message..."
                                            isInvalid={!!errors.message}
                                            {...register('message', { required: 'Le message est requis.' })}
                                        />
                                        <Form.Control.Feedback type="invalid">
                                            {errors.message?.message}
                                        </Form.Control.Feedback>
                                    </Form.Group>
                                    <Button type="submit" size="sm" variant="primary" disabled={loading}>
                                        Envoyer
                                    </Button>
                                </Form>
                            </Card.Body>
                        </Card>
                    )}

                    {visibleMessages.filter(m => !pendingDeletion[m.id]).length === 0 ? (
                        <p className="text-muted">Aucun message pour le moment. Soyez le premier à réagir !</p>
                    ) : (
                        <div className="d-flex flex-column gap-3 mb-4">
                            {visibleMessages.filter(m => !pendingDeletion[m.id]).map((msg) => (
                                <Card key={msg.id}>
                                    <Card.Body>
                                        <div className="d-flex justify-content-between align-items-start">
                                            <div>
                                                <strong>@{msg.pseudo || msg.user_pseudo || 'Utilisateur'}</strong>
                                                <span className="text-muted small ms-2">{formatDate(msg.created_at)}</span>
                                            </div>
                                            <div className="d-flex gap-1">
                                                {/* Organisateur de l'event : demande de suppression */}
                                                {isEventOrganizer && (
                                                    <Button size="sm" variant="outline-warning" onClick={() => handleRequestDeletion(msg.id)}>
                                                        Modérer
                                                    </Button>
                                                )}
                                                {/* Admin : suppression directe */}
                                                {isAdmin && (
                                                    <Button size="sm" variant="outline-danger" onClick={() => handleAdminDelete(msg.id)}>
                                                        Supprimer
                                                    </Button>
                                                )}
                                            </div>
                                        </div>
                                        <p className="mb-0 mt-2">{msg.message || msg.content}</p>
                                    </Card.Body>
                                </Card>
                            ))}
                        </div>
                    )}

                    {/* Section admin : messages signalés par l'organisateur (même session) */}
                    {isAdmin && visibleMessages.some(m => pendingDeletion[m.id]) && (
                        <div className="mb-4">
                            <h6 className="text-warning">⚠ En attente de modération</h6>
                            <div className="d-flex flex-column gap-2">
                                {visibleMessages.filter(m => pendingDeletion[m.id]).map((msg) => (
                                    <Card key={msg.id} className="border-warning">
                                        <Card.Body>
                                            <div className="d-flex justify-content-between align-items-start">
                                                <div>
                                                    <strong>@{msg.pseudo || msg.user_pseudo || 'Utilisateur'}</strong>
                                                    <span className="text-muted small ms-2">{formatDate(msg.created_at)}</span>
                                                </div>
                                                <div className="d-flex gap-1">
                                                    <Button size="sm" variant="danger" onClick={() => handleAdminDelete(msg.id)}>
                                                        Supprimer
                                                    </Button>
                                                    <Button size="sm" variant="success" onClick={() => handleAdminKeep(msg.id)}>
                                                        Conserver
                                                    </Button>
                                                </div>
                                            </div>
                                            <p className="mb-0 mt-2">{msg.message || msg.content}</p>
                                        </Card.Body>
                                    </Card>
                                ))}
                            </div>
                        </div>
                    )}
                </Col>

                <Col md={4}>
                    {event.image && (
                        <img
                            src={event.image}
                            alt={event.name}
                            className="img-fluid rounded mb-3"
                            onError={e => { e.target.style.display = 'none'; }}
                        />
                    )}
                </Col>
            </Row>
        </Container>
    );
}

export default EventDetailPage;
