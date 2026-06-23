import { Navbar, Nav, Container } from "react-bootstrap";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logoutUser } from "../../features/auth/authSlice";

function MainNavbar() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { user, token } = useSelector((state) => state.auth);

  const handleLogout = async () => {
    await dispatch(logoutUser());
    navigate("/login");
  };

  const isActive = (path) => location.pathname === path;

  return (
    <Navbar className="navbar-hub" expand="lg">
      <Container>
        <Navbar.Brand as={Link} to="/">
          Community<span className="brand-accent">Hub</span>
        </Navbar.Brand>

        <Navbar.Toggle aria-controls="main-nav" />

        <Navbar.Collapse id="main-nav">
          <Nav className="ms-auto align-items-center gap-1">
            <Nav.Link as={Link} to="/events" className={isActive("/events") ? "active" : ""}>
              Événements
            </Nav.Link>
            <Nav.Link as={Link} to="/contact" className={isActive("/contact") ? "active" : ""}>
              Contact
            </Nav.Link>

            {token ? (
              <>
                <Nav.Link as={Link} to="/dashboard" className={isActive("/dashboard") ? "active" : ""}>
                  Dashboard
                </Nav.Link>

                {Number(user?.user_status_id) === 3 && (
                  <Nav.Link as={Link} to="/categories" className={isActive("/categories") ? "active" : ""}>
                    Catégories
                  </Nav.Link>
                )}

                <Nav.Link as={Link} to="/contacts" className={isActive("/contacts") ? "active" : ""}>
                  Contacts
                </Nav.Link>
                <Nav.Link as={Link} to="/messages" className={isActive("/messages") ? "active" : ""}>
                  Messages
                </Nav.Link>

                {user?.is_premium && (
                  <Nav.Link as={Link} to="/skills" className={isActive("/skills") ? "active" : ""}>
                    Compétences
                  </Nav.Link>
                )}

                <div className="d-flex align-items-center gap-2 ms-3">
                  <div className="user-avatar">
                    {user?.pseudo?.[0]?.toUpperCase() ?? "?"}
                  </div>
                  <span className="user-pseudo">@{user?.pseudo}</span>
                </div>

                <button className="btn-logout ms-2" onClick={handleLogout}>
                  Déconnexion
                </button>
              </>
            ) : (
              <>
                <Nav.Link as={Link} to="/login" className={isActive("/login") ? "active" : ""}>
                  Connexion
                </Nav.Link>
                <Nav.Link as={Link} to="/register" className={isActive("/register") ? "active" : ""}>
                  Inscription
                </Nav.Link>
              </>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default MainNavbar;
