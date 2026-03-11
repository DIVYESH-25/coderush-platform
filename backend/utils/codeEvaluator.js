const { exec } = require("child_process");
const fs = require("fs");
const path = require("path");
const crypto = require("crypto");

const TIMEOUT = 2000; // 2 seconds

/**
 * Runs code against a test case.
 * @param {string} language - python | java
 * @param {string} code - The user's code
 * @param {string} functionName - Name of the function to call
 * @param {any} input - Input parameter(s)
 * @returns {Promise<{success: boolean, output: any, error: string}>}
 */
const evaluateCode = (language, code, functionName, input) => {
    return new Promise((resolve) => {
        const id = crypto.randomUUID();
        const tempDir = path.join(__dirname, "../../tmp_eval_" + id);

        if (!fs.existsSync(tempDir)) {
            fs.mkdirSync(tempDir, { recursive: true });
        }

        let fileName, filePath, runnerPath, command;

        if (language === "python") {
            fileName = "solution.py";
            filePath = path.join(tempDir, fileName);

            // Format input as a list of args for *args call if it's an array, else single arg
            const inputStr = JSON.stringify(input);
            const isArrayInput = Array.isArray(input) && !["sum_arr", "filter_even"].includes(functionName);
            // Binary search takes [[arr], target], so it is an array but we should treat it as 2 args.
            // Actually, let's just use a more generic approach.

            let callStr;
            if (functionName === "binarySearch") {
                // binarySearch(int[] arr, int target) -> input: [[1,2,3], 2]
                callStr = `${functionName}(*${inputStr})`;
            } else {
                callStr = `${functionName}(${inputStr})`;
            }

            const runnerCode = `
import json
import sys

${code}

try:
    result = ${callStr}
    print("RESULT_START")
    print(json.dumps(result))
    print("RESULT_END")
except Exception as e:
    print(f"ERROR: {str(e)}", file=sys.stderr)
    sys.exit(1)
`;
            fs.writeFileSync(filePath, runnerCode);
            command = `python "${filePath}"`;
        }
        else if (language === "java") {
            fileName = "Solution.java";
            filePath = path.join(tempDir, fileName);

            let inputCall;
            if (functionName === "isPalindrome") {
                inputCall = `System.out.println(new Solution().isPalindrome("${input}"));`;
            } else if (functionName === "reverse") {
                inputCall = `System.out.println(new Solution().reverse("${input}"));`;
            } else if (functionName === "binarySearch") {
                // input: [[1,2,3], 2]
                const arr = JSON.stringify(input[0]).replace("[", "{").replace("]", "}");
                const target = input[1];
                inputCall = `System.out.println(new Solution().binarySearch(new int[]${arr}, ${target}));`;
            }

            const runnerCode = `
public class Solution {
    ${code}

    public static void main(String[] args) {
        try {
            ${inputCall}
        } catch (Exception e) {
            e.printStackTrace();
            System.exit(1);
        }
    }
}
`;
            fs.writeFileSync(filePath, runnerCode);
            command = `javac "${filePath}" && java -cp "${tempDir}" Solution`;
        }

        const process = exec(command, { timeout: TIMEOUT }, (error, stdout, stderr) => {
            // Cleanup
            try {
                fs.rmSync(tempDir, { recursive: true, force: true });
            } catch (e) { }

            if (error) {
                if (error.killed) {
                    return resolve({ success: false, error: "Time Limit Exceeded" });
                }
                return resolve({ success: false, error: stderr || error.message });
            }

            if (language === "python") {
                const parts = stdout.split("RESULT_START");
                if (parts.length < 2) return resolve({ success: false, error: "No output" });
                const result = parts[1].split("RESULT_END")[0].trim();
                try {
                    resolve({ success: true, output: JSON.parse(result) });
                } catch (e) {
                    resolve({ success: false, error: "Invalid Output Format" });
                }
            } else {
                const trimmed = stdout.trim();
                try {
                    // Try parsing as JSON (to handle boolean "true"/"false", numbers, etc.)
                    // Note: true/false in Java println are "true"/"false" strings, which are valid JSON for boolean
                    const parsed = JSON.parse(trimmed);
                    resolve({ success: true, output: parsed });
                } catch (e) {
                    // Fallback to raw string
                    resolve({ success: true, output: trimmed });
                }
            }
        });
    });
};

module.exports = { evaluateCode };
