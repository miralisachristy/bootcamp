//menuliskan atau write
//const fs = require('fs');
// fs.writeFileSync('text.txt','Hello world secara synchronous!');

//membaca atau read
//const a = fs.readFileSync('text.txt', { encoding: 'utf-8'});
//console.log(a)


//input dan read yang di input
const readline = require('readline');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

rl.question('Dengan siapa saya berbicara? ', (nama) => {
    console.log(`\nOh! Halo, ${nama}! senang bertemu denganmu :)\n`);

    rl.question('Dimana Kamu tinggal? ', (a) => {
        console.log(`\nOh! ${a} :)\n`);
    
        
        rl.question(`Lalu hobimu apa ${nama}? `, (b) => {
            console.log(`\nOh, ${b}! Hobi yang bagus :D \n`);
            rl.close();
        });
    
    });

});