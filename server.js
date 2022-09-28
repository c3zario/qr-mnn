const express = require("express");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const app = express();
const port = process.env.PORT || 5000;
const cors = require("cors");
const path = require("path");
const { ObjectId } = require("mongodb");
const { getDatabase } = require("./database");

main();
async function main() {
    app.use(cookieParser());
    app.use(session({ secret: "Shh, its a secret!" }));
    app.use(cors());
    app.use(express.json());

    const database = await getDatabase();

    app.get("/qr/:id", async (req, res) => {
        let code;
        if (ObjectId.isValid(req.params.id))
            code = await database.codes.findOne({ _id: ObjectId(req.params.id) });

        if (req.session.user && code) {
            let codeExists = await database.users.findOne({
                _id: ObjectId(req.session.user._id),
                codes: { $all: [req.params.id] },
            });

            if (!codeExists) {
                await database.users.updateOne(
                    { _id: ObjectId(req.session.user._id) },
                    { $push: { codes: req.params.id } }
                );
            }

            res.redirect("/home");
        } else {
            res.redirect("/");
        }
    });

    app.post("/points", async (req, res) => {
        res.send(
            (
                await database.users.findOne({ _id: ObjectId(req.session.user._id) })
            ).codes.length.toString()
        );
    });

    app.get("/login/:id", async (req, res) => {
        let user;
        if (ObjectId.isValid(req.params.id))
            user = await database.users.findOne({ _id: ObjectId(req.params.id) });

        if (user) {
            req.session.user = user;
            res.redirect("/home");
        } else {
            res.redirect("/");
        }
    });

    app.get("/session", async (req, res) => {
        res.send(req.session.user ? req.session.user : {});
    });

    app.post("/add_account", async (req, res) => {
        let { name, surname, email, age } = req.body;
        email = email.toLowerCase();

        if (!(await database.users.findOne({ email }))) {
            let user = await database.users.insertOne({ name, surname, email, age });
            console.log("http://localhost:" + port + "/login/" + user.insertedId.toString());
        }

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
