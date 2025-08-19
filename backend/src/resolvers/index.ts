import { projectQueries } from './projects/queries';
import { projectMutations } from './projects/mutations';
import { articleQueries } from './articles/queries';
import { articleMutations } from './articles/mutations';
import { userQueries } from './users/queries';
import { userMutations } from './users/mutations';
import { rateTestQueries } from './rateTest/queries';
import { chatbotQueries } from './chatbot/queries';
import { chatbotMutations } from './chatbot/mutations';
import { screamMutations } from './screams/mutations';
import Project from '../models/Project';

function slugify(text: string) {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
}

// Combine all resolvers
export const resolvers = {
  Query: {
    ...projectQueries,
    ...articleQueries,
    ...userQueries,
    ...rateTestQueries,
    ...chatbotQueries,
  },
  
  Mutation: {
    ...projectMutations,
    ...articleMutations,
    ...userMutations,
    ...chatbotMutations,
    ...screamMutations,
  },
  
  Project: {
    // Ensure non-null slug by backfilling if missing
    async slug(parent: any) {
      if (parent.slug) return parent.slug;
      if (!parent.title) return null;
      const generated = slugify(parent.title);
      try {
        await Project.findByIdAndUpdate(parent.id, { $set: { slug: generated } }, { new: false });
      } catch (e) {
        // ignore duplicate or other errors here; still return computed slug
      }
      return generated;
    },
  },
};
