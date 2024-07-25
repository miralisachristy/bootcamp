const fs = require('fs');
const readline = require('readline').createInterface({
    input: process.stdin,
    output: process.stdout
});
const validator = require('validator');

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
        validate: (answer) => true // Placeholder validation
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

const askQuestions = async () => {
    let dataAnswer = {};

    for (let i = 0; i < questions.length; i++) {
        const question = questions[i];
        let answer;

        do {
            answer = await ask(question.tanya);
            if (!question.validate(answer)) {
                console.log("Mohon masukkan data yang valid");
            }
        } while (!question.validate(answer));

        dataAnswer[question.type] = answer;
    }

    console.log("\nTerima kasih! Berikut adalah informasi yang Anda masukkan:");
    console.log(`Nama: ${dataAnswer.name}`);
    console.log(`Email: ${dataAnswer.email}`);
    console.log(`Nomor Telepon: ${dataAnswer.phone}`);

    saveContact(dataAnswer);
    readline.close();
};

const ask = (question) => {
    return new Promise((resolve) => {
        readline.question(question, resolve);
    });
};

const saveContact = (contact) => {
    let contacts = readContact(); // Read existing contacts
    contacts.push(contact); // Add new contact
    writeContact(contacts); // Write to file
};

// Start asking questions
askQuestions().catch(error => console.error("Error asking questions:", error));
