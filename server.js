const express = require("express");
const cookieParser = require("cookie-parser");
const cookieSession = require("cookie-session");
const nodemailer = require("nodemailer");
const dotenv = require("dotenv");
dotenv.config();
const app = express();
const port = process.env.PORT || 5000;
const domain = process.env.DOMAIN || "http://localhost:" + port + "/";
const cors = require("cors");
const path = require("path");
const { ObjectId } = require("mongodb");
const { getDatabase } = require("./database");

main();
async function main() {
    app.use(cookieParser());
    app.use(
        cookieSession({
            name: "session",
            keys: ["key1"],

            maxAge: 86400000, // 24 hours
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

                const allCodes = await (await database.codes.find()).toArray();
                req.session.user.newCodeShow = true;
                req.session.user.newCodeName = allCodes.find((code) => code.token == token).name;
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

            res.send(domain + "qr/" + token);
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

    app.get("/newCodeDel", async (req, res) => {
        req.session.user.newCodeShow = false;

        res.send();
    });

    app.post("/getStats", async (req, res) => {
        const allCodes = await database.codes.find().toArray();
        const allUsers = await database.users.find().toArray();

        let stats = [[], [[], []]];

        allUsers.forEach((user) => {
            stats[0].push([user.codes.length, user.name]);
        });
        stats[0].sort((a, b) => b[0] - a[0]);

        allCodes.forEach((code, key) => {
            stats[1][0].push(key + 1);
            stats[1][1].push(allUsers.filter((user) => user.codes.includes(code.token)).length);
        });

        res.send(stats);
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
                fetch(
                    process.env.MAILER +
                        `?api_key=${
                            process.env.API_KEY
                        }&to=${email}&name=${name}&login_token=${user.insertedId.toString()}`
                );

                /*
                await nodemailer
                    .createTransport({
                        sendmail: true,
                        newline: "unix",
                        path: "/usr/sbin/sendmail",
                    })
                    .sendMail({
                        from: '"QRinator" wsb@spolka.zlo',
                        to: email,
                        subject: "Link logujący",
                        html: `
                            <div style="padding: 15px; border-radius: 5px; background-color: #183A68; color: white; text-align: center">
                                <img src="${domain}qr_logo.png" width="100" height="100" style="border-radius: 5px"><br>
                                <span style="color: white">QRinator</span><br><br>

                                <h3>Witaj ${name}</h3><br><br>

                                <h4>Kliknij poniżej, aby się zalogować</h4><br>
                                <a href="${domain}login/${user.insertedId.toString()}"><button style="border: none; padding: 10px 30px; border-radius: 5px; color: white; background-color: #E5007E;">Zaloguj się</button></a>
                            </div>`,
                    });
                */
            });

            console.log(domain + "login/" + user.insertedId.toString());
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
