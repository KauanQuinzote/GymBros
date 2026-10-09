#!/usr/bin/env python3
import re
import subprocess
import os

TASKS_FILE = "/home/kauan/Documentos/MyBroth/docs/GITHUB_TASKS.md"

def main():
    with open(TASKS_FILE, "r", encoding="utf-8") as f:
        content = f.read()

    # Split by section headers "### "
    sections = re.split(r'\n###\s+', content)
    
    # First section is header/index, skip it
    task_sections = sections[1:]
    
    created_count = 0
    skipped_count = 0

    for section in task_sections:
        lines = section.strip().split('\n')
        if not lines:
            continue
        
        raw_title = lines[0].strip()
        
        # Check if already completed
        if "(Concluída)" in raw_title or "Status: Concluída" in section:
            print(f"⏩ Pulando task concluída: {raw_title}")
            skipped_count += 1
            continue

        title = raw_title.strip()
        body = '\n'.join(lines[1:]).strip()

        # Extract labels from Metadados
        tipo_match = re.search(r'-\s*\*\*Tipo\*\*:\s*`([^`]+)`', body)
        prioridade_match = re.search(r'-\s*\*\*Prioridade\*\*:\s*`([^`]+)`', body)

        labels = []
        if tipo_match:
            labels.append(tipo_match.group(1).strip())
        if prioridade_match:
            labels.append(prioridade_match.group(1).strip())

        print(f"\n🚀 Criando issue: '{title}' com labels: {labels}...")
        
        cmd = ["gh", "issue", "create", "--title", title, "--body", body]
        if labels:
            cmd.extend(["--label", ",".join(labels)])

        result = subprocess.run(cmd, capture_output=True, text=True)
        if result.returncode == 0:
            print(f"✅ Criada com sucesso: {result.stdout.strip()}")
            created_count += 1
        else:
            print(f"❌ Erro ao criar '{title}': {result.stderr.strip()}")

    print(f"\n✨ Processo finalizado: {created_count} criadas, {skipped_count} ignoradas (concluídas).")

if __name__ == "__main__":
    main()
