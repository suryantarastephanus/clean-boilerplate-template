# Superpowers Workflow

This project integrates the **Superpowers** software development methodology and skill suite.

## Core Workflows & Available Skills

1. **Brainstorming (`brainstorming`)**:
    - Use when exploring new features, component designs, or architectural changes before finalizing plans.
2. **Writing Plans (`writing-plans`) & Executing Plans (`executing-plans`)**:
    - Structure plans into bite-sized, verifiable tasks.
3. **Subagent-Driven Development (`subagent-driven-development`)**:
    - Break tasks into self-contained work units, delegating where appropriate with clear verification criteria.
4. **Test-Driven Development (`test-driven-development`)**:
    - Write failing tests first, observe the failure, then write minimal code to make them pass.
5. **Systematic Debugging (`systematic-debugging`)**:
    - Investigate bugs methodically: reproduce, form hypotheses, isolate root causes before attempting fixes.
6. **Verification Before Completion (`verification-before-completion`)**:
    - Always verify changes with automated tests, linting (`vendor/bin/pint`), and asset building (`npm run build`) before considering a task complete.
