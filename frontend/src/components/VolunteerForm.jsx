import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './VolunteerForm.css';

const VolunteerForm = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [user, setUser] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        // Check if user is logged in
        const token = localStorage.getItem('accessToken');
        const userData = localStorage.getItem('user');
        
        if (!token) {
            // User not logged in, redirect to login
            alert('You must be logged in to apply as a volunteer. Please login first.');
            navigate('/login');
            return;
        }

        if (!userData) {
            // If no user data but token exists, create minimal user object
            setUser({ 
                name: 'User', 
                email: 'user@example.com',
                roles: []
            });
            return;
        }

        try {
            const parsedUser = JSON.parse(userData);
            setUser(parsedUser);
        } catch (error) {
            console.error('Error parsing user data:', error);
            // Don't redirect if we have a token, just use minimal user data
            setUser({ 
                name: 'User', 
                email: 'user@example.com',
                roles: []
            });
        }
    }, [navigate]);


    // If user is already a volunteer, show a message
    if (user?.roles?.includes('volunteer')) {
        return (
            <div className="volunteer-form-container">
                <h2>You are already registered as a volunteer!</h2>
                <p>Thank you for your commitment to helping the community.</p>
            </div>
        );
    }

    const handleQuickVolunteer = async () => {
        const confirmed = window.confirm(
            `Hi ${user?.name || 'there'}!\n\nWould you like to become a volunteer for CleanStreet?\n\nAs a volunteer, you'll help make your community cleaner and safer by assisting with local issues.\n\nClick OK to register as a volunteer.`
        );
        
        if (!confirmed) return;

        setLoading(true);
        setError('');

        try {
            const token = localStorage.getItem('accessToken');
            const volunteerData = {
                fullName: user?.name || '',
                email: user?.email || '',
                preferredArea: 'General Area', // Default value
                skills: 'Community Service' // Default value
            };

            const response = await axios.post('http://localhost:3000/api/contact/volunteer', volunteerData, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                withCredentials: true
            });

            if (response.status === 201) {
                alert('🎉 Congratulations! You are now registered as a volunteer!\n\nThank you for your commitment to helping the community. You may receive notifications about volunteer opportunities in your area.');
                
                // Update localStorage with new user data
                const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
                localStorage.setItem('user', JSON.stringify({
                    ...currentUser,
                    roles: [...(currentUser.roles || []), 'volunteer']
                }));
                navigate('/dashboard');
            }
        } catch (err) {
            console.error('Volunteer registration error:', err);
            setError(err.response?.data?.message || 'Error registering as volunteer. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="volunteer-form-container">
            <h2>🌟 Become a Volunteer</h2>
            <div style={{ textAlign: 'center', padding: '2rem' }}>
                <div style={{ 
                    background: '#f0f9ff', 
                    padding: '2rem', 
                    borderRadius: '15px', 
                    marginBottom: '2rem',
                    border: '2px solid #0ea5e9'
                }}>
                    <h3 style={{ color: '#0369a1', marginBottom: '1rem' }}>
                        Hello {user?.name || 'there'}! 👋
                    </h3>
                    <p style={{ fontSize: '1.1rem', lineHeight: '1.6', color: '#374151' }}>
                        Ready to make a difference in your community? Join our volunteer network and help keep the streets clean and safe!
                    </p>
                    <div style={{ margin: '1.5rem 0' }}>
                        <p><strong>✅ Your Name:</strong> {user?.name || 'Not available'}</p>
                        <p><strong>✅ Your Email:</strong> {user?.email || 'Not available'}</p>
                    </div>
                </div>

                {error && (
                    <div style={{ 
                        padding: '1rem', 
                        background: '#fef2f2', 
                        color: '#dc2626', 
                        borderRadius: '5px', 
                        marginBottom: '1rem' 
                    }}>
                        {error}
                    </div>
                )}

                <button 
                    onClick={handleQuickVolunteer}
                    disabled={loading}
                    style={{
                        background: loading ? '#9ca3af' : 'linear-gradient(135deg, #10b981, #059669)',
                        color: 'white',
                        border: 'none',
                        padding: '1rem 2rem',
                        fontSize: '1.1rem',
                        fontWeight: 'bold',
                        borderRadius: '10px',
                        cursor: loading ? 'not-allowed' : 'pointer',
                        boxShadow: '0 4px 15px rgba(16, 185, 129, 0.3)',
                        transition: 'all 0.3s ease',
                        minWidth: '200px'
                    }}
                >
                    {loading ? '⏳ Registering...' : '🚀 Yes, I want to volunteer!'}
                </button>

                <p style={{ 
                    marginTop: '1rem', 
                    fontSize: '0.9rem', 
                    color: '#6b7280' 
                }}>
                    By clicking the button above, you agree to volunteer for community service activities.
                </p>
            </div>
        </div>
    );
};

export default VolunteerForm;