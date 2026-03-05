import { NavLink, Outlet } from 'react-router-dom';
import { Home, List, PlusCircle, HeartPulse, GitBranch, Printer, Baby } from 'lucide-react';

const Layout = () => {
    const handlePrint = () => {
        window.print();
    };

    return (
        <div className="app-container">
            <aside className="sidebar">
                <div className="sidebar-logo">
                    <HeartPulse size={28} />
                    <span>Schäfer App</span>
                </div>

                <nav className="nav-links">
                    <NavLink to="/" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"} end>
                        <Home size={20} />
                        Übersicht
                    </NavLink>
                    <NavLink to="/bestand" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>
                        <List size={20} />
                        Tierbestand
                    </NavLink>
                    <NavLink to="/neu" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>
                        <PlusCircle size={20} />
                        Tier erfassen (Zukauf)
                    </NavLink>
                    <NavLink to="/geburt" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>
                        <Baby size={20} />
                        Geburt erfassen
                    </NavLink>
                    <NavLink to="/gesundheit" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>
                        <HeartPulse size={20} />
                        Gesundheitbuch
                    </NavLink>
                    <NavLink to="/abstammung" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>
                        <GitBranch size={20} />
                        Abstammung
                    </NavLink>
                </nav>

                <div style={{ marginTop: 'auto' }}>
                    <button className="btn btn-secondary" style={{ width: '100%' }} onClick={handlePrint}>
                        <Printer size={18} />
                        Drucken
                    </button>
                </div>
            </aside>

            <main className="content">
                <Outlet />
            </main>
        </div>
    );
};

export default Layout;
