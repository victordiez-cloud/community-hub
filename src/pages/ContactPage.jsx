import { useState } from "react";
import { Container, Row, Col, Form, Button, Alert } from "react-bootstrap";
import { useForm } from "react-hook-form";

function ContactPage() {
  const [success, setSuccess] = useState(false);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const onSubmit = (data) => {
    console.log("Contact form:", data);
    setSuccess(true);
    reset();
  };

  return (
    <Container className="mt-5 mb-5">
      <Row className="justify-content-center">
        <Col md={6}>
          <h2 className="mb-4">Nous contacter</h2>
          {success && (
            <Alert
              variant="success"
              onClose={() => setSuccess(false)}
              dismissible
            >
              Votre message a bien été envoyé !
            </Alert>
          )}
          <Form onSubmit={handleSubmit(onSubmit)}>
            <Form.Group className="mb-3">
              <Form.Label>Nom & prénom *</Form.Label>
              <Form.Control
                type="text"
                placeholder="Jean Dupont"
                {...register("fullname", { required: "Ce champ est requis" })}
                isInvalid={!!errors.fullname}
              />
              <Form.Control.Feedback type="invalid">
                {errors.fullname?.message}
              </Form.Control.Feedback>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Sujet *</Form.Label>
              <Form.Control
                type="text"
                placeholder="Votre sujet"
                {...register("subject", { required: "Ce champ est requis" })}
                isInvalid={!!errors.subject}
              />
              <Form.Control.Feedback type="invalid">
                {errors.subject?.message}
              </Form.Control.Feedback>
            </Form.Group>
            <Form.Group className="mb-4">
              <Form.Label>Message *</Form.Label>
              <Form.Control
                as="textarea"
                rows={5}
                placeholder="Votre message..."
                {...register("message", { required: "Ce champ est requis" })}
                isInvalid={!!errors.message}
              />
              <Form.Control.Feedback type="invalid">
                {errors.message?.message}
              </Form.Control.Feedback>
            </Form.Group>
            <Button type="submit" variant="primary" className="w-100">
              Envoyer
            </Button>
          </Form>
        </Col>
      </Row>
    </Container>
  );
}

export default ContactPage;
