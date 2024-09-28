import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import NotFound from './NotFound';

export default function UserProfilePage() {
  const { username } = useParams();
  const { token } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const [userProfile, setUserProfile] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorStatus, setErrorStatus] = useState(null);
  const { toast } = useToast();

  useEffect(() => {
    if (token) {
      fetchUserProfile();
    } else {
      navigate('/login');
    }
  }, [token, navigate, username]);

  const fetchUserProfile = async () => {
    setIsLoading(true);
    setErrorStatus(null); // Reset error status before fetching
    try {
      const response = await fetch(`http://127.0.0.1:8000/users/${username}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('Unauthorized: Please log in again');
        } else if (response.status === 404) {
          setErrorStatus(404);  // Set the 404 error status
          return;  // No need to throw an error, handle it in the UI
        }
        throw new Error('Failed to fetch user profile');
      }
      const data = await response.json();
      setUserProfile(data);
    } catch (error) {
      console.error('Error fetching user profile:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to fetch user profile",
        variant: "destructive",
      });
      
      if (error.message === 'Unauthorized: Please log in again') {
        navigate('/login');
      }
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  if (errorStatus === 404) {
    return <NotFound />;  // Render NotFound component if 404 error
  }

  if (!userProfile) {
    return <div className="flex justify-center items-center h-screen">User not found</div>;
  }

  return (
    <div className="container mx-auto mt-10 p-4">
      <Button onClick={() => navigate('/')} className="mb-4">Back to Home</Button>
      <Card>
        <CardHeader>
          <CardTitle>User Profile: {userProfile.username}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <p><strong>ID:</strong> {userProfile.id}</p>
            <p><strong>Email:</strong> {userProfile.email}</p>
            <p><strong>Role:</strong> {userProfile.role}</p>
            <p><strong>Active:</strong> {userProfile.is_active ? 'Yes' : 'No'}</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
