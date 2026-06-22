import { useEffect, useState } from 'react';
import { Container, Row, Col, Form, Button, Alert } from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { registerUser, clearError } from '../features/auth/authSlice';

function RegisterPage() {
    const dispatch = useDispatch();
    const { loading, error } = useSelector(state => state.auth);
    const [success, setSuccess] = useState(false);
    const { register, handleSubmit, formState: { errors } } = useForm({
        defaultValues: { user_status_id: '1' },
    });

    useEffect(() => {
        return () => dispatch(clearError());
    }, [dispatch]);

    const onSubmit = async (data) => {
        const result = await dispatch(registerUser({
            ...data,
            user_status_id: parseInt(data.user_status_id),
        }));
        if (registerUser.fulfilled.match(result)) {
            setSuccess(true);
        }
    };

    if (success) {
        return (
            <Container className="mt-5">
                <Row className="justify-content-center">
                    <Col md={6}>
                        <Alert variant="success">
                            <Alert.Heading>Inscription réussie !</Alert.Heading>
                            <p>Un email de confirmation vous a été envoyé. Vérifiez votre boîte mail.</p>
                            <Link to="/login" className="btn btn-success">Se connecter</Link>
                        </Alert>
                    </Col>
                </Row>
            </Container>
        );
    }

    return (
        <Container className="mt-5 mb-5">
            <Row className="justify-content-center">
                <Col md={7}>
                    <h2 className="mb-4">Inscription</h2>
                    {error && <Alert variant="danger">{error}</Alert>}
                    <Form onSubmit={handleSubmit(onSubmit)}>
                        <Row>
                            <Col md={6}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Pseudo *</Form.Label>
                                    <Form.Control
                                        type="text"
                                        {...register('pseudo', { required: 'Le pseudo est requis' })}
                                        isInvalid={!!errors.pseudo}
                                    />
                                    <Form.Control.Feedback type="invalid">
                                        {errors.pseudo?.message}
                                    </Form.Control.Feedback>
                                </Form.Group>
                            </Col>
                            <Col md={6}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Email *</Form.Label>
                                    <Form.Control
                                        type="email"
                                        {...register('email', {
                                            required: "L'email est requis",
                                            pattern: {
                                                value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                                                message: 'Email invalide',
                                            },
                                        })}
                                        isInvalid={!!errors.email}
                                    />
                                    <Form.Control.Feedback type="invalid">
                                        {errors.email?.message}
                                    </Form.Control.Feedback>
                                </Form.Group>
                            </Col>
                        </Row>

                        <Form.Group className="mb-3">
                            <Form.Label>Mot de passe *</Form.Label>
                            <Form.Control
                                type="password"
                                {...register('password', {
                                    required: 'Le mot de passe est requis',
                                    minLength: { value: 6, message: 'Minimum 6 caractères' },
                                })}
                                isInvalid={!!errors.password}
                            />
                            <Form.Control.Feedback type="invalid">
                                {errors.password?.message}
                            </Form.Control.Feedback>
                        </Form.Group>

                        <Row>
                            <Col md={6}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Prénom *</Form.Label>
                                    <Form.Control
                                        type="text"
                                        {...register('firstname', { required: 'Le prénom est requis' })}
                                        isInvalid={!!errors.firstname}
                                    />
                                    <Form.Control.Feedback type="invalid">
                                        {errors.firstname?.message}
                                    </Form.Control.Feedback>
                                </Form.Group>
                            </Col>
                            <Col md={6}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Nom *</Form.Label>
                                    <Form.Control
                                        type="text"
                                        {...register('lastname', { required: 'Le nom est requis' })}
                                        isInvalid={!!errors.lastname}
                                    />
                                    <Form.Control.Feedback type="invalid">
                                        {errors.lastname?.message}
                                    </Form.Control.Feedback>
                                </Form.Group>
                            </Col>
                        </Row>

                        <Form.Group className="mb-3">
                            <Form.Label>Date de naissance *</Form.Label>
                            <Form.Control
                                type="date"
                                {...register('birthdate', { required: 'La date de naissance est requise' })}
                                isInvalid={!!errors.birthdate}
                            />
                            <Form.Control.Feedback type="invalid">
                                {errors.birthdate?.message}
                            </Form.Control.Feedback>
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Adresse *</Form.Label>
                            <Form.Control
                                type="text"
                                {...register('address', { required: "L'adresse est requise" })}
                                isInvalid={!!errors.address}
                            />
                            <Form.Control.Feedback type="invalid">
                                {errors.address?.message}
                            </Form.Control.Feedback>
                        </Form.Group>

                        <Row>
                            <Col md={4}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Code postal *</Form.Label>
                                    <Form.Control
                                        type="text"
                                        {...register('postal_code', { required: 'Le code postal est requis' })}
                                        isInvalid={!!errors.postal_code}
                                    />
                                    <Form.Control.Feedback type="invalid">
                                        {errors.postal_code?.message}
                                    </Form.Control.Feedback>
                                </Form.Group>
                            </Col>
                            <Col md={8}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Ville *</Form.Label>
                                    <Form.Control
                                        type="text"
                                        {...register('city', { required: 'La ville est requise' })}
                                        isInvalid={!!errors.city}
                                    />
                                    <Form.Control.Feedback type="invalid">
                                        {errors.city?.message}
                                    </Form.Control.Feedback>
                                </Form.Group>
                            </Col>
                        </Row>

                        <Form.Group className="mb-3">
                            <Form.Label>Téléphone (optionnel)</Form.Label>
                            <Form.Control
                                type="tel"
                                placeholder="0600000000"
                                {...register('phone')}
                            />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Avatar (nom du fichier)</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="avatar.png"
                                {...register('avatar')}
                            />
                        </Form.Group>

                        <Form.Group className="mb-4">
                            <Form.Label>Statut *</Form.Label>
                            <Form.Select
                                {...register('user_status_id', { required: 'Le statut est requis' })}
                                isInvalid={!!errors.user_status_id}
                            >
                                <option value="1">Utilisateur</option>
                                <option value="2">Organisateur</option>
                            </Form.Select>
                            <Form.Control.Feedback type="invalid">
                                {errors.user_status_id?.message}
                            </Form.Control.Feedback>
                        </Form.Group>

                        <Button type="submit" variant="primary" disabled={loading} className="w-100">
                            {loading ? 'Inscription en cours...' : "S'inscrire"}
                        </Button>
                    </Form>
                    <p className="mt-3 text-center">
                        Déjà un compte ? <Link to="/login">Se connecter</Link>
                    </p>
                </Col>
            </Row>
        </Container>
    );
}

export default RegisterPage;
