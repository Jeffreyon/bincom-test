const express = require("express");
const mysql = require("mysql");
const cors = require("cors");
const app = express();

// connect db
const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "123456",
    database: "bincomtest",
});

db.connect((err) => {
    if (err) throw err;
    console.log("db connected");
});

app.use(cors({ origin: "*" }));
app.use(express.json());

let sql_queries = {
    getPollingUnitResults: (pu_id) =>
        `SELECT * FROM announced_pu_results WHERE polling_unit_uniqueid = ${pu_id}`,
    getPollingUnits: () => `SELECT * FROM polling_unit`,
    getLgas: () => `SELECT * FROM lga`,
    getPollingUnitsByLga: (lga_Id) =>
        `SELECT * FROM polling_unit WHERE lga_id = ${lga_Id}`,
    getParties: () => `SELECT * FROM party`,
    addPollUnitResult: (pollId, party) =>
        "INSERT INTO `announced_pu_results`(`polling_unit_uniqueid`, `party_abbreviation`, `party_score`, `entered_by_user`, `date_entered`, `user_ip_address`) VALUES ('" +
        pollId +
        "','" +
        party.party +
        "','" +
        party.score +
        "','Jeffrey'," +
        Date.now() +
        ",'alfkjldkfjlkajfl')",
    createPollingUnit: (data) =>
        "INSERT INTO `polling_unit`(`polling_unit_id`, `ward_id`, `lga_id`, `uniquewardid`, `polling_unit_number`, `polling_unit_name`, `polling_unit_description`, `lat`, `long`, `entered_by_user`, `date_entered`, `user_ip_address`) VALUES (" +
        data.polling_unit_id +
        "," +
        data.ward_id +
        "," +
        data.lga_id +
        "," +
        data.uniquewardid +
        ",'" +
        data.polling_unit_number +
        "','" +
        data.polling_unit_name +
        "','" +
        data.polling_unit_description +
        "','" +
        data.lat +
        "','" +
        data.long +
        "','" +
        data.entered_by_user +
        "'," +
        Date.now() +
        ",'" +
        data.user_ip_address +
        "')",
};

// create db
// populate db

// get polling units
app.get("/api/polling-units", (req, res) => {
    let sql = sql_queries.getPollingUnits();
    db.query(sql, (err, results) => {
        if (err) throw err;

        let data = results
            .filter((pu) => pu.polling_unit_id !== 0) // ignore units with an id of 0
            .map((pu) => {
                return {
                    polling_unit_name: pu.polling_unit_name,
                    polling_unit_id: pu.uniqueid,
                };
            });
        res.send(data);
    });
});

// get lgas
app.get("/api/lgas", (req, res) => {
    let sql = sql_queries.getLgas();
    db.query(sql, (err, results) => {
        if (err) throw err;

        results = results.map((lga) => {
            return {
                id: lga.lga_id,
                lga_name: lga.lga_name,
            };
        });
        res.send(results);
    });
});

// get parties
app.get("/api/parties", (req, res) => {
    let sql = sql_queries.getParties();
    db.query(sql, (err, results) => {
        if (err) throw err;

        res.send(results);
    });
});

// get polling unit results
app.get("/api/polling-unit-results/:id", (req, res) => {
    let sql = sql_queries.getPollingUnitResults(req.params.id);
    db.query(sql, (err, results) => {
        if (err) throw err;
        res.send(results);
    });
});

// get lga polling units aggregate
app.get("/api/lga-aggregate/:id", (req, res) => {
    let aggregateScore = 0;
    let sql = sql_queries.getPollingUnitsByLga(req.params.id);

    db.query(sql, (err, results) => {
        if (err) throw err;

        // loop through each polling unit and aggregate their results

        results.forEach((pu) => {
            sql = sql_queries.getPollingUnitResults(pu.polling_unit_id);

            db.query(sql, (err, results) => {
                if (err) throw err;

                results.forEach((result) => {
                    aggregateScore += result.party_score;
                });
            });
        });

        setTimeout(() => {
            // if it's not done after 3s, timeout
            console.log(aggregateScore);
            res.send({ score: aggregateScore });
        }, 3000);
    });
});

// add polling unit result
app.post("/api/add-polling-unit", (req, res) => {
    let data = req.body;
    let pollingUnitData = data.pollUnitDetails;
    let partyScores = data.partyScores;

    // create numbers from numeric fields or assign 0
    pollingUnitData.polling_unit_id =
        Number.parseInt(pollingUnitData.polling_unit_id) || 0;
    pollingUnitData.ward_id = Number.parseInt(pollingUnitData.ward_id) || 0;
    pollingUnitData.lga_id = Number.parseInt(pollingUnitData.lga_id) || 0;
    pollingUnitData.uniquewardid =
        Number.parseInt(pollingUnitData.uniquewardid) || 0;

    let sql = sql_queries.createPollingUnit(pollingUnitData);
    db.query(sql, (err, result) => {
        if (err) throw err;

        // loop through the party scores
        partyScores.map((party) => {
            let sql = sql_queries.addPollUnitResult(result.insertId, party);

            // add new pu results for each party with a score
            db.query(sql, (err, result) => {
                if (err) throw err;
            });
        });
    });

    setTimeout(() => res.send({ success: true }), 3000);
});

app.listen(5000, () => {
    console.log("Server live at port 5000");
});
