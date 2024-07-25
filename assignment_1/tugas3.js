const fs = require('fs');
const readline = require('readline');
const validator = require('validator');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

const contactFile = "contactlisa.json"

const readContact = () => {
    if(fs.existsSync (contactFile)){
        const data = fs.readSync(contactFile)
        return JSON.parse(data)
    } else {
        return []
    }
}

const writeContact = (contact) => {
    fs.writeFileSync(contactFile, JSON.stringify(contact, null, 2))
}

const question = [
    {
        tanya : "Masukkan Nama Anda : ",
        type: "name",
        validate: (answer) => true
    },{
        tanya : "Masukkan Email Anda : ",
        type: "email",
        validate: (answer) => validator.isEmail(answer)
    },{
        tanya : "Masukkan No.Telp Anda : ",
        type: "phone",
        validate: (answer) => validator.isMobilePhone(answer, "id-ID")
    }
]

let currentQuestionIndex = 0

let dataAnswer = {}

function askQuestion() {
    let currentQuestion = question[currentQuestionIndex]
    rl.question(currentQuestion.tanya, (answer) => {
        if(currentQuestion.validate(answer)){
            dataAnswer[currentQuestion.type] = answer
            currentQuestionIndex++
            if(currentQuestionIndex<question.length) {
                askQuestion()
            } else {
                rl.close
                 // Output informasi yang sudah dimasukkan
                console.log("\nTerima kasih! Berikut adalah informasi yang Anda masukkan:");
                console.log(`Nama: ${dataAnswer.name}`);
                console.log(`Email: ${dataAnswer.email}`);
                console.log(`Nomor Telepon: ${dataAnswer.phone}`);

                saveContact(dataAnswer)
            }

        } else {
            console.log("Mohon masukkan data yang valid")
            askQuestion()
        }
    })

}

function saveContact(contact) {
    let contacts = readContact(); // Read existing contacts
    contacts.push(contact); // Add new contact
    writeContact(contacts); // Write to file
}

askQuestion()