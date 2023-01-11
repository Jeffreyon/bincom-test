import Navbar from "react-bootstrap/Navbar";
import Nav from "react-bootstrap/Nav";
import Container from "react-bootstrap/Container";
import { Link } from "react-router-dom";

function NavBar() {
    return (
        <div>
            <Navbar>
                <Container>
                    <Navbar.Brand href="#home">Bincom Test</Navbar.Brand>
                    <Nav className="justify-content-end">
                        <Nav.Link>
                            <Link to="/">Polling Unit Result</Link>
                        </Nav.Link>
                        <Nav.Link>
                            <Link to="/lga-aggregate">LGA Results</Link>
                        </Nav.Link>
                        <Nav.Link>
                            <Link to="/add-polling-unit">Add Polling Unit</Link>
                        </Nav.Link>
                    </Nav>
                </Container>
            </Navbar>
        </div>
    );
}

export default NavBar;
