import Database from 'better-sqlite3';

export function migratePriorityScoring(db: Database.Database) {
  // Check if columns already exist
  const tableInfo = db.prepare("PRAGMA table_info(ideas)").all() as any[];
  const columns = tableInfo.map(col => col.name);

  if (!columns.includes('impact_potential')) {
    db.exec(`
      ALTER TABLE ideas ADD COLUMN impact_potential INTEGER DEFAULT 5;
      ALTER TABLE ideas ADD COLUMN effort_hours INTEGER DEFAULT 5;
      ALTER TABLE ideas ADD COLUMN confidence_level INTEGER DEFAULT 5;
    `);
    console.log('✓ Added priority scoring columns (impact_potential, effort_hours, confidence_level)');
  }
}
