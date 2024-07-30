const fs = require('fs');
const readline = require('readline');
const validator = require('validator');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

const contactFile = "contactlisa.json";

const readContact = () => {
    if (fs.existsSync(contactFile)) {
        const data = fs.readFileSync(contactFile, 'utf8');
        return JSON.parse(data);
    } else {
        return [];
    }
};

const writeContact = (contact) => {
    fs.writeFileSync(contactFile, JSON.stringify(contact, null, 2));
};

const questions = [
    {
        tanya: "Masukkan Nama Anda : ",
        type: "name",
        validate: (answer) => !!answer.trim() // Validasi sederhana untuk nama (tidak boleh kosong)
    },
    {
        tanya: "Masukkan Email Anda : ",
        type: "email",
        validate: (answer) => validator.isEmail(answer)
    },
    {
        tanya: "Masukkan No.Telp Anda : ",
        type: "phone",
        validate: (answer) => validator.isMobilePhone(answer, "id-ID")
    }
];

const askQuestion = () => {
    return new Promise((resolve) => {
        let dataAnswer = {};
        let currentQuestionIndex = 0;

        const askNextQuestion = () => {
            const question = questions[currentQuestionIndex];
            rl.question(question.tanya, (answer) => {
                if (question.validate(answer)) {
                    dataAnswer[question.type] = answer;
                    currentQuestionIndex++;
                    if (currentQuestionIndex < questions.length) {
                        askNextQuestion();
                    } else {
                        resolve(dataAnswer);
                    }
                } else {
                    console.log("Mohon masukkan data yang valid");
                    askNextQuestion(); // Ask the same question again
                }
            });
        };

        askNextQuestion(); // Start asking questions from the first one
    });
};

const saveContact = (contact) => {
    let contacts = readContact(); // Read existing contacts
    contacts.push(contact); // Add new contact
    writeContact(contacts); // Write to file
};

// Main function to ask questions and save contact
const main = async () => {
    try {
        const dataAnswer = await askQuestion();

        console.log("\nTerima kasih! Berikut adalah informasi yang Anda masukkan:");
        console.log(`Nama: ${dataAnswer.name}`);
        console.log(`Email: ${dataAnswer.email}`);
        console.log(`Nomor Telepon: ${dataAnswer.phone}`);

        saveContact(dataAnswer);
    } catch (error) {
        console.error("Error asking questions:", error);
    } finally {
        rl.close();
    }
};

// Start the main function
main();
