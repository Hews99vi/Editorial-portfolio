export interface SEOProps {
    title?: string;
    description?: string;
    image?: string;
    url?: string;
    type?: 'website' | 'article';
}

export const generateSEO = (props: SEOProps, defaults: { title: string; description: string }) => {
    const title = props.title || defaults.title;
    const description = props.description || defaults.description;
    const url = props.url || window.location.href;
    const type = props.type || 'website';

    return {
        title: title,
        meta: [
            { name: 'description', content: description },
            { property: 'og:title', content: title },
            { property: 'og:description', content: description },
            { property: 'og:type', content: type },
            { property: 'og:url', content: url },
            ...(props.image ? [{ property: 'og:image', content: props.image }] : []),
            { name: 'twitter:card', content: 'summary_large_image' },
            { name: 'twitter:title', content: title },
            { name: 'twitter:description', content: description },
            ...(props.image ? [{ name: 'twitter:image', content: props.image }] : []),
        ],
    };
};
