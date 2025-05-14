#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { input, search } from "@inquirer/prompts";
import minimist from "minimist";
import pc from "picocolors";
import { TEMPLATES } from "./constants";

const CWD = process.cwd();

const argv = minimist(process.argv.slice(2));

const defaultProjectName = argv._[0] || "";

const ignore = ["node_modules"];

async function bootstrap() {
	console.log(`😊 ${pc.magenta("Hey")}, welcome to my stack🚀`);

	let projectName = defaultProjectName;

	if (!projectName) {
		projectName = await input({
			message: "Project name: ",
			default: "my-app",
			validate: (input) =>
				input.trim().length > 0 || "Please enter a project name",
			transformer: (input) => input.trim(),
		});
	} else {
		console.log(`${pc.green("✔")} Project name: ${pc.green(projectName)}`);
	}

	const template = await search({
		message: "Select template",
		source(input) {
			const filter = input ? input.toLowerCase() : "";
			if (filter) {
				return TEMPLATES.filter((item) =>
					item.name.toLowerCase().includes(filter),
				).map((item) => ({
					name: item.displayName,
					value: item.name,
				}));
			}

			return TEMPLATES.map((item) => ({
				name: item.displayName,
				value: item.name,
			}));
		},
	});
	const root = path.join(CWD, projectName);

	fs.mkdirSync(root, { recursive: true });

	const templateDir = path.resolve(
		fileURLToPath(import.meta.url),
		"../../templates",
		template,
	);

	function write(file: string) {
		const targetPath = path.join(root, file);

		copy(path.join(templateDir, file), targetPath);
	}

	const files = fs.readdirSync(templateDir);

	for (const file of files.filter((item) => !ignore.includes(item))) {
		write(file);
	}

	console.log(`
    ${pc.green("✔")} Project created: ${pc.green(root)}

    cd ${pc.green(projectName)}
    
    ${pc.yellow("npm install")} | ${pc.green("yarn install")} | ${pc.cyan("pnpm install")}
    `);
}

function copy(src: string, dest: string) {
	const stat = fs.statSync(src);
	if (stat.isDirectory()) {
		copyDir(src, dest);
	} else {
		fs.copyFileSync(src, dest);
	}
}

function copyDir(srcDir: string, destDir: string) {
	fs.mkdirSync(destDir, { recursive: true });
	for (const file of fs.readdirSync(srcDir)) {
		const srcFile = path.resolve(srcDir, file);
		const destFile = path.resolve(destDir, file);
		copy(srcFile, destFile);
	}
}

bootstrap().catch(console.error);
