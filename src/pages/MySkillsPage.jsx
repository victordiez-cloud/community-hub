import { useEffect } from 'react';
import { Container, Row, Col, Form, Button, Alert, Spinner } from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { fetchMySkills, createSkill, clearSkillError } from '../features/skills/skillSlice';
import SkillCard from '../components/skills/SkillCard';

function MySkillsPage() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { user } = useSelector(state => state.auth);
    const { items, loading, error } = useSelector(state => state.skills);
    const { register, handleSubmit, reset, formState: { errors } } = useForm();

    useEffect(() => {
        if (!user?.is_premium) {
            navigate('/premium');
            return;
        }
        dispatch(fetchMySkills());
        return () => dispatch(clearSkillError());
    }, [user, dispatch, navigate]);

    const onSubmit = async (data) => {
        const result = await dispatch(createSkill({
            ...data,
            daily_price: parseFloat(data.daily_price),
        }));
        if (createSkill.fulfilled.match(result)) {
            reset();
            dispatch(fetchMySkills());
        }
    };

    if (!user?.is_premium) return null;

    const mySkills = items.filter(s => Number(s.user_id) === Number(user?.id));
    const othersSkills = items.filter(s => Number(s.user_id) !== Number(user?.id));

    return (
        <Container className="mt-5 mb-5">
            <h2>Mes compétences</h2>

            <Row className="mt-4">
                <Col md={4}>
                    <h5 className="mb-3">Ajouter une compétence</h5>
                    {error && <Alert variant="danger">{error}</Alert>}
                    <Form onSubmit={handleSubmit(onSubmit)}>
                        <Form.Group className="mb-3">
                            <Form.Label>Titre *</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Animation atelier React"
                                {...register('title', { required: 'Le titre est requis' })}
                                isInvalid={!!errors.title}
                            />
                            <Form.Control.Feedback type="invalid">
                                {errors.title?.message}
                            </Form.Control.Feedback>
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Description *</Form.Label>
                            <Form.Control
                                as="textarea"
                                rows={3}
                                placeholder="Décrivez votre compétence..."
                                {...register('description', { required: 'La description est requise' })}
                                isInvalid={!!errors.description}
                            />
                            <Form.Control.Feedback type="invalid">
                                {errors.description?.message}
                            </Form.Control.Feedback>
                        </Form.Group>
                        <Form.Group className="mb-4">
                            <Form.Label>Prix journalier (€) *</Form.Label>
                            <Form.Control
                                type="number"
                                min="0"
                                step="0.01"
                                placeholder="250"
                                {...register('daily_price', {
                                    required: 'Le prix est requis',
                                    min: { value: 0, message: 'Le prix doit être positif' },
                                })}
                                isInvalid={!!errors.daily_price}
                            />
                            <Form.Control.Feedback type="invalid">
                                {errors.daily_price?.message}
                            </Form.Control.Feedback>
                        </Form.Group>
                        <Button type="submit" variant="primary" disabled={loading} className="w-100">
                            {loading ? 'Ajout...' : 'Ajouter la compétence'}
                        </Button>
                    </Form>
                </Col>

                <Col md={8}>
                    <h5 className="mb-3">Mes compétences ({mySkills.length})</h5>
                    {loading && !items.length ? (
                        <Spinner animation="border" variant="primary" />
                    ) : mySkills.length === 0 ? (
                        <p className="text-muted">Aucune compétence pour le moment.</p>
                    ) : (
                        <Row xs={1} sm={2} className="g-3">
                            {mySkills.map((skill, index) => (
                                <Col key={skill.id ?? index}>
                                    <SkillCard skill={skill} />
                                </Col>
                            ))}
                        </Row>
                    )}

                    <hr className="my-4" />

                    <h5 className="mb-3">Compétences des autres membres ({othersSkills.length})</h5>
                    {othersSkills.length === 0 ? (
                        <p className="text-muted">Aucune compétence proposée par d'autres membres.</p>
                    ) : (
                        <Row xs={1} sm={2} className="g-3">
                            {othersSkills.map((skill, index) => (
                                <Col key={skill.id ?? index}>
                                    <SkillCard skill={skill} showAuthor />
                                </Col>
                            ))}
                        </Row>
                    )}
                </Col>
            </Row>
        </Container>
    );
}

export default MySkillsPage;
