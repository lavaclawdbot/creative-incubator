#!/usr/bin/env node

import { Command } from 'commander';
import { addIdea } from './commands/add';
import { listIdeas } from './commands/list';
import { showIdea } from './commands/show';
import { developIdea, archiveIdea } from './commands/status';
import { searchIdeas } from './commands/search';
import { listPriorities, updatePriorityFields } from './commands/priority';
import chalk from 'chalk';

const program = new Command();

program
  .name('lava-idea')
  .description('AI Creative Project Incubator - Capture, develop, validate and pitch ideas')
  .version('0.1.0');

program
  .command('add <title> <description>')
  .description('Capture a new idea')
  .action((title: string, description: string) => {
    addIdea(title, description);
  });

program
  .command('list')
  .description('List all ideas')
  .option('-s, --status <status>', 'Filter by status')
  .option('--sort <field>', 'Sort by field (created_at, updated_at, title, status, effort_estimate)')
  .action((options) => {
    listIdeas(options);
  });

program
  .command('show <id>')
  .description('Show idea details')
  .action((id: string) => {
    showIdea(parseInt(id, 10));
  });

program
  .command('develop <id>')
  .description('Move idea to developing status')
  .action((id: string) => {
    developIdea(parseInt(id, 10));
  });

program
  .command('archive <id>')
  .description('Archive an idea')
  .action((id: string) => {
    archiveIdea(parseInt(id, 10));
  });

program
  .command('search <query>')
  .description('Search ideas by keyword')
  .action((query: string) => {
    searchIdeas(query);
  });

program
  .command('priority')
  .description('List ideas ranked by priority score')
  .action(() => {
    listPriorities();
  });

program
  .command('score <id>')
  .description('Update priority scoring fields')
  .option('-i, --impact <score>', 'Impact potential (1-10)', parseInt)
  .option('-e, --effort <score>', 'Effort estimate (1-10)', parseInt)
  .option('-c, --confidence <score>', 'Confidence level (1-10)', parseInt)
  .action((id: string, options) => {
    updatePriorityFields(
      parseInt(id, 10),
      options.impact,
      options.effort,
      options.confidence
    );
  });

// Edit command (placeholder - needs $EDITOR support)
program
  .command('edit <id>')
  .description('Edit idea in $EDITOR (coming soon)')
  .action((id: string) => {
    console.log(chalk.yellow('⚠ Edit command not yet implemented'));
    console.log(chalk.gray(`  Use: lava-idea show ${id} to view details`));
  });

// Validate command (placeholder - needs interactive prompts)
program
  .command('validate <id>')
  .description('Run validation checklist (coming soon)')
  .action((id: string) => {
    console.log(chalk.yellow('⚠ Validate command not yet implemented'));
    console.log(chalk.gray(`  Use: lava-idea show ${id} to view validation status`));
  });

// Pitch command (placeholder - needs AI generation)
program
  .command('pitch <id>')
  .description('Generate pitch text (coming soon)')
  .action((id: string) => {
    console.log(chalk.yellow('⚠ Pitch command not yet implemented'));
    console.log(chalk.gray(`  Use: lava-idea show ${id} to view pitch`));
  });

program.parse(process.argv);
