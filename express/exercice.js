import express from 'express'
const app = express()
const PORT = 5000

//Middleware pour lire le JSON du body (important pour les POST)
app.use(express.json

)
// Les routes 
app.get('/', (req, res) => {
    res.send("Bienvenue sur l'API Radiooooo")
})

app.get('/bonjour/:prenom', (req,res) =>{
    const {prenom} = req.params;
    res.send(`Salut ${prenom}`)


})

app.get('/addition/:a/:b', (req,res)=> {
    const {a,b} = req.params;
    const somme = Number(a) + Number(b)
    res.send(String(somme))
})

app.post('/contact', (req,res) =>{
    const {name, messages} = req.body
    res.json({reçu: true, name, messages})
})

// Démarrage du serveur 
app.listen(PORT, () =>{
    console.log(`Serveur démmaré sur http://localhost:${PORT}`)
});