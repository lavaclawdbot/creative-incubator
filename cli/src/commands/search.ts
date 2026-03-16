import { db, Idea } from '../db';
import chalk from 'chalk';

export function searchIdeas(query: string) {
  try {
    const stmt = db.prepare(`
      SELECT * FROM ideas 
      WHERE 
        title LIKE ? OR 
        description LIKE ? OR 
        problem LIKE ? OR 
        solution LIKE ? OR 
        value_prop LIKE ?
      ORDER BY created_at DESC
    `);

    const searchPattern = `%${query}%`;
    const ideas = stmt.all(
      searchPattern,
      searchPattern,
      searchPattern,
      searchPattern,
      searchPattern
    ) as Idea[];

    if (ideas.length === 0) {
      console.log(chalk.gray(`No ideas found matching "${query}"`));
      return;
    }

    console.log(chalk.bold(`\nFound ${ideas.length} idea(s) matching "${query}":\n`));

    ideas.forEach((idea) => {
      console.log(
        chalk.gray(`#${idea.id}`) +
        ' ' +
        chalk.bold(idea.title) +
        ' ' +
        chalk.yellow(`[${idea.status}]`)
      );
      
      if (idea.description) {
        console.log(chalk.gray(`   ${idea.description.substring(0, 80)}${idea.description.length > 80 ? '...' : ''}`));
      }
      console.log();
    });

    console.log(chalk.gray(`Total: ${ideas.length} matches`));
  } catch (error) {
    console.error(chalk.red('Error searching ideas:'), error);
    process.exit(1);
  }
}
