const { ESLint } = require("eslint");
(async function main() {
    const eslint = new ESLint();
    const results = await eslint.lintFiles(["**/*.ts", "**/*.tsx"]);

    for (const file of results) {
        if (file.messages.length > 0) {
            console.log(`\n### ${file.filePath}`);
            for (const msg of file.messages) {
                console.log(`${msg.line}:${msg.column} - ${msg.message} (${msg.ruleId})`);
            }
        }
    }
})().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
