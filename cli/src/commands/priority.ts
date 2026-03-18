import { db } from '../db';
import chalk from 'chalk';

interface Idea {
  id: number;
  title: string;
  description: string;
  status: string;
  impact_potential?: number;
  effort_hours?: number;
  confidence_level?: number;
  created_at: string;
}

/**
 * Calculate priority score for an idea
 * Formula: (Impact × Confidence) / Effort
 * Higher score = higher priority
 */
function calculatePriority(idea: Idea): number {
  const impact = idea.impact_potential || 5; // Default medium impact
  const effort = idea.effort_hours || 5; // Default medium effort
  const confidence = idea.confidence_level || 5; // Default medium confidence

  // Prevent division by zero
  const effortSafe = Math.max(effort, 0.1);
  
  // Priority = (Impact × Confidence) / Effort
  // This rewards high-impact, high-confidence, low-effort ideas
  const priority = (impact * confidence) / effortSafe;
  
  return Math.round(priority * 10) / 10; // Round to 1 decimal
}

/**
 * Get priority label based on score
 */
function getPriorityLabel(score: number): { label: string; color: typeof chalk.green } {
  if (score >= 15) return { label: '🔥 CRITICAL', color: chalk.red };
  if (score >= 10) return { label: '⚡ HIGH', color: chalk.yellow };
  if (score >= 5) return { label: '📊 MEDIUM', color: chalk.blue };
  return { label: '💤 LOW', color: chalk.gray };
}

export function listPriorities() {
  const ideas = db.prepare(`
    SELECT * FROM ideas 
    WHERE status != 'archived'
    ORDER BY status ASC
  `).all() as Idea[];

  if (ideas.length === 0) {
    console.log(chalk.yellow('No ideas found'));
    return;
  }

  // Calculate priorities
  const ideasWithPriority = ideas.map(idea => ({
    ...idea,
    priority: calculatePriority(idea)
  }));

  // Sort by priority (highest first)
  ideasWithPriority.sort((a, b) => b.priority - a.priority);

  console.log(chalk.bold('\n📈 Idea Priority Ranking\n'));
  console.log(chalk.gray('Formula: (Impact × Confidence) / Effort\n'));

  ideasWithPriority.forEach((idea, index) => {
    const { label, color } = getPriorityLabel(idea.priority);
    const statusColor = idea.status === 'captured' ? chalk.cyan : 
                       idea.status === 'developing' ? chalk.yellow : 
                       chalk.green;

    console.log(color(`${index + 1}. ${label} [Score: ${idea.priority}]`));
    console.log(`   ${chalk.bold(idea.title)} ${statusColor(`[${idea.status}]`)}`);
    console.log(chalk.gray(`   Impact: ${idea.impact_potential || 5}/10 | Effort: ${idea.effort_hours || 5}/10 | Confidence: ${idea.confidence_level || 5}/10`));
    console.log(chalk.gray(`   ${idea.description.slice(0, 80)}${idea.description.length > 80 ? '...' : ''}`));
    console.log('');
  });

  // Summary stats
  const avgPriority = ideasWithPriority.reduce((sum, i) => sum + i.priority, 0) / ideasWithPriority.length;
  const highPriority = ideasWithPriority.filter(i => i.priority >= 10).length;
  
  console.log(chalk.gray('─'.repeat(60)));
  console.log(chalk.bold('Summary:'));
  console.log(chalk.gray(`  Total ideas: ${ideas.length}`));
  console.log(chalk.gray(`  Average priority: ${Math.round(avgPriority * 10) / 10}`));
  console.log(chalk.gray(`  High priority (≥10): ${highPriority}`));
  console.log('');
}

export function updatePriorityFields(id: number, impact?: number, effort?: number, confidence?: number) {
  const idea = db.prepare('SELECT * FROM ideas WHERE id = ?').get(id) as Idea | undefined;
  
  if (!idea) {
    console.log(chalk.red(`✗ Idea #${id} not found`));
    return;
  }

  const updates: string[] = [];
  const params: any[] = [];

  if (impact !== undefined) {
    if (impact < 1 || impact > 10) {
      console.log(chalk.red('✗ Impact must be between 1-10'));
      return;
    }
    updates.push('impact_potential = ?');
    params.push(impact);
  }

  if (effort !== undefined) {
    if (effort < 1 || effort > 10) {
      console.log(chalk.red('✗ Effort must be between 1-10'));
      return;
    }
    updates.push('effort_hours = ?');
    params.push(effort);
  }

  if (confidence !== undefined) {
    if (confidence < 1 || confidence > 10) {
      console.log(chalk.red('✗ Confidence must be between 1-10'));
      return;
    }
    updates.push('confidence_level = ?');
    params.push(confidence);
  }

  if (updates.length === 0) {
    console.log(chalk.yellow('⚠ No fields to update'));
    return;
  }

  updates.push('updated_at = CURRENT_TIMESTAMP');
  params.push(id);

  const query = `UPDATE ideas SET ${updates.join(', ')} WHERE id = ?`;
  db.prepare(query).run(...params);

  // Fetch updated idea
  const updated = db.prepare('SELECT * FROM ideas WHERE id = ?').get(id) as Idea;
  const newPriority = calculatePriority(updated);
  const { label, color } = getPriorityLabel(newPriority);

  console.log(chalk.green(`✓ Updated priority fields for idea #${id}`));
  console.log(color(`  ${label} [Score: ${newPriority}]`));
  console.log(chalk.gray(`  Impact: ${updated.impact_potential || 5}/10 | Effort: ${updated.effort_hours || 5}/10 | Confidence: ${updated.confidence_level || 5}/10`));
}
