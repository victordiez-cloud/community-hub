import { useEffect } from 'react';
import { Container, Row, Col, Form, Button, Alert } from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { loginUser, clearError } from '../features/auth/authSlice';

function LoginPage() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { loading, error, token } = useSelector(state => state.auth);
    const { register, handleSubmit, formState: { errors } } = useForm();

    useEffect(() => {
        if (token) navigate('/dashboard', { replace: true });
    }, [token, navigate]);

    useEffect(() => {
        return () => dispatch(clearError());
    }, [dispatch]);

    const onSubmit = (data) => {
        dispatch(loginUser(data));
    };

    return (
        <Container className="mt-5">
            <Row className="justify-content-center">
                <Col md={5}>
                    <h2 className="mb-4">Connexion</h2>
                    {error && <Alert variant="danger">{error}</Alert>}
                    <Form onSubmit={handleSubmit(onSubmit)}>
                        <Form.Group className="mb-3">
                            <Form.Label>Pseudo ou email</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Votre pseudo ou email"
                                {...register('login', { required: 'Ce champ est requis' })}
                                isInvalid={!!errors.login}
                            />
                            <Form.Control.Feedback type="invalid">
                                {errors.login?.message}
                            </Form.Control.Feedback>
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Mot de passe</Form.Label>
                            <Form.Control
                                type="password"
                                placeholder="Votre mot de passe"
                                {...register('password', { required: 'Ce champ est requis' })}
                                isInvalid={!!errors.password}
                            />
                            <Form.Control.Feedback type="invalid">
                                {errors.password?.message}
                            </Form.Control.Feedback>
                        </Form.Group>
                        <Button type="submit" variant="primary" disabled={loading} className="w-100">
                            {loading ? 'Connexion...' : 'Se connecter'}
                        </Button>
                    </Form>
                    <p className="mt-3 text-center">
                        Pas encore de compte ? <Link to="/register">S'inscrire</Link>
                    </p>
                </Col>
            </Row>
        </Container>
    );
}

export default LoginPage;
