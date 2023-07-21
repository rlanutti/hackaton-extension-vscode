// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const vscode = require("vscode");
const integration = require("./integration.js");

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed

/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {
  let selecionarTexto = vscode.commands.registerCommand(
    "team-5-hackaton-cit-chat-gpt.runCommandOnSelection",
    async () => {
      // Obter o editor de texto ativo
      const editor = vscode.window.activeTextEditor;
      if (!editor) {
        vscode.window.showErrorMessage("Nenhum editor de texto ativo.");
        return;
      }

      // Obter a seleção atual
      const selection = editor.selection;
      if (selection.isEmpty) {
        vscode.window.showInformationMessage("Nenhuma seleção de texto.");
        return;
      }

      // Obter o texto selecionado
      const selectedText = editor.document.getText(selection);

      // Exibir o prompt para seleção de opções
      const options = ["Clean Code", "DRY", "KISS", "SOLID", "YAGNI"];
      const selectedOption = await vscode.window.showQuickPick(options, {
        canPickMany: false,
        ignoreFocusOut: true,
        placeHolder: "Selecione uma opção",
      });

      // Executar o comando team-5-hackaton-cit-chat-gpt.helloWorld com o texto selecionado e opção selecionada
      vscode.commands.executeCommand(
        "team-5-hackaton-cit-chat-gpt.helloWorld",
        {
          codigo: selectedText,
          semantica: selectedOption,
        }
      );
    }
  );

  let sugestaoDeMelhoria = vscode.commands.registerCommand(
    "team-5-hackaton-cit-chat-gpt.helloWorld",
    function ({ codigo, semantica }) {
      const prompt = { codigo: codigo, semantica: semantica };

      // Use vscode.window.withProgress to show the progress bar
      vscode.window.withProgress(
        {
          location: vscode.ProgressLocation.Notification, // Show progress in the notification area
          title: "Analisando a sugestão de Melhoria...", // Title of the progress bar
          cancellable: false, // Whether the progress can be canceled by the user
        },
        async (progress) => {
          try {
            // Call the function runCodeReview with the progress object
            const suggestion = await integration.runCodeReview(
              prompt,
              progress
            );

            let panel = vscode.window.createWebviewPanel(
              "sugestaoCodeReview",
              "Sugestão de Code Review",
              vscode.ViewColumn.Two,
              {
                enableScripts: true,
                retainContextWhenHidden: true,
                enableFindWidget: true,
                webviewOptions: { width: 800, height: 600 },
              }
            );

            panel.webview.html = getWebviewContent(suggestion);

            function getWebviewContent(suggestion) {
              let webviewContent = `<!DOCTYPE html>
              <html>
              <head>
              <meta http-equiv="Content-Type" content="text/html;charset=UTF-8">
              <style>
              body {
              font-family: Arial, Helvetica, sans-serif;
              font-size: 1rem;
              padding: 1rem;
              }
      
              code {
              font-family: Consolas, Courier New, monospace;
              font-size: 1rem;
              }
              </style>
              </head>
              <body>
              <pre><code>${suggestion}</code></pre>
              </body>
              </html>`;

              return webviewContent;
            }
          } catch (err) {
            console.error(
              "Ocorreu um erro ao obter sugestão de code review:",
              err
            );
            vscode.window.showErrorMessage(
              "Ocorreu um erro ao obter sugestão de code review."
            );
          }
        }
      );
    }
  );

  context.subscriptions.push(sugestaoDeMelhoria);
  context.subscriptions.push(selecionarTexto);
}

// This method is called when your extension is deactivated
function deactivate() {}

module.exports = {
  activate,
  deactivate,
};
