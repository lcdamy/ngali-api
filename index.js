import 'dotenv/config';
import express from "express";
import cors from "cors";
import moment from 'moment';
import multer from 'multer';
import { extname, join } from 'path';
import path from 'path';
import { existsSync, mkdirSync, writeFileSync } from 'fs';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';
import mysql from "mysql";
import { doHash, doHashValidation } from "./utils/hashing";
import { signupSchema } from "./middlewares/validator";
import jwt from "jsonwebtoken";

const app = express();

const upload = multer();
const __dirname = path.dirname(__filename);

const mysql_connection = mysql.createConnection({
    host: "host.docker.internal",
    user: "lcdamy",
    password: "Zudanga@1",
    database: "ngali_challenge"
});
mysql_connection.connect((err) => {
    if (err) throw err;
    console.log("Mysql connected!");
});

app.use(cors());
app.use(helmet());
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));


app.get("/", (req, res) => {
    res.json("Backend API....")
});


app.get("/attendances", (req, res) => {
    const q = "SELECT * FROM ngali_challenge.attendances";
    mysql_connection.query(q, (error, data) => {
        if (error) return res.json(error);
        return res.json(data);
    })
});

app.get("/attendance/:id", (req, res) => {
    const id = req.params.id;
    const q = "SELECT * FROM ngali_challenge.attendances WHERE id=?";
    mysql_connection.query(q, [id], (error, data) => {
        if (error) return res.json(error);
        return res.json(data[0]);
    })
});

app.post("/attendances", upload.fields([{ name: 'cover' }, { name: 'name' }, { name: 'author' }, { name: 'description' }]), (req, res) => {
    if (!req.files['cover']) {
        return res.json("Please provide the file");
    }

    const file = req.files['cover'][0];

    if (!existsSync('uploads')) {
        mkdirSync('uploads', { recursive: true });
    }

    const timestamp = Date.now();
    const fileExtension = extname(file.originalname); // Extract the file extension
    const newFileName = `${timestamp}${fileExtension}`;

    const filePath = join('uploads', newFileName);

    writeFileSync(filePath, file.buffer);
    const cover_url = `http://localhost:8001/${filePath.replace(/\\/g, '/')}`;

    const q = "INSERT INTO attendancess (`name`,`description`,`author`,`cover_url`) VALUES (?,?,?,?)";
    const payload = [
        req.body.name,
        req.body.description,
        req.body.author,
        cover_url
    ];

    mysql_connection.query(q, payload, (error, data) => {
        if (error) return res.json(error);
        return res.json("attendances saved");
    });
})

app.delete("/attendances/:id", (req, res) => {
    const attendancesId = req.params.id;
    const q = "DELETE FROM attendancess WHERE id=?";
    mysql_connection.query(q, attendancesId, (error, data) => {
        if (error) return res.json(error);
        return res.json("attendances deleted");
    })
})

app.put("/attendances/:id", (req, res) => {
    const attendancesId = req.params.id;
    const q = "UPDATE attendancess SET name=?,description=?,author=? WHERE id=?";
    const payload = [
        req.body.name,
        req.body.description,
        req.body.author,
        attendancesId
    ]

    mysql_connection.query(q, [...payload, attendancesId], (error, data) => {
        if (error) return res.json(error);
        return res.json("attendances updated Successfully");
    })
})

app.get("/employees", (req, res) => {
    const q = "SELECT * FROM ngali_challenge.employees";
    mysql_connection.query(q, (error, data) => {
        if (error) return res.json(error);
        return res.json(data);
    })
});

app.post("/employee", (req, res) => {
    const q = "INSERT INTO employees (`names`,`email`,`age`,`dob`,`gender`,`salary`,`departement`) VALUES (?,?,?,?,?,?,?)";
    const payload = [
        req.body.names,
        req.body.email,
        req.body.age,
        moment(req.body.dob).format("YYYY-MM-DD"),
        req.body.gender,
        req.body.salary,
        req.body.departement
    ];
    mysql_connection.query(q, payload, (error, data) => {
        if (error) return res.json(error);
        return res.json("Employee saved");
    });
});

app.delete("/employees/:id", (req, res) => {
    const employeeId = req.params.id;
    const q = "DELETE FROM employees WHERE id=?";
    mysql_connection.query(q, employeeId, (error, data) => {
        if (error) return res.json(error);
        return res.json("employee deleted");
    })
});


app.post("/feedbacks", (req, res) => {
    const q = "INSERT INTO feedbacks (`employee_id`,`comment`,`feed_back_type`) VALUES (?,?,?)";
    const payload = [
        req.body.employee_id,
        req.body.comment,
        req.body.feed_back_type
    ];
    console.log(payload);

    mysql_connection.query(q, payload, (error, data) => {
        if (error) return res.json(error);
        return res.json("Feedback saved");
    });
});


app.post("/attendance", (req, res) => {
    const q = "INSERT INTO attendances (`date`,`employee_id`) VALUES (?,?)";
    const payload = [
        moment(req.body.date).format("YYYY-MM-DD"),
        req.body.employee_id
    ];

    mysql_connection.query(q, payload, (error, data) => {
        if (error) return res.json(error);
        return res.json("attendance saved");
    });
});

app.get("/attendances/:id", (req, res) => {
    const id = req.params.id;
    const q = "SELECT * FROM ngali_challenge.attendances WHERE employee_id=?";
    mysql_connection.query(q, id, (error, data) => {
        if (error) return res.json(error);
        data = data.map((x) => {
            x.date = moment(x.date).format("YYYY-MM-DD")
            return x
        })
        return res.json(data);
    })
});

app.listen(8001, () => {
    console.log(`API running on port 8001`);
})