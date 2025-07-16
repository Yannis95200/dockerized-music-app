const args = process.argv.slice(2)
let total = 0;

for (let n of args) {
    total += Number(n)
}

console.log(`La somme est : ${total}`)