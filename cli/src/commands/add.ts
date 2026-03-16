import { db } from '../db';
import chalk from 'chalk';

export function addIdea(title: string, description: string) {
  try {
    const stmt = db.prepare(`
      INSERT INTO ideas (title, description) 
      VALUES (?, ?)
    `);
    
    const result = stmt.run(title, description);
    
    console.log(chalk.green('✓') + ' Idea captured!');
    console.log(chalk.gray(`  ID: ${result.lastInsertRowid}`));
    console.log(chalk.gray(`  Title: ${title}`));
    console.log(chalk.gray(`  Description: ${description}`));
    
    return result.lastInsertRowid;
  } catch (error) {
    console.error(chalk.red('Error adding idea:'), error);
    process.exit(1);
  }
}
