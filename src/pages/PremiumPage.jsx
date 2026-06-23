import { useEffect, useState } from 'react';
import { Container, Row, Col, Card, Button, Alert, Form } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { goPremium, clearPaymentError } from '../features/payments/paymentSlice';
import { fetchMe } from '../features/auth/authSlice';

function PremiumPage() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { user } = useSelector(state => state.auth);
    const { loading, error } = useSelector(state => state.payments);
    const [paymentMethod, setPaymentMethod] = useState('stripe');
    const [success, setSuccess] = useState(false);

    useEffect(() => {
        return () => dispatch(clearPaymentError());
    }, [dispatch]);

    const handlePay = async () => {
        const result = await dispatch(goPremium({ payment_method: paymentMethod, amount: 19.99 }));
        if (goPremium.fulfilled.match(result)) {
            await dispatch(fetchMe());
            setSuccess(true);
            setTimeout(() => navigate('/dashboard'), 2500);
        }
    };

    if (user?.is_premium) {
        return (
            <Container className="mt-5 text-center">
                <h2>Vous êtes déjà membre premium !</h2>
                <Button variant="primary" className="mt-3" onClick={() => navigate('/dashboard')}>
                    Retour au dashboard
                </Button>
            </Container>
        );
    }

    if (success) {
        return (
            <Container className="mt-5 text-center">
                <Alert variant="success" className="d-inline-block">
                    <Alert.Heading>Paiement confirmé !</Alert.Heading>
                    <p>Bienvenue dans le club premium. Un email de confirmation vous a été envoyé.</p>
                    <p className="text-muted">Redirection en cours...</p>
                </Alert>
            </Container>
        );
    }

    return (
        <Container className="mt-5 mb-5">
            <Row className="justify-content-center">
                <Col md={5}>
                    <Card className="shadow-sm">
                        <Card.Header className="bg-warning text-dark text-center fw-bold fs-5">
                            Offre Premium
                        </Card.Header>
                        <Card.Body className="text-center">
                            <p className="display-6 fw-bold mb-1">19,99 €</p>
                            <p className="text-muted mb-4">accès à vie</p>
                            <ul className="list-unstyled text-start mb-4">
                                <li>✅ Créer des événements</li>
                                <li>✅ Proposer vos compétences</li>
                                <li>✅ Messagerie privée</li>
                                <li>✅ Gestion de contacts</li>
                            </ul>
                            {error && <Alert variant="danger">{error}</Alert>}
                            <Form.Group className="mb-3 text-start">
                                <Form.Label>Mode de paiement</Form.Label>
                                <Form.Select
                                    value={paymentMethod}
                                    onChange={e => setPaymentMethod(e.target.value)}
                                >
                                    <option value="stripe">Stripe (carte bancaire)</option>
                                    <option value="cheque">Chèque</option>
                                </Form.Select>
                            </Form.Group>
                            <Button
                                variant="warning"
                                className="w-100 fw-bold"
                                onClick={handlePay}
                                disabled={loading}
                            >
                                {loading ? 'Traitement...' : `Payer 19,99 € avec ${paymentMethod === 'stripe' ? 'Stripe' : 'Chèque'}`}
                            </Button>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
}

export default PremiumPage;
