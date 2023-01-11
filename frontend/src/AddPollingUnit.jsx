import Form from "react-bootstrap/Form";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";
import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function AddPollingUnit() {
    const [parties, setParties] = useState([]);
    const navigate = useNavigate();

    const puFields = () => {
        const fields = [];
        const pollUnitFormDetails = {
            polling_unit_id: "",
            ward_id: "",
            lga_id: "",
            uniquewardid: "",
            polling_unit_number: "",
            polling_unit_name: "",
            polling_unit_description: "",
            lat: "",
            long: "",
            entered_by_user: "",
            user_ip_address: "",
        };

        for (let field in pollUnitFormDetails) {
            fields.push(
                <Col className="mt-4">
                    <Form.Label>{field}</Form.Label>
                    <Form.Control
                        type="text"
                        placeholder="Enter value"
                        name={field}
                        className="poll-field"
                    />
                </Col>
            );
        }

        return fields;
    };

    useEffect(() => {
        // get party list
        axios
            .get("http://localhost:5000/api/parties")
            .then((res) => {
                if (res.data) return res.data;
            })
            .then((data) => {
                setParties(data);
            })
            .catch(console.log);
    });

    const handleClick = () => {
        let partyForms = document.querySelectorAll(".party");
        let pollFields = document.querySelectorAll(".poll-field");

        // good idea to validate the data first

        let data = {
            pollUnitDetails: {},
            partyScores: [],
        };

        pollFields.forEach((field) => {
            data.pollUnitDetails[field.name] = field.value;
        });

        partyForms.forEach((p) => {
            data.partyScores.push({
                party: p.name,
                score: p.value,
            });
        });

        // send to server
        axios
            .post("http://localhost:5000/api/add-polling-unit", data)
            .then((res) => {
                if (res.data.success) {
                    alert("Polling Unit Added");
                    navigate("add-polling-unit");
                }
            })
            .catch(console.log);
    };

    return (
        <Container className="mt-5">
            <Form>
                <h1>Add new polling unit result</h1>
                <Row xs={2} className="mt-3">
                    {puFields().map((f, ii) => (
                        <div key={ii}>{f}</div>
                    ))}
                </Row>
                <h3 className="mt-5">Party scores</h3>
                <Row xs={2}>
                    {parties.map((party, ii) => {
                        return (
                            <Col className="mt-4">
                                <Form.Label>{party.partyname}</Form.Label>
                                <Form.Control
                                    key={ii}
                                    type="number"
                                    placeholder="Enter score"
                                    className="party"
                                    name={party.partyname}
                                />
                            </Col>
                        );
                    })}
                </Row>
                <Row className="my-5">
                    <Button variant="primary" onClick={handleClick}>
                        Add Polling Unit Result
                    </Button>
                </Row>
            </Form>
        </Container>
    );
}

export default AddPollingUnit;
