import { useEffect, useState } from 'react';
import { Container, Card, Button, Alert, Spinner, ButtonGroup, Badge } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { fetchMessages, clearMessagesError } from '../features/messages/messagesSlice';

function MessagesPage() {
    const dispatch = useDispatch();
    const { messages, loading, error } = useSelector((state) => state.messages);
    const [filter, setFilter] = useState('received');

    useEffect(() => {
        dispatch(fetchMessages(filter));
    }, [dispatch, filter]);

    const formatDate = (dateStr) => {
        if (!dateStr) return '';
        return new Date(dateStr).toLocaleString('fr-FR', {
            day: '2-digit', month: '2-digit', year: 'numeric',
            hour: '2-digit', minute: '2-digit',
        });
    };

    const messageList = Array.isArray(messages) ? messages : [];

    return (
        <Container className="py-4">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h2 className="mb-0">Mes messages</h2>
                <ButtonGroup>
                    <Button
                        variant={filter === 'received' ? 'primary' : 'outline-primary'}
                        onClick={() => setFilter('received')}
                    >
                        Reçus
                    </Button>
                    <Button
                        variant={filter === 'sent' ? 'primary' : 'outline-primary'}
                        onClick={() => setFilter('sent')}
                    >
                        Envoyés
                    </Button>
                </ButtonGroup>
            </div>

            {error && (
                <Alert variant="danger" dismissible onClose={() => dispatch(clearMessagesError())}>
                    {error}
                </Alert>
            )}

            {loading && (
                <div className="text-center py-4">
                    <Spinner animation="border" variant="primary" />
                </div>
            )}

            {!loading && messageList.length === 0 && (
                <p className="text-muted">
                    {filter === 'received' ? 'Vous n\'avez reçu aucun message.' : 'Vous n\'avez envoyé aucun message.'}
                </p>
            )}

            <div className="d-flex flex-column gap-3">
                {messageList.map((msg) => (
                    <Card key={msg.id}>
                        <Card.Body>
                            <div className="d-flex justify-content-between align-items-start mb-2">
                                <div>
                                    {filter === 'received' ? (
                                        <span className="fw-semibold">
                                            De : {msg.sender_pseudo || msg.sender || `#${msg.sender_id}`}
                                        </span>
                                    ) : (
                                        <span className="fw-semibold">
                                            À : {msg.receiver_pseudo || msg.receiver || `#${msg.receiver_id}`}
                                        </span>
                                    )}
                                </div>
                                <Badge bg="secondary" className="text-nowrap">
                                    {formatDate(msg.created_at || msg.date)}
                                </Badge>
                            </div>
                            <p className="mb-0">{msg.message || msg.content}</p>
                        </Card.Body>
                    </Card>
                ))}
            </div>
        </Container>
    );
}

export default MessagesPage;
