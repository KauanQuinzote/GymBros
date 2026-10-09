#!/bin/bash
# ==============================================================================
# Script de Criação em Lote de Labels e Issues no GitHub - GymBros
# Pré-requisito: GitHub CLI instalado e autenticado (`gh auth login`)
# ==============================================================================

set -e

echo "🚀 Iniciando configuração de Labels no GitHub..."

# 1. Criação das Labels Padrão (Taxonomia 2D: Tipo + Prioridade)
gh label create "feature" --description "Nova funcionalidade ou módulo" --color "0E8A16" --force || true
gh label create "bug" --description "Correção de erro ou falha" --color "D93F0B" --force || true
gh label create "enhancement" --description "Melhoria de funcionalidade ou UX" --color "A2EEEF" --force || true
gh label create "refactor" --description "Refatoração interna sem alteração de regra de negócio" --color "FBCA04" --force || true

gh label create "alta" --description "Prioridade Alta / Bloqueante" --color "B60205" --force || true
gh label create "média" --description "Prioridade Média" --color "FEF2C0" --force || true
gh label create "baixa" --description "Prioridade Baixa / Futuro" --color "C5DEF5" --force || true

echo "✅ Labels configuradas com sucesso!"
echo "📌 Para criar uma issue individualmente via CLI, utilize o padrão:"
echo 'gh issue create --title "Título" --body-file arquivo.md --label "feature,alta"'
