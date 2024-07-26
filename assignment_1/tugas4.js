const fs = require("fs");
const path = require("path");
const validator = require("validator");
const readline = require("readline");
const yargs = require("yargs");
const { hideBin } = require("yargs/helpers");

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
});

const dirPath = "./data";
const contactsFile = path.join(dirPath, "contacts.json");

/**
 * Reads contacts from the file.
 * @returns {Array} List of contacts.
 */
const readContacts = () => {
    if (fs.existsSync(contactsFile)) {
        const data = fs.readFileSync(contactsFile, "utf-8");
        return JSON.parse(data);
    }
    return [];
};

/**
 * Writes contacts to the file.
 * @param {Array} contacts - List of contacts to write.
 * @returns {void}
 */
const writeContacts = (contacts) => {
    if (!fs.existsSync(dirPath)) {
        fs.mkdirSync(dirPath, { recursive: true });
    }
    fs.writeFileSync(contactsFile, JSON.stringify(contacts, null, 2));
};

/**
 * Adds a new contact.
 * @returns {Promise<void>}
 */
const addContact = async () => {
    const questions = [
        {
            name: "name",
            message: "Masukkan nama:",
        },
        {
            name: "phone",
            message: "Masukkan nomor telepon:",
            validate: (value) => {
                if (validator.isMobilePhone(value, "id-ID")) {
                    return true;
                }
                return "Nomor telepon tidak valid!";
            },
        },
        {
            name: "email",
            message: "Masukkan email:",
            validate: (value) => {
                if (validator.isEmail(value)) {
                    return true;
                }
                return "Email tidak valid!";
            },
        },
    ];

    const getInput = (question) => {
        return new Promise((resolve) => {
            rl.question(`${question.message} `, (input) => {
                if (question.validate) {
                    const valid = question.validate(input);
                    if (valid === true) {
                        resolve(input);
                    } else {
                        console.log(valid);
                        resolve(getInput(question));
                    }
                } else {
                    resolve(input);
                }
            });
        });
    };

    const answers = {};
    for (const question of questions) {
        answers[question.name] = await getInput(question);
    }

    const contacts = readContacts();
    contacts.push(answers);
    writeContacts(contacts);
    console.log("Kontak berhasil ditambahkan!");

    rl.close();
    process.exit(0);
};

/**
 * Lists all contacts.
 * @returns {void}
 */
const listContacts = () => {
    const contacts = readContacts();
    console.log("Daftar Kontak:");
    contacts.forEach((contact, index) => {
        console.log(
            `${index + 1}. Nama: ${contact.name}, Telepon: ${contact.phone}`
        );
    });
    rl.close();
    process.exit(0);
};

/**
 * Shows the detail of a contact by name.
 * @param {string} name - The name of the contact.
 * @returns {void}
 */
const detailContact = (name) => {
    const contacts = readContacts();
    const contact = contacts.find(
        (c) => c.name.toLowerCase() === name.toLowerCase()
    );
    if (contact) {
        console.log(
            `Detail Kontak: Nama: ${contact.name}, Telepon: ${contact.phone}, Email: ${contact.email}`
        );
    } else {
        console.log(`Kontak dengan nama ${name} tidak ditemukan.`);
    }
    rl.close();
};

/**
 * Deletes a contact by name.
 * @param {string} name - The name of the contact.
 * @returns {void}
 */
const deleteContact = (name) => {
    let contacts = readContacts();
    const newContacts = contacts.filter(
        (c) => c.name.toLowerCase() !== name.toLowerCase()
    );

    if (contacts.length === newContacts.length) {
        console.log(`Kontak dengan nama ${name} tidak ditemukan.`);
    } else {
        writeContacts(newContacts);
        console.log(`Kontak dengan nama ${name} berhasil dihapus.`);
    }
    rl.close();
    process.exit(0);
};

// Konfigurasi yargs untuk menangani berbagai perintah
yargs(hideBin(process.argv))
    .version("1.0.2")
    .command("add", "Tambah kontak baru", {}, addContact)
    .command("list", "Tampilkan semua kontak", {}, listContacts)
    .command(
        "detail <name>",
        "Tampilkan detail kontak berdasarkan nama",
        (yargs) => {
            yargs.positional("name", {
                describe: "Nama kontak",
                type: "string",
            });
        },
        (argv) => {
            detailContact(argv.name);
        }
    )
    .command(
        "delete <name>",
        "Hapus kontak berdasarkan nama",
        (yargs) => {
            yargs.positional("name", {
                describe: "Nama kontak",
                type: "string",
            });
        },
        (argv) => {
            deleteContact(argv.name);
        }
    )
    .demandCommand(1, "Harap pilih perintah yang valid")
    .help()
    .argv;
