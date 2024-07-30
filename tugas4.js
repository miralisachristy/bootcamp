const fs = require("fs"); // Modul 'fs' untuk berinteraksi dengan sistem file
const path = require("path"); // Modul 'path' untuk menangani path file
const validator = require("validator"); // Modul 'validator' untuk validasi data
const readline = require("readline"); // Modul 'readline' untuk membaca input dari pengguna
const yargs = require("yargs"); // Modul 'yargs' untuk menangani command-line arguments
const { hideBin } = require("yargs/helpers"); // Helper untuk menghilangkan argumen bin dari argv

// Membuat interface readline untuk membaca input dari stdin
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
});

const dirPath = "./data"; // Path ke direktori data
const contactsFile = path.join(dirPath, "contacts.json"); // Path ke file kontak JSON

/**
 * Membaca kontak dari file.
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
 * Menulis kontak ke file.
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
 * Memeriksa apakah kontak dengan nama yang diberikan sudah ada.
 * @param {string} name - Nama kontak yang akan diperiksa.
 * @returns {boolean} True jika kontak ada, false jika tidak.
 */
const contactExists = (name) => {
    const contacts = readContacts();
    return contacts.some(
        (contact) => contact.name.toLowerCase() === name.toLowerCase()
    );
};

/**
 * Menambahkan kontak baru.
 * @returns {Promise<void>}
 */
const addContact = async () => {
    const questions = [
        {
            name: "name",
            message: "Masukkan nama:",
            validate: async (value) => {
                if (contactExists(value)) {
                    return "Nama kontak sudah ada! Silakan masukkan nama yang berbeda.";
                }
                return true;
            },
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
        return new Promise(async (resolve) => {
            rl.question(`${question.message} `, async (input) => {
                if (question.validate) {
                    const valid = await question.validate(input);
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
 * Menampilkan semua kontak.
 * @returns {void}
 */
const listContacts = () => {
    const contacts = readContacts();
    if (contacts.length === 0) {
        console.log("Tidak ada data.");
    } else {
        console.log("Daftar Kontak:");
        contacts.forEach((contact, index) => {
            console.log(
                `${index + 1}. Nama: ${contact.name}, Telepon: ${contact.phone}, Email: ${contact.email}`
            );
        });
    }
    rl.close();
    process.exit(0);
};

/**
 * Menampilkan detail kontak berdasarkan nama.
 * @param {string} name - Nama kontak.
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
 * Menghapus kontak berdasarkan nama.
 * @param {string} name - Nama kontak.
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

/**
 * Menghapus semua kontak.
 * @returns {void}
 */
const deleteAllContacts = () => {
    if (fs.existsSync(contactsFile)) {
        fs.unlinkSync(contactsFile);
        console.log("Semua data kontak berhasil dihapus.");
    } else {
        console.log("Tidak ada data untuk dihapus.");
    }
    rl.close();
    process.exit(0);
};

/**
 * Memperbarui kontak berdasarkan nama.
 * @param {string} name - Nama kontak yang akan diperbarui.
 * @returns {Promise<void>}
 */
const updateContact = async (name) => {
    const contacts = readContacts(); // Membaca kontak dari file
    const contactIndex = contacts.findIndex(
        (c) => c.name.toLowerCase() === name.toLowerCase()
    ); // Mencari indeks kontak berdasarkan nama

    if (contactIndex === -1) {
        console.log(`Kontak dengan nama ${name} tidak ditemukan.`); // Menampilkan pesan jika kontak tidak ditemukan
        rl.close();
        process.exit(0);
    }

    // Pertanyaan untuk memilih data yang ingin diperbarui
    const updateOptions = [
        {
            name: "field",
            message: "Apa yang ingin Anda perbarui? (name/phone/email):",
            validate: (value) => {
                const validFields = ["name", "phone", "email"];
                if (validFields.includes(value.toLowerCase())) {
                    return true;
                }
                return "Pilihan tidak valid! Silakan pilih 'name', 'phone', atau 'email'.";
            },
        },
    ];

    // Mendapatkan pilihan field yang ingin diperbarui
    const getField = async () => {
        return new Promise((resolve) => {
            rl.question(`${updateOptions[0].message} `, (input) => {
                const valid = updateOptions[0].validate(input);
                if (valid === true) {
                    resolve(input.toLowerCase());
                } else {
                    console.log(valid);
                    resolve(getField());
                }
            });
        });
    };

    // Mendapatkan input untuk data yang akan diperbarui
    const fieldToUpdate = await getField();

    // Pertanyaan untuk input baru
    const questions = [
        {
            name: "newValue",
            message: `Masukkan ${fieldToUpdate} baru:`,
            validate: (value) => {
                if (fieldToUpdate === "phone" && !validator.isMobilePhone(value, "id-ID")) {
                    return "Nomor telepon tidak valid!";
                }
                if (fieldToUpdate === "email" && !validator.isEmail(value)) {
                    return "Email tidak valid!";
                }
                return true;
            },
        },
    ];

    const getInput = (question) => {
        return new Promise(async (resolve) => {
            rl.question(`${question.message} `, async (input) => {
                const valid = await question.validate(input);
                if (valid === true) {
                    resolve(input);
                } else {
                    console.log(valid);
                    resolve(getInput(question));
                }
            });
        });
    };

    const newValue = await getInput(questions[0]);

    // Memperbarui data kontak dengan data baru
    contacts[contactIndex] = {
        ...contacts[contactIndex],
        [fieldToUpdate]: newValue,
    };
    writeContacts(contacts); // Menyimpan kontak yang telah diperbarui
    console.log("Kontak berhasil diperbarui!");

    rl.close();
    process.exit(0);
};

// Konfigurasi yargs untuk menangani berbagai perintah
yargs(hideBin(process.argv))
    .version("1.0.4") // Versi aplikasi
    .command("add", "Tambah kontak baru", {}, addContact) // Command untuk menambahkan kontak
    .command("list", "Tampilkan semua kontak", {}, listContacts) // Command untuk menampilkan semua kontak
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
            detailContact(argv.name); // Menampilkan detail kontak
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
            deleteContact(argv.name); // Menghapus kontak
        }
    )
    .command("delete-all", "Hapus semua data kontak", {}, deleteAllContacts) // Command untuk menghapus semua data kontak
    .command(
        "update <name>",
        "Perbarui kontak berdasarkan nama",
        (yargs) => {
            yargs.positional("name", {
                describe: "Nama kontak",
                type: "string",
            });
        },
        (argv) => {
            updateContact(argv.name); // Memperbarui kontak
        }
    )
    .demandCommand(1, "Harap pilih perintah yang valid") // Meminta setidaknya satu command
    .help() // Menampilkan bantuan
    .argv; // Mengurai argumen command-line
