import { describe, it, expect } from "vitest";
import { Grammar } from "clarity-pattern-parser";
import * as fs from "fs";
import * as path from "path";

// Define the GrammarFile interface locally since it's not exported
interface GrammarFile {
    resource: string;
    expression: string;
}

const importResolver = async (resource: string, originResource: string | null): Promise<GrammarFile> => {
    const dir = originResource ? path.dirname(originResource) : __dirname;
    const fullPath = path.join(dir, resource);
    const content = fs.readFileSync(fullPath, "utf8");
    return {
        resource: fullPath,
        expression: content
    };
};

const setupGrammar = async () => {
    const mainPatternPath = path.join(__dirname, "../patterns/consolidated.cpat");
    const mainPattern = fs.readFileSync(mainPatternPath, "utf8");
    const grammar = await Grammar.parse(mainPattern, { resolveImport: importResolver, originResource: mainPatternPath });
    return grammar.program; // Get the program pattern
};

describe("KiXtart Pattern Tests", () => {
    const examplesDir = path.join(__dirname, "../examples");

    // Helper function to test a single example file
    const testExampleFile = (filename: string) => {
        it(`should parse ${filename} correctly`, async () => {
            const programPattern = await setupGrammar();
            const filePath = path.join(examplesDir, filename);
            console.log(`Testing file: ${filePath}`);
            const content = fs.readFileSync(filePath, "utf8");
            console.log("File content:", content);
            
            const result = programPattern.exec(content);
            console.log("Parse result:", result);
            if (!result.ast) {
                console.error("Parse error details:", {
                    index: result.cursor.index,
                    remainingText: content.slice(result.cursor.index, result.cursor.index + 50) + "..."
                });
            }
            expect(result.ast).not.toBeNull();
        });
    };

    // Test each example file
    const exampleFiles = fs.readdirSync(examplesDir)
        .filter(file => file.endsWith(".kix"))
        .sort();

    exampleFiles.forEach(testExampleFile);
}); 

describe("Specific Pattern Tests", () => {
    const testPattern = (name: string, code: string) => {
        it(name, async () => {
            const programPattern = await setupGrammar();
            console.log("Testing code:", code);
            const result = programPattern.exec(code);
            console.log("Parse result:", result);
            if (!result.ast) {
                console.error("Parse error details:", {
                    index: result.cursor.index,
                    remainingText: code.slice(result.cursor.index, result.cursor.index + 50) + "..."
                });
            }
            expect(result.ast).not.toBeNull();
        });
    };

    testPattern(
        "should parse a simple function call",
        "FUNCTION Main()\n    ? \"Hello\"\nENDFUNCTION"
    );

    testPattern(
        "should parse a complex expression",
        "FUNCTION Main()\n    $result = (5 + 3) * 2\nENDFUNCTION"
    );

    testPattern(
        "should parse nested if statements",
        "FUNCTION Main()\n    IF $x > 0\n        IF $y < 10\n            ? \"Valid\"\n        ENDIF\n    ENDIF\nENDFUNCTION"
    );

    testPattern(
        "should parse array operations",
        "FUNCTION Main()\n    DIM $arr[3]\n    $arr[0] = 1\nENDFUNCTION"
    );

    testPattern(
        "should parse string operations",
        "FUNCTION Main()\n    $str = \"Hello\" + \" World\"\nENDFUNCTION"
    );
});

describe("Debug Array Pattern Tests", () => {
    const debugTest = (name: string, code: string) => {
        it(name, async () => {
            const programPattern = await setupGrammar();
            console.log("Testing code:", code);
            const result = programPattern.exec(code);
            console.log("Parse result:", {
                success: !!result.ast,
                index: result.cursor.index,
                length: result.cursor.length
            });
            if (!result.ast) {
                console.error("Parse error details:", {
                    index: result.cursor.index,
                    remainingText: code.slice(result.cursor.index, result.cursor.index + 50) + "..."
                });
            }
            expect(result.ast).not.toBeNull();
        });
    };

    debugTest(
        "should parse array declaration",
        "DIM $arr[3]"
    );

    debugTest(
        "should parse array access",
        "$arr[0]"
    );

    debugTest(
        "should parse array assignment",
        "$arr[0] = 1"
    );
});