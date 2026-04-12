import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { getProjects } from '../services/api';

export default function CelebrationWall() {
    const navigate = useNavigate();
    const [completedProjects, setCompletedProjects] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchWall = async () => {
            try {
                const data = await getProjects();
                // Filter out only the completed projects
                const finished = data.filter((project: any) => project.is_completed === true);
                setCompletedProjects(finished);
            } catch (err) {
                navigate('/login');
            } finally {
                setLoading(false);
            }
        };

        fetchWall();
    }, [navigate]);

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/login');
    };

    return (
        <div className="min-h-screen bg-mzansi-black text-mzansi-white pb-12">
            {/* Navbar */}
            <nav className="bg-white border-b border-gray-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16">
                        <div className="flex items-center space-x-8">
                            <span className="text-xl font-bold text-mzansi-green">MzansiBuilds</span>
                            <Link to="/dashboard" className="text-sm font-medium text-gray-500 hover:text-gray-900">
                                Community Feed
                            </Link>
                        </div>
                        <div className="flex items-center">
                            <button onClick={handleLogout} className="px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-mzansi-green hover:bg-green-700">
                                Sign out
                            </button>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Wall Content */}
            <main className="max-w-7xl mx-auto py-10 px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-mzansi-green to-blue-500 sm:text-5xl">
                        The Celebration Wall
                    </h1>
                    <p className="mt-3 max-w-2xl mx-auto text-xl text-gray-400 sm:mt-4">
                        Honouring the completed high-performance projects from our developer community.
                    </p>
                </div>
                
                {loading ? (
                    <div className="text-center text-gray-400">Loading triumphs...</div>
                ) : completedProjects.length === 0 ? (
                    <div className="text-center text-gray-400 bg-gray-900 rounded-lg p-12 border border-gray-800">
                        No projects have been completed yet. Time to get building!
                    </div>
                ) : (
                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                        {completedProjects.map((project) => (
                            <div key={project.id} className="bg-gray-800 rounded-lg shadow-lg overflow-hidden border border-gray-700 hover:border-mzansi-green transition-colors duration-300">
                                <div className="p-6">
                                    <div className="flex items-center justify-between mb-4">
                                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-blue-900 text-blue-200">
                                            🎉 Completed
                                        </span>
                                    </div>
                                    <h2 className="text-xl font-bold text-white mb-2">{project.title}</h2>
                                    <p className="text-gray-400 text-sm mb-4">{project.description}</p>
                                    
                                    <div className="pt-4 border-t border-gray-700 mt-auto">
                                        <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold">
                                            Milestones Achieved: {project.milestones?.length || 0}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </main>
        </div>
    );
}