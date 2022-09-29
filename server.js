const express = require("express");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const nodemailer = require("nodemailer");
const app = express();
const port = process.env.PORT || 5000;
const cors = require("cors");
const path = require("path");
const { ObjectId } = require("mongodb");
const { getDatabase } = require("./database");

main();
async function main() {
    app.use(cookieParser());
    app.use(
        session({ secret: "Shh, its a secret!", cookie: { expires: new Date(253402300000000) } })
    );
    app.use(cors());
    app.use(express.json());

    app.get("/home", async (req, res, next) => {
        if (req.session.user) next();
        else res.redirect("/register");
    });

    const database = await getDatabase();

    app.get("/qr/:token", async (req, res) => {
        let token = req.params.token;
        let code = await database.codes.findOne({ token });

        if (req.session.user && code) {
            let codeExists = await database.users.findOne({
                _id: ObjectId(req.session.user._id),
                codes: { $all: [token] },
            });

            if (!codeExists) {
                await database.users.updateOne(
                    { _id: ObjectId(req.session.user._id) },
                    { $push: { codes: token } }
                );
            }
        }

        if (req.session.user) res.redirect("/home");
        else res.redirect("/register");
    });

    app.post("/all_codes", async (req, res) => {
        let list = [];

        const allCodes = await (await database.codes.find()).toArray();
        const userCodes = (await database.users.findOne({ _id: ObjectId(req.session.user._id) }))
            .codes;

        allCodes.forEach((code) => {
            if (userCodes.find((codeId) => codeId == code.token)) list.push(code.name);
            else list.push("");
        });

        res.send(list);
    });

    app.post("/points", async (req, res) => {
        res.send(
            (
                await database.users.findOne({ _id: ObjectId(req.session.user._id) })
            ).codes.length.toString()
        );
    });

    app.post("/position", async (req, res) => {
        const users = await (
            await database.users.find({ category: req.session.user.category })
        ).toArray();
        const userCodes = (await database.users.findOne({ _id: ObjectId(req.session.user._id) }))
            .codes.length;

        let position = 1;
        users.forEach((user) => {
            if (user.codes.length > userCodes) position++;
        });

        res.send([position, users.length]);
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

    app.get("/logout", async (req, res) => {
        req.session.user = undefined;

        res.redirect("/");
    });

    app.get("/session", async (req, res) => {
        res.send(req.session.user ? req.session.user : {});
    });

    app.post("/add_account", async (req, res) => {
        let { name, surname, email, age } = req.body;
        email = email.toLowerCase();

        if (!(await database.users.findOne({ email }))) {
            let user = await database.users.insertOne({
                name,
                surname,
                email,
                age,
                category: age < 15 ? 0 : 1,
                codes: [],
            });

            await handleErrors(async () => {
                await nodemailer
                    .createTransport({
                        sendmail: true,
                        newline: "unix",
                        path: "/usr/sbin/sendmail",
                    })
                    .sendMail({
                        from: '"QRinator" wsb@spolka.zlo',
                        to: email,
                        subject: "Rejestracja konta",
                        html: `
                            <div style="padding: 15px; border-radius: 5px; background-color: #183A68; color: white; text-align: center">
                                <span style="color: white">QRinator</span><br><br>
                            
                                <h3>Witaj ${name}</h3><br><br>
                            
                                <h4>Kliknij poniżej, aby się zalogować</h4><br>
                                <a href="http://wsb.server702757.nazwa.pl/login/${user.insertedId.toString()}"><button style="border: none; padding: 10px 30px; border-radius: 5px; color: white; background-color: #E5007E;">Zaloguj się</button></a>
                            </div>`,
                    });
            });

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

async function handleErrors(callback) {
    try {
        await callback();
    } catch (error) {
        console.error(error instanceof Error ? error.message : error);
    }
}
