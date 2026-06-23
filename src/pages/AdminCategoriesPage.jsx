import { useEffect, useState } from 'react';
import { Container, Form, Button, Alert, ListGroup } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { fetchCategories, createCategory, clearEventsError } from '../features/events/eventsSlice';

function AdminCategoriesPage() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { user } = useSelector(state => state.auth);
    const { categories, loading, error } = useSelector(state => state.events);

    const [name, setName] = useState('');
    const [successMessage, setSuccessMessage] = useState(null);
    const [localError, setLocalError] = useState(null);

    useEffect(() => {
        if (Number(user?.user_status_id) !== 3) {
            navigate('/dashboard');
            return;
        }
        dispatch(fetchCategories());
        return () => dispatch(clearEventsError());
    }, [user, dispatch, navigate]);

    if (Number(user?.user_status_id) !== 3) return null;

    const onSubmit = async (e) => {
        e.preventDefault();
        setLocalError(null);
        setSuccessMessage(null);
        if (!name.trim()) {
            setLocalError('Le nom de la catégorie est requis.');
            return;
        }
        const result = await dispatch(createCategory(name.trim()));
        if (createCategory.fulfilled.match(result)) {
            setName('');
            setSuccessMessage('Catégorie créée avec succès.');
            dispatch(fetchCategories());
            setTimeout(() => setSuccessMessage(null), 3000);
        } else {
            setLocalError(result.payload || 'Une erreur est survenue.');
        }
    };

    return (
        <Container className="mt-5 mb-5" style={{ maxWidth: '500px' }}>
            <h2 className="mb-4">Gestion des catégories</h2>

            {(error || localError) && (
                <Alert variant="danger" dismissible onClose={() => { dispatch(clearEventsError()); setLocalError(null); }}>
                    {localError || error}
                </Alert>
            )}
            {successMessage && <Alert variant="success">{successMessage}</Alert>}

            <Form onSubmit={onSubmit} className="d-flex gap-2 mb-4">
                <Form.Control
                    type="text"
                    placeholder="Nom de la catégorie"
                    value={name}
                    onChange={e => setName(e.target.value)}
                />
                <Button type="submit" variant="primary" disabled={loading}>
                    {loading ? '...' : 'Ajouter'}
                </Button>
            </Form>

            <h5>Catégories existantes ({categories.length})</h5>
            {categories.length === 0 ? (
                <p className="text-muted">Aucune catégorie pour le moment.</p>
            ) : (
                <ListGroup>
                    {categories.map(cat => (
                        <ListGroup.Item key={cat.id}>{cat.name}</ListGroup.Item>
                    ))}
                </ListGroup>
            )}
        </Container>
    );
}

export default AdminCategoriesPage;
