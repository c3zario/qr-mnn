const express = require("express");
const app = express();
const port = process.env.PORT || 5000;
const cors = require("cors");
const path = require("path");
const { getDatabase } = require("./database");

main();
async function main() {
    app.use(cors());
    app.use(express.json());

    const database = await getDatabase();
    app.post("/add_account", async (req, res) => {
        let { name, surname, email, age } = req.body;
        email = email.toLowerCase();

        if (!(await database.users.findOne({ email })))
            await database.users.insertOne({ name, surname, email, age });

        res.send("Zaloguj się klikając w link wysłany na " + email);
    });

    app.use(express.static("public"));

    app.get("*", (req, res) => {
        res.sendFile(path.resolve(__dirname, "public", "index.html"));
    });

    app.listen(port, () => {
        console.log(`Server is up at port ${port}`);
    });
}
