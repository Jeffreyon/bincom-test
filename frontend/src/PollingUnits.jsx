import { useState } from "react";
import { useEffect } from "react";
import axios from "axios";
import Form from "react-bootstrap/Form";
import Table from "react-bootstrap/Table";
import Container from "react-bootstrap/Container";
import Stack from "react-bootstrap/Stack";

function PollingUnits() {
    const [pollingUnits, setPollingUnits] = useState([]);
    const [selectedPollingUnit, setSelectedPollingUnit] = useState(null);
    const [pollingUnitResults, setPollingUnitResults] = useState([]);

    useEffect(() => {
        axios
            .get("http://localhost:5000/api/polling-units")
            .then((res) => {
                if (res.data) return res.data;
            })
            .then((data) => setPollingUnits(data))
            .catch((err) => console.log(err));
    }, []);

    useEffect(() => {
        if (selectedPollingUnit) {
            axios
                .get(
                    `http://localhost:5000/api/polling-unit-results/${selectedPollingUnit}`
                )
                .then((res) => {
                    console.log(res.data);
                    if (res.data) return res.data;
                })
                .then((data) => setPollingUnitResults(data))
                .catch(console.log);
        }
    }, [selectedPollingUnit]);

    const handleSelect = (e) => {
        e.preventDefault();

        let selected = e.target.value;
        setSelectedPollingUnit(selected);
    };

    const displayResults = () => {
        if (!pollingUnitResults.length) {
            return <p>No results for this polling unit</p>;
        } else {
            return (
                <Table striped border="true" hover size="sm">
                    <thead>
                        <tr>
                            <th>Result ID</th>
                            <th>Polling Unit ID</th>
                            <th>Party</th>
                            <th>Score</th>
                            <th>Entered by user</th>
                            <th>User IP</th>
                        </tr>
                    </thead>
                    <tbody>
                        {pollingUnitResults.map((result, ii) => {
                            return (
                                <tr key={ii}>
                                    <td>{result.result_id}</td>
                                    <td>{result.polling_unit_uniqueid}</td>
                                    <td>{result.party_abbreviation}</td>
                                    <td>{result.party_score}</td>
                                    <td>{result.entered_by_user}</td>
                                    <td>{result.user_ip_address}</td>
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
            <h1 className="mb-5">View polling results</h1>
            <Stack direction="horizontal">
                <Form.Select
                    name="polling_unit"
                    onChange={handleSelect}
                    defaultValue={"default"}>
                    <option value="default" disabled>
                        Select a polling unit
                    </option>
                    {pollingUnits.map((pu, ii) => {
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

export default PollingUnits;
