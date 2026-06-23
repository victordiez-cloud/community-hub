import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Container, Row, Col, Card, Form, Button, Alert, Spinner, Badge, InputGroup,
} from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import {
    fetchEvents,
    fetchCategories,
    createEvent,
    clearEventsError,
    clearEventsSuccess,
} from '../features/events/eventsSlice';

function EventsPage() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { user } = useSelector(state => state.auth);
    const { items, categories, loading, error, successMessage } = useSelector(state => state.events);

    const [priceType, setPriceType] = useState('gratuit');
    const [filters, setFilters] = useState({ q: '', type: '', price_type: '', category_id: '' });

    const {
        register,
        handleSubmit,
        reset,
        watch,
        formState: { errors },
    } = useForm({ defaultValues: { price_type: 'gratuit', event_type: 'presentiel' } });

    const watchedPriceType = watch('price_type', 'gratuit');
    const watchedStartDate = watch('start_date');

    useEffect(() => {
        dispatch(fetchEvents());
        dispatch(fetchCategories());
        return () => {
            dispatch(clearEventsError());
            dispatch(clearEventsSuccess());
        };
    }, [dispatch]);

    useEffect(() => {
        setPriceType(watchedPriceType);
    }, [watchedPriceType]);

    useEffect(() => {
        if (successMessage) {
            reset();
            setPriceType('gratuit');
            dispatch(fetchEvents());
            setTimeout(() => dispatch(clearEventsSuccess()), 3000);
        }
    }, [successMessage, dispatch, reset]);

    const onSubmit = (data) => {
        const payload = {
            event_category_id: Number(data.event_category_id),
            name: data.name,
            event_type: data.event_type,
            price_type: data.price_type,
            max_participants: Number(data.max_participants),
            start_date: data.start_date.replace('T', ' ') + ':00',
            end_date: data.end_date.replace('T', ' ') + ':00',
            introduction: data.introduction,
        };
        if (data.price_type === 'payant') {
            payload.price = parseFloat(data.price);
        }
        if (data.image) {
            payload.image = data.image;
        }
        dispatch(createEvent(payload));
    };

    const formatDate = (dateStr) => {
        if (!dateStr) return '';
        return new Date(dateStr).toLocaleDateString('fr-FR', {
            day: '2-digit', month: 'long', year: 'numeric',
            hour: '2-digit', minute: '2-digit',
        });
    };

    const isSameDay = (d1, d2) => {
        if (!d1 || !d2) return false;
        return d1.slice(0, 10) === d2.slice(0, 10);
    };

    return (
        <Container className="mt-5 mb-5">
            <h2>Événements</h2>

            {successMessage && <Alert variant="success" className="mt-3">{successMessage}</Alert>}

            <Row className="mt-4">
                {Number(user?.user_status_id) === 2 && (
                    <Col md={4}>
                        <h5 className="mb-3">Proposer un événement</h5>
                        {error && (
                            <Alert variant="danger" dismissible onClose={() => dispatch(clearEventsError())}>
                                {error}
                            </Alert>
                        )}
                        <Form onSubmit={handleSubmit(onSubmit)}>
                            <Form.Group className="mb-3">
                                <Form.Label>Nom *</Form.Label>
                                <Form.Control
                                    type="text"
                                    placeholder="Soirée jeux de rôle"
                                    {...register('name', { required: 'Le nom est requis' })}
                                    isInvalid={!!errors.name}
                                />
                                <Form.Control.Feedback type="invalid">
                                    {errors.name?.message}
                                </Form.Control.Feedback>
                            </Form.Group>

                            <Form.Group className="mb-3">
                                <Form.Label>Catégorie *</Form.Label>
                                <Form.Select
                                    {...register('event_category_id', { required: 'La catégorie est requise' })}
                                    isInvalid={!!errors.event_category_id}
                                >
                                    <option value="">-- Sélectionner --</option>
                                    {categories.map(cat => (
                                        <option key={cat.id} value={cat.id}>{cat.name}</option>
                                    ))}
                                </Form.Select>
                                <Form.Control.Feedback type="invalid">
                                    {errors.event_category_id?.message}
                                </Form.Control.Feedback>
                            </Form.Group>

                            <Form.Group className="mb-3">
                                <Form.Label>Type *</Form.Label>
                                <Form.Select
                                    {...register('event_type', { required: true })}
                                >
                                    <option value="presentiel">Présentiel</option>
                                    <option value="distanciel">Distanciel</option>
                                </Form.Select>
                            </Form.Group>

                            <Form.Group className="mb-3">
                                <Form.Label>Tarif *</Form.Label>
                                <Form.Select {...register('price_type', { required: true })}>
                                    <option value="gratuit">Gratuit</option>
                                    <option value="payant">Payant</option>
                                </Form.Select>
                            </Form.Group>

                            {priceType === 'payant' && (
                                <Form.Group className="mb-3">
                                    <Form.Label>Prix (€) *</Form.Label>
                                    <Form.Control
                                        type="number"
                                        min="0"
                                        step="0.01"
                                        placeholder="15"
                                        {...register('price', {
                                            required: 'Le prix est requis',
                                            min: { value: 0, message: 'Le prix doit être positif' },
                                        })}
                                        isInvalid={!!errors.price}
                                    />
                                    <Form.Control.Feedback type="invalid">
                                        {errors.price?.message}
                                    </Form.Control.Feedback>
                                </Form.Group>
                            )}

                            <Form.Group className="mb-3">
                                <Form.Label>Nombre max de participants *</Form.Label>
                                <Form.Control
                                    type="number"
                                    min="1"
                                    placeholder="10"
                                    {...register('max_participants', {
                                        required: 'Ce champ est requis',
                                        min: { value: 1, message: 'Minimum 1 participant' },
                                    })}
                                    isInvalid={!!errors.max_participants}
                                />
                                <Form.Control.Feedback type="invalid">
                                    {errors.max_participants?.message}
                                </Form.Control.Feedback>
                            </Form.Group>

                            <Form.Group className="mb-3">
                                <Form.Label>Date de début *</Form.Label>
                                <Form.Control
                                    type="datetime-local"
                                    {...register('start_date', { required: 'La date de début est requise' })}
                                    isInvalid={!!errors.start_date}
                                />
                                <Form.Control.Feedback type="invalid">
                                    {errors.start_date?.message}
                                </Form.Control.Feedback>
                            </Form.Group>

                            <Form.Group className="mb-3">
                                <Form.Label>Date de fin *</Form.Label>
                                <Form.Control
                                    type="datetime-local"
                                    {...register('end_date', {
                                        required: 'La date de fin est requise',
                                        validate: (value) =>
                                            !isSameDay(watchedStartDate, value) ||
                                            'La date de fin doit être un jour différent de la date de début',
                                    })}
                                    isInvalid={!!errors.end_date}
                                />
                                <Form.Control.Feedback type="invalid">
                                    {errors.end_date?.message}
                                </Form.Control.Feedback>
                            </Form.Group>

                            <Form.Group className="mb-3">
                                <Form.Label>Image (optionnel)</Form.Label>
                                <Form.Control
                                    type="text"
                                    placeholder="event.jpg"
                                    {...register('image')}
                                />
                            </Form.Group>

                            <Form.Group className="mb-4">
                                <Form.Label>Introduction *</Form.Label>
                                <Form.Control
                                    as="textarea"
                                    rows={3}
                                    placeholder="Présentation de l'événement..."
                                    {...register('introduction', { required: "L'introduction est requise" })}
                                    isInvalid={!!errors.introduction}
                                />
                                <Form.Control.Feedback type="invalid">
                                    {errors.introduction?.message}
                                </Form.Control.Feedback>
                            </Form.Group>

                            <Button type="submit" variant="primary" disabled={loading} className="w-100">
                                {loading ? 'Création...' : 'Créer l\'événement'}
                            </Button>
                        </Form>
                    </Col>
                )}

                <Col md={Number(user?.user_status_id) === 2 ? 8 : 12}>
                    {/* Filtres */}
                    <Row className="g-2 mb-3">
                        <Col xs={12} md={4}>
                            <InputGroup>
                                <Form.Control
                                    placeholder="Rechercher..."
                                    value={filters.q}
                                    onChange={e => {
                                        const val = e.target.value;
                                        setFilters(f => ({ ...f, q: val }));
                                        dispatch(fetchEvents({ ...filters, q: val }));
                                    }}
                                />
                            </InputGroup>
                        </Col>
                        <Col xs={6} md={3}>
                            <Form.Select value={filters.type} onChange={e => {
                                const val = e.target.value;
                                setFilters(f => ({ ...f, type: val }));
                                dispatch(fetchEvents({ ...filters, type: val }));
                            }}>
                                <option value="">Tous les types</option>
                                <option value="presentiel">Présentiel</option>
                                <option value="distanciel">Distanciel</option>
                            </Form.Select>
                        </Col>
                        <Col xs={6} md={3}>
                            <Form.Select value={filters.price_type} onChange={e => {
                                const val = e.target.value;
                                setFilters(f => ({ ...f, price_type: val }));
                                dispatch(fetchEvents({ ...filters, price_type: val }));
                            }}>
                                <option value="">Tous les tarifs</option>
                                <option value="gratuit">Gratuit</option>
                                <option value="payant">Payant</option>
                            </Form.Select>
                        </Col>
                        <Col xs={12} md={2}>
                            <Button variant="outline-secondary" className="w-100" onClick={() => {
                                setFilters({ q: '', type: '', price_type: '', category_id: '' });
                                dispatch(fetchEvents());
                            }}>
                                Réinitialiser
                            </Button>
                        </Col>
                    </Row>

                    <h5 className="mb-3">Tous les événements ({items.length})</h5>
                    {loading && !items.length ? (
                        <div className="text-center py-4">
                            <Spinner animation="border" variant="primary" />
                        </div>
                    ) : items.length === 0 ? (
                        <p className="text-muted">Aucun événement trouvé.</p>
                    ) : (
                        <Row xs={1} sm={2} className="g-3">
                            {items.map((event, index) => (
                                <Col key={event.id ?? index}>
                                    <Card
                                        className="h-100"
                                        style={{ cursor: 'pointer' }}
                                        onClick={() => navigate(`/events/${event.id}`)}
                                    >
                                        <Card.Body>
                                            <div className="d-flex justify-content-between align-items-start mb-2">
                                                <Card.Title className="mb-0">{event.name}</Card.Title>
                                                <Badge bg={event.price_type === 'payant' ? 'warning' : 'success'} text="dark">
                                                    {event.price_type === 'payant' ? `${event.price} €` : 'Gratuit'}
                                                </Badge>
                                            </div>
                                            <div className="mb-2">
                                                <Badge bg="secondary" className="me-1">
                                                    {event.event_type === 'presentiel' ? 'Présentiel' : 'Distanciel'}
                                                </Badge>
                                                {event.category_name && (
                                                    <Badge bg="info" text="dark">{event.category_name}</Badge>
                                                )}
                                            </div>
                                            <Card.Text className="text-muted small">{event.introduction}</Card.Text>
                                        </Card.Body>
                                        <Card.Footer className="bg-transparent small text-muted">
                                            <div>Début : {formatDate(event.start_date)}</div>
                                            <div>Fin : {formatDate(event.end_date)}</div>
                                            {event.max_participants && (
                                                <div>Max. {event.max_participants} participants</div>
                                            )}
                                        </Card.Footer>
                                    </Card>
                                </Col>
                            ))}
                        </Row>
                    )}
                </Col>
            </Row>
        </Container>
    );
}

export default EventsPage;
