*This project is incomplete and doesn't work. I would describe it as a failure of motivation, as well unnecessary to begin with. May it stand as a reminder that not every idea is worth finishing.*

# KiXtart Language Server

A Language Server Protocol (LSP) implementation for the KiXtart scripting language, using clarity-pattern-parser for syntax analysis.

## Features

- Syntax highlighting
- Code completion
- Hover information
- More features coming soon...

## Development Setup

1. Install dependencies:
   ```bash
   npm install
   cd server
   npm install
   ```

2. Build the server:
   ```bash
   cd server
   npm run build
   ```

3. Run the development server:
   ```bash
   npm run dev
   ```

## Project Structure

- `/server`: Contains the LSP server implementation
  - `/src`: Source code for the server
  - `/out`: Compiled JavaScript output

## License

MIT 
