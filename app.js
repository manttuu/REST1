// Vaaditaan express ja fs
const express = require("express");
const fs = require("fs");

const app = express();
app.use(express.json());

// GET-metodi: Hakee englanninkielisen sanan suomenkielisen sanan perusteella
app.get("/words/:finnishWord", (req, res) => {
  const finnishWord = req.params.finnishWord;
  const data = fs.readFileSync("sanakirja.txt", "utf8");
  
  // Jakaa tiedoston rivit ja etsii suomenkielisen sanan
  const lines = data.split("\n");
  for (const line of lines) {
    const [fin, eng] = line.split(" ");
    if (fin === finnishWord) {
      return res.json({ finnish: fin, english: eng });
    }
  }

  res.status(404).json({ message: "Sanaa ei löytynyt" });
});

// POST-metodi: Lisää uuden sanaparin sanakirjaan
app.post("/words", (req, res) => {
  const { finnish, english } = req.body;
  if (!finnish || !english) {
    return res.status(400).json({ message: "Molemmat sanat (suomi ja englanti) ovat pakollisia." });
  }

  // Lisää uusi sana tiedoston loppuun
  fs.appendFileSync("sanakirja.txt", `${finnish} ${english}\n`);
  res.status(201).json({ message: "Sana lisätty onnistuneesti" });
});

// Käynnistää palvelimen
app.listen(3000, () => {
  console.log("Palvelin käynnissä portissa 3000");
});
