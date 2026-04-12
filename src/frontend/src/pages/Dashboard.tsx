import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { getProjects, createProject, addMilestone, completeProject } from '../services/api';

export default function Dashboard() {
    const navigate = useNavigate();
    const [projects, setProjects] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [currentUserId, setCurrentUserId] = useState<number | null>(null);
    
    // Project Modal State
    const [showProjectModal, setShowProjectModal] = useState(false);
    const [isSubmittingProject, setIsSubmittingProject] = useState(false);
    const [projectFormData, setProjectFormData] = useState({
        title: '', description: '', stage: 'Ideation', support_required: ''
    });

    // Milestone Modal State
    const [showMilestoneModal, setShowMilestoneModal] = useState(false);
    const [activeProjectId, setActiveProjectId] = useState<number | null>(null);
    const [isSubmittingMilestone, setIsSubmittingMilestone] = useState(false);
    const [milestoneFormData, setMilestoneFormData] = useState({
        title: '', description: ''
    });

    useEffect(() => {
        // Decode the JWT to get the current user's ID
        const token = localStorage.getItem('token');
        if (token) {
            try {
                const payload = JSON.parse(atob(token.split('.')[1]));
                setCurrentUserId(payload.user_id);
            } catch (e) {
                console.error("Failed to parse token payload");
            }
        }

        const fetchFeed = async () => {
            try {
                const data = await getProjects();
                setProjects(data);
            } catch (err: any) {
                setError('Could not load projects. Please sign in again.');
                localStorage.removeItem('token');
                navigate('/login');
            } finally {
                setLoading(false);
            }
        };

        fetchFeed();
    }, [navigate]);

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/login');
    };

    const handleProjectSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmittingProject(true);
        try {
            const newProject = await createProject(projectFormData);
            setProjects([newProject, ...projects]);
            setShowProjectModal(false);
            setProjectFormData({ title: '', description: '', stage: 'Ideation', support_required: '' });
        } catch (err: any) {
            alert(err.message || 'Failed to create project');
        } finally {
            setIsSubmittingProject(false);
        }
    };

    const handleMilestoneSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!activeProjectId) return;
        
        setIsSubmittingMilestone(true);
        try {
            const newMilestone = await addMilestone(activeProjectId, milestoneFormData);
            
            // Optimistically update the specific project's milestone array in our local state
            setProjects(projects.map(project => {
                if (project.id === activeProjectId) {
                    return { ...project, milestones: [...project.milestones, newMilestone] };
                }
                return project;
            }));

            setShowMilestoneModal(false);
            setMilestoneFormData({ title: '', description: '' });
            setActiveProjectId(null);
        } catch (err: any) {
            alert(err.message || 'Failed to add milestone');
        } finally {
            setIsSubmittingMilestone(false);
        }
    };

    const handleCompleteProject = async (projectId: number) => {
        if (!window.confirm("Are you sure you want to mark this project as completed? It will be sent to the Celebration Wall!")) return;
        
        try {
            const updatedProject = await completeProject(projectId);
            
            // Optimistically update the UI to show the new 'Completed' status
            setProjects(projects.map(project => 
                project.id === projectId ? updatedProject : project
            ));
        } catch (err: any) {
            alert(err.message || 'Failed to complete project');
        }
    };

    return (
        <div className="min-h-screen bg-mzansi-black text-mzansi-white pb-12 relative">
            <nav className="bg-white border-b border-gray-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16">
                        
                        <div className="flex items-center space-x-8">
                        <span className="text-xl font-bold text-mzansi-green">MzansiBuilds</span>
                        <Link to="/celebration-wall" className="text-sm font-medium text-gray-500 hover:text-mzansi-green transition-colors">
                            Celebration Wall
                        </Link>
                    </div>
                        <div className="flex items-center space-x-4">
                            <button onClick={() => setShowProjectModal(true)} className="text-sm font-medium text-gray-700 hover:text-mzansi-green">
                                + New Project
                            </button>
                            <button onClick={handleLogout} className="px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-mzansi-green hover:bg-green-700">
                                Sign out
                            </button>
                        </div>
                    </div>
                </div>
            </nav>

            <main className="max-w-3xl mx-auto py-10 px-4 sm:px-6 lg:px-8">
                <h1 className="text-3xl font-bold mb-8">Community Feed</h1>
                
                {loading ? (
                    <div className="text-center text-gray-400">Loading projects...</div>
                ) : error ? (
                    <div className="text-red-500 text-center">{error}</div>
                ) : projects.length === 0 ? (
                    <div className="text-center text-gray-400">No projects yet. Be the first to build something!</div>
                ) : (
                    <div className="space-y-6">
                        {projects.map((project) => (
                            <div key={project.id} className="bg-white rounded-lg shadow overflow-hidden text-gray-900">
                                <div className="p-6">
                                <div className="flex justify-between items-start">
                                        <h2 className="text-xl font-bold text-gray-900">{project.title}</h2>
                                        
                                        <div className="flex space-x-3 items-center">
                                            {/* CONDITIONAL RENDERING: Only the owner sees these buttons */}
                                            {currentUserId === project.owner_id && !project.is_completed && (
                                                <>
                                                    <button 
                                                        onClick={() => { setActiveProjectId(project.id); setShowMilestoneModal(true); }}
                                                        className="text-xs font-bold text-mzansi-green hover:text-green-700 uppercase tracking-wider"
                                                    >
                                                        + Add Milestone
                                                    </button>
                                                    <button 
                                                        onClick={() => handleCompleteProject(project.id)}
                                                        className="text-xs font-bold text-blue-600 hover:text-blue-800 uppercase tracking-wider"
                                                    >
                                                        ✓ Mark Completed
                                                    </button>
                                                </>
                                            )}
                                            {/* Dynamic Stage Badge */}
                                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${project.is_completed ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'}`}>
                                                {project.stage}
                                            </span>
                                        </div>
                                    </div>
                                    <p className="mt-2 text-gray-600">{project.description}</p>
                                    
                                    {project.support_required && (
                                        <div className="mt-4 p-3 bg-gray-50 rounded-md border border-gray-200">
                                            <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Support Required</span>
                                            <p className="mt-1 text-sm text-gray-700">{project.support_required}</p>
                                        </div>
                                    )}
                                </div>
                                
                                {project.milestones && project.milestones.length > 0 && (
                                    <div className="bg-gray-50 border-t border-gray-200 p-6">
                                        <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-4">Milestones</h3>
                                        <ul className="space-y-4">
                                            {project.milestones.map((milestone: any) => (
                                                <li key={milestone.id} className="flex space-x-3">
                                                    <div className="flex-shrink-0">
                                                        <span className="h-2 w-2 mt-2 rounded-full bg-mzansi-green block"></span>
                                                    </div>
                                                    <div>
                                                        <p className="text-sm font-medium text-gray-900">{milestone.title}</p>
                                                        {milestone.description && (
                                                            <p className="text-sm text-gray-500">{milestone.description}</p>
                                                        )}
                                                    </div>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </main>

            {/* Create Project Modal */}
            {showProjectModal && (
                <div className="fixed inset-0 z-10 overflow-y-auto">
                    <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                        <div className="fixed inset-0 bg-black bg-opacity-75" onClick={() => setShowProjectModal(false)}></div>
                        <span className="hidden sm:inline-block sm:align-middle sm:h-screen">&#8203;</span>
                        <div className="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full sm:p-6 text-gray-900">
                            <h3 className="text-lg leading-6 font-bold mb-4">Start a New Project</h3>
                            <form onSubmit={handleProjectSubmit} className="space-y-4">
                                <div><label className="block text-sm font-medium">Title</label><input type="text" required value={projectFormData.title} onChange={(e) => setProjectFormData({...projectFormData, title: e.target.value})} className="mt-1 block w-full border border-gray-300 rounded-md py-2 px-3 focus:ring-mzansi-green focus:border-mzansi-green sm:text-sm" /></div>
                                <div><label className="block text-sm font-medium">Description</label><textarea required rows={3} value={projectFormData.description} onChange={(e) => setProjectFormData({...projectFormData, description: e.target.value})} className="mt-1 block w-full border border-gray-300 rounded-md py-2 px-3 focus:ring-mzansi-green focus:border-mzansi-green sm:text-sm" /></div>
                                <div><label className="block text-sm font-medium">Stage</label><select value={projectFormData.stage} onChange={(e) => setProjectFormData({...projectFormData, stage: e.target.value})} className="mt-1 block w-full border border-gray-300 bg-white rounded-md py-2 px-3 focus:ring-mzansi-green focus:border-mzansi-green sm:text-sm"><option>Ideation</option><option>In Development</option><option>Testing</option><option>Completed</option></select></div>
                                <div><label className="block text-sm font-medium">Support Required</label><input type="text" value={projectFormData.support_required} onChange={(e) => setProjectFormData({...projectFormData, support_required: e.target.value})} className="mt-1 block w-full border border-gray-300 rounded-md py-2 px-3 focus:ring-mzansi-green focus:border-mzansi-green sm:text-sm" /></div>
                                <div className="mt-5 sm:flex sm:flex-row-reverse"><button type="submit" disabled={isSubmittingProject} className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-mzansi-green text-white font-medium hover:bg-green-700 sm:ml-3 sm:w-auto sm:text-sm">{isSubmittingProject ? 'Creating...' : 'Create'}</button><button type="button" onClick={() => setShowProjectModal(false)} className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-gray-700 font-medium hover:bg-gray-50 sm:mt-0 sm:w-auto sm:text-sm">Cancel</button></div>
                            </form>
                        </div>
                    </div>
                </div>
            )}

            {/* Add Milestone Modal */}
            {showMilestoneModal && (
                <div className="fixed inset-0 z-10 overflow-y-auto">
                    <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                        <div className="fixed inset-0 bg-black bg-opacity-75" onClick={() => setShowMilestoneModal(false)}></div>
                        <span className="hidden sm:inline-block sm:align-middle sm:h-screen">&#8203;</span>
                        <div className="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full sm:p-6 text-gray-900">
                            <h3 className="text-lg leading-6 font-bold mb-4">Add a Milestone</h3>
                            <form onSubmit={handleMilestoneSubmit} className="space-y-4">
                                <div><label className="block text-sm font-medium">Milestone Title</label><input type="text" required value={milestoneFormData.title} onChange={(e) => setMilestoneFormData({...milestoneFormData, title: e.target.value})} className="mt-1 block w-full border border-gray-300 rounded-md py-2 px-3 focus:ring-mzansi-green focus:border-mzansi-green sm:text-sm" placeholder="e.g., Deployed to AWS" /></div>
                                <div><label className="block text-sm font-medium">Description (Optional)</label><textarea rows={2} value={milestoneFormData.description} onChange={(e) => setMilestoneFormData({...milestoneFormData, description: e.target.value})} className="mt-1 block w-full border border-gray-300 rounded-md py-2 px-3 focus:ring-mzansi-green focus:border-mzansi-green sm:text-sm" /></div>
                                <div className="mt-5 sm:flex sm:flex-row-reverse"><button type="submit" disabled={isSubmittingMilestone} className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-mzansi-green text-white font-medium hover:bg-green-700 sm:ml-3 sm:w-auto sm:text-sm">{isSubmittingMilestone ? 'Adding...' : 'Add Milestone'}</button><button type="button" onClick={() => setShowMilestoneModal(false)} className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-gray-700 font-medium hover:bg-gray-50 sm:mt-0 sm:w-auto sm:text-sm">Cancel</button></div>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}