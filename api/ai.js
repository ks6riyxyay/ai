/* api/ai.js */

import Bytez from "bytez.js"

// Lê a chave da Variável de Ambiente configurada no Vercel
const key = process.env.BYTEZ_API_KEY

// Inicializa o SDK
const sdk = new Bytez(key)

// Mapeamento dos modelos disponíveis
const models = {
  'video': "vdo/text-to-video-ms-1.7b",
  'text': "openai-community/gpt2",
  'image': "SG161222/RealVisXL_V5.0"
}

// Handler da função Serverless
export default async function handler(request, response) {
  // Configuração básica de CORS (essencial para o frontend)
  response.setHeader('Access-Control-Allow-Origin', '*');
  response.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  response.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (request.method === 'OPTIONS') {
    return response.status(200).end();
  }

  if (request.method !== 'POST') {
    return response.status(405).send('Método não permitido.');
  }
  
  if (!key) {
    return response.status(500).json({ error: 'Erro de Configuração: Variável BYTEZ_API_KEY não encontrada.' });
  }


  const { type, prompt } = request.body

  if (!type || !prompt) {
    return response.status(400).json({ error: 'Faltando "type" ou "prompt".' });
  }

  const modelName = models[type]

  if (!modelName) {
    return response.status(400).json({ error: `Tipo de modelo não suportado: ${type}.` });
  }

  try {
    const model = sdk.model(modelName)
    console.log(`Executando modelo: ${modelName} com prompt: ${prompt}`)
    const { error, output } = await model.run(prompt)

    if (error) {
      console.error('Erro da API Bytez:', error)
      return response.status(500).json({ error: `Erro da API para ${type}: ${error}` });
    }

    return response.status(200).json({ 
      success: true,
      model: modelName,
      type: type,
      output: output
    });

  } catch (err) {
    console.error('Erro geral na função serverless:', err)
    return response.status(500).json({ error: 'Erro interno do servidor.', details: err.message });
  }
}
