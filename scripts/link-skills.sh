#!/usr/bin/env bash
# scripts/link-skills.sh
# Hubungkan project lokal ke AI Skills Global via Symbolic Link

set -e

GLOBAL_SKILLS="$HOME/.agents/skills"
GLOBAL_CLAUDE="$HOME/.claude/skills"

echo "🔗 Menghubungkan AI Skills Global ke project..."

mkdir -p .agents
if [ ! -e .agents/skills ]; then
    ln -s "$GLOBAL_SKILLS" .agents/skills
    echo "✅ Symlink dibuat: .agents/skills -> $GLOBAL_SKILLS"
else
    echo "ℹ️ .agents/skills sudah ada."
fi

mkdir -p .claude
if [ ! -e .claude/skills ]; then
    ln -s "$GLOBAL_CLAUDE" .claude/skills
    echo "✅ Symlink dibuat: .claude/skills -> $GLOBAL_CLAUDE"
else
    echo "ℹ️ .claude/skills sudah ada."
fi

echo "🎉 AI Skills Global berhasil terhubung!"

