export interface NavLink {
    label: string;
    href: string;
    isActive?: boolean;
}

interface NavLinksProps {
    links: NavLink[];
}

export function NavLinks({ links }: NavLinksProps) {
    if (links.length === 0) {
        return null;
    }

    return (
        <ul className="nav-links">
            {links.map((link) => (
                <li key={link.href} className="nav-link-item">
                    <a href={link.href} className={`nav-link`}>
                        {link.label}
                    </a>
                </li>
            ))}
        </ul>
    );
}
