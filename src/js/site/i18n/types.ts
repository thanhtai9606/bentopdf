export type Locale = 'en' | 'vi';

export type ToolTranslation = {
    name: string;
    subtitle: string;
};

export type Messages = {
    nav: {
        home: string;
        about: string;
        contact: string;
        allTools: string;
        viewAllTools: string;
    };
    home: {
        title: string;
        titleHighlight: string;
        subtitle: string;
        searchPlaceholder: string;
        backToTools: string;
    };
    footer: {
        company: string;
        legal: string;
        followUs: string;
        aboutUs: string;
        faq: string;
        contactUs: string;
        terms: string;
        privacy: string;
        copyright: string;
    };
    common: {
        processing: string;
        alert: string;
        ok: string;
        documentPreview: string;
        downloadPdf: string;
        close: string;
    };
    theme: {
        label: string;
        choose: string;
        system: string;
        light: string;
        soft: string;
        dark: string;
    };
    language: {
        label: string;
    };
    categories: Record<string, string>;
    tools: Record<string, ToolTranslation>;
    about: Record<string, string>;
    contact: Record<string, string>;
};
