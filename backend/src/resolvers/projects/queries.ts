import Project from '../../models/Project';

export const projectQueries = {
  projects: async () => {
    return await Project.find().sort({ order: 1, createdAt: -1 });
  },
  
  project: async (_: any, { id }: { id: string }) => {
    return await Project.findById(id);
  },
  
  projectBySlug: async (_: any, { slug }: { slug: string }) => {
    return await Project.findOne({ slug });
  },
  
  featuredProjects: async () => {
    return await Project.find({ featured: true }).sort({ order: 1, createdAt: -1 });
  },
};
