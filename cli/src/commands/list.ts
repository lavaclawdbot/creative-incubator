import { db, Idea } from '../db';
import chalk from 'chalk';

interface ListOptions {
  status?: string;
  sort?: string;
}

const STATUS_COLORS: Record<string, (text: string) => string> = {
  'captured': chalk.blue,
  'developing': chalk.yellow,
  'validated': chalk.green,
  'pitched': chalk.magenta,
  'implemented': chalk.cyan,
  'archived': chalk.gray,
};

export function listIdeas(options: ListOptions = {}) {
  try {
    let query = 'SELECT * FROM ideas WHERE 1=1';
    const params: any[] = [];

    if (options.status) {
      query += ' AND status = ?';
      params.push(options.status);
    }

    // Sort
    const sortField = options.sort || 'created_at';
    const validSortFields = ['created_at', 'updated_at', 'title', 'status', 'effort_estimate'];
    
    if (validSortFields.includes(sortField)) {
      query += ` ORDER BY ${sortField} DESC`;
    } else {
      query += ' ORDER BY created_at DESC';
    }

    const stmt = db.prepare(query);
    const ideas = stmt.all(...params) as Idea[];

    if (ideas.length === 0) {
      console.log(chalk.gray('No ideas found.'));
      return;
    }

    console.log(chalk.bold(`\nFound ${ideas.length} idea(s):\n`));

    ideas.forEach((idea) => {
      const statusColor = STATUS_COLORS[idea.status] || chalk.white;
      console.log(
        chalk.gray(`#${idea.id}`) +
        ' ' +
        chalk.bold(idea.title) +
        ' ' +
        statusColor(`[${idea.status}]`)
      );
      
      if (idea.description) {
        console.log(chalk.gray(`   ${idea.description.substring(0, 80)}${idea.description.length > 80 ? '...' : ''}`));
      }
      
      if (idea.effort_estimate) {
        console.log(chalk.gray(`   Effort: ${idea.effort_estimate}`));
      }
      
      console.log(chalk.gray(`   Created: ${new Date(idea.created_at).toLocaleDateString()}`));
      console.log();
    });

    console.log(chalk.gray(`Total: ${ideas.length} ideas`));
  } catch (error) {
    console.error(chalk.red('Error listing ideas:'), error);
    process.exit(1);
  }
}
