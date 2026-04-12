const API_URL = import.meta.env.VITE_API_URL;

export const registerUser = async (userData: any) => {
    const response = await fetch(`${API_URL}/auth/register`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.detail || 'Registration failed');
    }

    return response.json();
};

export const loginUser = async (credentials: any) => {
    // 1. We must convert the standard JSON into URL Encoded Form Data
    const formData = new URLSearchParams();
    
    // 2. We map the React 'email' state to the 'username' field OAuth2 expects
    formData.append('username', credentials.email); 
    formData.append('password', credentials.password);

    const response = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: {
            // 3. Tell the backend we are sending form data, not JSON
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: formData, // Send the URLSearchParams object
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.detail || 'Login failed');
    }

    return response.json();
};

export const getProjects = async () => {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_URL}/projects/`, {
        headers: {
            'Authorization': `Bearer ${token}`,
        },
    });

    if (!response.ok) {
        throw new Error('Failed to fetch projects');
    }
    return response.json();
};

export const createProject = async (projectData: any) => {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_URL}/projects/`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(projectData),
    });

    if (!response.ok) {
        throw new Error('Failed to create project');
    }
    return response.json();
};

export const addMilestone = async (projectId: number, milestoneData: any) => {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_URL}/projects/${projectId}/milestones`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(milestoneData),
    });

    if (!response.ok) {
        throw new Error('Failed to add milestone');
    }
    return response.json();
};

export const completeProject = async (projectId: number) => {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_URL}/projects/${projectId}/complete`, {
        method: 'PATCH',
        headers: {
            'Authorization': `Bearer ${token}`,
        },
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.detail || 'Failed to complete project');
    }
    return response.json();
};