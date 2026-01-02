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
        <nav className="nav-links-container">
            <span className="nav-links-label">Other roots</span>
            <ul className="nav-links">
                {links.map((link) => (
                    <li key={link.href}>
                        <a href={link.href} className="nav-link">
                            {link.label}
                        </a>
                    </li>
                ))}
            </ul>
        </nav>
    );
}
