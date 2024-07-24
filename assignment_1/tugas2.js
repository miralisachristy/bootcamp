const readline = require('readline');
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});
const PhoneNumber = require('libphonenumber-js');

function validateEmail(email) {
  const validator = require('validator');
  return validator.isEmail(email);
}

function validatePhoneNumber(phoneNumber) {
  // Validasi nomor telepon menggunakan libphonenumber-js
  try {
    const number = PhoneNumber(phoneNumber, 'ID');
    return number.isValid();
  } catch (error) {
    return false;
  }
}

function getInput(prompt) {
  return new Promise((resolve) => {
    rl.question(prompt, (answer) => {
      resolve(answer);
    });
  });
}

async function main() {
  try {
    // Meminta input nama
    const nama = await getInput("Masukkan nama Anda: ");

    // Meminta input email dengan validasi
    let email;
    while (true) {
      email = await getInput("Masukkan email Anda: ");
      if (validateEmail(email)) {
        break;
      } else {
        console.log("Email yang dimasukkan tidak valid. Mohon masukkan email yang benar.");
      }
    }

    // Meminta input nomor telepon dengan validasi
    let nomorTelepon;
    while (true) {
      nomorTelepon = await getInput("Masukkan nomor telepon Anda (dimulai dengan +62): ");
      if (validatePhoneNumber(nomorTelepon)) {
        break;
      } else {
        console.log("Nomor telepon yang dimasukkan tidak valid. Mohon masukkan nomor telepon yang benar.");
      }
    }

    // Output informasi yang sudah dimasukkan
    console.log("\nTerima kasih! Berikut adalah informasi yang Anda masukkan:");
    console.log(`Nama: ${nama}`);
    console.log(`Email: ${email}`);
    console.log(`Nomor Telepon: ${nomorTelepon}`);

    rl.close();
  } catch (error) {
    console.error("Terjadi kesalahan:", error);
    rl.close();
  }
}

main();
