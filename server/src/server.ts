import {
  createConnection,
  TextDocuments,
  ProposedFeatures,
  InitializeParams,
  TextDocumentSyncKind,
  InitializeResult,
} from 'vscode-languageserver/node';

import { TextDocument } from 'vscode-languageserver-textdocument';
import { Literal, Regex, Sequence, Options } from 'clarity-pattern-parser';

// Create a connection for the server
const connection = createConnection(ProposedFeatures.all);

// Create a text document manager
const documents: TextDocuments<TextDocument> = new TextDocuments(TextDocument);

// Initialize KiXtart syntax patterns
const keywords = new Options('keywords', [
  new Literal('if', 'if'),
  new Literal('then', 'then'),
  new Literal('else', 'else'),
  new Literal('endif', 'endif'),
  new Literal('while', 'while'),
  new Literal('wend', 'wend'),
  // Add more KiXtart keywords as needed
]);

connection.onInitialize((params: InitializeParams) => {
  const result: InitializeResult = {
    capabilities: {
      textDocumentSync: TextDocumentSyncKind.Incremental,
      // We'll add more capabilities as we implement them
      completionProvider: {
        resolveProvider: true,
        triggerCharacters: ['.', '$', '@']  // KiXtart uses $ for variables and @ for macros
      },
      hoverProvider: true
    }
  };
  return result;
});

// Make the text document manager listen on the connection
// for open, change and close text document events
documents.listen(connection);

// Listen on the connection
connection.listen(); 