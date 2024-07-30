// Mengimpor modul yang diperlukan
const fs = require('fs');          // Modul untuk operasi file, seperti membaca dan menulis file
const readline = require('readline'); // Modul untuk interaksi berbasis teks di terminal
const validator = require('validator'); // Modul untuk memvalidasi data seperti email dan nomor telepon
const yargs = require('yargs'); // Modul untuk memproses argumen command line

// Nama file untuk menyimpan data kontak
const contactFile = "contactlisa.json";

// Fungsi untuk membaca data kontak dari file
const readContact = () => {
    if (fs.existsSync(contactFile)) { // Periksa apakah file kontak ada
        const data = fs.readFileSync(contactFile); // Baca isi file sebagai buffer
        return JSON.parse(data); // Konversi buffer menjadi objek JavaScript dan kembalikan sebagai array
    } else {
        return []; // Jika file tidak ada, kembalikan array kosong
    }
};

// Fungsi untuk menulis data kontak ke file
const writeContact = (contact) => {
    fs.writeFileSync(contactFile, JSON.stringify(contact, null, 2)); // Konversi data kontak menjadi JSON dengan indentasi 2 spasi dan tulis ke file
};

// Fungsi untuk menyimpan kontak ke file
const saveContact = (contact) => {
    let contacts = readContact(); // Membaca daftar kontak yang ada dari file
    contacts.push(contact); // Menambahkan kontak baru ke daftar
    writeContact(contacts); // Menulis daftar kontak yang diperbarui ke file
};

// Fungsi untuk menanyakan semua pertanyaan sekaligus
const askAllQuestions = (questions) => {
    const rl = readline.createInterface({
        input: process.stdin,  // Mengambil input dari standard input (keyboard)
        output: process.stdout // Mengeluarkan output ke standard output (terminal)
    });

    const answers = {}; // Objek untuk menyimpan jawaban
    let questionIndex = 0; // Index pertanyaan saat ini

    // Fungsi untuk mengajukan pertanyaan berikutnya
    const askNextQuestion = () => {
        if (questionIndex < questions.length) { // Jika masih ada pertanyaan yang tersisa
            const question = questions[questionIndex]; // Ambil pertanyaan saat ini dari daftar
            rl.question(question.query, (answer) => { // Ajukan pertanyaan dan ambil jawaban dari pengguna
                if (question.validate(answer)) { // Periksa apakah jawaban valid
                    answers[question.type] = answer; // Simpan jawaban ke objek answers
                    questionIndex++; // Pindah ke pertanyaan berikutnya
                    askNextQuestion(); // Ajukan pertanyaan berikutnya
                } else {
                    console.log("Jawaban tidak valid. Silakan coba lagi."); // Tampilkan pesan kesalahan jika jawaban tidak valid
                    askNextQuestion(); // Tanyakan kembali
                }
            });
        } else {
            rl.close(); // Tutup antarmuka readline setelah semua pertanyaan selesai
            console.log("\nTerima kasih! Berikut adalah informasi yang Anda masukkan:"); // Tampilkan pesan terima kasih
            console.log(`Nama: ${answers.name}`); // Tampilkan nama yang dimasukkan
            console.log(`Email: ${answers.email}`); // Tampilkan email yang dimasukkan
            console.log(`Nomor Telepon: ${answers.phone}`); // Tampilkan nomor telepon yang dimasukkan
            saveContact(answers); // Simpan data kontak ke file
        }
    };

    askNextQuestion(); // Mulai proses pertanyaan
};

// Mengatur yargs untuk menangani perintah command line
yargs.command({
    command: 'add', // Nama perintah CLI
    describe: 'Tambah kontak baru', // Deskripsi perintah
    builder: { // Definisi argumen yang diterima perintah ini
        name: {
            describe: 'Nama kontak', // Deskripsi argumen 'name'
            demandOption: true, // Argumen ini wajib
            type: 'string', // Tipe data argumen adalah string
        },
        email: {
            describe: 'Email kontak', // Deskripsi argumen 'email'
            demandOption: false, // Argumen ini tidak wajib
            type: 'string', // Tipe data argumen adalah string
        },
        mobile: {
            describe: 'Nomor telepon kontak', // Deskripsi argumen 'mobile'
            demandOption: true, // Argumen ini wajib
            type: 'string', // Tipe data argumen adalah string
        },
    },
    handler(argv) { // Fungsi yang dijalankan jika perintah 'add' digunakan
        // Validasi email jika ada
        if (argv.email && !validator.isEmail(argv.email)) { // Periksa format email
            console.log("Email tidak valid"); // Tampilkan pesan kesalahan jika email tidak valid
            return; // Keluar dari fungsi jika email tidak valid
        }
        // Validasi nomor telepon
        if (!validator.isMobilePhone(argv.mobile, "id-ID")) { // Periksa format nomor telepon untuk Indonesia
            console.log("Nomor telepon tidak valid"); // Tampilkan pesan kesalahan jika nomor telepon tidak valid
            return; // Keluar dari fungsi jika nomor telepon tidak valid
        }

        // Membuat objek kontak dengan data dari argumen CLI
        const contact = {
            name: argv.name, // Ambil nama dari argumen
            email: argv.email || '', // Ambil email dari argumen, atau string kosong jika tidak ada
            phone: argv.mobile, // Ambil nomor telepon dari argumen
        };
        saveContact(contact); // Simpan kontak baru ke file
        // Tampilkan konfirmasi
        console.log("Kontak berhasil ditambahkan:");
        console.log(`Nama: ${contact.name}`); // Tampilkan nama kontak
        console.log(`Email: ${contact.email}`); // Tampilkan email kontak
        console.log(`Nomor Telepon: ${contact.phone}`); // Tampilkan nomor telepon kontak
    },
});

// Mengecek apakah perintah `add` digunakan
if (process.argv.includes('add')) { // Jika argumen CLI termasuk 'add'
    yargs.parse(); // Parse argumen dan jalankan perintah 'add'
} else {
    // Daftar pertanyaan untuk pengguna
    const questions = [
        {
            query: "Masukkan Nama Anda: ", // Pertanyaan untuk nama
            type: "name", // Tipe data jawaban
            validate: (answer) => answer.trim() !== "" // Validasi untuk nama (tidak boleh kosong)
        },
        {
            query: "Masukkan Email Anda: ", // Pertanyaan untuk email
            type: "email", // Tipe data jawaban
            validate: (answer) => validator.isEmail(answer) // Validasi untuk email
        },
        {
            query: "Masukkan No.Telp Anda: ", // Pertanyaan untuk nomor telepon
            type: "phone", // Tipe data jawaban
            validate: (answer) => validator.isMobilePhone(answer, "id-ID") // Validasi untuk nomor telepon
        }
    ];

    // Memulai proses interaktif
    askAllQuestions(questions); // Panggil fungsi untuk menanyakan semua pertanyaan sekaligus
}
