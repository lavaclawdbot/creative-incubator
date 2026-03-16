import { db, Idea } from '../db';
import chalk from 'chalk';

export function showIdea(id: number) {
  try {
    const stmt = db.prepare('SELECT * FROM ideas WHERE id = ?');
    const idea = stmt.get(id) as Idea | undefined;

    if (!idea) {
      console.error(chalk.red(`Idea #${id} not found`));
      process.exit(1);
    }

    console.log();
    console.log(chalk.bold.blue(`Idea #${idea.id}`));
    console.log(chalk.gray('='.repeat(50)));
    console.log();
    
    console.log(chalk.bold('Title:'), idea.title);
    console.log(chalk.bold('Status:'), chalk.yellow(idea.status));
    console.log(chalk.bold('Created:'), new Date(idea.created_at).toLocaleString());
    console.log(chalk.bold('Updated:'), new Date(idea.updated_at).toLocaleString());
    console.log();

    if (idea.description) {
      console.log(chalk.bold('Description:'));
      console.log(idea.description);
      console.log();
    }

    // Development fields
    if (idea.problem || idea.solution || idea.value_prop || idea.tech_stack) {
      console.log(chalk.bold.green('Development'));
      console.log(chalk.gray('-'.repeat(50)));
      
      if (idea.problem) {
        console.log(chalk.bold('Problem:'));
        console.log(idea.problem);
        console.log();
      }
      
      if (idea.solution) {
        console.log(chalk.bold('Solution:'));
        console.log(idea.solution);
        console.log();
      }
      
      if (idea.value_prop) {
        console.log(chalk.bold('Value Proposition:'));
        console.log(idea.value_prop);
        console.log();
      }
      
      if (idea.tech_stack) {
        console.log(chalk.bold('Tech Stack:'));
        console.log(idea.tech_stack);
        console.log();
      }
      
      if (idea.effort_estimate) {
        console.log(chalk.bold('Effort Estimate:'), idea.effort_estimate);
        console.log();
      }
    }

    // Validation
    if (idea.is_valuable !== null || idea.is_feasible !== null || idea.is_unique !== null) {
      console.log(chalk.bold.yellow('Validation'));
      console.log(chalk.gray('-'.repeat(50)));
      
      const bool = (val: number | null) => val ? chalk.green('✓ Yes') : val === 0 ? chalk.red('✗ No') : chalk.gray('? Unknown');
      
      console.log(chalk.bold('Valuable:'), bool(idea.is_valuable));
      console.log(chalk.bold('Feasible:'), bool(idea.is_feasible));
      console.log(chalk.bold('Unique:'), bool(idea.is_unique));
      
      if (idea.validation_notes) {
        console.log();
        console.log(chalk.bold('Notes:'));
        console.log(idea.validation_notes);
      }
      console.log();
    }

    // Pitch
    if (idea.pitch_text) {
      console.log(chalk.bold.magenta('Pitch'));
      console.log(chalk.gray('-'.repeat(50)));
      console.log(idea.pitch_text);
      if (idea.pitch_generated_at) {
        console.log();
        console.log(chalk.gray(`Generated: ${new Date(idea.pitch_generated_at).toLocaleString()}`));
      }
      console.log();
    }

    // Tracking
    if (idea.project_repo || idea.notion_task_id || idea.outcome) {
      console.log(chalk.bold.cyan('Tracking'));
      console.log(chalk.gray('-'.repeat(50)));
      
      if (idea.project_repo) {
        console.log(chalk.bold('Repository:'), idea.project_repo);
      }
      if (idea.notion_task_id) {
        console.log(chalk.bold('Notion Task:'), idea.notion_task_id);
      }
      if (idea.outcome) {
        console.log(chalk.bold('Outcome:'), idea.outcome);
      }
      console.log();
    }

  } catch (error) {
    console.error(chalk.red('Error showing idea:'), error);
    process.exit(1);
  }
}
