const express = require("express");
const path = require("path");
const app = express();
const port = 3000;
const expressLayouts = require("express-ejs-layouts");
const fs = require("fs");
const bodyParser = require("body-parser");

// Rute untuk menghapus kontak berdasarkan nama
app.get("/delete/:name", async (req, res) => {
    try {
        const name = decodeURIComponent(req.params.name);
        const result = await Contact.deleteOne({ name: name });

        if (result.deletedCount > 0) {
            res.send("Contact deleted successfully");
        } else {
            res.send("No contact found with that name");
        }
    } catch (error) {
        res.status(500).send("Error deleting contact");
    }
});

const dataDir = path.join(__dirname, "data");

// Konfigurasi express untuk menggunakan EJS Layout
app.use(expressLayouts);
app.set("layout", "layout/layout"); // Menentukan layout yang akan digunakan
app.use(bodyParser.urlencoded({ extended: true }));

// Menyajikan file statis dari folder 'public'
app.use(express.static(path.join(__dirname, "public")));

app.use((req, res, next) => {
    console.log("Time:", Date.now());
    next();
});

// Mengatur EJS sebagai template engine
app.set("view engine", "ejs");

// Rute untuk halaman utama
app.get("/", (req, res) => {
    res.render("index", { nama: "Lisa", title: "Belajar Js" });
});

// Rute untuk halaman About
app.get("/about", (req, res) => {
    res.render("about");
});

// Function to read contacts from JSON file
const readContacts = () => {
    return new Promise((resolve, reject) => {
        fs.readFile(
            path.join(__dirname, "data", "contacts.json"),
            "utf-8",
            (err, data) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(JSON.parse(data));
                }
            }
        );
    });
};

// Rute untuk halaman Contact dengan data
app.get("/contact", (req, res) => {
    // const listContact = [
    //     { name: "AKW", email: "abc@gmail.com" },
    //     { name: "Lisa", email: "def@gmail.com" },
    //     { name: "Icha", email: "xyz@gmail.com" },
    // ];
    fs.readFile(
        path.join(__dirname, "data", "contacts.json"),
        "utf-8",
        (err, data) => {
            if (err) {
                console.log(err);
                req.status(500).send("Internal Server Error");
            } else {
                const contacts = JSON.parse(data);
                res.render("contact", { contacts });
            }
        }
    );
});

// Rute untuk produk dengan ID dan kategori
app.get("/product/:id/category/:idCat", (req, res) => {
    const idProduct = req.params.id;
    const idCategory = req.params.idCat;
    res.send(`Product id: ${idProduct} <br>Category id: ${idCategory}`);
});

// Rute untuk menampilkan file dari direktori 'data'
app.get("/random", (req, res) => {
    res.sendFile(path.join(dataDir, "random.txt")); // Ganti dengan nama file yang valid
});

// Menangani rute 404
app.use((req, res) => {
    res.status(404).send("404 not found");
});

// Menjalankan server
app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});
