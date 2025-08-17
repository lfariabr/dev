import { useQuery } from '@apollo/client';
import { GET_ARTICLES, GET_ARTICLE, GET_PUBLISHED_ARTICLES, GET_ARTICLE_BY_SLUG } from '../graphql/queries/article.queries';
import { Article, ArticleData, ArticlesData, PublishedArticlesData } from '../graphql/types/article.types';

/**
 * Hook for fetching all articles (including unpublished)
 * Intended for admin use
 */
export const useArticles = () => {
  const { data, loading, error } = useQuery<ArticlesData>(GET_ARTICLES);
  
  return {
    articles: data?.articles || [],
    loading,
    error: error?.message
  };
};

/**
 * Hook for fetching only published articles
 * Intended for public-facing pages
 */
export const usePublishedArticles = () => {
  const { data, loading, error } = useQuery<PublishedArticlesData>(GET_PUBLISHED_ARTICLES);
  
  return {
    articles: data?.publishedArticles || [],
    loading,
    error: error?.message
  };
};

/**
 * Hook for fetching a single article by ID (admin)
 */
export const useArticle = (id: string) => {
  const { data, loading, error } = useQuery<ArticleData>(GET_ARTICLE, {
    variables: { id },
    skip: !id
  });
  
  return {
    article: data?.article || null,
    loading,
    error: error?.message,
    notFound: !loading && !error && !data?.article
  };
};

/**
 * Hook for fetching a single article by slug (public SEO URL)
 */
export const useArticleBySlug = (slug: string) => {
  const { data, loading, error } = useQuery<{ articleBySlug: Article }>(GET_ARTICLE_BY_SLUG, {
    variables: { slug },
    skip: !slug
  });

  return {
    article: data?.articleBySlug || null,
    loading,
    error: error?.message,
    notFound: !loading && !error && !data?.articleBySlug
  };
};
