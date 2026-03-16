import Database from 'better-sqlite3';
import { join } from 'path';
import { homedir } from 'os';
import { mkdirSync, existsSync } from 'fs';

const DB_DIR = join(homedir(), '.lava-incubator');
const DB_PATH = join(DB_DIR, 'ideas.db');

// Ensure directory exists
if (!existsSync(DB_DIR)) {
  mkdirSync(DB_DIR, { recursive: true });
}

export const db: Database.Database = new Database(DB_PATH);

// Enable foreign keys
db.pragma('foreign_keys = ON');

// Initialize schema
export function initDatabase() {
  db.exec(`
    CREATE TABLE IF NOT EXISTS ideas (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      description TEXT,
      status TEXT DEFAULT 'captured',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      
      problem TEXT,
      solution TEXT,
      value_prop TEXT,
      tech_stack TEXT,
      effort_estimate TEXT,
      
      is_valuable INTEGER,
      is_feasible INTEGER,
      is_unique INTEGER,
      validation_notes TEXT,
      
      pitch_text TEXT,
      pitch_generated_at DATETIME,
      
      project_repo TEXT,
      notion_task_id TEXT,
      outcome TEXT
    );

    CREATE INDEX IF NOT EXISTS idx_ideas_status ON ideas(status);
    CREATE INDEX IF NOT EXISTS idx_ideas_created ON ideas(created_at DESC);
  `);
}

export interface Idea {
  id: number;
  title: string;
  description: string | null;
  status: string;
  created_at: string;
  updated_at: string;
  problem: string | null;
  solution: string | null;
  value_prop: string | null;
  tech_stack: string | null;
  effort_estimate: string | null;
  is_valuable: number | null;
  is_feasible: number | null;
  is_unique: number | null;
  validation_notes: string | null;
  pitch_text: string | null;
  pitch_generated_at: string | null;
  project_repo: string | null;
  notion_task_id: string | null;
  outcome: string | null;
}

// Initialize on import
initDatabase();
