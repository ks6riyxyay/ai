import Bytez from "bytez.js";

export default async function handler(req, res) {
  if (req.method !== "POST")
    return res.status(405).json({ error: "Use POST" });

  try {
    const { model: modelName, prompt } = req.body;

    if (!modelName || !prompt)
      return res.status(400).json({ error: "Envie model e prompt" });

    const key = process.env.BYTEZ_KEY;

    const sdk = new Bytez(key);
    const model = sdk.model(modelName);

    const { error, output } = await model.run(prompt);

    res.status(200).json({ error, output });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
