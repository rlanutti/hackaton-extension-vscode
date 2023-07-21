const { OpenAIClient, AzureKeyCredential } = require("@azure/openai");


const endpoint = "https://gptdeployment.openai.azure.com/";
const azureApiKey = "API_KEY"; // Substitua pela sua chave de API do Azure

async function runCodeReview(prompt) {
    const client = new OpenAIClient(endpoint, new AzureKeyCredential(azureApiKey));
    const deploymentId = "gpt-35-turbo";
  
    // Concatenando o código e a semântica para enviar como prompt à API
    const promptText = `${prompt.codigo}\n Faça a analise do código utilizando a Semântica: ${prompt.semantica} e me retorne um trecho de código válido descrevendo no comentário o que foi aplicado e qual padrão foi solicitado resumidamente`;
  
    // Defina o número máximo de tokens na resposta para controlar o tamanho da resposta
    const maxTokens = 800;
  
    const result = await client.getCompletions(deploymentId, promptText, { maxTokens });
  
    if (result.choices.length > 0) {
        const codeReviewSuggestion = result.choices[0].text;
        return codeReviewSuggestion;
    } else {
        return "Não foi possível obter sugestão de code review para o código fornecido.";
    }
}

module.exports = {
    runCodeReview
};