import { useEffect, useState } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  Button,
  Form,
  Alert,
  Badge,
  Spinner,
  Modal,
} from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { useForm } from "react-hook-form";
import {
  fetchContacts,
  fetchUsers,
  sendContactRequest,
  acceptContactRequest,
  clearContactsError,
  clearContactsSuccess,
} from "../features/contacts/contactsSlice";
import {
  sendMessage,
  clearMessagesError,
  clearMessagesSuccess,
} from "../features/messages/messagesSlice";

function ContactsPage() {
  const dispatch = useDispatch();
  const { contacts, users, loading, error, successMessage } = useSelector(
    (state) => state.contacts,
  );
  const { error: msgError, successMessage: msgSuccess } = useSelector(
    (state) => state.messages,
  );
  const { user } = useSelector((state) => state.auth);

  const [selectedContact, setSelectedContact] = useState(null);
  const [showMessageModal, setShowMessageModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);

  const {
    register: registerMsg,
    handleSubmit: handleMsgSubmit,
    reset: resetMsg,
    formState: { errors: msgErrors },
  } = useForm();
  const {
    register: registerAdd,
    handleSubmit: handleAddSubmit,
    reset: resetAdd,
    formState: { errors: addErrors },
  } = useForm();

  useEffect(() => {
    dispatch(fetchContacts());
    dispatch(fetchUsers());
  }, [dispatch]);

  useEffect(() => {
    if (successMessage) {
      dispatch(fetchContacts());
      setTimeout(() => dispatch(clearContactsSuccess()), 3000);
    }
  }, [successMessage, dispatch]);

  useEffect(() => {
    if (msgSuccess) {
      setShowMessageModal(false);
      resetMsg();
      setTimeout(() => dispatch(clearMessagesSuccess()), 3000);
    }
  }, [msgSuccess, dispatch, resetMsg]);

  const acceptedContacts = Array.isArray(contacts)
    ? contacts.filter((c) => c.status === "accepted")
    : [];

  const pendingContacts = Array.isArray(contacts)
    ? contacts.filter((c) => c.status === "pending")
    : [];

  const otherUsers = Array.isArray(users)
    ? users.filter((u) => Number(u.id) !== Number(user?.id))
    : [];

  const getOtherUserId = (contact) =>
    Number(contact.receiver_id) === Number(user?.id)
      ? contact.requester_id
      : contact.receiver_id;

  const getContactName = (contact) =>
    Number(contact.receiver_id) === Number(user?.id)
      ? contact.requester_pseudo
      : contact.receiver_pseudo;

  const handleOpenMessage = (contact) => {
    setSelectedContact(contact);
    setShowMessageModal(true);
    dispatch(clearMessagesError());
  };

  const onSendMessage = (data) => {
    const receiverId = getOtherUserId(selectedContact);
    dispatch(sendMessage({ receiverId, message: data.message }));
  };

  const onSendRequest = (data) => {
    dispatch(sendContactRequest(Number(data.receiver_id)));
    resetAdd();
    setShowAddModal(false);
  };

  const onAccept = (contactId) => {
    dispatch(acceptContactRequest(contactId));
  };

  return (
    <Container className="py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="mb-0">Mes contacts</h2>
        <Button variant="primary" onClick={() => setShowAddModal(true)}>
          + Ajouter un contact
        </Button>
      </div>

      {error && (
        <Alert
          variant="danger"
          dismissible
          onClose={() => dispatch(clearContactsError())}
        >
          {error}
        </Alert>
      )}
      {successMessage && <Alert variant="success">{successMessage}</Alert>}
      {msgSuccess && <Alert variant="success">{msgSuccess}</Alert>}

      {loading && (
        <div className="text-center py-4">
          <Spinner animation="border" variant="primary" />
        </div>
      )}

      {pendingContacts.length > 0 && (
        <div className="mb-4">
          <h5 className="mb-3">Demandes en attente</h5>
          <Row className="g-3">
            {pendingContacts.map((contact) => (
              <Col key={contact.id} xs={12} md={6} lg={4}>
                <Card className="h-100">
                  <Card.Body className="d-flex justify-content-between align-items-center">
                    <div>
                      <span className="fw-semibold">
                        {getContactName(contact)}
                      </span>
                      <br />
                      <Badge bg="warning" text="dark">
                        En attente
                      </Badge>
                    </div>
                    {Number(contact.receiver_id) === Number(user?.id) && (
                      <Button
                        size="sm"
                        variant="success"
                        onClick={() => onAccept(contact.id)}
                      >
                        Accepter
                      </Button>
                    )}
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        </div>
      )}

      <h5 className="mb-3">Contacts acceptés</h5>
      {acceptedContacts.length === 0 && !loading ? (
        <p className="text-muted">
          Vous n'avez pas encore de contacts acceptés.
        </p>
      ) : (
        <Row className="g-3">
          {acceptedContacts.map((contact) => (
            <Col key={contact.id} xs={12} md={6} lg={4}>
              <Card className="h-100">
                <Card.Body className="d-flex justify-content-between align-items-center">
                  <div>
                    <span className="fw-semibold">
                      {getContactName(contact)}
                    </span>
                    <br />
                    <Badge bg="success">Accepté</Badge>
                  </div>
                  <Button
                    size="sm"
                    variant="outline-primary"
                    onClick={() => handleOpenMessage(contact)}
                  >
                    Envoyer un message
                  </Button>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      )}

      {/* Modal envoyer un message */}
      <Modal
        show={showMessageModal}
        onHide={() => setShowMessageModal(false)}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>
            Message à{" "}
            {selectedContact ? getContactName(selectedContact) : "ce contact"}
          </Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleMsgSubmit(onSendMessage)}>
          <Modal.Body>
            {msgError && <Alert variant="danger">{msgError}</Alert>}
            <Form.Group>
              <Form.Label>Votre message</Form.Label>
              <Form.Control
                as="textarea"
                rows={4}
                placeholder="Écrivez votre message..."
                isInvalid={!!msgErrors.message}
                {...registerMsg("message", {
                  required: "Le message est requis.",
                })}
              />
              <Form.Control.Feedback type="invalid">
                {msgErrors.message?.message}
              </Form.Control.Feedback>
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button
              variant="secondary"
              onClick={() => setShowMessageModal(false)}
            >
              Annuler
            </Button>
            <Button type="submit" variant="primary" disabled={loading}>
              Envoyer
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>

      {/* Modal ajouter un contact */}
      <Modal show={showAddModal} onHide={() => setShowAddModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Ajouter un contact</Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleAddSubmit(onSendRequest)}>
          <Modal.Body>
            <Form.Group>
              <Form.Label>Choisir un utilisateur</Form.Label>
              <Form.Select
                isInvalid={!!addErrors.receiver_id}
                {...registerAdd("receiver_id", {
                  required: "Veuillez sélectionner un utilisateur.",
                })}
              >
                <option value="">-- Sélectionner --</option>
                {otherUsers.map((u) => (
                  <option key={u.id} value={u.id}>
                    {u.pseudo || `${u.firstname} ${u.lastname}`}
                  </option>
                ))}
              </Form.Select>
              <Form.Control.Feedback type="invalid">
                {addErrors.receiver_id?.message}
              </Form.Control.Feedback>
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowAddModal(false)}>
              Annuler
            </Button>
            <Button type="submit" variant="primary" disabled={loading}>
              Envoyer la demande
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </Container>
  );
}

export default ContactsPage;
