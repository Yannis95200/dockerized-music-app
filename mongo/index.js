import express from "express";
import mongoose from "mongoose";
import Contact from "./models/contact.js";
const app = express();
const PORT = 5000;

app.use(express.json());

mongoose
  .connect("mongodb://localhost:27017/radioooooDB")
  .then(() => console.log(" Connecté à MongoDB"))
  .catch((err) => console.error(" Erreur MongoDB", err));

app.post("/contact", async (req, res) => {
  try {
    const { name, message } = req.body;
    const newContact = new Contact({ name, message });
    await newContact.save();
    res.json({ reçu: true, saved: newContact });
  } catch (err) {
    console.error("ERREUR :", err);
    res.status(500).json({ error: "Erreur lors de l'enregistrement" });
  }
});

app.get("/contacts", async (req, res) => {
  try {
    const contacts = await Contact.find().sort({ createdAt: -1 });
    res.status(200).json(contacts);
  } catch {
    res.status(500).json({ error: "Erreur lors de la recupération" });
  }
});

app.delete("/contacts/:id", async (req, res) => {
  try {
    const { id } = req.params;
    await Contact.findByIdAndDelete(id);
    res.json({ status: "deleted", id });
  } catch {
    console.error("erreur supression:", err);
    res.status(500).json({ error: "supression echoué" });
  }
});


app.get('/stats', async (req, res)=>{
    try{
        const total = await Contact.countDocuments();
        const last = await Contact.findOne().sort({createdAt:-1})
        res.json({total, last})
    } catch(err){
        res.status(500).json({error: "Erreur dans les statistiques"});
    }
})

app.listen(PORT, () => {
  console.log(`Serveur démarré sur http://localhost:${PORT}`);
});
