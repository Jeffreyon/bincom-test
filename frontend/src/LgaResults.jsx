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
    const [aggregateScore, setAggregateScore] = useState("");

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
                .get(
                    `https://bincom-test.onrender.com/api/lga-aggregate/${selectedLga}`
                )
                .then((res) => {
                    if (res.data) return res.data;
                })
                .then((data) => {
                    setAggregateScore(data.score);
                })
                .catch(console.log);
        }
    }, [selectedLga]);

    const handleSelect = (e) => {
        e.preventDefault();

        let selected = e.target.value;
        setSelectedLga(selected);
    };

    return (
        <Container className="mt-5">
            <h1 className="mb-5">View aggregate score per LGA</h1>
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
            </Stack>
            {aggregateScore && (
                <>
                    <h6 className="mt-5">Aggregate Score for LGA</h6>
                    <h1 className="mt-1">{aggregateScore} Votes</h1>
                </>
            )}
        </Container>
    );
}

export default LgaResults;
