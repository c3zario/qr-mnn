const express = require("express");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const nodemailer = require("nodemailer");
const dotenv = require("dotenv");
dotenv.config();
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
        session({
            secret: "Shh, its a secret!",
            resave: true,
            saveUninitialized: false,
            cookie: { maxAge: 253402300000000 },
        })
    );
    app.use(cors());
    app.use(express.json());

    app.get("/home", async (req, res, next) => {
        if (req.session.user) next();
        else res.redirect("/register");
    });

    app.get("/register", async (req, res, next) => {
        if (req.session.user) res.redirect("/home");
        else next();
    });

    const database = await getDatabase();

    app.get("/admin/:password", async (req, res, next) => {
        if (req.params.password === process.env.ADMIN_PASS) {
            req.session.admin = true;
            res.redirect("/admin");
        } else {
            res.redirect("/");
        }
    });

    app.get("/admin", async (req, res, next) => {
        if (req.session.admin) next();
        else res.redirect("/");
    });

    app.post("/results", async (req, res, next) => {
        let results = {};
        let userNames = {};
        let users = await database.users.find().toArray();

        users.forEach((user) => {
            results[user._id] = user.codes.length;
            userNames[user._id] = user.name;
        });

        req.session.admin ? res.send([results, userNames]) : res.send();
    });

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

    app.get("/add_qr", async (req, res) => {
        if (req.session.admin) {
            const rand = () => {
                return Math.random().toString(36).substring(2);
            };

            const RandomToken = () => {
                return rand() + rand();
            };

            let token = RandomToken();
            await database.codes.insertOne({ token, name: "nowy kod" });

            res.send("http://wsb.server702757.nazwa.pl/qr/" + token);
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
                        subject: "Link loguj??cy",
                        html: `
                            <div style="padding: 15px; border-radius: 5px; background-color: #183A68; color: white; text-align: center">
                                <img src="http://wsb.server702757.nazwa.pl/qr_logo.png" width="100" height="100" style="border-radius: 5px"><br>
                                <span style="color: white">QRinator</span><br><br>
                            
                                <h3>Witaj ${name}</h3><br><br>
                            
                                <h4>Kliknij poni??ej, aby si?? zalogowa??</h4><br>
                                <a href="http://wsb.server702757.nazwa.pl/login/${user.insertedId.toString()}"><button style="border: none; padding: 10px 30px; border-radius: 5px; color: white; background-color: #E5007E;">Zaloguj si??</button></a>
                            </div>`,
                    });
            });

            console.log("http://localhost:" + port + "/login/" + user.insertedId.toString());
        }

        res.send("Zaloguj si?? klikaj??c w link wys??any na " + email);
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
