import React from "react";
import ReactDOM from "react-dom/client";
import Layout from "./Layout";
import PollingUnits from "./PollingUnits";
import LgaResults from "./LgaResults";
import AddPollingUnit from "./AddPollingUnit";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import "./index.css";
import "bootstrap/dist/css/bootstrap.min.css";

ReactDOM.createRoot(document.getElementById("root")).render(
    <React.StrictMode>
        <Router>
            <Routes>
                <Route element={<Layout />}>
                    <Route path="/" element={<PollingUnits />} />
                    <Route path="/lga-aggregate" element={<LgaResults />} />
                    <Route
                        path="/add-polling-unit"
                        element={<AddPollingUnit />}
                    />
                </Route>
            </Routes>
        </Router>
    </React.StrictMode>
);
