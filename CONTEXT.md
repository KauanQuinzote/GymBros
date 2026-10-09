# GymBros Domain Context & Glossary

## Language

**Workout (Treino)**:
A complete physical training session comprised of multiple exercises, sets, weights and repetitions. Concluding a workout awards BroPoints and streak progression.

**Workout Completion (Conclusão de Treino)**:
A deterministic, isolated state change where the active session status becomes `completed`. It triggers only local celebratory stats and points accumulation without dispatching any automatic sound or social interaction.

**Chilling**:
The dedicated social, voice and audio trash-talk module in GymBros. Interactivity is 100% deliberated and manual.

**Nudge / Taunt (Provocação)**:
A manual social event sent explicitly by a Bro (text, preset audio meme or custom TTS) via the Chilling screen targeting an individual Bro or all Bros.

## Relationships
- A **Workout** produces **BroPoints** and updates **Streak**.
- A **Workout Completion** NEVER triggers a **Nudge / Taunt** automatically.
- A **Nudge / Taunt** is dispatched ONLY within **Chilling** by explicit user action.
