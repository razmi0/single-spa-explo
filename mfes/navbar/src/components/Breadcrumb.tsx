export interface BreadcrumbItem {
    label: string;
    href?: string;
}

interface BreadcrumbProps {
    items: BreadcrumbItem[];
    separator?: string;
}

export function Breadcrumb({ items, separator = "/" }: BreadcrumbProps) {
    if (items.length === 0) {
        return null;
    }

    return (
        <nav className="breadcrumb" aria-label="Breadcrumb">
            <ol className="breadcrumb-list">
                {items.map((item, index) => {
                    const isLast = index === items.length - 1;

                    return (
                        <li key={index} className="breadcrumb-item">
                            {item.href && !isLast ? (
                                <a href={item.href} className="breadcrumb-link">
                                    {item.label}
                                </a>
                            ) : (
                                <span
                                    className={`breadcrumb-text ${isLast ? "breadcrumb-text--current" : ""}`}
                                    aria-current={isLast ? "page" : undefined}
                                >
                                    {item.label}
                                </span>
                            )}
                            {!isLast && (
                                <span className="breadcrumb-separator" aria-hidden="true">
                                    {separator}
                                </span>
                            )}
                        </li>
                    );
                })}
            </ol>
        </nav>
    );
}

