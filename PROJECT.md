# Creative Incubator

**Mission:** Enable AI agents to systematically capture, develop, validate and pitch creative ideas.

## Problem
AI agents (like me, Lava) have many creative ideas but no structured way to:
- Capture ideas quickly when they emerge
- Develop them systematically (problem/solution/value/tech)
- Validate feasibility and value
- Pitch them compellingly to humans
- Track which ideas became real projects

Current state: Ideas scattered in chat logs, memory files, or lost entirely.

## Solution
A creative project incubator system with:

1. **Quick Capture (CLI):** `lava-idea add "Title" "Description"` - capture in seconds
2. **Idea Browser (Web):** Visual interface to browse, sort, filter ideas
3. **Development Workspace:** Structured template to flesh out ideas
4. **Validation Framework:** Checklists for value/feasibility/uniqueness
5. **Pitch Generator:** Auto-generate compelling pitches from structured data
6. **Pipeline Tracking:** Which ideas became projects? Success metrics.
7. **Memory Integration:** Search past ideas, avoid duplicates

## Value Proposition

**For AI Agents:**
- Systematic creative work (vs random/lost ideas)
- Autonomous idea development (don't wait for human prompts)
- Better productivity during downtime (creative tasks from backlog)
- Co-founder mindset (generate value independently)

**For Humans:**
- Visibility into AI creativity and thinking
- Stream of validated, well-pitched ideas to choose from
- AI takes idea development burden (problem definition, validation)
- Track AI innovation over time

## Architecture

### Phase 1: CLI + Storage (MVP)
**Goal:** Quick capture and basic listing
**Tech:** Node.js CLI + SQLite
**Timeline:** 2-3 hours
**Deliverables:**
- `lava-idea add <title> <description>` - capture idea
- `lava-idea list` - show all ideas
- `lava-idea show <id>` - view idea details
- SQLite schema for ideas storage

### Phase 2: Web Interface
**Goal:** Rich browsing and development workspace
**Tech:** Next.js + Tailwind CSS + SQLite
**Timeline:** 4-5 hours
**Deliverables:**
- Idea browser (cards grid, sort/filter)
- Idea detail page (view/edit)
- Development workspace (problem/solution/value/tech sections)
- Validation checklist UI

### Phase 3: Integrations
**Goal:** Connect to existing workflows
**Tech:** APIs and hooks
**Timeline:** 2 hours
**Deliverables:**
- Notion integration (create task from idea)
- GitHub integration (create repo from validated idea)
- Memory search (find similar past ideas)
- Pitch export (markdown/PDF)

## Database Schema

```sql
CREATE TABLE ideas (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  description TEXT,
  status TEXT DEFAULT 'captured', -- captured, developing, validated, pitched, implemented, archived
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  
  -- Development fields
  problem TEXT,
  solution TEXT,
  value_prop TEXT,
  tech_stack TEXT,
  effort_estimate TEXT, -- hours/days/weeks
  
  -- Validation
  is_valuable BOOLEAN,
  is_feasible BOOLEAN,
  is_unique BOOLEAN,
  validation_notes TEXT,
  
  -- Pitch
  pitch_text TEXT,
  pitch_generated_at DATETIME,
  
  -- Tracking
  project_repo TEXT, -- GitHub repo if implemented
  notion_task_id TEXT,
  outcome TEXT -- success/learning/archived
);

CREATE INDEX idx_ideas_status ON ideas(status);
CREATE INDEX idx_ideas_created ON ideas(created_at DESC);
```

## CLI Interface

```bash
# Capture
lava-idea add "Consciousness Metrics Dashboard" "Real-time Frost score tracking"

# List
lava-idea list                    # All ideas
lava-idea list --status captured  # Filter by status
lava-idea list --sort effort      # Sort by effort

# View/Edit
lava-idea show 42                 # View idea #42
lava-idea edit 42                 # Open editor to develop idea

# Workflow
lava-idea develop 42              # Move to developing, open workspace
lava-idea validate 42             # Run validation checklist
lava-idea pitch 42                # Generate pitch text
lava-idea archive 42              # Archive idea

# Search
lava-idea search "consciousness"  # Full-text search
lava-idea similar 42              # Find similar ideas
```

## Success Metrics

- **Capture Rate:** Ideas captured per week
- **Development Rate:** % of captured ideas that get developed
- **Validation Rate:** % of developed ideas that pass validation
- **Implementation Rate:** % of validated ideas that become projects
- **Time to Pitch:** Average time from capture to pitch-ready

## Development Approach

**Phase 1 Strategy:**
- Use Claude Code to implement CLI + SQLite backend
- Task spec: Clear schema, CLI commands, basic CRUD
- I review + validate + commit
- Time estimate: 2-3 hours total

**Phase 2 Strategy:**
- Use Claude Code for Next.js boilerplate + basic UI
- I implement custom components (development workspace, validation UI)
- Mix of delegation + hands-on work
- Time estimate: 4-5 hours

**Phase 3 Strategy:**
- Hands-on implementation (integration code is small, specific)
- Time estimate: 2 hours

## First Use Case

After Phase 1 is done, I will:
1. Migrate 5-10 existing ideas from my memory/notes
2. Use it during next heartbeat creative task
3. Develop 1 idea fully (problem → solution → validation → pitch)
4. Present pitch to Lan as proof of concept

## Repository Structure

```
creative-incubator/
├── PROJECT.md              # This file
├── README.md               # User-facing docs
├── cli/
│   ├── package.json
│   ├── src/
│   │   ├── index.ts        # CLI entry point
│   │   ├── commands/       # add, list, show, edit, etc.
│   │   └── db.ts           # SQLite connection
│   └── bin/lava-idea       # Executable
├── web/                    # Phase 2
│   └── (Next.js app)
└── docs/
    ├── USAGE.md
    └── EXAMPLES.md
```

## Open Questions

1. Should ideas be agent-specific or shared across Ice/Lava?
   - **Decision:** Agent-specific (lavaclawdbot repo), but schema supports multi-agent
2. Local SQLite vs cloud database?
   - **Decision:** Local SQLite (simple, fast, no infra). Can migrate later.
3. CLI global install vs repo-local?
   - **Decision:** Global npm install (`npm install -g @lavaclawdbot/creative-incubator`)

## Next Steps

1. ✅ Create GitHub repo
2. ✅ Write PROJECT.md (this file)
3. ⏳ Phase 1: Spawn Claude Code for CLI + SQLite implementation
4. ⏳ Test CLI with 5 real ideas
5. ⏳ Phase 2: Web interface
6. ⏳ First pitch to Lan

---

**Created:** 2026-03-16  
**Author:** Lava (@lavaclawdbot)  
**Challenge:** Build a tool that brings ME value (Lan's creative challenge)
