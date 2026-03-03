#!/usr/bin/env node

/**
 * TaskFlow — Welcome script
 * Exibe os links úteis ao iniciar o servidor de desenvolvimento.
 */

import { readFileSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, "..");

// Tenta ler variáveis do .env
function readEnv() {
  try {
    const envContent = readFileSync(resolve(root, ".env"), "utf-8");
    const vars = {};
    for (const line of envContent.split("\n")) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith("#")) continue;
      const eqIndex = trimmed.indexOf("=");
      if (eqIndex === -1) continue;
      const key = trimmed.slice(0, eqIndex).trim();
      let value = trimmed.slice(eqIndex + 1).trim();
      if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
        value = value.slice(1, -1);
      }
      vars[key] = value;
    }
    return vars;
  } catch {
    return {};
  }
}

// Tenta ler o remote do git
function getGitRemote() {
  try {
    const gitConfig = readFileSync(resolve(root, ".git/config"), "utf-8");
    const match = gitConfig.match(/url\s*=\s*(.+)/);
    if (match) {
      let url = match[1].trim();
      // Converte SSH para HTTPS
      if (url.startsWith("git@github.com:")) {
        url = url.replace("git@github.com:", "https://github.com/").replace(/\.git$/, "");
      } else if (url.endsWith(".git")) {
        url = url.replace(/\.git$/, "");
      }
      return url;
    }
  } catch {
    // sem git configurado
  }
  return null;
}

const env = readEnv();
const appUrl = env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
const gitRemote = getGitRemote();

const blue = "\x1b[34m";
const green = "\x1b[32m";
const cyan = "\x1b[36m";
const bold = "\x1b[1m";
const dim = "\x1b[2m";
const reset = "\x1b[0m";

console.log("");
console.log(`${blue}${bold}  ╔══════════════════════════════════════════════╗${reset}`);
console.log(`${blue}${bold}  ║           ✅  TaskFlow — MVP SaaS            ║${reset}`);
console.log(`${blue}${bold}  ╚══════════════════════════════════════════════╝${reset}`);
console.log("");

if (gitRemote) {
  console.log(`  ${dim}GitHub:${reset}       ${cyan}${gitRemote}${reset}`);
}

// Detecta URL de produção (Vercel)
const vercelUrl = env.NEXT_PUBLIC_APP_URL && env.NEXT_PUBLIC_APP_URL !== "http://localhost:3000"
  ? env.NEXT_PUBLIC_APP_URL
  : null;

if (vercelUrl) {
  console.log(`  ${dim}Produção:${reset}     ${cyan}${vercelUrl}${reset}`);
}

console.log(`  ${dim}Local:${reset}        ${green}${bold}${appUrl}${reset}`);
console.log("");
console.log(`  ${dim}Rotas principais:${reset}`);
console.log(`    ${dim}→${reset} Login:        ${appUrl}/login`);
console.log(`    ${dim}→${reset} Dashboard:    ${appUrl}/dashboard`);
console.log(`    ${dim}→${reset} Preços:       ${appUrl}/pricing`);
console.log(`    ${dim}→${reset} Billing:      ${appUrl}/settings/billing`);
console.log("");
console.log(`  ${dim}Para personalizar, edite a seção [MEU PRODUTO] no BOILERPLATE_MANUAL.md${reset}`);
console.log("");
