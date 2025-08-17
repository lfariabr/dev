import { useQuery } from '@apollo/client';
import { GET_PROJECTS, GET_FEATURED_PROJECTS, GET_PROJECT, GET_PROJECT_BY_SLUG } from '../graphql/queries/project.queries';
import { 
  ProjectsData, 
  FeaturedProjectsData, 
  ProjectData, 
  ProjectVars,
  ProjectBySlugData,
  ProjectBySlugVars
} from '../graphql/types/project.types';

export function useProjects() {
  const { data, loading, error } = useQuery<ProjectsData>(GET_PROJECTS);
  
  return {
    projects: data?.projects || [],
    loading,
    error: error?.message
  };
}

export function useFeaturedProjects() {
  const { data, loading, error } = useQuery<FeaturedProjectsData>(GET_FEATURED_PROJECTS);
  
  return {
    featuredProjects: data?.featuredProjects || [],
    loading,
    error: error?.message
  };
}

export function useProject(id: string) {
  const { data, loading, error } = useQuery<ProjectData, ProjectVars>(
    GET_PROJECT,
    { variables: { id } }
  );
  
  return {
    project: data?.project,
    loading,
    error: error?.message,
    notFound: !loading && !error && !data?.project
  };
}

export function useProjectBySlug(slug: string) {
  const { data, loading, error } = useQuery<ProjectBySlugData, ProjectBySlugVars>(
    GET_PROJECT_BY_SLUG,
    { variables: { slug }, skip: !slug }
  );

  return {
    project: data?.projectBySlug,
    loading,
    error: error?.message,
    notFound: !loading && !error && !data?.projectBySlug
  };
}
