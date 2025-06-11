// frontend/src/components/chat/MarkdownMessage.tsx
'use client';

import React from 'react';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/cjs/styles/prism';
import remarkGfm from 'remark-gfm';
import { cn } from '@/lib/utils';

interface MarkdownMessageProps {
  content: string;
  className?: string;
  variant?: 'default' | 'project' | 'article';
}

export function MarkdownMessage({ 
  content, 
  className = '', 
  variant = 'default' 
}: MarkdownMessageProps) {
  const baseStyles = 'prose prose-invert max-w-none';
  const variantStyles = {
    default: '',
    project: 'prose-lg',
    article: 'prose-lg leading-relaxed'
  };

  return (
    <div className={cn(baseStyles, variantStyles[variant], className)}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          // Headings
          h1: ({ node, ...props }) => <h1 className="text-4xl font-bold mt-8 mb-4" {...props} />,
          h2: ({ node, ...props }) => <h2 className="text-3xl font-semibold mt-8 mb-3" {...props} />,
          h3: ({ node, ...props }) => <h3 className="text-2xl font-medium mt-6 mb-3" {...props} />,
          h4: ({ node, ...props }) => <h4 className="text-xl font-medium mt-4 mb-2" {...props} />,
          
          // Paragraphs
          p: ({ node, ...props }) => <p className="my-4 leading-relaxed" {...props} />,
          
          // Lists
          ul: ({ node, ...props }) => (
            <ul className="list-disc pl-6 space-y-2 my-4" {...props} />
          ),
          ol: ({ node, ...props }) => (
            <ol className="list-decimal pl-6 space-y-2 my-4" {...props} />
          ),
          li: ({ node, ...props }) => (
            <li className="my-1 pl-1" {...props} />
          ),
          
          // Blockquotes
          blockquote: ({ node, ...props }) => (
            <blockquote 
              className="border-l-4 border-primary/40 pl-4 my-6 text-muted-foreground italic" 
              {...props} 
            />
          ),
          
          // Code blocks
          code({ node, inline, className, children, ...props }) {
            const match = /language-(\w+)/.exec(className || '');
            return !inline && match ? (
              <div className="my-4 rounded-lg overflow-hidden">
                <SyntaxHighlighter
                  style={vscDarkPlus}
                  language={match[1]}
                  PreTag="div"
                  className="text-sm leading-relaxed"
                  customStyle={{ margin: 0 }}
                  {...props}
                >
                  {String(children).replace(/\n$/, '')}
                </SyntaxHighlighter>
              </div>
            ) : (
              <code className="bg-muted px-1.5 py-0.5 rounded text-sm font-mono" {...props}>
                {children}
              </code>
            );
          },
          
          // Links
          a: ({ node, ...props }) => (
            <a 
              className="text-primary hover:underline underline-offset-4" 
              target="_blank" 
              rel="noopener noreferrer"
              {...props}
            />
          ),
          
          // Images
          img: ({ node, ...props }) => (
            <div className="my-6 rounded-lg overflow-hidden border">
              <img 
                className="w-full h-auto" 
                {...props} 
                alt={props.alt || ''}
              />
              {props.alt && (
                <p className="text-center text-sm text-muted-foreground mt-2">
                  {props.alt}
                </p>
              )}
            </div>
          ),
          
          // Horizontal rule
          hr: ({ node, ...props }) => (
            <hr className="my-8 border-t border-border" {...props} />
          ),
          
          // Tables
          table: ({ node, ...props }) => (
            <div className="my-6 overflow-x-auto">
              <table className="w-full border-collapse" {...props} />
            </div>
          ),
          th: ({ node, ...props }) => (
            <th 
              className="border border-border px-4 py-2 text-left bg-muted/50" 
              {...props} 
            />
          ),
          td: ({ node, ...props }) => (
            <td 
              className="border border-border px-4 py-2" 
              {...props} 
            />
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}