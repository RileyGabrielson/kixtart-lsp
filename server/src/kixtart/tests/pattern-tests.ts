import { describe, it, expect } from "vitest";
import { Grammar } from "clarity-pattern-parser";
import * as fs from "fs";
import * as path from "path";

const setupGrammar = async () => {
    const mainPatternPath = path.join(__dirname, "../patterns/main.cpat");
    const mainPattern = fs.readFileSync(mainPatternPath, "utf8");
    const grammar = await Grammar.parse(mainPattern);
    return grammar.program; // Get the program pattern
};

describe("KiXtart Pattern Tests", () => {
    const examplesDir = path.join(__dirname, "../examples");

    // Helper function to test a single example file
    const testExampleFile = (filename: string) => {
        it(`should parse ${filename} correctly`, async () => {
            const programPattern = await setupGrammar();
            const filePath = path.join(examplesDir, filename);
            const content = fs.readFileSync(filePath, "utf8");
            
            const result = programPattern.exec(content);
            expect(result.ast).not.toBeNull();
            expect(result.ast?.type).toBe("program");
        });
    };

    // Test each example file
    const exampleFiles = fs.readdirSync(examplesDir)
        .filter(file => file.endsWith(".kix"))
        .sort();

    exampleFiles.forEach(testExampleFile);

    // Additional test cases for specific patterns
    describe("Specific Pattern Tests", () => {
        it("should parse a simple function call", async () => {
            const programPattern = await setupGrammar();
            const code = "FUNCTION Main()\n    ? \"Hello\"\nENDFUNCTION";
            const result = programPattern.exec(code);
            expect(result.ast).not.toBeNull();
            expect(result.ast?.type).toBe("program");
        });

        it("should parse a complex expression", async () => {
            const programPattern = await setupGrammar();
            const code = "FUNCTION Main()\n    $result = (5 + 3) * 2\nENDFUNCTION";
            const result = programPattern.exec(code);
            expect(result.ast).not.toBeNull();
            expect(result.ast?.type).toBe("program");
        });

        it("should parse nested if statements", async () => {
            const programPattern = await setupGrammar();
            const code = "FUNCTION Main()\n    IF $x > 0\n        IF $y < 10\n            ? \"Valid\"\n        ENDIF\n    ENDIF\nENDFUNCTION";
            const result = programPattern.exec(code);
            expect(result.ast).not.toBeNull();
            expect(result.ast?.type).toBe("program");
        });

        it("should parse array operations", async () => {
            const programPattern = await setupGrammar();
            const code = "FUNCTION Main()\n    DIM $arr[3]\n    $arr[0] = 1\nENDFUNCTION";
            const result = programPattern.exec(code);
            expect(result.ast).not.toBeNull();
            expect(result.ast?.type).toBe("program");
        });

        it("should parse string operations", async () => {
            const programPattern = await setupGrammar();
            const code = "FUNCTION Main()\n    $str = \"Hello\" + \" World\"\nENDFUNCTION";
            const result = programPattern.exec(code);
            expect(result.ast).not.toBeNull();
            expect(result.ast?.type).toBe("program");
        });
    });
}); 