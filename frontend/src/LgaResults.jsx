import { useState } from "react";
import { useEffect } from "react";
import axios from "axios";
import Form from "react-bootstrap/Form";
import Table from "react-bootstrap/Table";
import Container from "react-bootstrap/Container";
import Stack from "react-bootstrap/Stack";

function LgaResults() {
    const [lgas, setLgas] = useState([]);
    const [selectedLga, setSelectedLga] = useState(null);
    const [pollingUnits, setPollingUnits] = useState([]);

    useEffect(() => {
        axios
            .get("http://localhost:5000/api/lgas")
            .then((res) => {
                if (res.data) return res.data;
            })
            .then((data) => setLgas(data))
            .catch(console.log);
    }, []);

    useEffect(() => {
        if (selectedLga) {
            axios
                .get(`http://localhost:5000/api/lga-aggregate/${selectedLga}`)
                .then((res) => {
                    if (res.data) return res.data;
                })
                .then((data) => setPollingUnits(data))
                .catch(console.log);
        }
    }, [selectedLga]);

    const handleSelect = (e) => {
        e.preventDefault();

        let selected = e.target.value;
        setSelectedLga(selected);
    };

    const displayResults = () => {
        if (!pollingUnits.length) {
            return <p>No polling units for this Lga</p>;
        } else {
            return (
                <Table striped border="true" hover size="sm">
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>Polling Unit Name</th>
                            <th>Polling Unit Number</th>
                        </tr>
                    </thead>
                    <tbody>
                        {pollingUnits.map((result, ii) => {
                            return (
                                <tr key={ii}>
                                    <td>{result.polling_unit_id}</td>
                                    <td>{result.polling_unit_name}</td>
                                    <td>{result.polling_unit_number}</td>
                                </tr>
                            );
                        })}
                    </tbody>
                </Table>
            );
        }
    };

    return (
        <Container className="mt-5">
            <Stack direction="horizontal" gap="3">
                <Form.Select
                    name="polling_unit"
                    onChange={handleSelect}
                    defaultValue="default">
                    <option value="default" disabled>
                        Select LGA
                    </option>
                    {lgas.map((lga, ii) => {
                        return (
                            <option key={ii} value={lga.id}>
                                {lga.lga_name}
                            </option>
                        );
                    })}
                </Form.Select>
                <Form.Select
                    name="polling_unit"
                    onChange={handleSelect}
                    defaultValue={"default"}>
                    <option value="default" disabled>
                        Select a polling unit
                    </option>
                    {lgas.map((pu, ii) => {
                        return (
                            <option key={ii} value={pu.polling_unit_id}>
                                {pu.polling_unit_name}
                            </option>
                        );
                    })}
                </Form.Select>
            </Stack>
            <div className="mt-3">{displayResults()}</div>
        </Container>
    );
}

export default LgaResults;
