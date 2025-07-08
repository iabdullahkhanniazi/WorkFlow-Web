import React, { useState, useEffect } from 'react';
import { Modal } from './Modal';
import { authService } from '../../services/authService';
import { firestoreService } from '../../services/firestoreService';
import { User, Camera } from 'lucide-react';

export const ProfileModal = ({ user, isOpen, onClose }) => {
    const [displayName, setDisplayName] = useState('');
    const [photoURL, setPhotoURL] = useState('');
    const [firstName, setFirstName] = useState(''); // Dummy state
    const [lastName, setLastName] = useState('');  // Dummy state
    const [position, setPosition] = useState('');  // Dummy state
    const [bio, setBio] = useState('');          // Dummy state

    useEffect(() => {
        if (user) {
            setDisplayName(user.displayName || '');
            setPhotoURL(user.photoURL || '');
            // In a real app, you would fetch these from the user's Firestore document
            setFirstName('Alex'); 
            setLastName('Buchanan');
            setPosition('Product Manager');
            setBio('Leading product strategy and development for innovative tech solutions.');
        }
    }, [user]);

    const handleSave = async (e) => {
        e.preventDefault();
        try {
            await authService.updateUserProfile(user, { displayName, photoURL });
            // In a real app, you would also update the user's document in Firestore
            // await firestoreService.updateUserProfile(user.uid, { firstName, lastName, position, bio });
            alert("Profile updated successfully!");
            onClose();
        } catch (error) {
            console.error("Error updating profile:", error);
            alert("Failed to update profile.");
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <div className="p-2">
                <h2 className="text-2xl font-bold text-white mb-6">My Profile</h2>
                <form onSubmit={handleSave}>
                    <div className="flex items-center space-x-6 mb-8">
                        <div className="relative">
                            <div className="w-24 h-24 bg-gray-700 rounded-full flex items-center justify-center">
                                {photoURL ? (
                                    <img src={photoURL} alt={displayName} className="w-full h-full rounded-full object-cover" />
                                ) : (
                                    <User size={48} className="text-gray-500" />
                                )}
                            </div>
                            <button type="button" className="absolute bottom-0 right-0 bg-indigo-600 p-2 rounded-full hover:bg-indigo-700">
                                <Camera size={16} className="text-white"/>
                            </button>
                        </div>
                        <div className="flex-grow">
                            <label className="block text-sm font-medium text-gray-400 mb-1">Photo URL</label>
                            <input 
                                type="url" 
                                value={photoURL} 
                                onChange={(e) => setPhotoURL(e.target.value)}
                                placeholder="https://example.com/image.png"
                                className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-400 mb-1">First Name</label>
                            <input type="text" value={firstName} onChange={(e) => setFirstName(e.target.value)} className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-400 mb-1">Last Name</label>
                            <input type="text" value={lastName} onChange={(e) => setLastName(e.target.value)} className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2" />
                        </div>
                    </div>
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-400 mb-1">Display Name</label>
                            <input type="text" value={displayName} onChange={(e) => setDisplayName(e.target.value)} className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-400 mb-1">Position</label>
                            <input type="text" value={position} onChange={(e) => setPosition(e.target.value)} className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2" />
                        </div>
                    </div>

                    <div className="mb-6">
                        <label className="block text-sm font-medium text-gray-400 mb-1">Bio</label>
                        <textarea value={bio} onChange={(e) => setBio(e.target.value)} rows="3" className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2"></textarea>
                    </div>
                    
                    <div className="mb-6">
                        <label className="block text-sm font-medium text-gray-400 mb-1">Skills</label>
                        <input type="text" placeholder="e.g., React, Node.js, UI/UX Design" className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2" />
                    </div>

                    <div className="flex justify-end space-x-3 pt-4 border-t border-gray-700">
                        <button type="button" onClick={onClose} className="bg-gray-600 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded-lg">Cancel</button>
                        <button type="submit" className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded-lg">Save Changes</button>
                    </div>
                </form>
            </div>
        </Modal>
    );
};
