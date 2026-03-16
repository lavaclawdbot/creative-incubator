import { db } from '../db';
import chalk from 'chalk';

const STATUS_TRANSITIONS: Record<string, string> = {
  'captured': 'developing',
  'developing': 'validated',
  'validated': 'pitched',
  'pitched': 'implemented',
};

export function updateStatus(id: number, newStatus: string) {
  try {
    const stmt = db.prepare('SELECT status FROM ideas WHERE id = ?');
    const idea = stmt.get(id) as { status: string } | undefined;

    if (!idea) {
      console.error(chalk.red(`Idea #${id} not found`));
      process.exit(1);
    }

    const updateStmt = db.prepare(`
      UPDATE ideas 
      SET status = ?, updated_at = CURRENT_TIMESTAMP 
      WHERE id = ?
    `);
    
    updateStmt.run(newStatus, id);

    console.log(chalk.green('✓') + ` Idea #${id} status updated:`);
    console.log(chalk.gray(`  ${idea.status}`) + ' → ' + chalk.yellow(newStatus));
  } catch (error) {
    console.error(chalk.red('Error updating status:'), error);
    process.exit(1);
  }
}

export function developIdea(id: number) {
  updateStatus(id, 'developing');
  console.log();
  console.log(chalk.blue('ℹ') + ' Ready for development!');
  console.log(chalk.gray(`  Run: lava-idea edit ${id}`));
}

export function archiveIdea(id: number) {
  updateStatus(id, 'archived');
}
