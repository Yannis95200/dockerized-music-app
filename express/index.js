import express from 'express';
const app = express();
const PORT = 3000

// Route de Base 
app.get('/', (req, res) => {
    res.send('Hello Radioooo')
});

app.get ('/about', (req, res) =>{
    res.send('A propos de Radiooooo')
})

app.get ('/contact', (req, res) =>{
    res.send('Contactez-nous à contact@radioooo.com')
})

app.get ('/hello/:name', (req, res) =>{
    const { name } = res.params;
    res.send(`Salut ${name}`)
})

app.use(express.json()) // pour lire JSON dans le coprs des requetes

app.post('/message', (req, res)=>{
    const { name, message } = req.body;
    res.json({reçu: true, name, message})
})


// Démarrage du serveur 
app.listen(PORT, () =>{
    console.log(`Serveur démmaré sur http://localhost:${PORT}`)
});